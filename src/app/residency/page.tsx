"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Wrench,
  Cube,
  Hammer,
  MonitorPlay,
  Sparkle,
  TreeEvergreen,
  Lightning,
  Circuitry,
  Printer,
  PaintBrushBroad,
  House,
  CurrencyDollar,
  GraduationCap,
  Heart,
  Eye,
  Mountains,
} from "@phosphor-icons/react";

/* ── Hero ─────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-[90dvh] bg-warm-dark overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/residency/hero-artist.jpg"
          alt="Artist working at Wells Gray Village"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "brightness(0.4)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-warm-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-dark/80 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-28 pb-20 lg:px-16 lg:pt-36 lg:pb-28">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber mb-6 lg:text-xs lg:mb-8"
          >
            Artist Residency
          </motion.p>

          <div className="overflow-hidden pb-6 -mb-6 lg:pb-10 lg:-mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,12vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Artists
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-6 -mb-6 lg:pb-10 lg:-mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,12vw,8rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              First.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 max-w-[54ch] text-[15px] leading-relaxed text-white/70 lg:mt-10 lg:text-base lg:text-white/65"
          >
            We&apos;re building a village in the mountains of British Columbia.
            We think culture is the foundation — and culture starts with artists.
            Come make something extraordinary on 400 acres of wild land, with
            tools, time, and people who take craft seriously.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-3 lg:mt-10 lg:gap-4"
          >
            <a
              href="#apply"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              Apply for the residency <ArrowRight size={14} weight="bold" />
            </a>
            <a
              href="#thesis"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-white/80 transition-colors hover:border-white/50 hover:text-white"
            >
              Read the thesis
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Thesis ────────────────────────────────────────────────────────── */

