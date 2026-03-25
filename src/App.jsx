import React, { useState, useEffect } from "react";
import StepForm from "./components/StepForm";
import Loading from "./components/LoadingScreen";
import Results from "./components/Results";
import AdminLeads from "./components/AdminLeads";
import { generateProfile } from "./utils/generateProfile";
import { exportPDF } from "./utils/exportPDF";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
import LegalModal from "./components/LegalModal";

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="card max-w-md p-8 shadow-xl border-t-4 border-red-500">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h2>
            <p className="text-slate-500 mb-6 font-medium">The application encountered a rendering error. This usually happens if the AI returns incomplete data.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full bg-slate-800 hover:bg-slate-900"
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
  const [page, setPage] = useState("home"); // home, form, loading, results, admin
  const [formData, setFormData] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  // Simple state-based router for /admin path
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
      setPage("form"); // Go back to form on error
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

  const startForm = () => {
    setPage("form");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (page === "admin") {
      return <AdminLeads onBack={handleReset} />;
    }

    switch (page) {
      case "home":
        return <LandingPage onGetStarted={startForm} />;
      case "form":
        return (
          <div className="animate-fade-in">
            <div className="fixed top-8 left-8 z-[60]">
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-all group"
              >
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span className="hidden md:block">Exit to Home</span>
              </button>
            </div>
            
            {error && (
              <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-6 pointer-events-none">
                <div className="bg-red-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce shadow-red-500/20 pointer-events-auto">
                  <span className="text-xl">⚠️</span>
                  <p className="font-bold text-sm">{error}</p>
                </div>
              </div>
            )}
            
            <StepForm onSubmit={handleFormSubmit} />
          </div>
        );
      case "loading":
        return <Loading businessName={formData?.businessName} />;
      case "results":
        return (
          <Results
            result={result}
            formData={formData}
            onReset={handleReset}
            onExportPDF={(res, form) => exportPDF(res, form)}
          />
        );
      default:
        return <LandingPage onGetStarted={startForm} />;
    }
  };

  return (
    <div className="App font-outfit min-h-screen flex flex-col">
      <ErrorBoundary>
        <main className="flex-1">
          {renderPage()}
        </main>
        
        {page !== "admin" && (
          <Footer 
            simple={page === "form" || page === "loading" || page === "results"} 
            onOpenLegal={setActiveModal} 
          />
        )}
      </ErrorBoundary>

      <LegalModal 
        title="Privacy Policy" 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)}
      >
        <p className="font-bold text-slate-900">1. Data Collection</p>
        <p>ListedPEI is committed to protecting your privacy. We do not store the business details you enter in our profile generation form. Everything is processed in transient memory.</p>
        <p className="font-bold text-slate-900 pt-4">2. Cookies</p>
        <p>We use essential functional cookies to manage your session. We do not use tracking or advertising cookies.</p>
        <p className="font-bold text-slate-900 pt-4">3. Third-Party Services</p>
        <p>We use Google Gemini AI and Web3Forms. Please refer to their respective privacy policies for how they handle data.</p>
      </LegalModal>

      <LegalModal 
        title="Terms of Service" 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal(null)}
      >
        <p className="font-bold text-slate-900">1. Acceptance of Terms</p>
        <p>By using ListedPEI, you agree to these terms. Our service is provided "as is" for informational purposes.</p>
        <p className="font-bold text-slate-900 pt-4">2. AI-Generated Content</p>
        <p>Content is generated by AI. While we optimize for local SEO, we do not guarantee search rankings. Review all text before publishing.</p>
      </LegalModal>
    </div>
  );
}

export default App;
