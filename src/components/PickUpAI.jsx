import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PickUpAILogo from "./PickUpAILogo";
import LegalModal from "./LegalModal";
import SiteFooter from "./SiteFooter";
import { PickUpAIPrivacyContent, PickUpAITermsContent } from "./LegalContent";
import { DEMO_PHONE, DEMO_PHONE_RAW, SUPPORT_EMAIL } from "../utils/constants";

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
    setup: "$500 one-time setup",
    tagline: "Small businesses testing AI, light call volume.",
    perks: [
      "500 minutes/month (~8 hours of calls)",
      "Basic FAQ setup (10 questions)",
      "Business hours, location, voicemail",
      "Daily call summary email",
      "Standard voice (Polly.Joanna)",
    ],
    notIncluded: [
      "Booking handling",
      "Review responses",
    ],
    included: [
      { feature: "Monthly minutes", detail: "500 min (~8 hrs of calls)" },
      { feature: "FAQ setup", detail: "10 questions configured" },
      { feature: "Business hours", detail: "AI tells callers when you're open/closed" },
      { feature: "Location & voicemail", detail: "Directions, parking, takes messages" },
      { feature: "Call summaries", detail: "Daily email recap" },
      { feature: "Voice", detail: "Standard — Polly.Joanna (US English)" },
    ],
    setupIncludes: [
      "2-hour config call",
      "FAQ writing + testing",
      "Go-live in 48 hours",
    ],
  },
  {
    name: "Pro",
    price: "$399/mo",
    setup: "$1,200 one-time setup",
    tagline: "Growing businesses that take bookings and miss calls during rush.",
    popular: true,
    perks: [
      "Unlimited minutes",
      "Unlimited FAQ refinement",
      "Booking integration — calendar, SMS confirmation",
      "Review response drafts",
      "Call analytics dashboard",
      "SMS replies + 6 voice options",
    ],
    notIncluded: [
      "Managed updates (text us changes)",
      "Monthly call review",
    ],
    included: [
      { feature: "Monthly minutes", detail: "Unlimited — no overage, ever" },
      { feature: "FAQ refinement", detail: "Unlimited, tuned from real call data" },
      { feature: "Booking integration", detail: "AI checks calendar, confirms appointments, sends SMS to customer + owner" },
      { feature: "Review responses", detail: "AI writes replies to Google Reviews — you copy-paste" },
      { feature: "Call analytics", detail: "Dashboard: answered, missed, escalated, bookings" },
      { feature: "SMS replies", detail: "Customers can text for quick answers" },
      { feature: "Voice options", detail: "6 Polly voices (male/female, US/UK/AU)" },
    ],
    setupIncludes: [
      "Booking system integration (Google Calendar or simple DB)",
      "2 weeks of call monitoring + tuning",
      "Owner training (30 min)",
    ],
  },
  {
    name: "Concierge",
    price: "$799/mo",
    setup: "$2,000 one-time setup",
    tagline: "Busy owners who want zero involvement. We manage everything.",
    perks: [
      "Everything in Pro",
      "We update your AI within 24 hours",
      "Monthly call review — we improve responses",
      "Escalation handling with context",
      "Direct Slack / email line",
    ],
    notIncluded: [],
    included: [
      { feature: "Everything in Pro", detail: "Unlimited minutes, bookings, reviews, SMS, analytics" },
      { feature: "Managed updates", detail: "Text us changes — pushed within 24 hours" },
      { feature: "Monthly call review", detail: "We listen to recordings and improve responses" },
      { feature: "Escalation handling", detail: "Urgent calls transferred to you with context" },
      { feature: "Direct line", detail: "Dedicated Slack / email to our team" },
    ],
    setupIncludes: [
      "Full onboarding + 30 days daily monitoring",
      "Weekly check-ins first month",
    ],
  },
];

const comparisonRows = [
  { feature: "Monthly minutes",  starter: "500",        pro: "Unlimited",  concierge: "Unlimited" },
  { feature: "FAQ questions",    starter: "10",         pro: "Unlimited",  concierge: "Unlimited" },
  { feature: "Booking handling", starter: false,        pro: true,         concierge: true },
  { feature: "Review responses", starter: false,        pro: true,         concierge: true },
  { feature: "Call dashboard",   starter: "Basic",      pro: "Advanced",   concierge: "Advanced" },
  { feature: "Voice options",    starter: "1",          pro: "6",          concierge: "6" },
  { feature: "SMS replies",      starter: false,        pro: true,         concierge: true },
  { feature: "Weekly optimization", starter: false,     pro: false,        concierge: true },
  { feature: "Managed updates",  starter: false,        pro: false,        concierge: true },
  { feature: "Strategy calls",   starter: false,        pro: false,        concierge: "Monthly" },
  { feature: "Support",          starter: "Email",      pro: "Priority 4hr", concierge: "Dedicated" },
  { feature: "Setup fee",        starter: "$500",       pro: "$1,200",     concierge: "$2,000" },
];