function Thesis() {
  return (
    <section id="thesis" className="bg-warm-dark py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              Why artists first
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Culture Is<br />
              <span className="italic">The Seed.</span>
            </h2>
            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-white/70 lg:text-sm lg:text-white/60">
              <p>
                A village isn&apos;t built out of buildings. It&apos;s built out
                of meaning, story, and shared experience — the things that make
                people want to stay, return, and bring others.
              </p>
              <p>
                Artists make those things. Culture comes first. Then the
                philosophers come to interpret it, the builders come to extend
                it, the innovators come to remix it, and the investors come
                because there&apos;s something real to back.
              </p>
              <p>
                Every village that&apos;s stood the test of time was anchored by
                an aesthetic, a craft tradition, a way of seeing. Without that,
                you have an HOA. With it, you have a place worth belonging to.
              </p>
              <p className="text-white/85 font-medium lg:text-white/80">
                So we&apos;re starting with artists.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "440px" }}>
            <Image
              src="/images/residency/thesis-portrait.jpg"
              alt="Artist at work"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-warm-dark/40 to-transparent" />
          </div>
        </div>

        {/* Flywheel sketch — 4 stages */}
        <div className="mt-16 lg:mt-24 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", label: "Artists make culture", body: "Beauty, meaning, immersion — the things that make a place feel like somewhere." },
            { n: "02", label: "Culture draws people", body: "Philosophers, builders, families — people who want to live where things are felt deeply." },
            { n: "03", label: "Community forms", body: "Shared rhythms, traditions, and a reason to come back season after season." },
            { n: "04", label: "Investment follows", body: "Capital aligns with the village because the foundation — story and craft — already exists." },
          ].map((step) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6"
            >
              <div className="font-mono text-xs text-amber/60 mb-3">{step.n}</div>
              <div className="text-[15px] font-medium text-white mb-2 lg:text-sm">{step.label}</div>
              <p className="text-[14px] leading-relaxed text-white/55 lg:text-[13px] lg:text-white/50">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Tools / studio ────────────────────────────────────────────────── */

function Studio() {
  const tools = [
    { icon: Wrench, label: "Maker space", body: "A full general-purpose shop for working with your hands." },
    { icon: Hammer, label: "Woodworking shop", body: "Saws, planers, joinery tools — everything for serious wood. (Lathe coming soon.)" },
    { icon: Cube, label: "Metalworking", body: "Welding and fabrication tools. (Metal finishing coming soon.)" },
    { icon: Lightning, label: "CNC machine (coming soon)", body: "Sub-millimeter precision for parts, signage, sculpture." },
    { icon: Printer, label: "3D printer", body: "Rapid prototyping and finished work. (More printers coming soon.)" },
    { icon: Sparkle, label: "Laser cutter", body: "Cut and engrave wood, acrylic, fabric, leather, more." },
    { icon: PaintBrushBroad, label: "UV printer (coming soon)", body: "Print directly onto wood, metal, acrylic — almost anything flat." },
    { icon: Circuitry, label: "Electronics workshop", body: "Soldering stations, components, microcontrollers. (Oscilloscopes coming soon.)" },
    { icon: MonitorPlay, label: "Projection + stages (coming soon)", body: "Outdoor projection systems and event stages for immersive work." },
    { icon: Cube, label: "AI tools", body: "Access to image, video, audio, and language model tools." },
    { icon: TreeEvergreen, label: "400 acres of canvas", body: "Forests, lake, fields, structures — the land itself is the medium." },
    { icon: Mountains, label: "Wells Gray wilderness", body: "Waterfalls, peaks, alpine lakes — the source material at your door." },
  ];

  return (
    <section className="bg-[#0F0E12] py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
            The studio
          </p>
          <h2 className="font-serif text-4xl font-light leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Tools for<br />
            <span className="italic">The Imagination.</span>
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-white/65 max-w-[56ch] lg:mt-8 lg:text-sm lg:text-white/60">
            Whatever you need to make the thing — physical, digital, or
            somewhere between — we have it, or we&apos;ll get it for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {tools.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.05, duration: 0.4 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-6"
            >
              <t.icon size={20} weight="light" className="text-amber mb-4" />
              <div className="text-[15px] font-medium text-white mb-1.5 lg:text-sm">{t.label}</div>
              <p className="text-[14px] leading-relaxed text-white/55 lg:text-[13px] lg:text-white/50">{t.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Image strip — tools & spaces ─────────────────────────────────── */

function StudioMosaic() {
  const images = [
    { src: "/images/residency/tools-1.jpg", alt: "Maker space" },
    { src: "/images/residency/tools-2.jpg", alt: "Outdoor projection installation" },
    { src: "/images/residency/tools-3.jpg", alt: "CNC and laser work" },
    { src: "/images/residency/tools-4.jpg", alt: "Studio at night" },
  ];

  return (
    <section className="bg-warm-dark py-12 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.src}
              className="relative overflow-hidden rounded-2xl"
              style={{ minHeight: "200px" }}
            >
              <Image src={img.src} alt={img.alt} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Support & accommodations ─────────────────────────────────────── */

function Support() {
  const items = [
    {
      icon: House,
      img: "/images/residency/support-stay.jpg",
      label: "Accommodation",
      body: "Free or low-cost stays for the duration of the residency — cabin, glamping, or RV depending on what's available when you arrive.",
    },
    {
      icon: CurrencyDollar,
      img: "/images/residency/support-grants.jpg",
      label: "Supply grants",
      body: "Materials grants to cover the cost of your project. The application asks for a rough budget; we'll talk about scope together.",
    },
    {
      icon: GraduationCap,
      img: "/images/residency/support-workshops.jpg",
      label: "Workshops & mentorship",
      body: "Workshops on tools you haven't used before, plus access to other residents, the maker community, and visiting practitioners.",
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
            What we provide
          </p>
          <h2 className="font-serif text-4xl font-light leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Time, Space,<br />
            <span className="italic">Support.</span>
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-white/65 max-w-[56ch] lg:mt-8 lg:text-sm lg:text-white/60">
            A residency only works if the practical pieces are handled. We
            cover the basics so the work is the only thing you have to think
            about.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {items.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45 }}
              className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden"
            >
              <div className="relative" style={{ minHeight: "200px" }}>
                <Image src={item.img} alt={item.label} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-6 lg:p-7">
                <item.icon size={20} weight="light" className="text-amber mb-3" />
                <div className="text-base font-medium text-white mb-2 lg:text-[15px]">{item.label}</div>
                <p className="text-[14px] leading-relaxed text-white/60 lg:text-[13px] lg:text-white/55">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── The bar ──────────────────────────────────────────────────────── */

function Bar() {
  const values = [
    {
      icon: Heart,
      label: "Meaningful",
      body: "Art that comes from something real — a question you're chasing, a wound you're working through, a vision you can't stop seeing.",
    },
    {
      icon: Sparkle,
      label: "Thoughtful",
      body: "Work that's been considered. The materials matter, the placement matters, the why matters.",
    },
    {
      icon: Eye,
      label: "Awe",
      body: "Pieces that stop people. Immersive, strange, beautiful — something they'll remember a year from now.",
    },
  ];

  return (
    <section className="bg-warm-dark py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
            The bar
          </p>
          <h2 className="font-serif text-4xl font-light leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Meaningful.<br />
            Thoughtful.<br />
            <span className="italic">Awe.</span>
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-white/65 max-w-[56ch] lg:mt-8 lg:text-sm lg:text-white/60">
            We&apos;re not looking for decoration. We&apos;re looking for work
            that makes the village feel like a place where something real is
            happening.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 lg:p-7">
              <v.icon size={20} weight="light" className="text-amber mb-4" />
              <div className="text-base font-medium text-white mb-2 lg:text-[15px]">{v.label}</div>
              <p className="text-[14px] leading-relaxed text-white/60 lg:text-[13px] lg:text-white/55">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Vision mosaic ─────────────────────────────────────────────────── */

function Vision() {
  const images = [
    { src: "/images/residency/vision-1.jpg", alt: "Light installation in the forest" },
    { src: "/images/residency/vision-2.jpg", alt: "Sculpture in the field" },
    { src: "/images/residency/vision-3.jpg", alt: "Performance under the dome" },
    { src: "/images/residency/vision-4.jpg", alt: "Projection on the gazebo" },
  ];

  return (
    <section className="bg-[#0F0E12] py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
            Vision
          </p>
          <h2 className="font-serif text-4xl font-light leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Imagine What<br />
            <span className="italic">Could Be Here.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:gap-4">
          {images.map((img) => (
            <div
              key={img.src}
              className="relative aspect-[16/9] overflow-hidden rounded-2xl"
            >
              <Image src={img.src} alt={img.alt} fill sizes="(max-width: 1024px) 50vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Process ──────────────────────────────────────────────────────── */

function Process() {
  const steps = [
    { n: "01", label: "Apply", body: "Tell us about your work, your project, and what you'd need to make it real." },
    { n: "02", label: "Review & interview", body: "We read every application. Promising ones move to a short conversation." },
    { n: "03", label: "Arrive & onboard", body: "We set you up — accommodation, tools, materials, the lay of the land." },
    { n: "04", label: "Make", body: "Two weeks to three months. Studio access, support, and time to do real work." },
  ];

  return (
    <section className="bg-warm-dark py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
            The process
          </p>
          <h2 className="font-serif text-4xl font-light leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            From Application<br />
            <span className="italic">To Installation.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 lg:p-7"
            >
              <div className="font-mono text-xs text-amber/60 mb-4">{step.n}</div>
              <div className="text-[15px] font-medium text-white mb-2 lg:text-sm">{step.label}</div>
              <p className="text-[14px] leading-relaxed text-white/55 lg:text-[13px] lg:text-white/50">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Application form ─────────────────────────────────────────────── */

function ApplicationForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const inputClass =
    "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-[15px] text-white placeholder:text-white/40 focus:border-white focus:ring-1 focus:ring-white/30 focus-visible:outline-none lg:text-sm";
  const labelClass = "block text-sm font-medium text-white/85 mb-2";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {};
    fd.forEach((v, k) => { if (k !== "confirm") body[k] = v; });

    try {
      const res = await fetch("/api/residency-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="apply" className="bg-amber py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-12 max-w-2xl lg:mb-16">
          <h2 className="font-serif text-4xl font-light leading-[1.05] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Apply for the<br />
            <span className="italic">residency.</span>
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-white/85 max-w-[52ch] lg:text-base lg:text-white/80">
            Tell us about your work and what you&apos;d want to make at the
            village. We read every application personally.
          </p>
        </div>

        {status === "success" ? (
          <div className="max-w-3xl rounded-2xl bg-white/10 p-10 text-center lg:p-12">
            <CheckCircle size={40} weight="light" className="text-white mx-auto mb-4" />
            <p className="text-lg font-medium text-white mb-2">Application received.</p>
            <p className="text-sm text-white/85">
              We&apos;ll read it carefully and reach out within two weeks. Thank you.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-7">
            {/* Identity */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Name</label>
                <input type="text" name="name" required placeholder="Your name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" required placeholder="you@example.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input type="text" name="location" required placeholder="City, Country" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>
                  Phone <span className="text-white/50">(optional)</span>
                </label>
                <input type="tel" name="phone" placeholder="+1 (555) 000-0000" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Portfolio / website / Instagram</label>
              <input type="url" name="portfolio" required placeholder="https://" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Primary medium</label>
              <select name="medium" required className={inputClass + " appearance-none"}>
                <option value="" className="bg-warm-dark">Select a medium…</option>
                <option value="sculpture" className="bg-warm-dark">Sculpture / installation</option>
                <option value="painting" className="bg-warm-dark">Painting / drawing</option>
                <option value="digital_ai" className="bg-warm-dark">Digital / AI / generative</option>
                <option value="performance" className="bg-warm-dark">Performance</option>
                <option value="music_sound" className="bg-warm-dark">Music / sound</option>
                <option value="film_video" className="bg-warm-dark">Film / video</option>
                <option value="mixed" className="bg-warm-dark">Mixed / multidisciplinary</option>
                <option value="other" className="bg-warm-dark">Other</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>What would you make at the village?</label>
              <textarea
                name="project_description"
                rows={5}
                required
                placeholder="Describe the project — concept, medium, scale, how it might engage with the land or community…"
                className={inputClass + " resize-y"}
              />
            </div>

            {/* Timing */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Residency length</label>
                <select name="length" className={inputClass + " appearance-none"}>
                  <option value="" className="bg-warm-dark">Select…</option>
                  <option value="2_weeks" className="bg-warm-dark">2 weeks</option>
                  <option value="1_month" className="bg-warm-dark">1 month</option>
                  <option value="2_months" className="bg-warm-dark">2 months</option>
                  <option value="3_months" className="bg-warm-dark">3 months</option>
                  <option value="other" className="bg-warm-dark">Other (describe below)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Preferred timing</label>
                <input type="text" name="timing" placeholder="e.g. Summer 2026" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Tools you&apos;d want to use <span className="text-white/50">(optional)</span>
              </label>
              <textarea
                name="tools"
                rows={3}
                placeholder="CNC, laser cutter, projection, AI tools, woodshop, electronics…"
                className={inputClass + " resize-y"}
              />
            </div>

            <div>
              <label className={labelClass}>
                Accommodation notes <span className="text-white/50">(optional)</span>
              </label>
              <textarea
                name="accommodation"
                rows={3}
                placeholder="Anything we should know — accessibility, dietary, partner/family, vehicle, etc."
                className={inputClass + " resize-y"}
              />
            </div>

            <div>
              <label className={labelClass}>
                Estimated supplies budget <span className="text-white/50">(optional)</span>
              </label>
              <input type="text" name="budget" placeholder="e.g. $500 / $2,000 / not sure yet" className={inputClass + " max-w-sm"} />
            </div>

            <div>
              <label className={labelClass}>Why this residency?</label>
              <textarea
                name="why"
                rows={4}
                required
                placeholder="What about the village, the thesis, or the setting draws you in?"
                className={inputClass + " resize-y"}
              />
            </div>

            <div>
              <label className={labelClass}>
                Anything else <span className="text-white/50">(optional)</span>
              </label>
              <textarea
                name="extra"
                rows={3}
                placeholder="Anything we missed that we should know."
                className={inputClass + " resize-y"}
              />
            </div>

            {/* Confirmation */}
            <label className="flex items-start gap-3 text-sm text-white/85 cursor-pointer">
              <input
                type="checkbox"
                name="confirm"
                required
                className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 text-warm-dark focus:ring-warm-dark accent-warm-dark"
              />
              <span>
                I understand this is an application, not a confirmed offer.
              </span>
            </label>

            {/* Submit */}
            <div className="flex items-center gap-4 flex-wrap pt-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-amber transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : <>Submit application <ArrowRight size={14} weight="bold" /></>}
              </button>
              {status === "error" && (
                <p className="text-sm text-white/90">
                  Something went wrong. Email us directly at{" "}
                  <a href="mailto:mike@futurethinkers.org" className="underline">mike@futurethinkers.org</a>.
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function ResidencyPage() {
  return (
    <>
      <Hero />
      <Thesis />
      <Studio />
      <StudioMosaic />
      <Support />
      <Bar />
      <Vision />
      <Process />
      <ApplicationForm />
    </>
  );
}
