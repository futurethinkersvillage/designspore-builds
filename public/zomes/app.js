// Zome Range configurator: choose layouts, quantities and line items, then read only that plan.
// Selection lives in the browser and in a shareable ?c= link. Data comes from window.ZDATA (written by tools/zome_page.mjs).
(function () {
  const Z = window.ZDATA, ids = Object.keys(Z.plans), KEY = 'zome-range-v1';
  const DEF = { cont: 15, lead: false, poly: false, design: true, septic: 0 };
  let state = { c: {}, s: { ...DEF } };
  const $ = (q, r = document) => r.querySelector(q), $$ = (q, r = document) => [...r.querySelectorAll(q)];
  const money = n => '$' + (Math.round(n / 100) * 100).toLocaleString('en-US');
  const short = n => '$' + (n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : (n / 1000).toFixed(n >= 1e5 ? 0 : 1) + 'k');
  const num = n => Math.round(n).toLocaleString('en-US');

  // ---- saved state --------------------------------------------------------------------------------------------------
  const enc = o => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const dec = s => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))));
  const compact = () => { const c = {}; for (const id in state.c) { const e = state.c[id]; if (e.q > 0 || e.x?.length) c[id] = e.x?.length ? [e.q, e.x] : [e.q]; } return { c, s: state.s }; };
  const load = o => { state = { c: {}, s: { ...DEF, ...(o.s || {}) } }; for (const id in o.c || {}) if (Z.plans[id]) state.c[id] = { q: +o.c[id][0] || 0, x: o.c[id][1] || [] }; };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(compact())); } catch { /* private window: selection still works until the page closes */ } };
  const params = new URLSearchParams(location.search);
  try {
    if (params.get('c')) load(dec(params.get('c')));
    else { const v = localStorage.getItem(KEY); if (v) load(JSON.parse(v)); }
  } catch { /* a broken link just opens an empty plan */ }
  const entry = id => state.c[id] || (state.c[id] = { q: 0, x: [] });
  const shareUrl = () => `${location.origin}${location.pathname}?view=plan&c=${enc(compact())}`;

  // ---- pricing: the same formula as zome_costs.js, with the choices applied ------------------------------------------
  function price(id) {
    const P = Z.plans[id], x = new Set(state.c[id]?.x || []), s = state.s, g = {};
    for (const k of ['shell', 'fit', 'trades', 'logistics', 'permits']) g[k] = P.lines[k].reduce((a, [, v], i) => a + (x.has(`${k}:${i}`) ? 0 : v), 0);
    if (s.poly) g.shell += P.polyUp;
    if (s.lead) g.trades += P.totalHours * 0.2 * 65;
    const pre = g.shell + g.fit + g.trades + g.logistics + g.permits, goods = g.shell + g.fit, cf = s.cont / 100;
    const contingency = pre * cf, tax = goods * (1 + cf) * 0.07 + (pre + contingency) * 0.05, sub = pre + contingency + tax;
    const low = (goods * 0.88 + (pre - goods) * 0.8) * 1.1 * 1.11, high = (goods * 1.2 + (pre - goods) * 1.4) * 1.2 * 1.12;
    const hours = s.lead ? P.totalHours * 0.8 : P.totalHours;
    return { g, contingency, tax, sub, low, high, hours, value: hours * 31 };
  }
  function totals() {
    const t = { builds: 0, layouts: 0, sub: 0, low: 0, high: 0, hours: 0, value: 0, g: { shell: 0, fit: 0, trades: 0, logistics: 0, permits: 0 }, contingency: 0, tax: 0, floor: 0, sleeps: 0, seats: 0, sizes: new Set(), rows: [] };
    for (const id of ids) {
      const q = state.c[id]?.q || 0; if (!q) continue;
      const p = price(id), P = Z.plans[id];
      t.builds += q; t.layouts++; t.sub += p.sub * q; t.low += p.low * q; t.high += p.high * q; t.hours += p.hours * q; t.value += p.value * q; t.contingency += p.contingency * q; t.tax += p.tax * q; t.floor += P.floor * q; t.sleeps += P.sleeps * q; t.seats += P.seats * q; t.sizes.add(P.type);
      for (const k in t.g) t.g[k] += p.g[k] * q;
      t.rows.push({ id, q, p, P });
    }
    t.design = state.s.design ? t.sizes.size * Z.extras.designPerSize : 0; t.septic = state.s.septic * Z.extras.septicEach;
    t.extras = (t.design + t.septic) * 1.05; t.grand = t.sub + t.extras;
    return t;
  }

  // ---- drawing ------------------------------------------------------------------------------------------------------------
  const costRow = id => {
    const P = Z.plans[id], p = price(id), q = state.c[id]?.q || 0, other = p.g.logistics + p.g.permits + p.contingency + p.tax;
    return `<tr class="${q ? 'on' : ''}" data-row="${id}"><td class="qc">${stepper(id, q, true)}</td><th scope="row"><a href="#${id}">${P.name}</a></th><td>${P.nominal}</td><td class="n">${money(p.g.shell)}</td><td class="n">${money(p.g.fit)}</td><td class="n">${money(p.g.trades)}</td><td class="n">${money(other)}</td><td class="n sub">${money(p.sub)}</td><td class="n">${short(p.low)} to ${short(p.high)}</td><td class="n vol">${num(p.hours)} h</td><td class="n vol">${money(p.value)}</td></tr>`;
  };
  const stepper = (id, q, tiny) => `<span class="step ${tiny ? 'tiny' : ''}" role="group" aria-label="Quantity of ${Z.plans[id].name}"><button type="button" data-q="-1" data-id="${id}" aria-label="One fewer" ${q ? '' : 'disabled'}>−</button><output>${q}</output><button type="button" data-q="1" data-id="${id}" aria-label="One more">+</button></span>`;

  function paint() {
    const t = totals(), planView = document.body.classList.contains('view-plan');
    // layout cards
    for (const card of $$('.plan[id]')) {
      const id = card.id, e = state.c[id], q = e?.q || 0, p = price(id), x = new Set(e?.x || []);
      card.classList.toggle('in-plan', q > 0);
      if (planView) card.hidden = !q; else card.hidden = false;
      $('.cart-q', card).innerHTML = stepper(id, q);
      $('.cart-add', card).textContent = q ? 'In your plan' : 'Add to plan'; $('.cart-add', card).setAttribute('aria-pressed', q > 0);
      $('.c-price', card).textContent = money(p.sub); $('.c-range', card).textContent = `${short(p.low)} to ${short(p.high)}`;
      $('.c-vol', card).textContent = `+ ${num(p.hours)} volunteer hours, not included`;
      const qt = $('.c-qty', card); qt.textContent = q > 1 ? `× ${q} = ${money(p.sub * q)}` : '';
      for (const k of ['shell', 'fit', 'trades', 'logistics', 'permits']) { const c = $(`[data-g=${k}]`, card); if (c) c.textContent = money(p.g[k]); }
      $('[data-k=cont]', card).textContent = money(p.contingency); $('[data-k=contl]', card).textContent = `Contingency, ${state.s.cont}%`; $('[data-k=tax]', card).textContent = money(p.tax); $('[data-k=sub]', card).textContent = money(p.sub);
      const hrs = $('[data-k=volh]', card); hrs.textContent = `Volunteer labour, not in subtotal: ${num(p.hours)} h, about ${Math.round(p.hours / 40)} days for a crew of 5`; $('[data-k=vol]', card).textContent = money(p.value);
      for (const tr of $$('tr[data-line]', card)) { const off = x.has(tr.dataset.line); tr.classList.toggle('off', off); $('input', tr).checked = !off; if (planView) tr.hidden = off; else tr.hidden = false; }
      const lead = $('[data-k=leadl]', card); lead.hidden = !state.s.lead; if (state.s.lead) lead.querySelector('td').textContent = money(Z.plans[id].totalHours * 0.2 * 65);
    }
    // sections follow what's selected
    for (const sec of $$('.type')) sec.hidden = planView && !$$('.plan[id]', sec).some(c => !c.hidden);
    for (const g of $$('.g-group')) g.hidden = planView && !$$('.plan[id]', g).some(c => !c.hidden);
    const gl = $('#glass'); gl.hidden = planView && !$$('.g-group', gl).some(g => !g.hidden);
    for (const n of $$('.nav [data-sec]')) { const s = document.getElementById(n.dataset.sec); n.hidden = !!s?.hidden; }
    // cost tables
    const show = id => !planView || (state.c[id]?.q > 0);
    const clad = ids.filter(i => !Z.plans[i].glass && show(i)), clr = ids.filter(i => Z.plans[i].glass && show(i));
    $('#cost-clad').innerHTML = clad.map(costRow).join(''); $('#cost-clear').innerHTML = clr.map(costRow).join('');
    $('#wrap-clad').hidden = !clad.length; $('#wrap-clear').hidden = !clr.length;
    $('#h-clad').textContent = `${clad.length} clad layout${clad.length === 1 ? '' : 's'}`; $('#h-clear').textContent = `${clr.length} transparent layout${clr.length === 1 ? '' : 's'}`;
    // cart bar
    $('#bar-count').textContent = t.builds ? `${t.builds} build${t.builds === 1 ? '' : 's'}, ${t.layouts} layout${t.layouts === 1 ? '' : 's'}` : 'Nothing chosen yet';
    $('#bar-total').textContent = t.builds ? money(t.grand) : '';
    $('#bar-vol').textContent = t.builds ? `+ ${num(t.hours)} volunteer hours` : 'Add layouts to build your plan';
    $('#bar-go').disabled = false;
    // settings
    $('#s-cont').value = state.s.cont; $('#s-lead').checked = state.s.lead; $('#s-poly').checked = state.s.poly; $('#s-design').checked = state.s.design; $('#s-septic').value = state.s.septic;
    paintPlan(t);
  }

  function paintPlan(t) {
    const box = $('#plan-sum');
    if (!t.builds) { box.innerHTML = '<div class="empty"><h2>No zomes in this plan yet</h2><p>Go back to the full range and add the layouts you plan to build.</p></div>'; return; }
    const rows = t.rows.map(({ id, q, p, P }) => `<tr><td class="n">${q}</td><th scope="row"><a href="#${id}">${P.name}</a></th><td>${P.nominal}${P.glass ? ', transparent' : ''}</td><td class="n">${money(p.sub)}</td><td class="n sub">${money(p.sub * q)}</td><td class="n vol">${num(p.hours * q)} h</td></tr>`).join('');
    const cat = [['Building materials', t.g.shell], ['Furniture and fit-out', t.g.fit], ['Professional services', t.g.trades], ['Delivery and site', t.g.logistics], ['Permits', t.g.permits], [`Contingency, ${state.s.cont}%`, t.contingency], ['GST and PST', t.tax]];
    const ext = [t.design ? [`Drawings and engineering, ${t.sizes.size} size${t.sizes.size === 1 ? '' : 's'}`, t.design * 1.05] : null, t.septic ? [`${state.s.septic} shared septic system${state.s.septic === 1 ? '' : 's'}`, t.septic * 1.05] : null].filter(Boolean);
    box.innerHTML = `<div class="ks"><div><dt>All-in budget</dt><dd>${money(t.grand)}</dd></div><div><dt>Likely range, builds only</dt><dd class="sm">${short(t.low)} to ${short(t.high)}</dd></div><div><dt>Builds</dt><dd>${t.builds}</dd></div><div><dt>Floor area</dt><dd>${num(t.floor)} m²</dd></div>${t.sleeps ? `<div><dt>Sleeps</dt><dd>${t.sleeps}</dd></div>` : ''}<div><dt>Volunteer labour, not included</dt><dd class="sm">${num(t.hours)} h, about ${money(t.value)}</dd></div></div>
    <h3>What gets built</h3><div class="tbl"><table class="cost-table"><thead><tr><th class="n">Qty</th><th>Layout</th><th>Size</th><th class="n">Each</th><th class="n">Total</th><th class="n vol">Volunteer hours</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="roll"><div><h3>Where the money goes</h3><table class="ct"><tbody>${cat.map(([a, b]) => `<tr class="g"><th scope="row">${a}</th><td>${money(b)}</td></tr>`).join('')}<tr class="t"><th scope="row">Builds subtotal</th><td>${money(t.sub)}</td></tr>${ext.map(([a, b]) => `<tr class="g"><th scope="row">${a}, with GST</th><td>${money(b)}</td></tr>`).join('')}<tr class="t"><th scope="row">All-in budget</th><td>${money(t.grand)}</td></tr><tr class="v"><th scope="row">Volunteer labour, not in budget: ${num(t.hours)} h, about ${num(t.hours / 200)} crew-weeks for a crew of 5</th><td>${money(t.value)}</td></tr></tbody></table></div>
    <div><h3>Assumptions in this plan</h3><ul><li>Contingency is ${state.s.cont}%.</li><li>${state.s.lead ? 'A paid lead carpenter is budgeted at 20% of build hours.' : 'The site lead is a volunteer. No lead is budgeted.'}</li><li>${t.rows.some(r => r.P.glass) ? (state.s.poly ? 'Clear panels are 16 mm triple-wall polycarbonate.' : 'Clear panels are 8 mm twin-wall polycarbonate, three-season use.') : 'All panels are clad.'}</li><li>${state.s.septic ? `Includes ${state.s.septic} new shared septic system${state.s.septic === 1 ? '' : 's'}.` : 'Plumbed layouts tie in to existing septic capacity. No new system is included.'}</li><li>${state.s.design ? 'Includes drawings and engineering once per size.' : 'Once-per-size drawings and engineering are not included.'}</li>${Object.values(state.c).some(e => e.q && e.x?.length) ? '<li>Some line items are removed. Those lines are left out of the layouts below.</li>' : ''}</ul></div></div>`;
  }

  // ---- views --------------------------------------------------------------------------------------------------------------
  function setView(plan, push = true) {
    document.body.classList.toggle('view-plan', plan);
    $('#plan-view').hidden = !plan;
    if (push) { const u = new URL(location.href); if (plan) u.searchParams.set('view', 'plan'); else u.searchParams.delete('view'); history.pushState({ plan }, '', u); scrollTo(0, 0); }
    $('title').textContent = plan ? 'Zome Build Plan | Portal.Place' : 'Zome Range | Portal.Place';
    paint();
  }
  addEventListener('popstate', () => setView(new URLSearchParams(location.search).get('view') === 'plan', false));

  // ---- events -------------------------------------------------------------------------------------------------------------
  const changed = () => { save(); paint(); };
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a'); if (!t) return;
    if (t.dataset.q) { const en = entry(t.dataset.id); en.q = Math.max(0, en.q + +t.dataset.q); return changed(); }
    if (t.classList.contains('cart-add')) { const id = t.closest('.plan').id, en = entry(id); en.q = en.q ? 0 : 1; return changed(); }
    if (t.dataset.go === 'plan') return setView(true);
    if (t.dataset.go === 'range') return setView(false);
    if (t.dataset.act === 'print') return print();
    if (t.dataset.act === 'copy') { const u = shareUrl(), note = $('#copied'); const done = m => { note.textContent = m; setTimeout(() => { note.textContent = ''; }, 4000); }; navigator.clipboard.writeText(u).then(() => done('Link copied'), () => { done(u); }); return; }
    if (t.dataset.act === 'reset') { if (t.dataset.armed) { state = { c: {}, s: { ...DEF } }; t.textContent = 'Clear plan'; delete t.dataset.armed; return changed(); } t.dataset.armed = 1; t.textContent = 'Clear everything?'; setTimeout(() => { if (t.dataset.armed) { delete t.dataset.armed; t.textContent = 'Clear plan'; } }, 4000); return; }
    if (t.dataset.v3d) {
      t.disabled = true; const label = t.textContent; t.textContent = 'Loading 3D…';
      import(Z.base + 'js/viewer.js').then(m => { window.zomeViewer = m.openViewer({ ...JSON.parse(t.dataset.v3d), returnFocus: t }); }).catch(() => { $('#v3d-fail').hidden = false; }).finally(() => { t.disabled = false; t.textContent = label; });
      return;
    }
    if (t.classList.contains('shot')) { const d = $('#dlg'), i = $('#dlg-img'); i.src = t.dataset.full; i.alt = t.dataset.alt; $('#dlg-cap').textContent = t.dataset.alt; d.showModal?.(); return; }
    if (t.id === 'dlg-x') $('#dlg').close();
  });
  $('#dlg').addEventListener('click', e => { if (e.target.id === 'dlg') e.target.close(); });
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('tr[data-line] input')) { const id = t.closest('.plan').id, en = entry(id), key = t.closest('tr').dataset.line; en.x = en.x.filter(k => k !== key); if (!t.checked) en.x.push(key); return changed(); }
    if (t.id === 's-cont') state.s.cont = +t.value;
    else if (t.id === 's-lead') state.s.lead = t.checked;
    else if (t.id === 's-poly') state.s.poly = t.checked;
    else if (t.id === 's-design') state.s.design = t.checked;
    else if (t.id === 's-septic') state.s.septic = Math.max(0, Math.min(20, Math.round(+t.value || 0)));
    else return;
    changed();
  });
  setView(params.get('view') === 'plan', false);
})();
