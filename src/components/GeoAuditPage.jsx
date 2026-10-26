import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const LABELS = {
  discoverability: "AI Discoverability",
  businessIdentity: "Business Identity",
  answerReadiness: "Answer Readiness",
  trust: "Trust & Evidence",
  technical: "Technical Clarity",
};

const DESCRIPTIONS = {
  discoverability: "Can search and AI crawlers access and discover the site?",
  businessIdentity: "Can systems identify the business, services and location?",
  answerReadiness: "Does the website directly answer customer questions?",
  trust: "Does the site provide credible, first-hand evidence?",
  technical: "Are pages clearly structured for machines and people?",
};

function scoreTone(score) {
  if (score >= 80) return { label: "Strong foundation", color: "text-emerald-600", ring: "stroke-emerald-500" };
  if (score >= 60) return { label: "Room to improve", color: "text-amber-600", ring: "stroke-amber-500" };
  return { label: "Needs attention", color: "text-rose-600", ring: "stroke-rose-500" };
}

function ScoreGauge({ score }) {
  const tone = scoreTone(score);
  const circumference = 2 * Math.PI * 54;
  return (
    <div className="relative h-40 w-40 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128" aria-hidden="true">
        <circle cx="64" cy="64" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100" />
        <circle cx="64" cy="64" r="54" fill="none" strokeWidth="10" strokeLinecap="round" className={tone.ring} strokeDasharray={circumference} strokeDashoffset={circumference - (score / 100) * circumference} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-slate-900">{score}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">out of 100</span>
      </div>
    </div>
  );
}

function AuditForm({ onResult }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/geo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "The website could not be audited.");
      onResult(payload);
      requestAnimationFrame(() => document.getElementById("audit-results")?.scrollIntoView({ behavior: "smooth" }));
    } catch (auditError) {
      setError(auditError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={submit} className="mx-auto mt-8 max-w-3xl rounded-[2rem] border border-white/60 bg-white/85 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:flex sm:items-center sm:gap-3 sm:p-4">
        <label htmlFor="audit-url" className="sr-only">Business website URL</label>
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3.5 sm:px-5">
          <svg className="h-5 w-5 shrink-0 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
          <input id="audit-url" type="text" inputMode="url" autoComplete="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="yourbusiness.ca" className="min-w-0 flex-1 bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400" required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-3 w-full sm:mt-0 sm:w-auto">
          {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Auditing site...</> : <>Check My AI Visibility <span aria-hidden="true">→</span></>}
        </button>
      </form>
      {error && <p role="alert" className="mx-auto mt-4 max-w-2xl text-sm font-bold text-rose-600">{error}</p>}
    </div>
  );
}

function LeadUnlock({ report, onUnlocked }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", businessName: "", consent: false });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/geo-audit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: report.auditedUrl, score: report.overallScore, issues: report.issues }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "The request could not be submitted.");
      onUnlocked();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-2xl sm:p-10">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-400">Free action plan</p>
      <h3 className="mt-3 text-2xl font-black sm:text-3xl">Unlock every finding and your priority roadmap</h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">Share your contact details to reveal the full audit and request a no-obligation review from PEI Web Studio.</p>
      <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2">
        <input value={form.name} onChange={update("name")} required placeholder="Your name" aria-label="Your name" className="rounded-xl border border-white/10 bg-white/10 px-4 py-3.5 text-white outline-none placeholder:text-slate-400 focus:border-primary-400" />
        <input type="email" value={form.email} onChange={update("email")} required placeholder="Business email" aria-label="Business email" className="rounded-xl border border-white/10 bg-white/10 px-4 py-3.5 text-white outline-none placeholder:text-slate-400 focus:border-primary-400" />
        <input value={form.businessName} onChange={update("businessName")} placeholder="Business name" aria-label="Business name" className="rounded-xl border border-white/10 bg-white/10 px-4 py-3.5 text-white outline-none placeholder:text-slate-400 focus:border-primary-400" />
        <input type="tel" value={form.phone} onChange={update("phone")} placeholder="Phone (optional)" aria-label="Phone number" className="rounded-xl border border-white/10 bg-white/10 px-4 py-3.5 text-white outline-none placeholder:text-slate-400 focus:border-primary-400" />
        <label className="flex items-start gap-3 text-xs leading-relaxed text-slate-300 sm:col-span-2"><input type="checkbox" checked={form.consent} onChange={update("consent")} required className="mt-0.5 h-4 w-4 rounded border-slate-500 text-primary-500" />I agree to receive this audit follow-up and information about improving my website. I can opt out at any time.</label>
        {error && <p role="alert" className="text-sm font-bold text-rose-300 sm:col-span-2">{error}</p>}
        <button type="submit" disabled={sending} className="btn-primary bg-primary-500 hover:bg-primary-600 sm:col-span-2 sm:justify-self-start">{sending ? "Unlocking..." : "Unlock My Full Action Plan"}</button>
      </form>
    </div>
  );
}

