import { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "./Toast";
import Logo from "./Logo";
import SiteFooter from "./SiteFooter";
import LegalModal from "./LegalModal";
import { PrivacyPolicyContent, TermsOfServiceContent } from "./LegalContent";
import { SUPPORT_EMAIL } from '../utils/constants';
import GrantChat from "./GrantChat";

const TOTAL_STEPS = 5;

const QUIZ_STEPS = [
  {
    id: "businessType",
    question: "What type of business do you have?",
    icon: "🏢",
    options: [
      { value: "restaurant", label: "Restaurant / Café", icon: "🍽️" },
      { value: "retail", label: "Retail Store", icon: "🛍️" },
      { value: "service", label: "Service Business", icon: "🔧" },
      { value: "tourism", label: "Tourism / Hospitality", icon: "🏖️" },
      { value: "other", label: "Other", icon: "✨" },
    ],
  },
  {
    id: "businessAge",
    question: "How long have you been in business?",
    icon: "📅",
    options: [
      { value: "new", label: "Less than 1 year", icon: "🌱" },
      { value: "established", label: "1–3 years", icon: "🌿" },
      { value: "mature", label: "3+ years", icon: "🌳" },
    ],
  },
  {
    id: "employees",
    question: "How many employees do you have?",
    icon: "👥",
    options: [
      { value: "solo", label: "Just me", icon: "👤" },
      { value: "small", label: "2–10 employees", icon: "👥" },
      { value: "medium", label: "11+ employees", icon: "🏢" },
    ],
  },
  {
    id: "website",
    question: "Do you currently have a website?",
    icon: "🌐",
    options: [
      { value: "yes", label: "Yes", icon: "✅" },
      { value: "no", label: "No", icon: "❌" },
      { value: "progress", label: "In progress", icon: "🚧" },
    ],
  },
  {
    id: "fundingGoal",
    question: "What are you looking to fund?",
    icon: "🎯",
    options: [
      { value: "website", label: "New website", icon: "💻" },
      { value: "marketing", label: "Marketing", icon: "📢" },
      { value: "equipment", label: "Equipment", icon: "⚙️" },
      { value: "training", label: "Training", icon: "📚" },
      { value: "multiple", label: "Multiple things", icon: "🔄" },
    ],
  },
];

// Innovation PEI Grants data
const GRANTS = [
  {
    id: "web-presence",
    name: "Web Presence Assistance Program",
    url: "https://www.princeedwardisland.ca/en/topic/small-business-incentives",
    description: "Get up to 50% of your website development costs covered. Perfect for businesses looking to establish or improve their online presence.",
    maxAmount: "50% of eligible costs",
    eligibility: {
      businessType: ["restaurant", "retail", "service", "tourism", "other"],
      businessAge: ["new", "established", "mature"],
      employees: ["solo", "small", "medium"],
      website: ["no", "progress", "yes"],
      fundingGoal: ["website", "marketing", "multiple"],
    },
    icon: "🌐",
    color: "primary",
  },
  {
    id: "business-development",
    name: "Business Development Support",
    url: "https://www.princeedwardisland.ca/en/service/small-business-assistance-program",
    description: "Financial assistance for business planning, market research, and professional consulting services to help grow your business.",
    maxAmount: "Up to $5,000",
    eligibility: {
      businessType: ["restaurant", "retail", "service", "tourism", "other"],
      businessAge: ["established", "mature"],
      employees: ["small", "medium"],
      website: ["yes", "no", "progress"],
      fundingGoal: ["marketing", "training", "multiple"],
    },
    icon: "📈",
    color: "accent",
  },
  {
    id: "digital-adoption",
    name: "Digital Adoption Support",
    url: "https://www.princeedwardisland.ca/en/service/small-business-investment-grant",
    description: "Funding to help small businesses adopt new digital technologies, software, and tools to improve operations and reach new customers.",
    maxAmount: "Up to $2,500",
    eligibility: {
      businessType: ["restaurant", "retail", "service", "tourism", "other"],
      businessAge: ["new", "established", "mature"],
      employees: ["solo", "small"],
      website: ["yes", "no", "progress"],
      fundingGoal: ["website", "equipment", "multiple"],
    },
    icon: "💻",
    color: "emerald",
  },
];

// Calculate matched grants based on answers
function calculateMatchedGrants(answers) {
  return GRANTS.filter((grant) => {
    // Special case: exclude Web Presence Assistance for users who already have a website
    // or whose funding goal is not website-related
    if (grant.id === "web-presence") {
      if (answers.website === "yes" || answers.website === "progress") {
        return false;
      }
      if (answers.fundingGoal !== "website" && answers.fundingGoal !== "multiple") {
        return false;
      }
    }

    const matches = {
      businessType: grant.eligibility.businessType.includes(answers.businessType),
      businessAge: grant.eligibility.businessAge.includes(answers.businessAge),
      employees: grant.eligibility.employees.includes(answers.employees),
      website: grant.eligibility.website.includes(answers.website),
      fundingGoal: grant.eligibility.fundingGoal.includes(answers.fundingGoal),
    };
    
    // A grant matches if at least 4 out of 5 criteria match
    const matchCount = Object.values(matches).filter(Boolean).length;
    return matchCount >= 4;
  });
}

export default function GrantQuiz() {
  const { toasts, addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    businessType: "",
    businessAge: "",
    employees: "",
    website: "",
    fundingGoal: "",
  });
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [matchedGrants, setMatchedGrants] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const handleAnswer = (value) => {
    const stepId = QUIZ_STEPS[currentStep].id;
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
  };

  const [isNavigating, setIsNavigating] = useState(false);

  const handleNext = () => {
    if (currentStep >= TOTAL_STEPS || isNavigating) return;

    const stepId = QUIZ_STEPS[currentStep].id;
    if (!answers[stepId]) {
      addToast("Please select an option to continue", "error");
      return;
    }
    
    setIsNavigating(true);
    setCurrentStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsNavigating(false), 400);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    // Calculate matched grants first
    const matched = calculateMatchedGrants(answers);
    setMatchedGrants(matched);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const leadTemplateId = import.meta.env.VITE_EMAILJS_LEAD_TEMPLATE_ID;
    const kitTemplateId = import.meta.env.VITE_EMAILJS_KIT_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || serviceId === "your_service_id") {
      addToast("EmailJS not configured. Please check .env file.", "error");
      // Still show results even if email fails
      setShowResults(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const answersLabel = {
        businessType: QUIZ_STEPS[0].options.find(o => o.value === answers.businessType)?.label || "",
        businessAge: QUIZ_STEPS[1].options.find(o => o.value === answers.businessAge)?.label || "",
        employees: QUIZ_STEPS[2].options.find(o => o.value === answers.employees)?.label || "",
        website: QUIZ_STEPS[3].options.find(o => o.value === answers.website)?.label || "",
        fundingGoal: QUIZ_STEPS[4].options.find(o => o.value === answers.fundingGoal)?.label || "",
      };

      const templateParams = {
        to_email: SUPPORT_EMAIL,
        from_name: "GrantReady PEI User",
        from_email: email,
        reply_to: email,
        business_name: "-",
        phone: "-",
        website_status: "-",
        business_type: answersLabel.businessType,
        business_age: answersLabel.businessAge,
        employees: answersLabel.employees,
        has_website: answersLabel.website,
        funding_goal: answersLabel.fundingGoal,
        matched_grants: matched.map(g => g.name).join(", ") || "No specific grants matched",
        message: `GrantReady PEI Quiz Results:\n\nBusiness Type: ${answersLabel.businessType}\nBusiness Age: ${answersLabel.businessAge}\nEmployees: ${answersLabel.employees}\nHas Website: ${answersLabel.website}\nFunding Goal: ${answersLabel.fundingGoal}\n\nMatched Grants: ${matched.map(g => g.name).join(", ") || "No specific grants matched"}`,
      };

      // Send lead notification to admin
      await emailjs.send(serviceId, leadTemplateId, templateParams, { publicKey });

      // Send grant results to the user using the kit template
      const grantList = matched.length > 0
        ? matched.map(g => `${g.icon} ${g.name}\nAmount: ${g.maxAmount}\n${g.description}\nApply here: ${g.url}`).join("\n\n---\n\n")
        : "No exact grant matches found based on your answers.\n\nVisit https://www.princeedwardisland.ca/en/information/innovation-pei to view all available Innovation PEI programs.";

      const nextSteps = `1. Review your matched grants and visit the apply links above.\n2. Prepare your business plan and financial statements.\n3. Get quotes for your project (most grants require this).\n4. Submit your application at princeedwardisland.ca\n\nNeed help applying? Email us at ${SUPPORT_EMAIL} — we help PEI businesses with grant applications.`;

      await emailjs.send(serviceId, kitTemplateId, {
        to_email: email,
        to_name: "there",
        from_name: "GrantReady PEI",
        reply_to: SUPPORT_EMAIL,
        business_name: answersLabel.businessType,
        category: answersLabel.fundingGoal,
        city: "Prince Edward Island",
        long_description: grantList,
        short_description: matched.length > 0
          ? `You likely qualify for ${matched.length} grant${matched.length !== 1 ? "s" : ""}. Top match: ${matched[0].name} (${matched[0].maxAmount}).`
          : "No exact matches found — check Innovation PEI for all available programs.",
        google_posts: nextSteps,
        review_positive: "-",
        review_neutral: "-",
        review_negative: "-",
        faqs: `Business Type: ${answersLabel.businessType}\nYears in Business: ${answersLabel.businessAge}\nEmployees: ${answersLabel.employees}\nHas Website: ${answersLabel.website}\nFunding Goal: ${answersLabel.fundingGoal}`,
        keywords_primary: "-",
        keywords_local: "-",
        keywords_longtail: "-",
        photo_tips: "-",
        categories: matched.map(g => g.name).join(", ") || "No matches",
      }, { publicKey });

      // Save to localStorage for admin
      let leads = [];
      try {
        leads = JSON.parse(localStorage.getItem("listedpei_grant_leads") || "[]");
      } catch {
        leads = [];
      }
      leads.push({
        email,
        answers,
        answersLabel,
        matchedGrants: matched.map(g => g.name),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("listedpei_grant_leads", JSON.stringify(leads));

      addToast("Your results have been sent to your email!");
      setShowResults(true);
    } catch (err) {
      console.error("EmailJS Error:", err);
      addToast("Failed to send email. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({
      businessType: "",
      businessAge: "",
      employees: "",
      website: "",
      fundingGoal: "",
    });
    setEmail("");
    setShowResults(false);
    setMatchedGrants([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentStepData = QUIZ_STEPS[currentStep] || QUIZ_STEPS[QUIZ_STEPS.length - 1];

  // Determine inner content based on state
  const renderInner = () => {
    // Results view
    if (showResults) {
      return (
        <div className="max-w-4xl mx-auto relative animate-fade-in py-10 sm:py-16 px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 border border-primary-100/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Quiz Complete
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight">
              You likely qualify for{" "}
              <span className="text-gradient">{matchedGrants.length} grant{matchedGrants.length !== 1 ? "s" : ""}</span>
            </h1>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
              Based on your answers, here are the Innovation PEI grants that match your business profile.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
            {matchedGrants.length > 0 ? (
              matchedGrants.map((grant, idx) => (
                <div key={grant.id} className="card p-4 sm:p-6 md:p-8 border-l-4 border-l-primary-500 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">{grant.icon}</div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900">{grant.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-700 w-fit">{grant.maxAmount}</span>
                      </div>
                      <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-4">{grant.description}</p>
                      <a href={grant.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary-600 font-bold text-sm hover:text-primary-700 transition-colors">
                        Learn more about this grant
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-8 sm:p-12 text-center">
                <div className="text-5xl sm:text-6xl mb-4">🔍</div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">No exact matches found</h3>
                <p className="text-slate-500 text-base sm:text-lg mb-6 max-w-md mx-auto">Based on your answers, we couldn't find specific grants that match all your criteria. However, Innovation PEI has many programs available!</p>
                <a href="https://www.princeedwardisland.ca/en/information/innovation-pei" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  View All Innovation PEI Programs
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            )}
          </div>

          <div className="card bg-slate-900 text-white p-6 sm:p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-48 sm:w-64 h-48 sm:h-64 bg-primary-500/10 blur-[60px] sm:blur-[100px] rounded-full"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4">Ready to apply for your grants?</h3>
              <p className="text-slate-400 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">Chat with our AI assistant or email our team to get help with your application.</p>
              <a href={`mailto:${SUPPORT_EMAIL}?subject=Grant%20Consultation%20-%20GrantReady%20PEI`} className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all hover:-translate-y-1 shadow-xl shadow-primary-500/20 text-base sm:text-lg">
                Email our team
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
            </div>
          </div>

          {/* PickUp AI Promo */}
          <div className="mt-6 rounded-3xl bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 blur-[60px] rounded-full pointer-events-none"></div>
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                  PickUp AI by ListedPEI
                </div>
                <h3 className="text-lg sm:text-xl font-black mb-2">While you work on grants — never miss another call.</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  An AI phone agent answers every call 24/7, handles bookings and FAQs. Free 1-week trial, plans from $199/mo.
                </p>
              </div>
              <Link
                to="/pickupai"
                className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-black px-5 py-3 rounded-xl transition-all text-sm whitespace-nowrap shrink-0"
              >
                Try Free for 1 Week
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <button onClick={handleRestart} className="inline-flex items-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Start Over
            </button>
          </div>
        </div>
      );
    }

    // Email capture view
    if (currentStep === TOTAL_STEPS) {
      return (
        <div className="flex items-start sm:items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
          <div className="w-full max-w-xl animate-fade-in">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-primary-600">Almost Done!</span>
                <span className="text-xs font-bold text-slate-400">100%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 transition-all duration-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="card p-6 sm:p-8 md:p-10 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-50 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl mb-4 sm:mb-6 mx-auto">📧</div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-3 sm:mb-4">One last step — where should we send your results?</h2>
              <p className="text-slate-500 text-sm sm:text-base mb-2 max-w-sm mx-auto">We'll email you a personalized grant summary so you can refer back to it when you're ready to apply — no digging through tabs.</p>
              <div className="flex flex-col gap-2 mb-6 sm:mb-8 text-left max-w-xs mx-auto">
                {[
                  "Your matched grants + direct application links",
                  "Documents you'll need to prepare",
                  "A note from our team if you want help applying",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-slate-600">
                    <svg className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </div>
                ))}
              </div>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input type="email" placeholder="your@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field text-center text-base sm:text-lg" />
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50">
                  {isSubmitting ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Sending...</>) : (<>Send My Grant Results<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>)}
                </button>
              </form>
              <p className="mt-5 text-xs text-slate-400">We don't spam. One email with your results, that's it.</p>
            </div>
            <div className="mt-6 text-center">
              <button onClick={handleBack} className="inline-flex items-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back to previous question
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Quiz steps view
    return (
      <div className="flex items-start sm:items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
        <div className="w-full max-w-2xl animate-fade-in">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 border border-primary-100/50">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              GrantReady PEI
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight">
              Find Grants For Your <span className="text-gradient">PEI Business</span>
            </h1>
            <p className="text-slate-500 text-base sm:text-lg">Answer 5 quick questions to discover Innovation PEI grants you qualify for</p>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-primary-600">Step {currentStep + 1} of {TOTAL_STEPS}</span>
              <span className="text-xs font-bold text-slate-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <div className="hidden sm:flex justify-between mt-3">
              {QUIZ_STEPS.map((step, i) => (
                <div key={step.id} className={`flex flex-col items-center gap-1 transition-all duration-300 ${i <= currentStep ? "opacity-100" : "opacity-40"}`}>
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentStep ? "bg-primary-500 scale-150" : i < currentStep ? "bg-primary-400" : "bg-slate-300"}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-50">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner-light flex-shrink-0">{currentStepData.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-black text-primary-600 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1">Question {currentStep + 1}</p>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">{currentStepData.question}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {currentStepData.options.map((option) => {
                const isSelected = answers[currentStepData.id] === option.value;
                return (
                  <button key={option.value} onClick={() => handleAnswer(option.value)} className={`relative p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 text-left transition-all duration-300 group ${isSelected ? "border-primary-500 bg-primary-50/50 shadow-lg shadow-primary-500/10" : "border-slate-100 bg-white hover:border-primary-200 hover:bg-slate-50"}`}>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-2xl sm:text-3xl">{option.icon}</span>
                      <span className={`font-bold text-sm sm:text-base ${isSelected ? "text-primary-700" : "text-slate-700"}`}>{option.label}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 sm:w-6 sm:h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className={`flex items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100 gap-3 ${currentStep > 0 ? 'justify-between' : 'justify-end'}`}>
              {currentStep > 0 && (
                <button type="button" onClick={handleBack} className="btn-secondary flex-1 sm:flex-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  Back
                </button>
              )}
              <button type="button" onClick={handleNext} className="btn-primary flex-1 sm:flex-none">
                {currentStep === TOTAL_STEPS - 1 ? "See My Results" : "Next"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-4 sm:mt-6 px-4">Takes less than 2 minutes • Your information is never shared</p>
        </div>
      </div>
    );
  };

  // Shared nav + footer wrapper for all states
  return (
    <div className="min-h-screen bg-[#FAFBFF] flex flex-col">
      <ToastContainer toasts={toasts} />

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-primary-100/30 blur-[80px] sm:blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-accent-100/20 blur-[80px] sm:blur-[120px] rounded-full"></div>
      </div>

      {/* ListedPEI Navbar */}
      <header className="sticky top-0 z-50 px-4 py-3 sm:px-6 sm:py-4">
        <nav className="mx-auto max-w-7xl">
          <div className="glass rounded-2xl sm:rounded-[1.5rem] px-4 sm:px-6 py-3 flex items-center justify-between">
            <Link to="/">
              <Logo />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/" className="nav-link">Features</Link>
              <Link to="/pickupai" className="nav-link">PickUp AI</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="hidden sm:flex bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg text-sm"
              >
                Get My Free Kit
              </Link>
              <Link to="/" className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Page content */}
      <main className="flex-1 relative z-10">
        {renderInner()}
      </main>

      {/* ListedPEI Footer */}
      <SiteFooter variant="listedpei" onOpenLegal={setActiveModal} />

      {/* Grant Chat Widget */}
      <GrantChat defaultOpen={false} />

      {/* Legal modals */}
      <LegalModal title="Privacy Policy" isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)}>
        <PrivacyPolicyContent />
      </LegalModal>
      <LegalModal title="Terms of Service" isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)}>
        <TermsOfServiceContent />
      </LegalModal>
    </div>
  );
}
