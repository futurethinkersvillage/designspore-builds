-- Prove the database-level guarantees actually fire.
-- Each expected failure is wrapped in its own SAVEPOINT so one deliberate
-- error doesn't abort the rest of the run.
--
-- If any block marked "MUST be rejected" reports no ERROR, the protection is
-- theatre and the application is one bug away from a double-booked site or a
-- drifted credit balance.
--
-- Run:
--   cat db/verify_constraints.sql | ssh root@HOST \
--     "docker exec -i CONTAINER psql -U wgr -d wgr -q"

BEGIN;

-- --------------------------------------------------------------- fixtures --
INSERT INTO unit_categories (id, slug, name, kind, picks_specific_unit)
VALUES ('11111111-1111-1111-1111-111111111111', 'test-rv', 'Test RV', 'rv', TRUE);

INSERT INTO inventory_units (id, category_id, label, max_length_ft, width_ft)
VALUES ('22222222-2222-2222-2222-222222222222',
        '11111111-1111-1111-1111-111111111111', 'T01', 40, 24);

INSERT INTO guests (id, email, first_name)
VALUES ('33333333-3333-3333-3333-333333333333', 'test@example.invalid', 'Test');

INSERT INTO reservations (id, code, guest_id, arrives_on, departs_on) VALUES
  ('44444444-4444-4444-4444-444444444444', 'WGR-TEST-0001', '33333333-3333-3333-3333-333333333333', '2027-08-10', '2027-08-14'),
  ('55555555-5555-5555-5555-555555555555', 'WGR-TEST-0002', '33333333-3333-3333-3333-333333333333', '2027-08-12', '2027-08-16'),
  ('66666666-6666-6666-6666-666666666666', 'WGR-TEST-0003', '33333333-3333-3333-3333-333333333333', '2027-08-14', '2027-08-18');

-- Baseline stay: 10th -> 14th.
INSERT INTO reservation_units (reservation_id, unit_id, arrives_on, departs_on)
VALUES ('44444444-4444-4444-4444-444444444444',
        '22222222-2222-2222-2222-222222222222', '2027-08-10', '2027-08-14');

\echo ''
\echo '=== TEST 1: overlapping stay MUST be rejected (expect ERROR) ==='
SAVEPOINT t1;
INSERT INTO reservation_units (reservation_id, unit_id, arrives_on, departs_on)
VALUES ('55555555-5555-5555-5555-555555555555',
        '22222222-2222-2222-2222-222222222222', '2027-08-12', '2027-08-16');
ROLLBACK TO SAVEPOINT t1;

\echo ''
\echo '=== TEST 2: turnover day MUST be allowed (expect INSERT 0 1) ==='
INSERT INTO reservation_units (reservation_id, unit_id, arrives_on, departs_on)
VALUES ('66666666-6666-6666-6666-666666666666',
        '22222222-2222-2222-2222-222222222222', '2027-08-14', '2027-08-18');

-- ----------------------------------------------------------------- ledger --
INSERT INTO ledger_accounts (id, guest_id, account_type, denomination, membership_year) VALUES
  ('77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'credits_general',     'cents',  2027),
  ('99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 'entitlement_nights',  'nights', 2027);
INSERT INTO ledger_accounts (id, account_type, denomination)
VALUES ('88888888-8888-8888-8888-888888888888', 'house_issuance', 'cents');

INSERT INTO ledger_transactions (id, description, reason, idempotency_key)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Issue credits', 'issued', 'test-issue-1');

\echo ''
\echo '=== TEST 3: balanced transaction MUST be accepted (expect INSERT 0 2) ==='
INSERT INTO ledger_entries (transaction_id, account_id, amount) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '88888888-8888-8888-8888-888888888888', -25000),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '77777777-7777-7777-7777-777777777777',  25000);

\echo ''
\echo '=== TEST 4: UPDATE a ledger entry MUST be rejected (expect ERROR) ==='
SAVEPOINT t4;
UPDATE ledger_entries SET amount = 999999
 WHERE transaction_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
ROLLBACK TO SAVEPOINT t4;

\echo ''
\echo '=== TEST 5: DELETE a ledger entry MUST be rejected (expect ERROR) ==='
SAVEPOINT t5;
DELETE FROM ledger_entries
 WHERE transaction_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
ROLLBACK TO SAVEPOINT t5;

\echo ''
\echo '=== TEST 6: UNBALANCED transaction MUST be rejected (expect ERROR) ==='
SAVEPOINT t6;
INSERT INTO ledger_transactions (id, description, reason, idempotency_key)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Broken', 'adjusted', 'test-unbalanced');
INSERT INTO ledger_entries (transaction_id, account_id, amount)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '77777777-7777-7777-7777-777777777777', 500);
SET CONSTRAINTS ALL IMMEDIATE;
ROLLBACK TO SAVEPOINT t6;

\echo ''
\echo '=== TEST 7: cents balance but NIGHTS do not — MUST be rejected (expect ERROR) ==='
SAVEPOINT t7;
INSERT INTO ledger_transactions (id, description, reason, idempotency_key)
VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Mixed', 'converted', 'test-mixed');
INSERT INTO ledger_entries (transaction_id, account_id, amount) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '77777777-7777-7777-7777-777777777777',  100),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '88888888-8888-8888-8888-888888888888', -100),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '99999999-9999-9999-9999-999999999999',    5);
SET CONSTRAINTS ALL IMMEDIATE;
ROLLBACK TO SAVEPOINT t7;

\echo ''
\echo '=== TEST 8: replayed idempotency key MUST be rejected (expect ERROR) ==='
SAVEPOINT t8;
INSERT INTO ledger_transactions (description, reason, idempotency_key)
VALUES ('Replayed webhook', 'issued', 'test-issue-1');
ROLLBACK TO SAVEPOINT t8;

\echo ''
\echo '=== RESULT: computed balance (expect credits_general = 25000) ==='
SELECT account_type, denomination, balance
  FROM ledger_balances
 WHERE guest_id = '33333333-3333-3333-3333-333333333333'
 ORDER BY account_type;

\echo ''
\echo '=== RESULT: stays on the test unit (expect 2 rows: the 10th and the 14th) ==='
SELECT arrives_on, departs_on
  FROM reservation_units
 WHERE unit_id = '22222222-2222-2222-2222-222222222222'
 ORDER BY arrives_on;

-- Leave no fixtures behind.
ROLLBACK;