const pricingFaqs = [
  { q: "Can I upgrade or downgrade?", a: "Yes, anytime. Changes apply next billing cycle." },
  { q: "What if I exceed 500 minutes on Starter?", a: "$0.08/min overage, or we can auto-upgrade you to Pro for the month." },
  { q: "Is there a contract?", a: "Monthly. Cancel with 30 days notice. Annual plans get 15% off." },
  { q: "What's the free trial?", a: "7 days, full Pro features. We configure your AI, you test with real calls. No credit card required." },
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
  const [selectedPlan, setSelectedPlan] = useState(null);
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
              <PickUpAILogo />
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
                <a href={`tel:${DEMO_PHONE_RAW}`} className="btn-secondary w-full justify-center sm:w-auto sm:justify-start">
                  <PhoneIcon />
                  Call now to hear it live
                </a>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a href={`tel:${DEMO_PHONE_RAW}`} className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-white shadow-xl shadow-slate-900/10 sm:w-auto sm:justify-start">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <PhoneIcon />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Live demo line</p>
                    <p className="text-xl font-black">{DEMO_PHONE}</p>
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
              <h2 className="mt-6 text-[1.85rem] font-black sm:text-3xl">Call {DEMO_PHONE}</h2>
              <p className="mt-4 text-slate-300">Hear a live demo built around the kind of questions Island businesses answer all day long.</p>
              <div className="mt-8 rounded-3xl bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Ask it</p>
                <ul className="mt-4 space-y-3 text-base font-medium text-slate-100">
                  {demoQuestions.map((question) => (
                    <li key={question}>"{question}"</li>
                  ))}
                </ul>
              </div>
              <a href={`tel:${DEMO_PHONE_RAW}`} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-900 transition hover:bg-primary-50 sm:w-auto">
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
              description="Start with one number, validate the value, and scale up once the calls stop leaking. Click any plan to see full details."
            />

            {/* Plan cards */}
            <div className="mt-12 grid gap-5 xl:grid-cols-3">
              {plans.map((plan) => (
                <button
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative rounded-[2rem] border p-7 shadow-premium text-left transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                    plan.popular
                      ? "border-primary-200 bg-slate-900 text-white"
                      : "border-slate-100 bg-white text-slate-900 hover:border-primary-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-6 rounded-full bg-primary-500 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">
                      Most Popular
                    </div>
                  )}

                  <p className={`text-sm font-black uppercase tracking-[0.18em] ${plan.popular ? "text-primary-300" : "text-primary-700"}`}>{plan.name}</p>
                  <p className="mt-3 text-4xl font-black">{plan.price}</p>
                  <p className={`mt-1 text-xs font-bold ${plan.popular ? "text-slate-400" : "text-slate-400"}`}>{plan.setup}</p>
                  <p className={`mt-3 text-sm leading-relaxed ${plan.popular ? "text-slate-300" : "text-slate-500"}`}>{plan.tagline}</p>

                  <div className={`mt-5 h-px ${plan.popular ? "bg-white/10" : "bg-slate-100"}`}></div>

                  <ul className={`mt-5 space-y-2.5 text-sm ${plan.popular ? "text-slate-200" : "text-slate-600"}`}>
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5">
                        <svg className={`mt-0.5 h-4 w-4 shrink-0 ${plan.popular ? "text-primary-400" : "text-primary-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                    plan.popular
                      ? "bg-white text-slate-900"
                      : "bg-slate-900 text-white"
                  }`}>
                    See full details
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Comparison table — horizontally scrollable on mobile */}
            <div className="mt-16 overflow-x-auto rounded-[2rem] border border-slate-100 bg-white shadow-premium">
              <table className="min-w-[540px] w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-left font-black text-slate-900 w-1/3">Feature</th>
                    {plans.map((plan) => (
                      <th key={plan.name} className={`px-4 sm:px-6 py-4 sm:py-5 text-center font-black ${plan.popular ? "text-primary-600" : "text-slate-900"}`}>
                        <span className="block">{plan.name}</span>
                        {plan.popular && <span className="mt-1 inline-block text-[9px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wide">Popular</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr key={row.feature} className={idx % 2 === 0 ? "bg-slate-50/60" : "bg-white"}>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-700 text-xs sm:text-sm">{row.feature}</td>
                      {[row.starter, row.pro, row.concierge].map((val, i) => (
                        <td key={i} className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                          {val === true ? (
                            <svg className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          ) : val === false ? (
                            <svg className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          ) : (
                            <span className="font-medium text-slate-700 text-xs sm:text-sm">{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pricing FAQ */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {pricingFaqs.map((item) => (
                <div key={item.q} className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="font-black text-slate-900 text-[0.95rem]">"{item.q}"</p>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plan detail modal */}
        {selectedPlan && (
          <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center px-0 sm:px-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPlan(null)}>
            <div
              className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {/* Modal header */}
              <div className={`px-7 pt-7 pb-6 rounded-t-[2rem] ${selectedPlan.popular ? "bg-slate-900 text-white" : "bg-slate-50 border-b border-slate-100"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {selectedPlan.popular && (
                      <span className="inline-block mb-2 rounded-full bg-primary-500 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">Most Popular</span>
                    )}
                    <p className={`text-xs font-black uppercase tracking-[0.2em] ${selectedPlan.popular ? "text-primary-300" : "text-primary-700"}`}>{selectedPlan.name}</p>
                    <div className="mt-1 flex items-baseline gap-3 flex-wrap">
                      <h2 className={`text-3xl font-black ${selectedPlan.popular ? "text-white" : "text-slate-900"}`}>{selectedPlan.price}</h2>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${selectedPlan.popular ? "bg-white/10 text-slate-300" : "bg-slate-200 text-slate-600"}`}>{selectedPlan.setup}</span>
                    </div>
                    <p className={`mt-2 text-sm leading-relaxed max-w-md ${selectedPlan.popular ? "text-slate-300" : "text-slate-500"}`}>
                      For: {selectedPlan.tagline}
                    </p>
                  </div>
                  <button onClick={() => setSelectedPlan(null)} className={`shrink-0 p-2 rounded-xl transition ${selectedPlan.popular ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-200 text-slate-500"}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              <div className="px-7 pb-7 pt-6 space-y-5">
                {/* What's included */}
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 mb-2.5">What's Included</p>
                  <div className="rounded-2xl border border-slate-100 overflow-hidden">
                    {selectedPlan.included.map((row, idx) => (
                      <div key={row.feature} className={`flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-3 px-5 py-3 text-sm ${idx % 2 === 0 ? "bg-slate-50" : "bg-white"}`}>
                        <div className="flex items-center gap-2 sm:gap-3 sm:w-40 sm:shrink-0">
                          <svg className="h-4 w-4 shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          <span className="font-bold text-slate-800">{row.feature}</span>
                        </div>
                        <span className="text-slate-500 leading-snug pl-6 sm:pl-0">{row.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What's NOT included */}
                {selectedPlan.notIncluded.length > 0 && (
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 mb-2.5">Not Included</p>
                    <div className="rounded-2xl border border-slate-100 overflow-hidden">
                      {selectedPlan.notIncluded.map((item, idx) => (
                        <div key={item} className={`flex items-start gap-3 px-5 py-3 text-sm ${idx % 2 === 0 ? "bg-slate-50" : "bg-white"}`}>
                          <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          <span className="text-slate-400">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Setup includes */}
                <div className="rounded-2xl bg-primary-50 border border-primary-100 px-5 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-primary-700 mb-2.5">One-time Setup Includes</p>
                  <ul className="space-y-1.5">
                    {selectedPlan.setupIncludes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <a
                    href={`mailto:${SUPPORT_EMAIL}?subject=PickUp%20AI%20${encodeURIComponent(selectedPlan.name)}%20Plan%20%E2%80%94%20Free%20Trial&body=Hi%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(selectedPlan.name)}%20plan%20(${encodeURIComponent(selectedPlan.price)}).%20Please%20set%20me%20up%20for%20the%20free%201-week%20trial.`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 font-black text-white transition hover:bg-primary-700 text-sm"
                  >
                    Start Free Trial — {selectedPlan.name}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </a>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}?subject=PickUp%20AI%20Question`}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3.5 font-bold text-slate-700 transition hover:bg-slate-50 text-sm"
                  >
                    Ask a question
                  </a>
                </div>
                <p className="text-center text-xs text-slate-400">No credit card required · 7-day full trial · Cancel anytime</p>
              </div>
            </div>
          </div>
        )}

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
                <a href={`mailto:${SUPPORT_EMAIL}?subject=Start%20Free%201-Week%20Trial`} className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3 font-bold text-slate-900 transition hover:bg-primary-50 sm:w-auto">
                  Start Free Trial
                </a>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="break-all text-center text-sm font-bold text-primary-200 underline-offset-4 hover:underline sm:text-left">
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="pickupai" onOpenLegal={setActiveModal} />

      <LegalModal
        title="Privacy Policy — PickUp AI"
        isOpen={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
      >
        <PickUpAIPrivacyContent />
      </LegalModal>

      <LegalModal
        title="Terms of Service — PickUp AI"
        isOpen={activeModal === 'terms'}
        onClose={() => setActiveModal(null)}
      >
        <PickUpAITermsContent />
      </LegalModal>
    </div>
  );
}
