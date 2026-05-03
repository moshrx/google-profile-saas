import { useState } from "react";

const PEI_CITIES = [
  "Charlottetown",
  "Summerside",
  "Stratford",
  "Cornwall",
  "Montague",
  "Kensington",
  "Souris",
  "Alberton",
  "Tignish",
  "Georgetown",
  "O'Leary",
  "Murray River",
  "Borden-Carleton",
  "Crapaud",
  "Miscouche",
  "Wellington",
  "Victoria",
  "North Rustico",
  "Hunter River",
  "Cavendish",
  "Morell",
  "Cardigan",
];

const BUSINESS_CATEGORIES = [
  "Restaurant / Café",
  "Retail Store",
  "Health & Wellness",
  "Beauty & Personal Care",
  "Home Services / Contractor",
  "Automotive",
  "Professional Services (Legal, Accounting)",
  "Real Estate",
  "Tourism & Hospitality",
  "Fitness / Gym",
  "Childcare / Education",
  "Pet Services",
  "Photography / Creative",
  "Technology / IT",
  "Agriculture / Farm",
  "Fishing Industry",
  "Arts & Crafts",
  "Other",
];

const STEPS = [
  { label: "Business", icon: "🏢" },
  { label: "Contact", icon: "📞" },
  { label: "Services", icon: "🕐" },
  { label: "Unique", icon: "⭐" },
];

const initialForm = {
  businessName: "",
  category: "",
  city: "",
  phone: "",
  website: "",
  address: "",
  services: "",
  hours: "",
  unique: "",
  wantsWebsiteMockup: false,
};

