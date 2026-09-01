import { Droplets, ArrowRight, Database, Brain, ShieldAlert, Activity, Sparkles } from 'lucide-react';

const FLOW = [
  { label: 'DATA', icon: Database },
  { label: 'INTELLIGENCE', icon: Brain },
  { label: 'RISK', icon: ShieldAlert },
  { label: 'ACTION', icon: Activity },
  { label: 'IMPACT', icon: Sparkles },
];

export function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-base-900">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-aqua-500/10 blur-[120px]" />
        <div className="absolute left-1/2 bottom-0 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/8 blur-[140px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-6 md:px-12">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-aqua-500 shadow-lg shadow-aqua-500/30">
              <Droplets className="h-5 w-5 text-base-900" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              AquaGuard
            </span>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">Hack The Weather 2026</span>
          </div>
        </header>

        {/* Hero */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center md:px-12">
          <div className="mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-xs font-medium uppercase tracking-wider text-aqua-300">
                Climate Risk Intelligence
              </span>
            </div>
          </div>

          <h1 className="animate-fade-in-up delay-100 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            Understand the Environment.
            <br />
            <span className="text-gradient">Predict the Risk.</span>
            <br />
            Act Earlier.
          </h1>

          <p className="animate-fade-in-up delay-200 mt-8 max-w-2xl text-base text-slate-400 md:text-lg">
            AquaGuard transforms environmental observations into understandable
            climate-risk intelligence and actionable decisions.
          </p>

          <button
            onClick={onEnter}
            className="animate-fade-in-up delay-300 group mt-10 inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-aqua-500 px-7 py-3.5 font-semibold text-base-900 shadow-xl shadow-aqua-500/25 transition-all hover:shadow-aqua-500/40 hover:scale-[1.02] active:scale-95"
          >
            Enter Climate Command Center
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Flow diagram */}
          <div className="animate-fade-in-up delay-500 mt-20 w-full max-w-4xl">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              {FLOW.map((step, i) => (
                <div key={step.label} className="flex flex-col items-center gap-4 sm:flex-row">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-aqua-400/40 hover:bg-aqua-500/10">
                      <step.icon className="h-6 w-6 text-aqua-300" />
                    </div>
                    <span className="font-display text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {step.label}
                    </span>
                  </div>
                  {i < FLOW.length - 1 && (
                    <ArrowRight className="hidden h-4 w-4 text-slate-600 sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="relative z-10 px-6 py-6 text-center md:px-12">
          <p className="text-xs text-slate-600">
            Demo built for Hack The Weather 2026 · Environmental data layer ready for JKUAT Conduit integration
          </p>
        </footer>
      </div>
    </div>
  );
}
