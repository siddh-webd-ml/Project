import { useState } from 'react';
import { CloudRain, Flame, Leaf, Users, Wheat, Building2, Info } from 'lucide-react';
import { ScoreGauge } from '@/components/ScoreGauge';
import { RiskBadge, ScoreNumber } from '@/components/RiskBadge';
import { DynamicIcon } from '@/components/DynamicIcon';
import {
  type ConduitData,
  type RiskBreakdown,
  type RiskIntelligence,
  getHeatIntelligence,
  getRainfallIntelligence,
  getEnvironmentalIntelligence,
} from '@/data/conduit';
import { cn } from '@/lib/utils';

const ACTION_ICONS: Record<string, typeof Users> = {
  'For Communities': Users,
  'For Farmers': Wheat,
  'For Authorities': Building2,
};

const FACTOR_COLORS: Record<string, string> = {
  High: '#ef4444',
  Moderate: '#fbbf24',
  Low: '#34d399',
};

type RiskTab = 'heat' | 'rainfall' | 'environmental';

export function RiskIntelligence({
  data,
  risk,
}: {
  data: ConduitData;
  risk: RiskBreakdown;
}) {
  const [tab, setTab] = useState<RiskTab>('heat');

  const intelligenceMap: Record<RiskTab, RiskIntelligence> = {
    heat: getHeatIntelligence(data, risk),
    rainfall: getRainfallIntelligence(data, risk),
    environmental: getEnvironmentalIntelligence(data, risk),
  };

  const tabs: { id: RiskTab; label: string; icon: typeof Flame; score: number; level: typeof risk.heatLevel }[] = [
    { id: 'heat', label: 'Heat Risk', icon: Flame, score: risk.heat, level: risk.heatLevel },
    { id: 'rainfall', label: 'Rainfall Risk', icon: CloudRain, score: risk.rainfall, level: risk.rainfallLevel },
    { id: 'environmental', label: 'Environmental Stress', icon: Leaf, score: risk.environmental, level: risk.environmentalLevel },
  ];

  const current = intelligenceMap[tab];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-white md:text-3xl">Risk Intelligence</h1>
        <p className="text-sm text-slate-400">
          Current risk level, contributing factors, and recommended actions.
        </p>
      </div>

      {/* Risk tabs */}
      <div className="flex gap-2 animate-fade-in-up">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
              tab === t.id
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-white/8 bg-white/3 text-slate-400 hover:bg-white/5 hover:text-slate-200',
            )}
          >
            <t.icon className="h-4 w-4" style={{ color: tab === t.id ? '#fbbf24' : undefined }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Main risk display */}
      <div key={tab} className="grid gap-5 lg:grid-cols-3 animate-fade-in-up">
        {/* Score card */}
        <div className="glass rounded-2xl p-6 lg:col-span-1">
          <div className="mb-2 flex items-center gap-2.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: `${current.score > 75 ? '#ef4444' : current.score > 55 ? '#f97316' : '#fbbf24'}15` }}
            >
              <DynamicIcon name={current.icon} className="h-5 w-5 text-ember-400" />
            </div>
            <span className="font-display text-lg font-bold text-white">{current.title}</span>
          </div>
          <div className="flex flex-col items-center py-6">
            <ScoreGauge score={current.score} level={current.level} size={170} />
            <RiskBadge level={current.level} size="lg" className="mt-4" />
          </div>
        </div>

        {/* Why? */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-white">Why?</h2>
          <p className="mt-1 text-sm text-slate-400">Contributing factors driving this risk score.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {current.factors.map((f) => (
              <div
                key={f.label}
                className="flex items-center justify-between rounded-xl border border-white/8 bg-white/3 px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-300">{f.label}</span>
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: FACTOR_COLORS[f.level] }}
                >
                  {f.level}
                </span>
              </div>
            ))}
          </div>

          {/* Explanation */}
          <div className="mt-5 rounded-xl border border-aqua-400/20 bg-aqua-500/5 p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 shrink-0 text-aqua-300 mt-0.5" />
              <p className="text-sm leading-relaxed text-slate-200">{current.explanation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Action */}
      <div className="glass rounded-2xl p-6 animate-fade-in-up delay-100">
        <h2 className="font-display text-lg font-semibold text-white">Recommended Action</h2>
        <p className="mt-1 text-sm text-slate-400">Practical guidance tailored to each audience.</p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {current.actions.map((a) => {
            const Icon = ACTION_ICONS[a.group] ?? Users;
            return (
              <div
                key={a.group}
                className="rounded-xl border border-white/8 bg-white/3 p-5 transition-all hover:border-white/15 hover:bg-white/5"
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-aqua-500/10 border border-aqua-400/20">
                    <Icon className="h-4 w-4 text-aqua-300" />
                  </div>
                  <span className="text-sm font-semibold text-white">{a.group}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{a.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
