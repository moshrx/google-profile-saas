import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import Footer from "./Footer";
import LegalModal from "./LegalModal";
import { PrivacyPolicyContent, TermsOfServiceContent } from "./LegalContent";

const demoQuestions = [
  "What are your hours?",
  "How much are the bins?",
  "Where are you located?",
];

const steps = [
  {
    title: "Connect",
    description: "Forward your business line to PickUp AI or launch with a brand-new number in a day.",
  },
  {
    title: "Train",
    description: "We upload your menu, hours, services, and FAQs so the agent answers like your best front desk staffer.",
  },
  {
    title: "Relax",
    description: "Calls get answered 24/7 while you review bookings, missed intents, and transcripts in one dashboard.",
  },
];

const features = [
  {
    title: "Never Miss a Call",
    description: "PickUp AI answers at 2 AM, during the lunch rush, and on those days when the team is already stretched thin.",
  },
  {
    title: "Bookings & Reservations",
    description: "Capture appointments, tables, and callbacks with confirmation texts that keep everyone on the same page.",
  },
  {
    title: "PEI Knowledge",
    description: "Trained for Prince Edward Island context, from ferry traffic and event weekends to seasonal business rushes.",
  },
  {
    title: "SMS Too",
    description: "Customers can text for quick answers when they do not want to wait on hold or speak out loud.",
  },
  {
    title: "Real Voice",
    description: "A calm, natural-sounding AI voice that feels polished and human instead of robotic or scripted.",
  },
  {
    title: "Dashboard",
    description: "See every call, every question, every booking, and every handoff from one clean operating view.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$199/mo",
    description: "500 minutes, basic FAQ",
    perks: ["500 monthly minutes", "Business hours and FAQ setup", "Call summaries"],
  },
  {
    name: "Pro",
    price: "$399/mo",
    description: "unlimited minutes, booking integration, review responses",
    perks: ["Unlimited minutes", "Booking integration", "Review response drafts"],
    popular: true,
  },
  {
    name: "Concierge",
    price: "$799/mo",
    description: "everything + we manage it for you",
    perks: ["Everything in Pro", "Hands-on optimization", "Managed updates and call tuning"],
  },
];

const faqs = [
  {
    question: "How long does setup take?",
    answer: "About 15 minutes once we have your hours, FAQs, and booking preferences.",
  },
  {
    question: "What if the AI cannot answer?",
    answer: "It can transfer the caller to you, route by schedule, or take a voicemail and text you the summary.",
  },
  {
    question: "Do I need a new phone number?",
    answer: "No. Most clients simply forward their existing line, but we can also provision a fresh number if you prefer.",
  },
  {
    question: "Is it only for restaurants?",
    answer: "No. It works for any call-heavy PEI business, including tours, rentals, clinics, trades, and retail.",
  },
  {
    question: "Can I update the info?",
    answer: "Yes. Text or email changes anytime and we will update the agent knowledge quickly.",
  },
];

const transcript = [
  {
    speaker: "Caller",
    text: "Hi, what are your hours today?",
  },
  {
    speaker: "PickUp AI",
    text: "Loot Bins PEI is open Saturday through Thursday from 10 AM to 7 PM, and Friday from 9 AM to 1 PM for clearance day.",
  },
  {
    speaker: "Caller",
    text: "Perfect. How much are the bins?",
  },
  {
    speaker: "PickUp AI",
    text: "The store follows a weekly price-drop cycle, so pricing gets lower as the week goes on after the Saturday reset.",
  },
  {
    speaker: "Caller",
    text: "Where are you located?",
  },
  {
    speaker: "PickUp AI",
    text: "You can find Loot Bins PEI at 13 Glen Stewart Drive in Stratford, Prince Edward Island.",
  },
];

function PhoneIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.35 1.78.68 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.25a2 2 0 0 1 2.11-.45c.83.33 1.71.56 2.61.68A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-700">{eyebrow}</p>
      <h2 className="mt-3 text-[1.9rem] sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">{title}</h2>
      <p className="mt-4 text-[0.95rem] sm:text-lg text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