export default function StepForm({ onSubmit, initialWantsMockup = false }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ ...initialForm, wantsWebsiteMockup: initialWantsMockup });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const progress = ((step + 1) / STEPS.length) * 100;

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function validateStep(currentStep) {
    const newErrors = {};
    if (currentStep === 0) {
      if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
      if (!formData.category) newErrors.category = "Please select a category";
      if (!formData.city) newErrors.city = "Please select a city or town";
    }
    if (currentStep === 1) {
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (formData.website) {
        try {
          new URL(formData.website);
        } catch {
          newErrors.website = "Please enter a valid URL (e.g. https://yourbusiness.ca)";
        }
      }
    }
    if (currentStep === 2) {
      if (!formData.services.trim()) newErrors.services = "Please describe your services";
      if (!formData.hours?.trim()) newErrors.hours = "Please enter your hours of operation";
    }
    if (currentStep === 3) {
      if (!formData.unique.trim()) newErrors.unique = "Please share what makes your business unique";
    }
    return newErrors;
  }

  function handleNext() {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      const touchAll = {};
      Object.keys(stepErrors).forEach((k) => (touchAll[k] = true));
      setTouched((prev) => ({ ...prev, ...touchAll }));
      return;
    }
    setStep((s) => s + 1);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    setStep((s) => s - 1);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      const touchAll = {};
      Object.keys(stepErrors).forEach((k) => (touchAll[k] = true));
      setTouched((prev) => ({ ...prev, ...touchAll }));
      return;
    }
    onSubmit(formData);
  }

  function fieldError(field) {
    return touched[field] && errors[field] ? errors[field] : null;
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex items-start sm:items-center justify-center p-4 sm:p-6 pt-24 sm:pt-6">
      <div className="w-full max-w-2xl animate-fade-in">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 border border-primary-100/50">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            AI-Powered Optimization
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight">Build Your Profile Kit</h1>
          <p className="text-slate-500 text-base sm:text-lg">Tell us about your business — AI does the rest</p>
        </div>

        {/* Mobile Step Progress */}
        <div className="sm:hidden mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-primary-600">Step {step + 1} of {STEPS.length}</span>
            <span className="text-xs font-bold text-slate-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {STEPS.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    i < step
                      ? "bg-primary-600 text-white"
                      : i === step
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {i < step ? "✓" : s.icon}
                </div>
                <span className={`text-[10px] font-medium mt-1 ${i === step ? "text-slate-900" : "text-slate-400"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Step Indicators */}
        <div className="hidden sm:flex items-center justify-between mb-8 px-2 relative">
          <div className="absolute top-[18px] left-10 right-10 h-[2px] bg-slate-100 -z-10"></div>
          
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-3 flex-1 relative">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  i < step
                    ? "bg-primary-600 text-white shadow-xl shadow-primary-200 scale-90"
                    : i === step
                    ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/20 scale-110"
                    : "bg-white text-slate-400 border border-slate-200"
                }`}
              >
                {i < step ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider ${i === step ? "text-slate-900" : "text-slate-400"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="card p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-slate-50">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-inner-light flex-shrink-0">
              {STEPS[step].icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] sm:text-xs font-black text-primary-600 uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                  Step {step + 1} of {STEPS.length}
                </p>
                <div className="hidden sm:block text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                  Step {step + 1} / 4
                </div>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate">{STEPS[step].label}</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="step-content space-y-4 sm:space-y-5">

              {/* ── Step 1: Business Info ── */}
              {step === 0 && (
                <>
                  <div>
                    <label htmlFor="businessName" className="label text-sm sm:text-base">Business Name <span className="text-red-400">*</span></label>
                    <input
                      id="businessName"
                      type="text"
                      className={`input-field ${fieldError("businessName") ? "border-red-400 focus:ring-red-400" : ""}`}
                      placeholder="e.g. Island Breeze Café"
                      value={formData.businessName}
                      onChange={(e) => handleChange("businessName", e.target.value)}
                      onBlur={() => handleBlur("businessName")}
                    />
                    {fieldError("businessName") && <p className="mt-1 text-xs sm:text-sm text-red-500">{fieldError("businessName")}</p>}
                  </div>

                  <div>
                    <label htmlFor="category" className="label text-sm sm:text-base">Business Category <span className="text-red-400">*</span></label>
                    <select
                      id="category"
                      className={`input-field ${fieldError("category") ? "border-red-400 focus:ring-red-400" : ""}`}
                      value={formData.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      onBlur={() => handleBlur("category")}
                    >
                      <option value="">Select a category…</option>
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {fieldError("category") && <p className="mt-1 text-xs sm:text-sm text-red-500">{fieldError("category")}</p>}
                  </div>

                  <div>
                    <label htmlFor="city" className="label text-sm sm:text-base">City / Town in PEI <span className="text-red-400">*</span></label>
                    <select
                      id="city"
                      className={`input-field ${fieldError("city") ? "border-red-400 focus:ring-red-400" : ""}`}
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      onBlur={() => handleBlur("city")}
                    >
                      <option value="">Select a city or town…</option>
                      {[...PEI_CITIES].sort().map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {fieldError("city") && <p className="mt-1 text-xs sm:text-sm text-red-500">{fieldError("city")}</p>}
                  </div>
                </>
              )}

              {/* ── Step 2: Contact Details ── */}
              {step === 1 && (
                <>
                  <div>
                    <label htmlFor="phone" className="label text-sm sm:text-base">Phone Number <span className="text-red-400">*</span></label>
                    <input
                      id="phone"
                      type="tel"
                      className={`input-field ${fieldError("phone") ? "border-red-400 focus:ring-red-400" : ""}`}
                      placeholder="e.g. (902) 555-1234"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                    />
                    {fieldError("phone") && <p className="mt-1 text-xs sm:text-sm text-red-500">{fieldError("phone")}</p>}
                  </div>

                  <div>
                    <label htmlFor="address" className="label text-sm sm:text-base">Street Address <span className="text-red-400">*</span></label>
                    <input
                      id="address"
                      type="text"
                      className={`input-field ${fieldError("address") ? "border-red-400 focus:ring-red-400" : ""}`}
                      placeholder="e.g. 123 Main St, Charlottetown, PE"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      onBlur={() => handleBlur("address")}
                    />
                    {fieldError("address") && <p className="mt-1 text-xs sm:text-sm text-red-500">{fieldError("address")}</p>}
                  </div>

                  <div>
                    <label htmlFor="website" className="label text-sm sm:text-base">
                      Website <span className="text-slate-400 font-normal text-xs ml-1">(optional)</span>
                    </label>
                    <input
                      id="website"
                      type="url"
                      className={`input-field ${fieldError("website") ? "border-red-400 focus:ring-red-400" : ""}`}
                      placeholder="https://yourbusiness.ca"
                      value={formData.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      onBlur={() => handleBlur("website")}
                    />
                    {fieldError("website") && <p className="mt-1 text-xs sm:text-sm text-red-500">{fieldError("website")}</p>}
                    <p className="mt-1 text-xs text-slate-400">If you have an existing site, we'll pull details from it.</p>
                  </div>
                  
                  <div className="mt-2 flex flex-col gap-2 p-3 sm:p-4 bg-primary-50/50 border border-primary-100 rounded-xl relative group">
                    <div className="flex items-start gap-3">
                      <input
                        id="wantsWebsite"
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-primary-300 text-primary-600 focus:ring-primary-600 cursor-pointer flex-shrink-0"
                        checked={formData.wantsWebsiteMockup}
                        onChange={(e) => handleChange("wantsWebsiteMockup", e.target.checked)}
                      />
                      <label htmlFor="wantsWebsite" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                        I don't have a website (or need a new one). <br/>
                        <span className="text-primary-700 font-bold">Get a FREE mockup from PEI Web Studio! 🚀</span>
                      </label>
                    </div>
                    <div className="ml-7 flex items-center gap-2 text-xs text-primary-600/80 font-medium">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>We'll create a visual preview of your new website based on your business details.</span>
                    </div>
                  </div>
                </>
              )}

              {/* ── Step 3: Services & Hours ── */}
              {step === 2 && (
                <>
                  <div>
                    <label htmlFor="services" className="label text-sm sm:text-base">Services Offered <span className="text-red-400">*</span></label>
                    <textarea
                      id="services"
                      rows={4}
                      className={`input-field resize-none ${fieldError("services") ? "border-red-400 focus:ring-red-400" : ""}`}
                      placeholder="e.g. Fresh seafood chowder, lobster rolls, fish & chips, take-out, catering for local events…"
                      value={formData.services}
                      onChange={(e) => handleChange("services", e.target.value)}
                      onBlur={() => handleBlur("services")}
                    />
                    {fieldError("services") && <p className="mt-1 text-xs sm:text-sm text-red-500">{fieldError("services")}</p>}
                    <p className="mt-1 text-xs text-slate-400">Be specific — the more detail, the better the AI result</p>
                  </div>

                  <div>
                    <label htmlFor="hours" className="label text-sm sm:text-base">Hours of Operation <span className="text-red-400">*</span></label>
                    <textarea
                      id="hours"
                      rows={3}
                      className={`input-field resize-none ${fieldError("hours") ? "border-red-400 focus:ring-red-400" : ""}`}
                      placeholder="e.g. Mon–Fri 8am–6pm, Sat 9am–4pm, Sun Closed"
                      value={formData.hours}
                      onChange={(e) => handleChange("hours", e.target.value)}
                      onBlur={() => handleBlur("hours")}
                    />
                    {fieldError("hours") && <p className="mt-1 text-xs sm:text-sm text-red-500">{fieldError("hours")}</p>}
                  </div>
                </>
              )}

              {/* ── Step 4: Unique Qualities ── */}
              {step === 3 && (
                <>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-amber-800">
                    <p className="font-semibold mb-1">💡 Pro tip for best results</p>
                    <p>Mention specific things like awards, certifications, family-owned history, local sourcing, or community involvement.</p>
                  </div>

                  <div>
                    <label htmlFor="unique" className="label text-sm sm:text-base">
                      3 Things That Make Your Business Unique <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="unique"
                      rows={5}
                      className={`input-field resize-none ${fieldError("unique") ? "border-red-400 focus:ring-red-400" : ""}`}
                      placeholder={`1. Family-owned and operated for 25 years on PEI\n2. We use only locally-sourced PEI potatoes and seafood\n3. Winner of the 2023 Charlottetown Readers' Choice Award`}
                      value={formData.unique}
                      onChange={(e) => handleChange("unique", e.target.value)}
                      onBlur={() => handleBlur("unique")}
                    />
                    {fieldError("unique") && <p className="mt-1 text-xs sm:text-sm text-red-500">{fieldError("unique")}</p>}
                  </div>
                </>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100 gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 0}
                id={`btn-back-step-${step}`}
                className={`btn-secondary ${step === 0 ? "opacity-40 cursor-not-allowed hover:translate-y-0" : ""} flex-1 sm:flex-none`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  id={`btn-next-step-${step}`}
                  className="btn-primary flex-1 sm:flex-none"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  id="btn-generate-profile"
                  className="btn-primary bg-primary-600 hover:bg-primary-700 px-4 sm:px-8 flex-1 sm:flex-none"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="hidden sm:inline">Generate My Profile Kit</span>
                  <span className="sm:hidden">Generate</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-4 sm:mt-6 px-4">
          Your data is never stored — everything runs in your browser.
        </p>
      </div>
    </div>
  );
}
