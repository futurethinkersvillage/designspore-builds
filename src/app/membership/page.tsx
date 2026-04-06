"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Heart,
  Wrench,
  TreeEvergreen,
  Star,
  Shield,
  Campfire,
  Check,
  Quotes,
} from "@phosphor-icons/react";

// ── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark flex items-center">
      <div className="absolute inset-0">
        <Image
          src="/images/add_a_group_202511251511-copy.jpeg"
          alt="Community at Portal.Place"
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-warm-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-dark/80 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-36 pb-24 lg:px-16">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-8"
          >
            Portal.Place
          </motion.p>

          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Membership
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 max-w-[52ch] text-base leading-relaxed text-white/45"
          >
            A new way of living, learning, building, and connecting — seasonally,
            in nature and in community.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-10"
          >
            <a
              href="#invitation"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              Become a Member <ArrowRight size={14} weight="bold" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Become A Founding Member ─────────────────────────────────────────────────

function BecomeMember() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_38%] items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              The Vision
            </p>
            <h2 className="font-serif text-4xl font-light text-white lg:text-5xl mb-10">
              Become A Founding Member Of{" "}
              <span className="italic">Wells Gray Village &amp; Network</span>
            </h2>

            <div className="space-y-6 text-sm leading-relaxed text-white/45 max-w-[65ch]">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                The world is changing fast. AI, automation, and the stress of
                modern life are pushing people toward something more grounded,
                healthy, and human. More families, creators, remote workers,
                and future-focused individuals are looking for places
                where they can return seasonally, build friendships, learn
                together, work on projects, and feel part of a real community.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Portal.Place Membership is your doorway into that new model of
                living.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                As a member, you join the founding community shaping Wells Gray
                Village in Interior BC — a nature-immersive, family-friendly,
                community destination centered around a shared rhythm, maker
                culture, wellness, entrepreneurship, and meaningful community
                projects. Members receive priority access to immersions,
                programs, gatherings, and special pricing on stays &amp;
                services, plus early invitations to future offerings and partner
                locations.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                This is neither a resort or not full-time housing — it&apos;s a
                seasonal, community-driven lifestyle club built for the post-AI
                world. A place where culture, nature, and creativity come
                together to form traditions that deepen each year.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                If you want a healthier seasonal rhythm, an inspiring creative
                basecamp, a meaningful summer destination, or a community to
                return to — this membership is your invitation.
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[572/1024] w-full overflow-hidden rounded-2xl"
          >
            <Image
              src="/images/add_a_small_202511251502-572x1024.jpeg"
              alt="Portal.Place community"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Why Portal.Place? ────────────────────────────────────────────────────────

