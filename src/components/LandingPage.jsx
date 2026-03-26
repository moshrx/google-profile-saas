import React, { useState } from 'react';
import Logo from './Logo';
import LegalModal from './LegalModal';

export default function LandingPage({ onGetStarted }) {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Optimized Descriptions",
      description: "AI-generated long and short descriptions tuned for local SEO in Prince Edward Island.",
      gradient: "from-blue-500/10 to-transparent"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      title: "Google Business Posts",
      description: "5 pre-written posts to keep your profile active and engaging for customers.",
      gradient: "from-purple-500/10 to-transparent"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: "Review Templates",
      description: "Smart replies for various types of reviews to build trust with your audience.",
      gradient: "from-amber-500/10 to-transparent"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "PEI Specific Setup",
      description: "Localized keywords and regional highlights that matter to island customers.",
      gradient: "from-emerald-500/10 to-transparent"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      title: "Export to PDF",
      description: "Download your complete kit in a professionally formatted PDF document.",
      gradient: "from-rose-500/10 to-transparent"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast",
      description: "Generate your entire profile setup kit in less than 30 seconds. No waiting.",
      gradient: "from-indigo-500/10 to-transparent"
    }
  ];

  const steps = [
    {
      title: "Tell your story",
      description: "Enter your business basics—name, category, and what makes you special.",
      step: "01"
    },
    {
      title: "Location Details",
      description: "Add your address and contact info so customers can find you easily.",
      step: "02"
    },
    {
      title: "AI Generation",
      description: "Our Gemini-powered engine crafts your complete SEO kit in seconds.",
      step: "03"
    },
    {
      title: "Download & Use",
      description: "Copy to your clipboard or download a PDF to update your GMB profile.",
      step: "04"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFF] selection:bg-primary-500/10 selection:text-primary-700 overflow-hidden">
      
      {/* ── Background Elements ─────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/20 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-accent-200/20 blur-[100px] rounded-full animate-float"></div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <nav className="max-w-7xl mx-auto">
          <div className="glass rounded-[1.5rem] px-6 py-3 flex items-center justify-between">
            <Logo />
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="nav-link">How it works</a>
              <a href="#features" className="nav-link">Features</a>
              <a href="#faq" className="nav-link">FAQ</a>
            </div>

            <button
              onClick={onGetStarted}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/10"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/40 mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
            <span className="text-sm font-bold text-slate-600 tracking-wide uppercase">Built for Prince Edward Island</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.1] mb-8 animate-fade-in-up">
            Master your <span className="text-gradient">Google Presence</span> in seconds.
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            The all-in-one AI tool for PEI small businesses to generate high-converting 
            Google Profile kits. Get found, get chosen, and get growing.
          </p>

          <div className="flex flex-col items-center justify-center animate-fade-in-up gap-3" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => onGetStarted(false)}
                className="btn-primary w-full sm:w-auto text-lg group"
              >
                Generate Your Profile Kit
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                  </div>
                ))}
                <div className="flex items-center ml-4">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-bold text-slate-600">500+ Local Businesses</span>
                </div>
              </div>
            </div>
            
            {/* Secondary CTA for Website Mockup */}
            <button 
              onClick={() => onGetStarted(true)} 
              className="text-slate-500 font-medium hover:text-primary-600 transition-colors text-sm flex items-center gap-1 group mt-2"
            >
              Don't have a website? Get a free mockup 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Value Prop Cards instead of video */}
        <div className="mt-20 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {[
            { title: "AI-Powered", desc: "Latest Gemini 2.5 Flash model" },
            { title: "Local First", desc: "Expertly tuned for PEI cities" },
            { title: "100% Free", desc: "Zero cost for island businesses" }
          ].map((item, idx) => (
            <div key={idx} className="glass p-8 rounded-3xl text-center">
              <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 underline decoration-primary-300 underline-offset-8">
                Everything you need to <br /> dominate local search
              </h2>
              <p className="text-lg text-slate-500">
                Stop guessing and start ranking. Our AI-driven engine provides a complete 
                arsenal of tools specifically designed for the Prince Edward Island market.
              </p>
            </div>
            <div className="pb-2">
              <button 
                onClick={onGetStarted}
                className="text-primary-600 font-bold flex items-center gap-2 group"
              >
                View all features 
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className={`card group hover:border-primary-200 overflow-hidden relative`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works Section ─────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-900 text-white relative rounded-[4rem] mx-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">Simple, Fast, & <span className="text-primary-400">Effective</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We've distilled hours of SEO work into a 3-minute process.
              No complex settings, just results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            {/* Desktop connecting line */}
            <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-white/10"></div>
            
            {steps.map((item, idx) => (
              <div key={idx} className="relative group text-center lg:text-left">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-900 font-display font-black text-2xl mb-8 mx-auto lg:mx-0 relative z-10 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary-500 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <button
              onClick={onGetStarted}
              className="px-10 py-5 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-black text-xl transition-all hover:-translate-y-1 shadow-2xl shadow-primary-500/20 active:scale-95"
            >
              Start Building Now — It's Free
            </button>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ─────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-lg">Everything you need to know about ListedPEI.</p>
          </div>
          <div className="space-y-6">
            {[
              { q: "Is it really free?", a: "Yes, ListedPEI is 100% free for small businesses in Prince Edward Island. No credit card or sign-up required." },
              { q: "How does the AI work?", a: "We use Google's latest Gemini AI models, specifically tuned with local PEI knowledge, to generate high-converting SEO content." },
              { q: "What do I get in my kit?", a: "You get a long description, short description, 5 Google posts, review response templates, category suggestions, and SEO keywords." },
              { q: "Why focus only on PEI?", a: "Local search is all about relevance. By focusing on the Island, we can provide much more accurate and effective SEO results than generic tools." }
            ].map((faq, idx) => (
              <div key={idx} className="glass p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{faq.q}</h3>
                <p className="text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto text-center glass p-16 rounded-[4rem] border-primary-100/50">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">Ready to boost your local ranking?</h2>
          <button
            onClick={onGetStarted}
            className="btn-primary text-xl px-12 py-5"
          >
            Get My Free Kit Now
          </button>
        </div>
      </section>
    </div>
  );
}
