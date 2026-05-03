import { useState } from "react";
import emailjs from '@emailjs/browser';
import { SUPPORT_EMAIL } from '../utils/constants';
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "./Toast";
import { Link } from "react-router-dom";
import GrantChat from "./GrantChat";

const GRANT_STEPS = [
  { id: "businessAge", question: "How long have you been in business?", options: [{ value: "new", label: "Less than 1 year" }, { value: "established", label: "1–3 years" }, { value: "mature", label: "3+ years" }] },
  { id: "employees", question: "How many employees?", options: [{ value: "solo", label: "Just me" }, { value: "small", label: "2–10 employees" }, { value: "medium", label: "11+ employees" }] },
  { id: "fundingGoal", question: "What are you looking to fund?", options: [{ value: "website", label: "New website" }, { value: "marketing", label: "Marketing" }, { value: "equipment", label: "Equipment" }, { value: "training", label: "Training" }, { value: "multiple", label: "Multiple things" }] },
];

const GRANTS_DATA = [
  { name: "Web Presence Assistance Program", maxAmount: "50% of eligible costs", description: "Covers up to 50% of website development costs.", url: "https://www.princeedwardisland.ca/en/topic/small-business-incentives", match: (a) => a.fundingGoal === "website" || a.fundingGoal === "multiple" },
  { name: "Business Development Support", maxAmount: "Up to $5,000", description: "Funding for business planning, market research, and consulting.", url: "https://www.princeedwardisland.ca/en/service/small-business-assistance-program", match: (a) => (a.businessAge === "established" || a.businessAge === "mature") && (a.employees === "small" || a.employees === "medium") && (a.fundingGoal === "marketing" || a.fundingGoal === "training" || a.fundingGoal === "multiple") },
  { name: "Digital Adoption Support", maxAmount: "Up to $2,500", description: "Funding to adopt new digital technologies and software.", url: "https://www.princeedwardisland.ca/en/service/small-business-investment-grant", match: (a) => (a.employees === "solo" || a.employees === "small") && (a.fundingGoal === "website" || a.fundingGoal === "equipment" || a.fundingGoal === "multiple") },
];

