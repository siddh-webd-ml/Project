import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { Thermometer, CloudRain, Droplets, ShieldAlert } from 'lucide-react';
import { generateTrends, colorForLevel, levelFromScore } from '@/data/conduit';
import { cn } from '@/lib/utils';

type Range = '24H' | '7D' | '30D';

const RANGES: Range[] = ['24H', '7D', '30D'];

const RANGE_HOURS: Record<Range, number> = {
  '24H': 24,
  '7D': 84, // 7 days at 2-hour intervals
  '30D': 90, // 30 days at 8-hour intervals
};

export function Trends() {
  const [range, setRange] = useState<Range>('24H');

  const data = useMemo(() => {
    const hours = RANGE_HOURS[range];
    const raw = generateTrends(hours);
    // Downsample for display if too many points
    const step = range === '24H' ? 1 : range === '7D' ? 1 : 1;
    return raw.filter((_, i) => i % step === 0);
  }, [range]);

  const charts = [
    {
      title: 'Temperature',
      icon: Thermometer,
      dataKey: 'temperature',
      color: '#f97316',
      unit: '°C',
    },
    {
      title: 'Rainfall',
      icon: CloudRain,
      dataKey: 'rainfall',
      color: '#38bdf8',
      unit: 'mm',
    },
    {
      title: 'Humidity',
      icon: Droplets,
      dataKey: 'humidity',
      color: '#22d3ee',
      unit: '%',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-white md:text-3xl">Trends</h1>
        <p className="text-sm text-slate-400">
          Environmental patterns and risk trajectory over time.
        </p>
      </div>

      {/* Time filter */}
      <div className="flex gap-1.5 animate-fade-in-up">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-semibold transition-all',
              range === r
                ? 'bg-aqua-500/20 text-aqua-200 border border-aqua-400/30'
                : 'text-slate-400 border border-white/8 hover:bg-white/5 hover:text-slate-200',
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Metric line charts */}
      <div className="grid gap-5 lg:grid-cols-2">
        {charts.map((c, i) => (
          <div
            key={c.title}
            className="glass rounded-2xl p-5 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="mb-4 flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}
              >
                <c.icon className="h-4 w-4" style={{ color: c.color }} />
              </div>
              <div>
                <div className="font-display font-semibold text-white">{c.title}</div>
                <div className="text-xs text-slate-500">{range} trend</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id={`grad-${c.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={c.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="t"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={range === '24H' ? 3 : 'preserveStartEnd'}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(16,28,42,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: c.color }}
                  formatter={(v) => [`${v} ${c.unit}`, c.title]}
                />
                <Area
                  type="monotone"
                  dataKey={c.dataKey}
                  stroke={c.color}
                  strokeWidth={2}
                  fill={`url(#grad-${c.dataKey})`}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Risk trend — full width */}
      <div className="glass rounded-2xl p-5 animate-fade-in-up delay-200">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember-500/15 border border-ember-500/30">
            <ShieldAlert className="h-4 w-4 text-ember-400" />
          </div>
          <div>
            <div className="font-display font-semibold text-white">Risk Score</div>
            <div className="text-xs text-slate-500">Composite climate risk over {range}</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="t"
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={range === '24H' ? 3 : 'preserveStartEnd'}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(16,28,42,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#94a3b8' }}
              itemStyle={{ color: '#f97316' }}
              formatter={(v) => {
                const n = Number(v);
                const level = levelFromScore(n);
                return [`${Math.round(n)} — ${level}`, 'Risk'];
              }}
            />
            <Line
              type="monotone"
              dataKey="risk"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#f97316' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
