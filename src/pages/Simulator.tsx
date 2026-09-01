import { useState, useMemo } from 'react';
import { Sliders, Thermometer, Flame, Info, TrendingUp } from 'lucide-react';
import {
  type ConduitData,
  type RiskBreakdown,
  computeHeatRisk,
  computeRisk,
  levelFromScore,
  colorForLevel,
  type RiskLevel,
} from '@/data/conduit';
import { ScoreGauge } from '@/components/ScoreGauge';
import { RiskBadge } from '@/components/RiskBadge';
import { cn } from '@/lib/utils';

export function Simulator({ data, risk }: { data: ConduitData; risk: RiskBreakdown }) {
  const [temp, setTemp] = useState(data.temperature);

  const simulatedData: ConduitData = useMemo(() => {
    const tempDelta = temp - data.temperature;
    return {
      ...data,
      temperature: temp,
      // WBGT rises roughly with temperature
      wbgt: Number((data.wbgt + tempDelta * 0.6).toFixed(1)),
      // Humidity slightly decreases as temp rises
      humidity: Math.max(30, Math.round(data.humidity - tempDelta * 1.5)),
    };
  }, [temp, data]);

  const simRisk: RiskBreakdown = useMemo(() => computeRisk(simulatedData), [simulatedData]);
  const simHeat = computeHeatRisk(simulatedData);

  const beforeLevel = risk.heatLevel;
  const afterLevel = levelFromScore(simHeat) as RiskLevel;
  const levelChanged = beforeLevel !== afterLevel;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-white md:text-3xl">What-If Simulator</h1>
        <p className="text-sm text-slate-400">
          Explore how changing conditions would affect climate risk.
        </p>
      </div>

      {/* Simulator card */}
      <div className="glass rounded-2xl p-6 animate-fade-in-up">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-500/15 border border-aqua-400/20">
            <Sliders className="h-5 w-5 text-aqua-300" />
          </div>
          <div>
            <div className="font-display text-lg font-semibold text-white">
              What if temperature increases?
            </div>
            <div className="text-xs text-slate-500">Adjust the slider to see impact on risk</div>
          </div>
        </div>

        {/* Slider */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-ember-400" />
              <span className="text-sm font-medium text-slate-300">Temperature</span>
            </div>
            <div className="font-display text-2xl font-bold text-white tabular-nums">
              {temp.toFixed(1)}°C
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min={20}
              max={42}
              step={0.5}
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-sky-500/40 via-amber-500/40 to-red-500/60 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-white/20 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-aqua-400 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-aqua-400 [&::-moz-range-thumb]:cursor-pointer"
            />
            <div className="mt-2 flex justify-between text-xs text-slate-600">
              <span>20°C</span>
              <span>Current: {data.temperature}°C</span>
              <span>42°C</span>
            </div>
          </div>
        </div>

        {/* Before / After comparison */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Current */}
          <div className="rounded-xl border border-white/8 bg-white/3 p-5">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Current
            </div>
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
              <Thermometer className="h-4 w-4 text-slate-500" />
              {data.temperature}°C
            </div>
            <div className="flex flex-col items-center">
              <ScoreGauge score={risk.heat} level={risk.heatLevel} size={130} label="Heat Risk" />
              <RiskBadge level={risk.heatLevel} className="mt-3" />
            </div>
          </div>

          {/* Simulated */}
          <div
            className={cn(
              'rounded-xl border p-5 transition-all',
              levelChanged ? 'border-ember-500/30 bg-ember-500/5' : 'border-white/8 bg-white/3',
            )}
          >
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-aqua-300">
              Simulated
            </div>
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
              <Thermometer className="h-4 w-4 text-ember-400" />
              {simulatedData.temperature}°C
            </div>
            <div className="flex flex-col items-center">
              <ScoreGauge score={simHeat} level={afterLevel} size={130} label="Heat Risk" />
              <RiskBadge level={afterLevel} className="mt-3" />
            </div>
          </div>
        </div>

        {/* Simulated impact */}
        <div
          className={cn(
            'mt-6 rounded-xl border p-5 transition-all',
            levelChanged ? 'border-ember-500/30 bg-ember-500/5' : 'border-white/8 bg-white/3',
          )}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-ember-400" />
            <h3 className="font-display font-semibold text-white">Simulated Impact</h3>
          </div>
          <p className="text-lg font-medium text-white">
            {simHeat > risk.heat ? (
              <>
                Risk{' '}
                <span className="text-ember-400">increases</span> from{' '}
                <span style={{ color: colorForLevel(beforeLevel) }}>{beforeLevel}</span> to{' '}
                <span style={{ color: colorForLevel(afterLevel) }}>{afterLevel}</span>.
              </>
            ) : simHeat < risk.heat ? (
              <>
                Risk{' '}
                <span className="text-emerald-400">decreases</span> from{' '}
                <span style={{ color: colorForLevel(beforeLevel) }}>{beforeLevel}</span> to{' '}
                <span style={{ color: colorForLevel(afterLevel) }}>{afterLevel}</span>.
              </>
            ) : (
              <>Risk remains <span style={{ color: colorForLevel(afterLevel) }}>{afterLevel}</span>.</>
            )}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
            <span>Heat risk score: {risk.heat} → </span>
            <span className="font-semibold" style={{ color: colorForLevel(afterLevel) }}>{simHeat}</span>
          </div>

          {/* Additional metrics */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <SimMetric label="WBGT" before={data.wbgt} after={simulatedData.wbgt} unit="°C" />
            <SimMetric label="Humidity" before={data.humidity} after={simulatedData.humidity} unit="%" />
            <SimMetric label="Overall Risk" before={risk.overall} after={simRisk.overall} unit="" />
          </div>
        </div>

        {/* Note */}
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <Info className="h-4 w-4 shrink-0 text-amber-400" />
          <span className="text-xs text-amber-200">
            <span className="font-semibold">Simulation</span> — not a real forecast. Values are derived from the current demo data for demonstration purposes.
          </span>
        </div>
      </div>
    </div>
  );
}

function SimMetric({
  label,
  before,
  after,
  unit,
}: {
  label: string;
  before: number;
  after: number;
  unit: string;
}) {
  const changed = after !== before;
  const up = after > before;
  return (
    <div className="rounded-lg border border-white/8 bg-white/3 p-3">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="font-display font-semibold text-white tabular-nums">
        {before} → <span className={changed ? (up ? 'text-ember-400' : 'text-emerald-400') : ''}>{after}{unit}</span>
      </div>
    </div>
  );
}