function GrantChecker({ onGrantsChecked }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ businessAge: "", employees: "", fundingGoal: "" });
  const [done, setDone] = useState(false);
  const [matched, setMatched] = useState([]);

  const current = GRANT_STEPS[step];

  const handleSelect = (value) => {
    const updated = { ...answers, [current.id]: value };
    setAnswers(updated);
    if (step < GRANT_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      const results = GRANTS_DATA.filter(g => g.match(updated));
      setMatched(results);
      setDone(true);
      onGrantsChecked(results, updated);
    }
  };

  if (done) {
    return (
      <div className="mt-3">
        {matched.length > 0 ? (
          <div className="space-y-3">
            {matched.map((g) => (
              <div key={g.name} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-black text-slate-900 text-sm">{g.name}</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">{g.maxAmount}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{g.description}</p>
                </div>
                <a href={g.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 whitespace-nowrap shrink-0 flex items-center gap-1">
                  Apply
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </a>
              </div>
            ))}
            <p className="text-xs text-slate-400 px-1">Results saved — included in your kit email above.</p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-sm font-bold text-slate-700 mb-1">No exact matches found</p>
            <p className="text-xs text-slate-500 mb-3">Check Innovation PEI for all available programs.</p>
            <a href="https://www.princeedwardisland.ca/en/information/innovation-pei" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary-600 hover:text-primary-700">View all programs →</a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400 mb-2">Step {step + 1} of {GRANT_STEPS.length} — {current.question}</p>
      <div className="flex flex-wrap gap-2">
        {current.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 text-sm font-medium text-slate-700 transition-all"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * CopyCard Sub-component with individual Copy button
 */
function CopyCard({ label, content, badge }) {
  const [copied, setCopied] = useState(false);
  const safeContent = content || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(safeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-result p-4 sm:p-5 border border-slate-100 mb-3 sm:mb-4 group relative overflow-hidden transition-all duration-300 hover:border-primary-200 bg-white rounded-xl sm:rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
          {badge && (
            <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-[10px] font-bold rounded-full uppercase tracking-tighter ring-1 ring-primary-100">
              {badge}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className={`self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 tap-target ${
            copied
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
              : "bg-slate-50 text-slate-600 hover:bg-white hover:shadow-md border border-slate-200"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-medium">
        {safeContent}
      </div>
      <div className="mt-2 sm:mt-3 flex items-center gap-2 text-[10px] font-medium text-slate-400">
        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
        {safeContent.length} characters
      </div>
    </div>
  );
}

/**
 * Main Results Display
 */
export default function Results({ result, formData, onReset, onExportPDF }) {
  const { toasts, addToast } = useToast();
  const [email, setEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [grantResults, setGrantResults] = useState(null);
  const [grantAnswers, setGrantAnswers] = useState(null);

  const handleGrantsChecked = (matched, answers) => {
    setGrantResults(matched);
    setGrantAnswers(answers);
    // Save to localStorage
    let leads = [];
    try {
      leads = JSON.parse(localStorage.getItem("listedpei_grant_leads") || "[]");
    } catch {
      leads = [];
    }
    leads.push({ businessName: formData?.businessName, answers, matchedGrants: matched.map(g => g.name), timestamp: new Date().toISOString() });
    localStorage.setItem("listedpei_grant_leads", JSON.stringify(leads));
  };
  const [websiteLead, setWebsiteLead] = useState({
    name: "",
    email: "",
    phone: formData.phone || "",
    status: formData.wantsWebsiteMockup ? "No Website" : "Enhance Existing",
    message: formData.wantsWebsiteMockup 
      ? `I selected that I don't have a website (or need a new one) during my profile generation for ${formData.businessName}. I'm interested in getting a FREE mockup from PEI Web Studio.`
      : `I just set up my Google profile for ${formData.businessName} and I'm interested in getting a website mockup.`,
  });
  const [isSendingWebsiteLead, setIsSendingWebsiteLead] = useState(false);
  const [websiteLeadSent, setWebsiteLeadSent] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(() => {
    return localStorage.getItem('listedpei_feedback') ? true : false;
  });

  // EmailJS configuration
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const kitTemplateId = import.meta.env.VITE_EMAILJS_KIT_TEMPLATE_ID;
  const leadTemplateId = import.meta.env.VITE_EMAILJS_LEAD_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Guard for missing data
  if (!result || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 text-center">
        <div className="card max-w-md p-6 sm:p-8 shadow-xl">
          <div className="text-4xl mb-4">🏠</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No profile found</h2>
          <p className="text-slate-500 mb-6 font-medium">Something went wrong. Let's head back and try again.</p>
          <button onClick={onReset} className="btn-primary w-full">Start New Search</button>
        </div>
      </div>
    );
  }

  // Handle Send Kit Email via EmailJS
  const handleSendKitEmail = async (e) => {
    e.preventDefault();
    if (!email) return;

    // Check if EmailJS is configured
    if (!serviceId || serviceId === "your_service_id") {
      addToast("EmailJS not configured. Please check .env file.", "error");
      return;
    }

    setIsSendingEmail(true);

    try {
      const templateParams = {
        to_email: email,
        to_name: formData.businessName,
        from_name: "ListedPEI",
        reply_to: SUPPORT_EMAIL,
        business_name: formData.businessName,
        category: formData.category,
        city: formData.city,
        long_description: result.longDescription || 'N/A',
        short_description: result.shortDescription || 'N/A',
        google_posts: (result.googlePosts || []).join("\n\n---\n\n"),
        review_positive: result.reviewResponses?.positive || 'N/A',
        review_neutral: result.reviewResponses?.neutral || 'N/A',
        review_negative: result.reviewResponses?.negative || 'N/A',
        faqs: (result.faqs || []).map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n"),
        grant_results: grantResults
          ? (grantResults.length > 0
              ? grantResults.map(g => `${g.name} (${g.maxAmount})`).join(", ")
              : "No exact grant matches found.")
          : "Grant check not completed.",
        grant_details: grantResults
          ? (grantResults.length > 0
              ? grantResults.map(g => `${g.name} (${g.maxAmount})\n${g.description}\nApply: ${g.url}`).join("\n\n")
              : "No exact grant matches found. Visit https://www.princeedwardisland.ca/en/information/innovation-pei for all programs.")
          : "Grant check not completed.",
        keywords_primary: (result.competitorKeywords?.primary || []).join(", "),
        keywords_local: (result.competitorKeywords?.local || []).join(", "),
        keywords_longtail: (result.competitorKeywords?.longTail || []).join(", "),
        photo_tips: (result.photoTips || []).join("\n"),
        categories: (result.categories || []).join(", "),
      };

      await emailjs.send(serviceId, kitTemplateId, templateParams, { publicKey });

      // Save to localStorage for admin
      let leads = [];
      try {
        leads = JSON.parse(localStorage.getItem("listedpei_leads") || "[]");
      } catch {
        leads = [];
      }
      leads.push({ email, businessName: formData.businessName, category: formData.category, city: formData.city, timestamp: new Date().toISOString() });
      localStorage.setItem("listedpei_leads", JSON.stringify(leads));

      addToast("Kit sent to your email successfully!");
      setEmail("");
    } catch (err) {
      console.error("EmailJS Error:", err);
      addToast("Failed to send email. Please try again.", "error");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Handle Website Lead via EmailJS
  const handleWebsiteLeadSubmit = async (e) => {
    e.preventDefault();

    if (!serviceId || serviceId === "your_service_id") {
      addToast("EmailJS not configured. Please check .env file.", "error");
      return;
    }

    setIsSendingWebsiteLead(true);

    try {
      const templateParams = {
        to_email: SUPPORT_EMAIL,
        from_name: websiteLead.name,
        from_email: websiteLead.email,
        reply_to: websiteLead.email,
        business_name: formData.businessName,
        phone: websiteLead.phone || "Not provided",
        website_status: websiteLead.status,
        business_type: grantAnswers?.businessAge
          ? (grantAnswers.businessAge === "new" ? "Less than 1 year" : grantAnswers.businessAge === "established" ? "1–3 years" : "3+ years")
          : "Not provided",
        business_age: grantAnswers?.businessAge
          ? (grantAnswers.businessAge === "new" ? "Less than 1 year" : grantAnswers.businessAge === "established" ? "1–3 years" : "3+ years")
          : "Not provided",
        employees: grantAnswers?.employees
          ? (grantAnswers.employees === "solo" ? "Just me" : grantAnswers.employees === "small" ? "2–10 employees" : "11+ employees")
          : "Not provided",
        has_website: "-",
        funding_goal: grantAnswers?.fundingGoal
          ? (grantAnswers.fundingGoal === "website" ? "New website" : grantAnswers.fundingGoal === "marketing" ? "Marketing" : grantAnswers.fundingGoal === "equipment" ? "Equipment" : grantAnswers.fundingGoal === "training" ? "Training" : "Multiple things")
          : "Not provided",
        matched_grants: grantResults
          ? (grantResults.length > 0 ? grantResults.map(g => g.name).join(", ") : "No matches")
          : "Grant check not completed",
        message: websiteLead.message + (grantResults && grantResults.length > 0
          ? `\n\n--- Grant Eligibility ---\n${grantResults.map(g => `${g.name} (${g.maxAmount})`).join("\n")}`
          : ""),
      };

      await emailjs.send(serviceId, leadTemplateId, templateParams, { publicKey });

      // Save to localStorage
      let leads = [];
      try {
        leads = JSON.parse(localStorage.getItem("listedpei_website_leads") || "[]");
      } catch {
        leads = [];
      }
      leads.push({ ...websiteLead, businessName: formData.businessName, timestamp: new Date().toISOString() });
      localStorage.setItem("listedpei_website_leads", JSON.stringify(leads));

      setWebsiteLeadSent(true);
      addToast("Website mockup request sent!");
    } catch (err) {
      console.error("EmailJS Error:", err);
      addToast("Request failed — please try again later.", "error");
    } finally {
      setIsSendingWebsiteLead(false);
    }
  };

  const handleFeedback = (type) => {
    localStorage.setItem('listedpei_feedback', type);
    setFeedbackGiven(true);
  };

  const copyAllKeywords = () => {
    const k = result.competitorKeywords || {};
    const all = [...(k.primary || []), ...(k.local || []), ...(k.longTail || [])].join(", ");
    navigator.clipboard.writeText(all);
    addToast("All keywords copied!");
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] pb-16 sm:pb-24 pt-6 sm:pt-12 px-4 sm:px-6 overflow-hidden">
      <ToastContainer toasts={toasts} />
      
      {/* ── Background Flair ─────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-primary-100/30 blur-[80px] sm:blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-accent-100/20 blur-[80px] sm:blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto relative animate-fade-in">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:gap-8 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="bg-primary-500 text-white text-[10px] sm:text-xs font-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-primary-500/20">
                Optimization Complete
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              {formData.businessName} <span className="text-gradient">Profile Kit</span>
            </h1>
            <p className="text-slate-500 text-base sm:text-lg font-medium mt-1 sm:mt-2">
              Deeply localized for {formData.city}, PEI
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button 
              onClick={onReset} 
              className="btn-secondary h-11 sm:h-14 px-4 sm:px-6 flex-1 sm:flex-none text-sm"
            >
              Start New
            </button>
            <button
              onClick={() => onExportPDF(result, formData)}
              className="btn-primary h-11 sm:h-14 px-4 sm:px-8 flex-1 sm:flex-none text-sm"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>

        {/* Inline Grant Checker */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-xl">💰</div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Is {formData.businessName} eligible for PEI grants?</h3>
              <p className="text-xs text-slate-500">3 quick questions — results saved to your kit email</p>
            </div>
          </div>
          <GrantChecker businessName={formData.businessName} onGrantsChecked={handleGrantsChecked} />
        </div>

        {/* Email Capture Section */}
        <div className="card shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-primary-100 bg-gradient-to-r from-white to-primary-50">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Get your full kit delivered to your inbox</h2>
          <form onSubmit={handleSendKitEmail} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="input-field flex-1 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSendingEmail}
              className="btn-primary bg-slate-800 hover:bg-slate-900 px-6 sm:px-8 disabled:opacity-50 text-sm whitespace-nowrap"
            >
              {isSendingEmail ? "Sending..." : "Send My Kit"}
            </button>
          </form>
          <p className="mt-2 text-xs text-slate-400">We'll only email you about your business profile and relevant updates.</p>
        </div>

        {/* Content Cards */}
        <div className="space-y-3 sm:space-y-4">
          {/* Descriptions */}
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Descriptions</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <CopyCard label="Long Description" content={result.longDescription} />
          <CopyCard label="Short Description" content={result.shortDescription} />

          {/* Google Posts */}
          <div className="flex items-center gap-3 mb-2 sm:mb-3 mt-6 sm:mt-8">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Google Posts (5)</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {(result.googlePosts || []).map((post, i) => (
              <CopyCard key={i} label={`Google Post ${i + 1}`} content={post} />
            ))}
          </div>

          {/* Review Responses */}
          <div className="flex items-center gap-3 mb-2 sm:mb-3 mt-6 sm:mt-8">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Review Responses</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <CopyCard label="Positive Review Response" content={result.reviewResponses?.positive} badge="5-Star" />
          <CopyCard label="Neutral Review Response" content={result.reviewResponses?.neutral} badge="3-Star" />
          <CopyCard label="Negative Review Response" content={result.reviewResponses?.negative} badge="1-Star" />

          {/* Photo Tips Section */}
          <div className="flex items-center gap-3 mb-2 sm:mb-3 mt-6 sm:mt-8">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">📸 Photo Tips</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(result.photoTips || []).map((tip, i) => (
              <div key={i} className="card p-3 sm:p-4 border border-slate-100 hover:border-primary-100 transition-all flex flex-col justify-between">
                <div>
                  <div className="text-lg mb-2">📸</div>
                  <p className="text-sm font-medium text-slate-700 leading-snug">{tip}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(tip);
                    addToast("Tip copied!");
                  }}
                  className="mt-3 sm:mt-4 text-[10px] font-bold text-primary-600 uppercase tracking-wider self-start hover:text-primary-700 tap-target"
                >
                  Copy Tip
                </button>
              </div>
            ))}
          </div>

          {/* Competitor Keywords Section */}
          <div className="flex items-center gap-3 mb-2 sm:mb-3 mt-6 sm:mt-8">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">🔍 Keywords to Target</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="card shadow-md p-4 sm:p-6 border border-slate-100">
            <div className="space-y-4 sm:space-y-6">
              {[
                { label: "Primary", list: result.competitorKeywords?.primary || [], color: "bg-blue-100 text-blue-800" },
                { label: "Local (PEI-specific)", list: result.competitorKeywords?.local || [], color: "bg-emerald-100 text-emerald-800" },
                { label: "Long-Tail Services", list: result.competitorKeywords?.longTail || [], color: "bg-purple-100 text-purple-800" }
              ].map((group) => (
                <div key={group.label}>
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">{group.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.list.map((kw, idx) => (
                      <button
                        key={`${group.label}-${idx}-${kw}`}
                        onClick={() => {
                          navigator.clipboard.writeText(kw);
                          addToast(`Keyword "${kw}" copied!`);
                        }}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all hover:scale-105 active:scale-95 tap-target ${group.color}`}
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={copyAllKeywords}
              className="mt-6 sm:mt-8 w-full btn-secondary text-primary-700 border-primary-100 hover:bg-primary-50 text-sm"
            >
              Copy All Keywords
            </button>
          </div>

          {/* Common FAQs */}
          <div className="flex items-center gap-3 mb-2 sm:mb-3 mt-6 sm:mt-8">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Common FAQs</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {(result.faqs || []).map((faq, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2 mb-1 pl-1">
                <span className="text-[10px] sm:text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded uppercase font-display tracking-wider">
                  Q&A {i + 1}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CopyCard label="Question" content={faq.q} />
                <CopyCard label="Answer" content={faq.a} />
              </div>
            </div>
          ))}

          {/* Categories */}
          <div className="flex items-center gap-3 mb-2 sm:mb-3 mt-6 sm:mt-8">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested Categories</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="card-result p-4 sm:p-6 border border-slate-100 bg-slate-50/50 rounded-xl sm:rounded-2xl">
            <div className="space-y-3">
              {(result.categories || []).map((cat, i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4">
                  <span className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-bold flex-shrink-0 ${
                      i === 0 ? "bg-primary-600 text-white" : "bg-white text-slate-400 border border-slate-200"
                    }`}>
                    {i === 0 ? "1º" : i + 1}
                  </span>
                  <span className={`font-semibold text-sm sm:text-base truncate ${i === 0 ? "text-slate-800" : "text-slate-500"}`}>{cat}</span>
                  {i === 0 && <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider ml-auto flex-shrink-0">Primary</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Website Upsell Banner */}
        <div className="mt-12 sm:mt-20 bg-slate-900 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-12 lg:p-16 shadow-2xl text-white overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-accent-600/20 pointer-events-none"></div>
          <div className="absolute top-[-20%] right-[-10%] w-48 sm:w-64 h-48 sm:h-64 bg-primary-500/10 blur-[60px] sm:blur-[100px] rounded-full group-hover:bg-primary-500/20 transition-colors duration-700"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-wider mb-4 sm:mb-8 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400"></span>
                Partner Program
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-8 !leading-tight tracking-tight">
                {formData.wantsWebsiteMockup ? (
                  <>Get your <span className="text-primary-400">FREE Mockup</span> started.</>
                ) : (
                  <>Take your business <span className="text-primary-400">Online</span> today.</>
                )}
              </h2>
              <p className="text-slate-400 mb-6 sm:mb-10 text-base sm:text-lg leading-relaxed">
                {formData.wantsWebsiteMockup 
                  ? "You mentioned you need a website. Provide a few details here, and our partner PEI Web Studio will design a custom mockup for your business at no cost!"
                  : "Your high-converting Google profile is just the beginning. Get a custom website that matches your new professional presence."
                }
              </p>
              <div className="space-y-3 sm:space-y-4">
                {[
                  "Mobile-first responsive design",
                  "SEO & Performance optimized",
                  "Social media integration",
                  "Innovation PEI grant assistance"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 sm:gap-4 text-slate-300 font-medium text-sm sm:text-base">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-dark border-white/5 p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-[2rem]">
              {websiteLeadSent ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center text-3xl sm:text-4xl mb-4 sm:mb-6 animate-bounce">✨</div>
                  <h3 className="text-xl sm:text-2xl font-black mb-2">Request Sent!</h3>
                  <p className="text-slate-400 text-sm sm:text-base">We'll reach out to discuss your mockup soon.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-8">Get a Free Mockup</h3>
                  <form onSubmit={handleWebsiteLeadSubmit} className="space-y-3 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Website Status</label>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {['No Website', 'Enhance Existing'].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setWebsiteLead({ ...websiteLead, status })}
                            className={`px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-[10px] sm:text-xs font-bold border transition-all tap-target ${
                              websiteLead.status === status 
                                ? "bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20" 
                                : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                      <input
                        required
                        placeholder="John Doe"
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-primary-500/50 outline-none transition-all text-sm"
                        value={websiteLead.name}
                        onChange={(e) => setWebsiteLead({ ...websiteLead, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-primary-500/50 outline-none transition-all text-sm"
                        value={websiteLead.email}
                        onChange={(e) => setWebsiteLead({ ...websiteLead, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="(902) 555-1234"
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-primary-500/50 outline-none transition-all text-sm"
                        value={websiteLead.phone}
                        onChange={(e) => setWebsiteLead({ ...websiteLead, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Your Vision</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Tell us about your goals..."
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-primary-500/50 outline-none transition-all resize-none text-sm"
                        value={websiteLead.message}
                        onChange={(e) => setWebsiteLead({ ...websiteLead, message: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSendingWebsiteLead}
                      className="w-full py-4 sm:py-5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] disabled:opacity-50 mt-2 sm:mt-4"
                    >
                      {isSendingWebsiteLead ? "Sending..." : "Request Mockup →"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Widget */}
        <div className="mt-12 sm:mt-16 mb-6 sm:mb-8 text-center animate-fade-in-up">
          {!feedbackGiven ? (
            <div className="bg-white/50 backdrop-blur-sm border border-slate-200 inline-flex flex-col items-center p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] shadow-sm">
              <h4 className="text-slate-800 font-bold mb-3 sm:mb-4 text-sm sm:text-base">Was this profile kit helpful?</h4>
              <div className="flex gap-3 sm:gap-4">
                <button 
                  onClick={() => handleFeedback('up')}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-slate-100 hover:scale-110 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-500 transition-all tap-target"
                >
                  👍
                </button>
                <button 
                  onClick={() => handleFeedback('down')}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-slate-100 hover:scale-110 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all tap-target"
                >
                  👎
                </button>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 text-primary-600 font-bold bg-primary-50 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-primary-100 text-sm sm:text-base">
              <span className="text-xl">🙌</span> Thanks for your feedback!
            </div>
          )}
        </div>

        {/* PickUp AI Promo */}
        <div className="mt-10 sm:mt-14 rounded-3xl bg-slate-900 text-white p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                PickUp AI by ListedPEI
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 leading-tight">
                You ranked on Google. Now answer the calls.
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
                An AI phone agent that answers every call 24/7 — handles bookings, FAQs, and follow-ups so you never miss a customer again. Plans start at $199/mo with a free 1-week trial.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                {["24/7 call answering", "Booking handling", "Setup in 48 hours"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link
                to="/pickupai"
                className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-black px-6 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5 shadow-xl shadow-red-500/20 text-sm sm:text-base whitespace-nowrap"
              >
                Get Free 1-Week Trial
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <p className="text-xs text-slate-500 text-center">No credit card required</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Generated by ListedPEI</p>
        </div>
      </div>

      {/* Floating Grant AI Chat Widget */}
      <GrantChat />
    </div>
  );
}
