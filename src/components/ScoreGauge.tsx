import { useEffect, useState } from 'react';
import { colorForLevel, type RiskLevel } from '@/data/conduit';

export function ScoreGauge({
  score,
  level,
  size = 160,
  label,
}: {
  score: number;
  level: RiskLevel;
  size?: number;
  label?: string;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const color = colorForLevel(level);
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = animatedScore / 100;

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedScore(score * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`gauge-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gauge-${size})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="font-display font-bold tabular-nums"
          style={{ color, fontSize: size * 0.28 }}
        >
          {Math.round(animatedScore)}
        </span>
        <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">
          {label ?? level}
        </span>
      </div>
    </div>
  );
}