export default function PickUpAI() {
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const trialHref = useMemo(() => "#pricing", []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,251,255,0.8))]"></div>
        <div className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-[#C34A36]/12 blur-3xl"></div>
        <div className="absolute right-0 top-48 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl"></div>
        <div className="absolute bottom-24 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-accent-200/20 blur-3xl"></div>
      </div>

      <header className="sticky top-0 z-50 px-4 py-3 sm:px-6 sm:py-4">
        <nav className="mx-auto max-w-7xl">
          <div className="glass rounded-2xl px-4 py-3 sm:rounded-[1.5rem] sm:px-6 flex items-center justify-between">
            <Link to="/" className="shrink-0">
              <Logo />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection("how-it-works")} className="nav-link">How it works</button>
              <button onClick={() => scrollToSection("demo")} className="nav-link">Demo</button>
              <button onClick={() => scrollToSection("pricing")} className="nav-link">Pricing</button>
              <button onClick={() => scrollToSection("faq")} className="nav-link">FAQ</button>
            </div>

            <div className="flex items-center gap-3">
              <a href={trialHref} onClick={(e) => { e.preventDefault(); scrollToSection("pricing"); }} className="hidden sm:inline-flex btn-primary">
                Get Free 1-Week Trial
              </a>
              <button
                onClick={() => setMobileMenuOpen((value) => !value)}
                className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors tap-target"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-2 glass rounded-2xl p-4 mobile-menu-enter">
              <div className="flex flex-col gap-2">
                <button onClick={() => scrollToSection("how-it-works")} className="nav-link py-3 px-4 rounded-xl hover:bg-slate-100 text-left">How it works</button>
                <button onClick={() => scrollToSection("demo")} className="nav-link py-3 px-4 rounded-xl hover:bg-slate-100 text-left">Demo</button>
                <button onClick={() => scrollToSection("pricing")} className="nav-link py-3 px-4 rounded-xl hover:bg-slate-100 text-left">Pricing</button>
                <button onClick={() => scrollToSection("faq")} className="nav-link py-3 px-4 rounded-xl hover:bg-slate-100 text-left">FAQ</button>
                <a
                  href={trialHref}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("pricing");
                  }}
                  className="btn-primary mt-2 justify-center"
                >
                  Get Free 1-Week Trial
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="relative">
        <section className="px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-14">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#C34A36]/15 bg-white/80 px-4 py-2 text-xs font-bold text-[#9E3E2E] shadow-sm sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-[#C34A36]"></span>
                <span className="leading-snug">Built for PEI tourist season and year-round call volume</span>
              </div>
              <h1 className="mt-6 max-w-4xl text-[2rem] font-black leading-[1.04] text-slate-900 sm:text-5xl lg:text-6xl">
                Your AI Phone Agent Never Calls in Sick
              </h1>
              <p className="mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-slate-600 sm:mt-6 sm:text-xl">
                PickUp AI answers every call, books every table, and handles FAQs 24/7 for PEI businesses.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href={trialHref}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("pricing");
                  }}
                  className="btn-primary w-full justify-center sm:w-auto sm:justify-start"
                >
                  Get Free 1-Week Trial
                </a>
                <a href="tel:+19028136359" className="btn-secondary w-full justify-center sm:w-auto sm:justify-start">
                  <PhoneIcon />
                  Call now to hear it live
                </a>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a href="tel:+19028136359" className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-white shadow-xl shadow-slate-900/10 sm:w-auto sm:justify-start">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <PhoneIcon />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Live demo line</p>
                    <p className="text-xl font-black">(902) 813-6359</p>
                  </div>
                </a>
                <p className="text-sm font-medium text-slate-500">Forward your line, keep your staff focused, and let the AI handle the repeat questions.</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#C34A36]/15 via-white to-primary-100/80 blur-2xl"></div>
              <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-premium backdrop-blur-xl sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-primary-700">Live right now</p>
                    <h2 className="mt-2 text-[1.55rem] font-black text-slate-900 sm:text-2xl">PEI phone coverage without hiring another shift</h2>
                  </div>
                  <div className="hidden h-16 w-16 items-center justify-center rounded-3xl bg-primary-50 text-primary-700 sm:flex">
                    <PhoneIcon />
                  </div>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[
                    ["0", "missed calls target"],
                    ["24/7", "availability"],
                    ["2 min", "to route your line"],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50/90 p-4">
                      <p className="text-2xl font-black text-slate-900">{value}</p>
                      <p className="mt-1 text-sm text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 rounded-[1.75rem] bg-slate-950 p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Caller preview</p>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-200">
                    <p>"Hi, are you open today and where are you located?"</p>
                    <p className="text-slate-400">PickUp AI answers instantly, confirms your hours, and offers the address without sending the caller to voicemail.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="How It Works"
              title="Three simple steps from missed calls to round-the-clock coverage"
              description="No long onboarding project. We keep the setup lightweight so PEI owners can get value fast."
            />
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="card p-8">
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-600">Step {index + 1}</p>
                  <h3 className="mt-4 text-2xl font-black text-slate-900">{step.title}</h3>
                  <p className="mt-4 text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/10">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-white">
                <PhoneIcon />
              </div>
              <h2 className="mt-6 text-[1.85rem] font-black sm:text-3xl">Call (902) 813-6359</h2>
              <p className="mt-4 text-slate-300">Hear a live demo built around the kind of questions Island businesses answer all day long.</p>
              <div className="mt-8 rounded-3xl bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Ask it</p>
                <ul className="mt-4 space-y-3 text-base font-medium text-slate-100">
                  {demoQuestions.map((question) => (
                    <li key={question}>"{question}"</li>
                  ))}
                </ul>
              </div>
              <a href="tel:+19028136359" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-900 transition hover:bg-primary-50 sm:w-auto">
                Hear It Live
              </a>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-premium sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-primary-700">Demo Transcript</p>
                  <h3 className="mt-2 text-[1.45rem] font-black text-slate-900 sm:text-2xl">LOOTBINS PEI sample call</h3>
                </div>
                <a href="https://www.lootbinscanada.com/" target="_blank" rel="noreferrer" className="text-sm font-bold text-primary-700 hover:text-primary-800">
                  View LOOTBINS PEI
                </a>
              </div>
              <div className="mt-6 space-y-4">
                {transcript.map((entry, index) => (
                  <div
                    key={`${entry.speaker}-${index}`}
                    className={`max-w-[92%] rounded-3xl px-5 py-4 text-sm leading-relaxed sm:max-w-[44rem] sm:text-base ${
                      entry.speaker === "PickUp AI"
                        ? "bg-primary-50 text-slate-700"
                        : "ml-auto bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p className="mb-1 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{entry.speaker}</p>
                    <p>{entry.text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-slate-500">
                Transcript uses verified LOOTBINS PEI location and hours, with pricing language based on their published weekly price-drop cycle.
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Features"
              title="Everything owners need to keep the phone covered"
              description="Designed for the businesses that get interrupted by the same questions all day long."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature, index) => (
                <div key={feature.title} className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-premium">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 text-lg font-black text-primary-700">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-black text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-br from-[#FFF4EE] via-white to-primary-50 p-8 shadow-premium sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#9E3E2E]">Social Proof</p>
                <h2 className="mt-3 text-[1.9rem] font-black text-slate-900 sm:text-4xl">Built with local momentum, not generic SaaS promises</h2>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  We are starting with a real PEI operator and opening only a handful of new installs so each launch gets proper attention.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-3xl font-black text-slate-900">0</p>
                  <p className="mt-2 text-sm text-slate-500">missed calls goal for launch partners</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-3xl font-black text-slate-900">24/7</p>
                  <p className="mt-2 text-sm text-slate-500">availability for customers and tourists</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-3xl font-black text-slate-900">2 min</p>
                  <p className="mt-2 text-sm text-slate-500">setup once your line is forwarded</p>
                </div>
              </div>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <a
                href="https://www.lootbinscanada.com/"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-start gap-4 rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 sm:flex-row sm:items-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-lg font-black text-white">
                  LB
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-primary-700">First customer</p>
                  <p className="mt-1 text-xl font-black text-slate-900">LOOTBINS PEI</p>
                  <p className="mt-1 text-sm text-slate-500">Stratford liquidation store with weekly drop traffic and high repeat questions.</p>
                </div>
              </a>
              <div className="rounded-[1.75rem] bg-slate-900 px-6 py-5 text-white lg:max-w-sm">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-300">June intake</p>
                <p className="mt-2 text-[1.6rem] font-black sm:text-2xl">Now accepting 3 new PEI businesses</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Pricing"
              title="Simple monthly plans with a free one-week trial"
              description="Start with one number, validate the value, and scale up once the calls stop leaking."
            />
            <div className="mt-12 grid gap-5 xl:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-[2rem] border p-7 shadow-premium ${
                    plan.popular
                      ? "border-primary-200 bg-slate-900 text-white"
                      : "border-slate-100 bg-white text-slate-900"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-6 rounded-full bg-primary-500 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">
                      Most Popular
                    </div>
                  )}
                  <p className={`text-sm font-black uppercase tracking-[0.18em] ${plan.popular ? "text-primary-200" : "text-primary-700"}`}>{plan.name}</p>
                  <p className="mt-4 text-4xl font-black">{plan.price}</p>
                  <p className={`mt-3 text-sm leading-relaxed ${plan.popular ? "text-slate-300" : "text-slate-500"}`}>{plan.description}</p>
                  <div className={`mt-6 h-px ${plan.popular ? "bg-white/10" : "bg-slate-100"}`}></div>
                  <ul className={`mt-6 space-y-3 text-sm ${plan.popular ? "text-slate-200" : "text-slate-600"}`}>
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3">
                        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${plan.popular ? "bg-primary-300" : "bg-primary-500"}`}></span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="mailto:peiwebstudio@gmail.com?subject=PickUp%20AI%20Free%20Trial"
                    className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 font-bold transition ${
                      plan.popular
                        ? "bg-white text-slate-900 hover:bg-primary-50"
                        : "bg-slate-900 text-white hover:bg-primary-600"
                    }`}
                  >
                    Start Free Trial
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              eyebrow="FAQ"
              title="The practical questions owners ask before they hand over the phone"
              description="Short answers, no fluff, and easy next steps if you want to test it with your own call flow."
            />
            <div className="mt-10 space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={faq.question} className="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-sm">
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="text-[0.98rem] font-black text-slate-900 sm:text-lg">{faq.question}</span>
                      <span className="text-2xl font-light text-slate-400">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-slate-500 leading-relaxed sm:px-6">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 pt-4 sm:px-6 sm:pb-24">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-900 px-6 py-10 text-white shadow-xl shadow-slate-900/10 sm:px-10 sm:py-14">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="mt-3 text-[1.9rem] font-black sm:text-4xl">Ready for tourist season?</h2>
                <p className="mt-4 text-[1rem] text-slate-300 sm:text-lg">
                  Let your AI phone agent take the repetitive calls so your team can focus on service, sales, and the people standing in front of them.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <a href="mailto:peiwebstudio@gmail.com?subject=Start%20Free%201-Week%20Trial" className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3 font-bold text-slate-900 transition hover:bg-primary-50 sm:w-auto">
                  Start Free Trial
                </a>
                <a href="mailto:peiwebstudio@gmail.com" className="break-all text-center text-sm font-bold text-primary-200 underline-offset-4 hover:underline sm:text-left">
                  peiwebstudio@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenLegal={setActiveModal} />

      <LegalModal
        title="Privacy Policy"
        isOpen={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
      >
        <PrivacyPolicyContent />
      </LegalModal>

      <LegalModal
        title="Terms of Service"
        isOpen={activeModal === 'terms'}
        onClose={() => setActiveModal(null)}
      >
        <TermsOfServiceContent />
      </LegalModal>
    </div>
  );
}