function AuditResults({ report }) {
  const [unlocked, setUnlocked] = useState(false);
  const tone = scoreTone(report.overallScore);
  const issues = unlocked ? report.issues : report.issues.slice(0, 3);
  return (
    <section id="audit-results" className="scroll-mt-8 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-premium sm:p-10">
          <div className="flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
            <ScoreGauge score={report.overallScore} />
            <div className="flex-1">
              <p className={`text-sm font-black uppercase tracking-[0.16em] ${tone.color}`}>{tone.label}</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">Your AI Visibility Readiness Score</h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">{report.businessSummary}</p>
              <p className="mt-3 truncate text-xs font-semibold text-slate-400">Audited: {report.auditedUrl}</p>
              {!report.aiEnhanced && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">Technical preview only: configure `OPENAI_API_KEY` on the server to enable personalized content analysis.</p>}
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(report.categoryScores).map(([key, score]) => <div key={key} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-baseline justify-between gap-2"><p className="text-sm font-black text-slate-900">{LABELS[key]}</p><span className="text-xl font-black text-primary-600">{score}<span className="text-xs text-slate-400">/20</span></span></div><p className="mt-2 text-xs leading-relaxed text-slate-500">{DESCRIPTIONS[key]}</p></div>)}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary-600">Priority findings</p>
            <h3 className="mb-5 mt-2 text-2xl font-black text-slate-900 sm:text-3xl">What is limiting your visibility</h3>
            <div className="space-y-4">{issues.map((issue, index) => <article key={`${issue.title}-${index}`} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${issue.priority === "critical" ? "bg-rose-100 text-rose-700" : issue.priority === "high" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{issue.priority}</span><span className="text-xs font-bold text-slate-400">{LABELS[issue.category] || issue.category}</span></div><h4 className="mt-3 text-lg font-black text-slate-900">{issue.title}</h4><p className="mt-2 text-sm leading-relaxed text-slate-600">{issue.explanation}</p><div className="mt-4 rounded-xl bg-primary-50 p-4 text-sm leading-relaxed text-primary-900"><strong>Recommended action:</strong> {issue.action}</div></article>)}</div>
          </div>
          <aside className="space-y-6"><div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6"><p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">What is working</p><ul className="mt-4 space-y-3 text-sm leading-relaxed text-emerald-950">{report.strengths.map((strength) => <li key={strength} className="flex gap-2"><span aria-hidden="true">✓</span><span>{strength}</span></li>)}</ul></div><div className="rounded-2xl border border-slate-100 bg-white p-6"><p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Audit coverage</p><p className="mt-3 text-3xl font-black text-slate-900">{report.pagesAudited.length} pages</p><p className="mt-2 text-sm leading-relaxed text-slate-500">Public pages, crawler access, structured data, site content and trust signals.</p></div></aside>
        </div>

        {!unlocked ? <div className="mt-10"><LeadUnlock report={report} onUnlocked={() => setUnlocked(true)} /></div> : <div className="mt-10 rounded-[2rem] border border-primary-100 bg-primary-50 p-6 sm:p-10"><p className="text-xs font-black uppercase tracking-[0.18em] text-primary-700">Your content roadmap</p><h3 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Questions your website should answer clearly</h3><div className="mt-6 grid gap-3 sm:grid-cols-2">{report.missingQuestions.map((question, index) => <div key={question} className="rounded-xl bg-white p-4 text-sm font-bold text-slate-800 shadow-sm"><span className="mr-2 text-primary-600">{index + 1}.</span>{question}</div>)}</div><a href="mailto:peiwebstudio@gmail.com?subject=My%20AI%20Visibility%20Audit" className="btn-primary mt-8">Book My Free GEO Review</a></div>}
      </div>
    </section>
  );
}

export default function GeoAuditPage() {
  const [report, setReport] = useState(null);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Free AI Visibility Audit for PEI Businesses | ListedPEI";
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAFBFF]">
      <header className="relative z-20 px-4 py-4 sm:px-6"><nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/50 bg-white/80 px-4 py-3 shadow-premium backdrop-blur-xl sm:px-6"><Link to="/" aria-label="ListedPEI home"><Logo /></Link><div className="flex items-center gap-3"><Link to="/" className="hidden text-sm font-bold text-slate-500 hover:text-primary-600 sm:inline">Google Profile Kit</Link><Link to="/pickupai" className="hidden text-sm font-bold text-slate-500 hover:text-primary-600 md:inline">PickUp AI</Link><a href="#audit" className="btn-primary px-4 py-2.5 text-xs sm:text-sm">Run Free Audit</a></div></nav></header>
      <main>
        <section id="audit" className="relative px-4 pb-20 pt-16 text-center sm:px-6 sm:pb-28 sm:pt-24"><div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"><div className="absolute left-1/2 top-0 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-200/40 via-violet-200/30 to-accent-200/40 blur-3xl" /></div><div className="mx-auto max-w-5xl"><div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-primary-700 shadow-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-primary-500" />Free for PEI businesses</div><h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-[1.05] text-slate-900 sm:text-6xl lg:text-7xl">Will AI recommend <span className="text-gradient">your business?</span></h1><p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-xl">See how clearly ChatGPT, Google AI and Copilot can discover, understand and trust your website—with a practical action plan you can use.</p><AuditForm onResult={setReport} /><div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-slate-500"><span>✓ No credit card</span><span>✓ Objective 100-point score</span><span>✓ Actionable recommendations</span></div></div></section>
        {report ? <AuditResults report={report} /> : <section className="px-4 pb-20 sm:px-6 sm:pb-28"><div className="mx-auto max-w-6xl rounded-[2.5rem] bg-slate-900 p-7 text-white sm:p-12"><div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-primary-400">What we inspect</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Five signals that shape AI visibility</h2><p className="mt-4 leading-relaxed text-slate-300">There is no magic GEO tag. Strong AI visibility starts with accessible pages, a clear business identity, useful answers and evidence people can trust.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{Object.entries(LABELS).map(([key, label], index) => <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-5"><span className="text-2xl font-black text-primary-400">0{index + 1}</span><h3 className="mt-4 font-black">{label}</h3><p className="mt-2 text-xs leading-relaxed text-slate-400">{DESCRIPTIONS[key]}</p></div>)}</div></div></section>}
        <section className="px-4 pb-20 sm:px-6 sm:pb-28"><div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-primary-600">Built for decisions, not hype</p><h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-5xl">A readiness audit—not a fake ranking promise</h2><p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">AI answers change by query, model, location and date. This audit measures whether your website gives search and AI systems the accessible, unambiguous and trustworthy information they need to consider your business.</p></div><div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-premium sm:p-8"><h3 className="text-xl font-black text-slate-900">You will receive</h3><ul className="mt-5 space-y-4 text-sm text-slate-600">{["A transparent score across five categories", "Your highest-priority technical and content blockers", "Specific recommendations written for business owners", "Questions your website should answer next", "An optional free review with PEI Web Studio"].map((item) => <li key={item} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-black text-primary-700">✓</span><span className="pt-0.5">{item}</span></li>)}</ul></div></div></section>
      </main>
    </div>
  );
}
