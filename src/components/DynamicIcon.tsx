import {
  Thermometer,
  CloudRain,
  Droplets,
  Wind,
  Gauge,
  Sun,
  ThermometerSun,
  Flame,
  Leaf,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Thermometer,
  CloudRain,
  Droplets,
  Wind,
  Gauge,
  Sun,
  ThermometerSun,
  Flame,
  Leaf,
};

export function DynamicIcon({
  name,
  className,
  size,
  strokeWidth,
}: {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}) {
  const Icon = ICONS[name] ?? Thermometer;
  return <Icon className={className} size={size} strokeWidth={strokeWidth} />;
}
