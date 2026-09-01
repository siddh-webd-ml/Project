import { cn } from '@/lib/utils';
import { colorForLevel, type RiskLevel } from '@/data/conduit';

export function RiskBadge({
  level,
  size = 'md',
  className,
}: {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const color = colorForLevel(level);
  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wider',
        sizes[size],
        className,
      )}
      style={{
        color,
        backgroundColor: `${color}1a`,
        border: `1px solid ${color}40`,
      }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
      />
      {level}
    </span>
  );
}

export function ScoreNumber({
  score,
  level,
  size = 'md',
}: {
  score: number;
  level: RiskLevel;
  size?: 'md' | 'lg' | 'xl';
}) {
  const color = colorForLevel(level);
  const sizes = {
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  };
  return (
    <div className="flex items-baseline gap-1">
      <span className={cn('font-display font-bold tabular-nums', sizes[size])} style={{ color }}>
        {score}
      </span>
      <span className="text-slate-500 font-display font-medium" style={{ fontSize: size === 'xl' ? '1.5rem' : '1rem' }}>
        /100
      </span>
    </div>
  );
}
