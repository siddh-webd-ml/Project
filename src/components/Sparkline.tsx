import { ResponsiveContainer, Area, AreaChart } from 'recharts';
import { colorForLevel, type RiskLevel } from '@/data/conduit';

export function Sparkline({
  data,
  color,
  height = 40,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  const chartData = data.map((v, i) => ({ i, v }));
  const id = `spark-${color.replace('#', '')}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${id})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RiskSparkline({
  data,
  level,
  height = 40,
}: {
  data: number[];
  level: RiskLevel;
  height?: number;
}) {
  return <Sparkline data={data} color={colorForLevel(level)} height={height} />;
}
