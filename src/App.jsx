import React, { useState, useEffect, lazy, Suspense } from "react";

// Lazy load components for code splitting
const StepForm = lazy(() => import("./components/StepForm"));
const Loading = lazy(() => import("./components/LoadingScreen"));
const Results = lazy(() => import("./components/Results"));
const AdminLeads = lazy(() => import("./components/AdminLeads"));
const LandingPage = lazy(() => import("./components/LandingPage"));
const Footer = lazy(() => import("./components/Footer"));
const LegalModal = lazy(() => import("./components/LegalModal"));
const FloatingBadge = lazy(() => import("./components/FloatingBadge"));

// Import utilities (these are smaller, can be loaded eagerly)
import { generateProfile } from "./utils/generateProfile";
import { exportPDF } from "./utils/exportPDF";

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFF]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Error Boundary Component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 text-center">
          <div className="card max-w-md p-6 sm:p-8 shadow-xl border-t-4 border-red-500">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Something went wrong</h2>
            <p className="text-slate-500 mb-6 font-medium text-sm sm:text-base">The application encountered a rendering error. This usually happens if the AI returns incomplete data.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full bg-slate-800 hover:bg-slate-900 text-sm"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [page, setPage] = useState("home");
  const [formData, setFormData] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [initialWantsMockup, setInitialWantsMockup] = useState(false);

  // Check for admin route
  useEffect(() => {
    if (window.location.pathname === "/admin/leads") {
      setPage("admin");
    }
  }, []);

  const handleFormSubmit = async (data) => {
    setFormData(data);
    setPage("loading");
    setError(null);

    try {
      const profile = await generateProfile(data);
      setResult(profile);
      setPage("results");
    } catch (err) {
      console.error("Generation Error:", err);
      setError(err.message || "Failed to generate profile. Please check your API key.");
      setPage("form");
    }
  };

  const handleReset = () => {
    setFormData(null);
    setResult(null);
    setError(null);
    setPage("home");
    if (window.location.pathname === "/admin/leads") {
      window.history.pushState({}, "", "/");
    }
  };

  const startForm = (wantsMockup = false) => {
    setInitialWantsMockup(wantsMockup);
    setPage("form");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (page === "admin") {
      return (
        <Suspense fallback={<PageLoader />}>
          <AdminLeads onBack={handleReset} />
        </Suspense>
      );
    }

    switch (page) {
      case "home":
        return (
          <Suspense fallback={<PageLoader />}>
            <LandingPage onGetStarted={startForm} />
          </Suspense>
        );
      case "form":
        return (
          <div className="animate-fade-in">
            <div className="fixed top-4 sm:top-8 left-4 sm:left-8 z-[60]">
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-all group tap-target"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full glass flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span className="hidden md:block text-sm">Exit to Home</span>
              </button>
            </div>
            
            {error && (
              <div className="fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-md px-4 pointer-events-none">
                <div className="bg-red-500 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-3 animate-bounce shadow-red-500/20 pointer-events-auto">
                  <span className="text-lg sm:text-xl">⚠️</span>
                  <p className="font-bold text-xs sm:text-sm">{error}</p>
                </div>
              </div>
            )}
            
            <Suspense fallback={<PageLoader />}>
              <StepForm onSubmit={handleFormSubmit} initialWantsMockup={initialWantsMockup} />
            </Suspense>
          </div>
        );
      case "loading":
        return (
          <Suspense fallback={<PageLoader />}>
            <Loading businessName={formData?.businessName} />
          </Suspense>
        );
      case "results":
        return (
          <Suspense fallback={<PageLoader />}>
            <Results
              result={result}
              formData={formData}
              onReset={handleReset}
              onExportPDF={(res, form) => exportPDF(res, form)}
            />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<PageLoader />}>
            <LandingPage onGetStarted={startForm} />
          </Suspense>
        );
    }
  };

  return (
    <div className="App font-outfit min-h-screen flex flex-col">
      <ErrorBoundary>
        <main className="flex-1">
          {renderPage()}
        </main>
        
        {page !== "admin" && (
          <Suspense fallback={null}>
            <Footer 
              simple={page === "form" || page === "loading" || page === "results"} 
              onOpenLegal={setActiveModal} 
            />
          </Suspense>
        )}
        
        {page === "home" && (
          <Suspense fallback={null}>
            <FloatingBadge />
          </Suspense>
        )}
      </ErrorBoundary>

      <Suspense fallback={null}>
        <LegalModal 
          title="Privacy Policy" 
          isOpen={activeModal === 'privacy'} 
          onClose={() => setActiveModal(null)}
        >
          <div className="text-sm sm:text-base space-y-4">
            <p className="font-bold text-slate-900">1. Data Collection</p>
            <p>ListedPEI is committed to protecting your privacy. We do not store the business details you enter in our profile generation form. Everything is processed in transient memory.</p>
            <p className="font-bold text-slate-900 pt-4">2. Cookies</p>
            <p>We use essential functional cookies to manage your session. We do not use tracking or advertising cookies.</p>
            <p className="font-bold text-slate-900 pt-4">3. Third-Party Services</p>
            <p>We use Google Gemini AI and Web3Forms. Please refer to their respective privacy policies for how they handle data.</p>
          </div>
        </LegalModal>

        <LegalModal 
          title="Terms of Service" 
          isOpen={activeModal === 'terms'} 
          onClose={() => setActiveModal(null)}
        >
          <div className="text-sm sm:text-base space-y-4">
            <p className="font-bold text-slate-900">1. Acceptance of Terms</p>
            <p>By using ListedPEI, you agree to these terms. Our service is provided "as is" for informational purposes.</p>
            <p className="font-bold text-slate-900 pt-4">2. AI-Generated Content</p>
            <p>Content is generated by AI. While we optimize for local SEO, we do not guarantee search rankings. Review all text before publishing.</p>
          </div>
        </LegalModal>
      </Suspense>
    </div>
  );
}

export default App;
