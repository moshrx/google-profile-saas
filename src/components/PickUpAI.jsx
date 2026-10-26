import { useState } from "react";
import { Link } from "react-router-dom";
import PickUpAILogo from "./PickUpAILogo";
import LegalModal from "./LegalModal";
import SiteFooter from "./SiteFooter";
import { PickUpAIPrivacyContent, PickUpAITermsContent } from "./LegalContent";
import { DEMO_PHONE, DEMO_PHONE_RAW, SUPPORT_EMAIL } from "../utils/constants";
import { sendLeadEmail } from "../utils/email";

const websiteQuestions = [
  "I need a website for my business. Where do I start?",
  "I already have a website, but it looks outdated. Can I discuss a redesign?",
  "Can I get a quote for a new website?",
  "My website isn’t working properly. Who can help?",
  "What information should I prepare before discussing my project?",
];

const receptionistQuestions = [
  "Are you an AI assistant?",
  "Can I speak to the owner?",
  "Can you connect me to a real person?",
  "Can I leave a message?",
  "Can the owner call me back?",
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

const useCases = [
  { industry: "Restaurants", pain: "Rush-hour calls interrupt service", outcome: "Answers hours, menu questions, and reservation requests" },
  { industry: "Trades & Home Services", pain: "Calls arrive while you're on the job", outcome: "Qualifies the request and captures callback details" },
  { industry: "Tours & Rentals", pain: "Seasonal questions repeat all day", outcome: "Handles availability, directions, and common policies" },
  { industry: "Clinics & Salons", pain: "The front desk cannot answer two people at once", outcome: "Captures booking requests and routine questions" },
];

const faqs = [
  {
    question: "How long does setup take?",
    answer: "The initial call-flow review takes about 15 minutes. Once we have your hours, FAQs, and routing preferences, we confirm a realistic launch timeline for your setup.",
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
  const [contact, setContact] = useState({ name: "", businessName: "", email: "", phone: "", callVolume: "", challenge: "", message: "" });
  const [contactStatus, setContactStatus] = useState("idle");
  const [contactError, setContactError] = useState("");

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setContactError("");

    setContactStatus("sending");
    try {
      await sendLeadEmail({
        to_email: SUPPORT_EMAIL,
        from_name: contact.name,
        from_email: contact.email,
        reply_to: contact.email,
        business_name: contact.businessName,
        phone: contact.phone || "Not provided",
        website_status: "PickUp AI inquiry",
        business_type: contact.challenge,
        business_age: "",
        employees: contact.callVolume,
        has_website: "",
        funding_goal: "",
        matched_grants: "",
        message: `Call volume: ${contact.callVolume || "Not provided"}\nBiggest phone challenge: ${contact.challenge || "Not provided"}\n\n${contact.message || "I would like a free call-flow review and custom PickUp AI demo."}`,
      });

      try {
        const stored = JSON.parse(localStorage.getItem("listedpei_website_leads") || "[]");
        const leads = Array.isArray(stored) ? stored : [];
        leads.push({ ...contact, status: "PickUp AI Inquiry", timestamp: new Date().toISOString() });
        localStorage.setItem("listedpei_website_leads", JSON.stringify(leads));
      } catch (storageError) {
        console.warn("Could not save a local copy of the PickUp AI lead:", storageError);
      }
      setContactStatus("sent");
      setContact({ name: "", businessName: "", email: "", phone: "", callVolume: "", challenge: "", message: "" });
    } catch (error) {
      console.error("PickUp AI contact form error:", error);
      setContactStatus("idle");
      setContactError(error.message || `We couldn't send your message. Please try again or email ${SUPPORT_EMAIL}.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] overflow-x-hidden pb-20 md:pb-0">
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
              <button onClick={() => scrollToSection("contact")} className="nav-link">Contact</button>
              <button onClick={() => scrollToSection("faq")} className="nav-link">FAQ</button>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => scrollToSection("contact")} className="hidden sm:inline-flex btn-primary">
                Get a Free Call Review
              </button>
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
                <button onClick={() => scrollToSection("contact")} className="nav-link py-3 px-4 rounded-xl hover:bg-slate-100 text-left">Contact</button>
                <button onClick={() => scrollToSection("faq")} className="nav-link py-3 px-4 rounded-xl hover:bg-slate-100 text-left">FAQ</button>
                <button onClick={() => scrollToSection("contact")} className="btn-primary mt-2 justify-center">
                  Get a Free Call Review
                </button>
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
                <span className="leading-snug">Every unanswered call could be your next customer</span>
              </div>
              <h1 className="mt-6 max-w-4xl text-[2rem] font-black leading-[1.04] text-slate-900 sm:text-5xl lg:text-6xl">
                Stop Sending Ready-to-Buy Customers to Voicemail
              </h1>
              <p className="mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-slate-600 sm:mt-6 sm:text-xl">
                PickUp AI answers your business phone 24/7, handles common questions, and captures the next step—so opportunities do not disappear when your team is busy.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button onClick={() => scrollToSection("contact")} className="btn-primary w-full justify-center sm:w-auto sm:justify-start">
                  Get a Free Call-Flow Review
                </button>
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
                <p className="text-sm font-medium text-slate-500">No obligation. We map your call flow and show you exactly what the agent could handle.</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#C34A36]/15 via-white to-primary-100/80 blur-2xl"></div>
              <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-premium backdrop-blur-xl sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-primary-700">What happens on the next call</p>
                    <h2 className="mt-2 text-[1.55rem] font-black text-slate-900 sm:text-2xl">A caller gets an answer—not a voicemail greeting</h2>
                  </div>
                  <div className="hidden h-16 w-16 items-center justify-center rounded-3xl bg-primary-50 text-primary-700 sm:flex">
                    <PhoneIcon />
                  </div>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[
                    ["24/7", "phone coverage"],
                    ["1", "consistent answer"],
                    ["Fast", "owner handoff"],
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
                    <p>"I need a website for my business. Where do I start?"</p>
                    <p className="text-slate-400">PickUp AI answers instantly, learns what the caller needs, and helps them take the next step without going to voicemail.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-900 px-6 py-10 text-white sm:px-10 sm:py-12">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-primary-300">The hidden leak</p>
                <h2 className="mt-3 text-[1.85rem] font-black leading-tight sm:text-4xl">Customers rarely leave a detailed voicemail. They call the next business.</h2>
                <p className="mt-4 text-slate-300 leading-relaxed">PickUp AI gives every caller an immediate, useful response while your team stays focused on the customer in front of them.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["During the rush", "Your staff keeps serving instead of stopping to repeat hours and directions."],
                  ["After closing", "Callers still get answers and can leave a structured request for your team."],
                  ["When it matters", "Urgent or valuable conversations can be handed to the right person with context."],
                ].map(([title, copy]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h3 className="font-black text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{copy}</p>
                  </div>
                ))}
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
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-700">Live PEI Web Studio Demo</p>
              <h2 className="mt-3 text-[1.9rem] font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">Call and test the AI receptionist yourself</h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-500 sm:text-lg">Give it a try—ask about a website project, request a quote, or ask to speak to the owner.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
              <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/10">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-white">
                  <PhoneIcon />
                </div>
                <h3 className="mt-6 text-[1.85rem] font-black sm:text-3xl">Call {DEMO_PHONE}</h3>
                <p className="mt-4 text-slate-300">You’ll reach the AI receptionist for PEI Web Studio and hear how it handles a real business conversation.</p>
                <a href={`tel:${DEMO_PHONE_RAW}`} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-900 transition hover:bg-primary-50 sm:w-auto">
                  Call the Live Demo
                </a>
                <a href="https://peiwebstudio.ca" target="_blank" rel="noreferrer" className="mt-5 block text-sm font-bold text-primary-300 hover:text-primary-200">
                  Visit peiwebstudio.ca →
                </a>
              </div>

              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-premium sm:p-8">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-primary-700">Questions to Try</p>
                <h3 className="mt-2 text-[1.45rem] font-black text-slate-900 sm:text-2xl">See how the receptionist handles real requests</h3>
                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  {[
                    ["About their website", websiteQuestions],
                    ["Testing the receptionist", receptionistQuestions],
                  ].map(([title, questions]) => (
                    <div key={title} className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{title}</p>
                      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                        {questions.map((question) => (
                          <li key={question} className="flex gap-3">
                            <span className="font-black text-primary-600">→</span>
                            <span>“{question}”</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
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
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Built Around Your Calls"
              title="Useful from the first hello"
              description="The best call flow depends on why customers call you. We shape the agent around the questions and next steps that matter in your business."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {useCases.map((item) => (
                <div key={item.industry} className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-primary-700">{item.industry}</p>
                  <p className="mt-3 font-bold text-slate-900">{item.pain}</p>
                  <div className="mt-4 flex items-start gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    <span className="font-black text-primary-600">→</span>
                    <span>{item.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button onClick={() => scrollToSection("contact")} className="btn-primary">Build My Custom Call Demo</button>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-br from-[#FFF4EE] via-white to-primary-50 p-8 shadow-premium sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#9E3E2E]">See It in a Real Business</p>
                <h2 className="mt-3 text-[1.9rem] font-black text-slate-900 sm:text-4xl">Meet the PEI Web Studio receptionist</h2>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  This is a live AI receptionist built around a real website business—not a polished recording. Call it, interrupt it, and ask follow-up questions the way a customer would.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-3xl font-black text-slate-900">Live</p>
                  <p className="mt-2 text-sm text-slate-500">demo available to call now</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-3xl font-black text-slate-900">24/7</p>
                  <p className="mt-2 text-sm text-slate-500">availability for website prospects and clients</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-3xl font-black text-slate-900">Local</p>
                  <p className="mt-2 text-sm text-slate-500">built for a PEI business</p>
                </div>
              </div>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <a
                href="https://peiwebstudio.ca"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-start gap-4 rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 sm:flex-row sm:items-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-lg font-black text-white">
                  PW
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-primary-700">Live demo business</p>
                  <p className="mt-1 text-xl font-black text-slate-900">PEI Web Studio</p>
                  <p className="mt-1 text-sm text-slate-500">A live receptionist for website projects, quote requests, support questions, and owner callbacks.</p>
                </div>
              </a>
              <button onClick={() => scrollToSection("contact")} className="rounded-[1.75rem] bg-slate-900 px-6 py-5 text-left text-white transition hover:bg-primary-800 lg:max-w-sm">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-primary-300">Your business could be next</p>
                <p className="mt-2 text-[1.6rem] font-black sm:text-2xl">Request your custom call demo →</p>
              </button>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Free Call-Flow Review"
                title="Get a custom demo built around your business"
                description="Tell us what customers call about. We'll map the best call flow and show you how PickUp AI could answer, qualify, and route those conversations."
              />
              <div className="mt-8 space-y-4">
                {[
                  "A review of where calls are being lost",
                  "A suggested answer, qualification, and routing flow",
                  "A personalized demo using your real customer questions",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-slate-600">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-[1.5rem] bg-slate-900 p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary-300">Prefer to talk now?</p>
                <a href={`tel:${DEMO_PHONE_RAW}`} className="mt-2 block text-2xl font-black hover:text-primary-300">{DEMO_PHONE}</a>
                <p className="mt-2 text-sm text-slate-400">Call the live demo line and hear the experience yourself.</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-premium sm:p-8">
              {contactStatus === "sent" ? (
                <div className="flex min-h-[28rem] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-slate-900">Thanks—we'll be in touch</h3>
                  <p className="mt-3 max-w-md text-slate-500">Your inquiry has been sent. We'll review your business and reply to the email address you provided.</p>
                  <button type="button" onClick={() => setContactStatus("idle")} className="btn-secondary mt-6">
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Request your free review</h3>
                      <p className="mt-2 text-sm text-slate-500">It takes about one minute. No obligation.</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">FREE</span>
                  </div>
                  <form onSubmit={handleContactSubmit} className="mt-7 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block text-sm font-bold text-slate-700">
                        Your name *
                        <input
                          required
                          autoComplete="name"
                          value={contact.name}
                          onChange={(event) => setContact({ ...contact, name: event.target.value })}
                          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        />
                      </label>
                      <label className="block text-sm font-bold text-slate-700">
                        Business name *
                        <input
                          required
                          autoComplete="organization"
                          value={contact.businessName}
                          onChange={(event) => setContact({ ...contact, businessName: event.target.value })}
                          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        />
                      </label>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block text-sm font-bold text-slate-700">
                        Approximate calls per week
                        <select
                          value={contact.callVolume}
                          onChange={(event) => setContact({ ...contact, callVolume: event.target.value })}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        >
                          <option value="">Select one</option>
                          <option value="Fewer than 25">Fewer than 25</option>
                          <option value="25–75">25–75</option>
                          <option value="76–150">76–150</option>
                          <option value="More than 150">More than 150</option>
                          <option value="Not sure">Not sure</option>
                        </select>
                      </label>
                      <label className="block text-sm font-bold text-slate-700">
                        Biggest phone challenge
                        <select
                          value={contact.challenge}
                          onChange={(event) => setContact({ ...contact, challenge: event.target.value })}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        >
                          <option value="">Select one</option>
                          <option value="Missed calls">Missed calls</option>
                          <option value="Repeat questions">Repeat questions</option>
                          <option value="Bookings and reservations">Bookings and reservations</option>
                          <option value="After-hours coverage">After-hours coverage</option>
                          <option value="Call qualification and routing">Call qualification and routing</option>
                        </select>
                      </label>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block text-sm font-bold text-slate-700">
                        Email *
                        <input
                          required
                          type="email"
                          autoComplete="email"
                          value={contact.email}
                          onChange={(event) => setContact({ ...contact, email: event.target.value })}
                          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        />
                      </label>
                      <label className="block text-sm font-bold text-slate-700">
                        Phone
                        <input
                          type="tel"
                          autoComplete="tel"
                          value={contact.phone}
                          onChange={(event) => setContact({ ...contact, phone: event.target.value })}
                          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        />
                      </label>
                    </div>
                    <label className="block text-sm font-bold text-slate-700">
                      What do customers usually call about?
                      <textarea
                        rows="5"
                        value={contact.message}
                        onChange={(event) => setContact({ ...contact, message: event.target.value })}
                        placeholder="For example: hours, availability, quotes, bookings, directions, or order questions."
                        className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                    </label>
                    {contactError && (
                      <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{contactError}</p>
                    )}
                    <button type="submit" disabled={contactStatus === "sending"} className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">
                      {contactStatus === "sending" ? "Sending..." : "Get My Free Call-Flow Review"}
                    </button>
                    <p className="text-center text-xs text-slate-400">No obligation. We only use your details to respond to this inquiry.</p>
                  </form>
                </>
              )}
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
                      aria-expanded={isOpen}
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
                <button onClick={() => scrollToSection("contact")} className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3 font-bold text-slate-900 transition hover:bg-primary-50 sm:w-auto">
                  Get My Free Call Review
                </button>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="break-all text-center text-sm font-bold text-primary-200 underline-offset-4 hover:underline sm:text-left">
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="pickupai" onOpenLegal={setActiveModal} />

      <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        <button onClick={() => scrollToSection("contact")} className="btn-primary w-full justify-center">
          Get a Free Call-Flow Review
        </button>
      </div>

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
