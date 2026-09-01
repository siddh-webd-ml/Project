import { ArrowUpRight, ArrowDownRight, Flame, CloudRain, Leaf, ArrowRight } from 'lucide-react';
import { ScoreGauge } from '@/components/ScoreGauge';
import { RiskBadge, ScoreNumber } from '@/components/RiskBadge';
import { Sparkline } from '@/components/Sparkline';
import { DynamicIcon } from '@/components/DynamicIcon';
import {
  type ConduitData,
  type RiskBreakdown,
  getMetrics,
  colorForLevel,
} from '@/data/conduit';
import type { PageId } from '@/components/DashboardShell';

export function Dashboard({
  data,
  risk,
  onNavigate,
}: {
  data: ConduitData;
  risk: RiskBreakdown;
  onNavigate: (p: PageId) => void;
}) {
  const metrics = getMetrics(data);

  const subRisks = [
    {
      icon: CloudRain,
      label: 'Rainfall Risk',
      score: risk.rainfall,
      level: risk.rainfallLevel,
      color: colorForLevel(risk.rainfallLevel),
    },
    {
      icon: Flame,
      label: 'Heat Risk',
      score: risk.heat,
      level: risk.heatLevel,
      color: colorForLevel(risk.heatLevel),
    },
    {
      icon: Leaf,
      label: 'Environmental Stress',
      score: risk.environmental,
      level: risk.environmentalLevel,
      color: colorForLevel(risk.environmentalLevel),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-1 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
          Climate Command Center
        </h1>
        <p className="text-sm text-slate-400">
          Real-time environmental risk overview · {new Date(data.timestamp).toLocaleString('en', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Top section: overall risk + sub-risks */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Overall risk gauge */}
        <div className="glass rounded-2xl p-6 animate-fade-in-up lg:col-span-1">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Overall Climate Risk
            </span>
            <RiskBadge level={risk.level} />
          </div>
          <div className="flex flex-col items-center py-4">
            <ScoreGauge score={risk.overall} level={risk.level} size={180} />
            <p className="mt-3 text-center text-sm text-slate-400">
              Composite of heat, rainfall and environmental stress signals.
            </p>
          </div>
        </div>

        {/* Sub-risk cards */}
        <div className="grid gap-4 sm:grid-cols-1 lg:col-span-2 lg:grid-cols-3">
          {subRisks.map((r, i) => (
            <div
              key={r.label}
              className="glass group relative overflow-hidden rounded-2xl p-5 animate-fade-in-up transition-all hover:border-white/20"
              style={{ animationDelay: `${i * 0.1 + 0.1}s` }}
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
                style={{ background: r.color }}
              />
              <div className="mb-3 flex items-center justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${r.color}15`, border: `1px solid ${r.color}30` }}
                >
                  <r.icon className="h-5 w-5" style={{ color: r.color }} />
                </div>
                <RiskBadge level={r.level} size="sm" />
              </div>
              <div className="mb-1 text-xs font-medium text-slate-400">{r.label}</div>
              <ScoreNumber score={r.score} level={r.level} />
              <div className="mt-3">
                <Sparkline data={Array.from({ length: 20 }, (_, j) => r.score + Math.sin(j * 0.5 + i) * 6)} color={r.color} height={32} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental data section */}
      <div className="animate-fade-in-up delay-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">Environmental Data</h2>
          <span className="text-xs text-slate-500">Conduit measurements</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => {
            const positive = m.delta > 0;
            const DeltaIcon = positive ? ArrowUpRight : ArrowDownRight;
            return (
              <div
                key={m.label}
                className="glass rounded-2xl p-5 animate-fade-in-up transition-all hover:border-white/20 hover:bg-white/5"
                style={{ animationDelay: `${i * 0.05 + 0.3}s` }}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                    <DynamicIcon name={m.icon} className="h-4 w-4 text-aqua-300" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">{m.label}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-2xl font-bold text-white tabular-nums">
                    {m.value}
                  </span>
                  <span className="text-sm text-slate-500">{m.unit}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs">
                  <span
                    className={`inline-flex items-center gap-0.5 font-medium ${
                      positive ? 'text-emerald-400' : 'text-sky-400'
                    }`}
                  >
                    <DeltaIcon className="h-3 w-3" />
                    {Math.abs(m.delta)}{m.unit === '°C' || m.unit === '%' || m.unit === 'UV index' ? m.unit : ''}
                  </span>
                  <span className="text-slate-600">{m.deltaLabel}</span>
                </div>
                <div className="mt-3 -mx-1">
                  <Sparkline data={m.history} color="#38bdf8" height={36} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick link to risk intelligence */}
      <button
        onClick={() => onNavigate('risk')}
        className="group flex w-full items-center justify-between glass rounded-2xl p-5 animate-fade-in-up delay-300 transition-all hover:border-aqua-400/30"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ember-500/20 to-risk-critical/20 border border-ember-500/30">
            <Flame className="h-6 w-6 text-ember-400" />
          </div>
          <div className="text-left">
            <div className="font-display font-semibold text-white">Why is the risk high?</div>
            <div className="text-sm text-slate-400">Explore contributing factors and recommended actions</div>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-aqua-300" />
      </button>
    </div>
  );
}
