import { Link } from 'react-router-dom';
import { DEMO_PHONE, DEMO_PHONE_RAW } from '../utils/constants';

export default function PickUpAIPromo() {
  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-slate-900 px-6 py-10 sm:px-10 sm:py-14 shadow-2xl">
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#C34A36]/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-primary-500/15 blur-3xl pointer-events-none"></div>

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-primary-300 mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C34A36] animate-pulse"></span>
                New from ListedPEI
              </div>

              <h2 className="text-[1.75rem] sm:text-4xl font-black text-white leading-tight">
                You ranked on Google.<br />
                Now <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f87060] to-primary-400">answer the calls.</span>
              </h2>

              <p className="mt-4 text-slate-300 text-[0.95rem] sm:text-lg leading-relaxed max-w-xl">
                Getting found is step one. Step two is never missing the customer who actually calls.
                <strong className="text-white"> PickUp AI</strong> is your 24/7 AI phone agent — trained on your business, your hours, and your FAQs.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
                {[
                  'Answers calls instantly, even at 2 AM',
                  'Books tables, takes messages, handles FAQs',
                  'Sounds natural — not robotic',
                  'Free 1-week trial, no credit card needed',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-400"></span>
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/pickupai"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-black text-slate-900 transition hover:bg-primary-50 hover:-translate-y-0.5 shadow-lg text-sm sm:text-base"
                >
                  Get Free 1-Week Trial
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a
                  href={`tel:${DEMO_PHONE_RAW}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-6 py-3 font-bold text-white transition hover:bg-white/8 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.35 1.78.68 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.25a2 2 0 0 1 2.11-.45c.83.33 1.71.56 2.61.68A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Hear it live: {DEMO_PHONE}
                </a>
              </div>
            </div>

            {/* Right: stats card */}
            <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 mb-6">Why businesses switch</p>
              <div className="space-y-5">
                {[
                  { stat: '62%', label: 'of callers hang up if sent to voicemail — they call a competitor instead.' },
                  { stat: '24/7', label: 'coverage from day one. Tourist season doesn\'t wait for you to hire.' },
                  { stat: '< 2 min', label: 'to route your existing number. No new hardware required.' },
                ].map(({ stat, label }) => (
                  <div key={stat} className="flex items-start gap-4">
                    <span className="text-2xl sm:text-3xl font-black text-white shrink-0 w-24">{stat}</span>
                    <p className="text-slate-400 text-sm leading-relaxed pt-1">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-xs font-black text-white">LB</div>
                <div>
                  <p className="text-xs font-black text-white">Lootbins PEI — first live customer</p>
                  <p className="text-xs text-slate-400">Stratford liquidation store, high repeat-question volume</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