function WhyPortal() {
  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
            Why Portal.Place?
          </p>
          <h2 className="font-serif text-4xl font-light text-white lg:text-5xl mb-8">
            Why <span className="italic">Portal.Place?</span>
          </h2>
          <p className="text-base leading-relaxed text-white/45 max-w-[60ch]">
            Because it&apos;s exactly what it sounds like — a portal to place. A
            doorway into real land, real people, and real experiences in a time
            when life feels increasingly digital and disconnected.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ── Why Become A Member ──────────────────────────────────────────────────────

function WhyMembership() {
  const reasons = [
    {
      n: "01",
      icon: Heart,
      label: "Belonging",
      body: "Real relationships and community rhythms.",
    },
    {
      n: "02",
      icon: Users,
      label: "Health & wellness",
      body: "Nature, movement, simplicity.",
    },
    {
      n: "03",
      icon: Wrench,
      label: "Creativity & learning",
      body: "Workshops, skills, shared projects.",
    },
    {
      n: "04",
      icon: TreeEvergreen,
      label: "Seasonal living",
      body: "Returning year after year.",
    },
    {
      n: "05",
      icon: Campfire,
      label: "Purpose",
      body: "Contributing meaningfully.",
    },
    {
      n: "06",
      icon: Shield,
      label: "Resilience",
      body: "A lifestyle less dependent on urban systems.",
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_45%] items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
              Why become a member
            </p>
            <h2 className="font-serif text-4xl font-light text-white lg:text-5xl mb-4">
              Why Become <span className="italic">A Member?</span>
            </h2>
            <p className="text-sm leading-relaxed text-white/45 mb-12 max-w-[55ch]">
              Membership is for people who want to participate — to be part of
              building something new.
            </p>

            <div className="divide-y divide-white/10 border-y border-white/10">
              {reasons.map((r, i) => (
                <motion.div
                  key={r.n}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="grid grid-cols-[3rem_1fr] items-center gap-6 py-5 lg:grid-cols-[3rem_12rem_1fr]"
                >
                  <span className="font-mono text-xs text-white/20">
                    {r.n}
                  </span>
                  <div className="flex items-center gap-3">
                    <r.icon
                      size={15}
                      weight="light"
                      className="text-amber shrink-0"
                    />
                    <span className="text-sm font-medium text-white">
                      {r.label}
                    </span>
                  </div>
                  <p className="hidden text-sm leading-relaxed text-white/40 lg:block">
                    {r.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <p className="mt-8 text-sm leading-relaxed text-white/45">
              If you want more than just consuming experiences — this is for you.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
          >
            <Image
              src="/images/add_a_group_202511251511-copy.jpeg"
              alt="Community gathering"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── What Members Receive ─────────────────────────────────────────────────────

function WhatYouGet() {
  const benefits = [
    {
      title: "Access to Wells Gray Village & Future Network",
      body: "Join the founding community shaping Wells Gray Village and upcoming locations.",
    },
    {
      title: "Priority Access to Programs & Stays",
      body: "Be first to register for immersions, members only events, and residencies.",
    },
    {
      title: "Members Pricing",
      body: "Save on stays and services at Wells Gray Village.",
    },
    {
      title: "Co-Creation Opportunities",
      body: "Participate in seasonal calls, project discussions, and early cultural rhythms.",
    },
    {
      title: "Backup Plan for Uncertain Times",
      body: "A rural community and a place to land if the world becomes unstable.",
    },
    {
      title: "Community Connections",
      body: "Meet aligned families, creators, founders, and builders.",
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            What members receive
          </p>
          <h2 className="font-serif text-4xl font-light text-white lg:text-5xl">
            What Members <span className="italic">Receive</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="bg-warm-dark p-8"
            >
              <div className="font-mono text-xs text-white/20 mb-4">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="text-sm font-medium text-white mb-3">
                {b.title}
              </div>
              <div className="text-sm leading-relaxed text-white/40">
                {b.body}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── What Members Do ──────────────────────────────────────────────────────────

function WhatMembersDo() {
  const items = [
    "Attend member-only gatherings",
    "Join seasonal immersions, events, or residencies",
    "Contribute to cultural traditions and shared rhythms",
    "Participate in community discussions",
    "Offer ideas or skills for projects",
    "Access deeper opportunities for involvement",
    "Be part of the early story of the network",
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
              What members do
            </p>
            <h2 className="font-serif text-4xl font-light text-white lg:text-5xl mb-6">
              What Members <span className="italic">Do</span>
            </h2>
            <p className="text-sm leading-relaxed text-white/45 mb-12 max-w-[55ch]">
              Membership is annual and tiered to fit your life.
            </p>

            <div className="divide-y divide-white/10 border-y border-white/10">
              {items.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.05,
                    type: "spring",
                    stiffness: 120,
                    damping: 22,
                  }}
                  className="flex items-center gap-4 py-4"
                >
                  <Check
                    size={14}
                    weight="bold"
                    className="text-amber shrink-0"
                  />
                  <span className="text-sm text-white/65">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[1024/747] w-full overflow-hidden rounded-2xl"
          >
            <Image
              src="/images/gemini_generated_image_o3gzbko3gzbko3gz-1024x747.png"
              alt="Village life"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── What Exists Today ────────────────────────────────────────────────────────

function WhatExistsToday() {
  const col1 = [
    "RV & tenting sites",
    "Geodesic glamping dome",
    "Bunk cabins with shared bathrooms & showers",
    "Barrel sauna & river cold plunge",
    "120-person gazebo + smaller gazebos",
    "Kids' playground",
    "Small maker space & woodworking shop",
  ];

  const col2 = [
    "Small garden",
    "Horse corrals",
    "Private lake",
    "Forest trails, river access & mountain scenery",
    "Golf & disc golf course",
    "Early seasonal programs & events",
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            What exists today
          </p>
          <h2 className="font-serif text-4xl font-light text-white lg:text-5xl mb-6">
            What Exists <span className="italic">Today</span>
          </h2>
          <p className="text-sm leading-relaxed text-white/45 mb-12 max-w-[60ch]">
            At Wells Gray Village — our 400-acre flagship site — members get
            immediate access to:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 max-w-4xl">
          <div className="divide-y divide-white/10 border-y border-white/10">
            {col1.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="flex items-center gap-4 py-4"
              >
                <Check
                  size={14}
                  weight="bold"
                  className="text-amber shrink-0"
                />
                <span className="text-sm text-white/65">{item}</span>
              </motion.div>
            ))}
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {col2.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="flex items-center gap-4 py-4"
              >
                <Check
                  size={14}
                  weight="bold"
                  className="text-amber shrink-0"
                />
                <span className="text-sm text-white/65">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-sm leading-relaxed text-white/45"
        >
          Everything we build next grows from this real foundation.
        </motion.p>
      </div>
    </section>
  );
}

// ── Who This Is For ──────────────────────────────────────────────────────────

function WhoItsFor() {
  const profiles = [
    "Builders & hands-on problem-solvers",
    "Families seeking healthier seasonal rhythms",
    "Artists & creators",
    "Retirees wanting a meaningful seasonal home base",
    "Regenerative thinkers & designers",
    "Founders, technologists & remote workers",
    "Values-aligned investors who want to build a better future while hedging against uncertainty & instability",
    "Anyone inspired by nature, community, and culture",
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
              Who this is for
            </p>
            <h2 className="font-serif text-4xl font-light text-white lg:text-5xl">
              Who This <span className="italic">Is For</span>
            </h2>
          </div>

          <div>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {profiles.map((p, i) => (
                <motion.div
                  key={p}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.05,
                    type: "spring",
                    stiffness: 120,
                    damping: 22,
                  }}
                  className="flex items-center gap-4 py-4"
                >
                  <span className="font-mono text-xs text-white/20 w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-white/65">{p}</span>
                </motion.div>
              ))}
            </div>
            <p className="mt-8 text-sm leading-relaxed text-white/45">
              If the Vision page spoke directly to you — you likely belong here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const testimonials = [
    {
      quote:
        "We felt an immediate sense of peace — like stepping into another world.",
      attribution: "Summer Guest, 2024",
    },
    {
      quote:
        "It's amazing to see Mike & Euvie's Smart Village vision take shape. They're putting together everything they said they would: sauna, maker-space, community atmosphere. I can't say say enough.",
      attribution: "Future Thinkers Podcast Listener, 2025",
    },
    {
      quote:
        "The community feeling here is something we've never experienced anywhere else.",
      attribution: "Family Visitor, 2023",
    },
    {
      quote:
        "It's the kind of place you want to come back to every year.",
      attribution: "Snowbird Couple, 2023",
    },
    {
      quote:
        "Waking up beside the creek with the sound of rushing water and mountain views — a peaceful, nature-filled escape that felt like a dream.",
      attribution: "Couple, 2025",
    },
    {
      quote:
        "Such a beautiful, relaxing place to be — with a warm, family-oriented atmosphere and nature all around.",
      attribution: "Family, 2024",
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Testimonials
          </p>
          <h2 className="font-serif text-4xl font-light text-white lg:text-5xl">
            What Guests Are <span className="italic">Saying</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="bg-warm-dark p-8 flex flex-col"
            >
              <Quotes
                size={24}
                weight="fill"
                className="text-amber/40 mb-4 shrink-0"
              />
              <p className="text-sm leading-relaxed text-white/60 mb-6 flex-1">
                {t.quote}
              </p>
              <p className="text-xs text-white/30">— {t.attribution}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How Membership Works ─────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      n: "1",
      label: "Join",
      body: "Sign up and become a member of the Portal.Place community.",
    },
    {
      n: "2",
      label: "Access",
      body: "Access members-only benefits, discounts, and programs.",
    },
    {
      n: "3",
      label: "Participate",
      body: "Participate in village programs, stays, and opportunities.",
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            The process
          </p>
          <h2 className="font-serif text-4xl font-light text-white lg:text-5xl">
            How Membership <span className="italic">Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="bg-[#0F0E12] p-8">
              <div className="font-mono text-3xl font-light text-white/15 mb-6">
                {s.n}
              </div>
              <div className="text-sm font-medium text-white mb-3">
                {s.label}
              </div>
              <div className="text-sm leading-relaxed text-white/40">
                {s.body}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-white/40">
          Starting at $48/month (billed annually).
        </p>
      </div>
    </section>
  );
}

// ── Founding Member Status ───────────────────────────────────────────────────

function FoundingStatus() {
  const perks = [
    "Recognition as part of the first wave",
    "Priority access to future programs",
    "Invitations to early gatherings",
    "Opportunities to influence culture & rhythms",
    "Early access to private materials & innovation previews",
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Founding members
          </p>
          <h2 className="font-serif text-4xl font-light text-white lg:text-5xl mb-6">
            Founding Member <span className="italic">Status</span>
          </h2>
          <p className="text-sm leading-relaxed text-white/45 mb-10">
            The first wave of members will receive Founding Member status.
          </p>

          <div className="divide-y divide-white/10 border-y border-white/10 mb-10">
            {perks.map((perk, i) => (
              <motion.div
                key={perk}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.05,
                  type: "spring",
                  stiffness: 120,
                  damping: 22,
                }}
                className="flex items-center gap-4 py-4"
              >
                <Star
                  size={14}
                  weight="fill"
                  className="text-amber shrink-0"
                />
                <span className="text-sm text-white/65">{perk}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-sm font-medium text-white/60">
            This status will not be available later.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── The Invitation ───────────────────────────────────────────────────────────

function Invitation() {
  return (
    <section id="invitation" className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_auto] items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60 mb-6">
              Join Us
            </p>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl mb-8">
              The <span className="italic">Invitation</span>
            </h2>
            <p className="max-w-[50ch] text-base leading-relaxed text-white/75">
              If you&apos;re feeling the pull toward seasonal village life —
              toward meaningful connection, nature, creativity, purpose, and a
              more resilient way of living — membership is the doorway. This is
              your invitation to help shape the next evolution of how we live.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-start"
          >
            <a
              href="/checkout"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-amber transition-all hover:bg-white/90 active:scale-[0.98]"
            >
              Become a Member <ArrowRight size={14} weight="bold" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Page Export ───────────────────────────────────────────────────────────────

export default function MembershipPage() {
  return (
    <>
      <Hero />
      <BecomeMember />
      <WhyPortal />
      <WhyMembership />
      <WhatYouGet />
      <WhatMembersDo />
      <WhatExistsToday />
      <WhoItsFor />
      <Testimonials />
      <HowItWorks />
      <FoundingStatus />
      <Invitation />
    </>
  );
}
