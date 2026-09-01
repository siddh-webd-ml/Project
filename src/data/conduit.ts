// AquaGuard data layer
// Environmental data + risk computation.
// Initially uses realistic DEMO data. The JKUAT Conduit API can be connected
// here by replacing getConduitData() with a real fetch.

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface MetricReading {
  label: string;
  value: number;
  unit: string;
  delta: number; // change vs previous reading, in unit
  deltaLabel: string;
  icon: string; // lucide icon name
  history: number[]; // recent sparkline points
}

export interface ConduitData {
  temperature: number; // °C
  rainfall: number; // mm today
  humidity: number; // %
  wind: number; // km/h
  pressure: number; // hPa
  solar: number; // W/m²
  uv: number; // UV index
  wbgt: number; // °C (wet bulb globe temperature)
  timestamp: string;
}

export interface RiskBreakdown {
  overall: number;
  level: RiskLevel;
  rainfall: number;
  rainfallLevel: RiskLevel;
  heat: number;
  heatLevel: RiskLevel;
  environmental: number;
  environmentalLevel: RiskLevel;
}

export interface TrendPoint {
  t: string;
  temperature: number;
  rainfall: number;
  humidity: number;
  risk: number;
}

export interface StationInfo {
  name: string;
  lat: number;
  lng: number;
  location: string;
}

// ---------------------------------------------------------------------------
// Station
// ---------------------------------------------------------------------------

export const STATION: StationInfo = {
  name: 'JKUAT Conduit Station',
  lat: -1.0998,
  lng: 37.0123,
  location: 'Juja, Kiambu, Kenya',
};

// ---------------------------------------------------------------------------
// Demo data — realistic for a tropical highland climate (Juja, Kenya, Sep)
// ---------------------------------------------------------------------------

export const DEMO_DATA: ConduitData = {
  temperature: 31.4,
  rainfall: 24,
  humidity: 78,
  wind: 12.5,
  pressure: 1013,
  solar: 820,
  uv: 9.5,
  wbgt: 29.6,
  timestamp: new Date().toISOString(),
};

export const IS_DEMO = true;

// ---------------------------------------------------------------------------
// Risk computation
// ---------------------------------------------------------------------------

export function levelFromScore(score: number): RiskLevel {
  if (score < 35) return 'LOW';
  if (score < 55) return 'MODERATE';
  if (score < 75) return 'HIGH';
  return 'CRITICAL';
}

export function colorForLevel(level: RiskLevel): string {
  switch (level) {
    case 'LOW':
      return '#34d399';
    case 'MODERATE':
      return '#fbbf24';
    case 'HIGH':
      return '#f97316';
    case 'CRITICAL':
      return '#ef4444';
  }
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

/** Heat risk from temperature, humidity, solar, WBGT. */
export function computeHeatRisk(d: ConduitData): number {
  const tempScore = ((d.temperature - 15) / (42 - 15)) * 100; // 15–42°C
  const humScore = d.humidity; // 0–100
  const solarScore = (d.solar / 1000) * 100; // 0–1000 W/m²
  const wbgtScore = ((d.wbgt - 20) / (35 - 20)) * 100; // 20–35°C
  return clamp(tempScore * 0.3 + humScore * 0.2 + solarScore * 0.2 + wbgtScore * 0.3);
}

/** Rainfall risk from rainfall amount + humidity. */
export function computeRainfallRisk(d: ConduitData): number {
  const rainScore = Math.min((d.rainfall / 60) * 100, 100); // 0–60mm → 0–100
  const humScore = d.humidity * 0.4;
  return clamp(rainScore * 0.6 + humScore * 0.4);
}

/** Environmental stress from humidity, pressure deviation, wind, UV. */
export function computeEnvironmentalRisk(d: ConduitData): number {
  const uvScore = Math.min((d.uv / 12) * 100, 100);
  const humScore = d.humidity;
  const windScore = Math.min((d.wind / 40) * 100, 100);
  const pressureDeviation = Math.abs(d.pressure - 1013) / 15; // deviation from standard
  const pressureScore = Math.min(pressureDeviation * 100, 100);
  return clamp(uvScore * 0.3 + humScore * 0.25 + windScore * 0.2 + pressureScore * 0.25);
}

export function computeRisk(d: ConduitData): RiskBreakdown {
  const heat = computeHeatRisk(d);
  const rainfall = computeRainfallRisk(d);
  const environmental = computeEnvironmentalRisk(d);
  const overall = clamp(heat * 0.4 + rainfall * 0.3 + environmental * 0.3);
  return {
    overall,
    level: levelFromScore(overall),
    heat,
    heatLevel: levelFromScore(heat),
    rainfall,
    rainfallLevel: levelFromScore(rainfall),
    environmental,
    environmentalLevel: levelFromScore(environmental),
  };
}

// ---------------------------------------------------------------------------
// Risk explanations & actions
// ---------------------------------------------------------------------------

export interface FactorInfo {
  label: string;
  level: 'High' | 'Moderate' | 'Low';
}

export interface RiskIntelligence {
  title: string;
  icon: string;
  score: number;
  level: RiskLevel;
  factors: FactorInfo[];
  explanation: string;
  actions: { group: string; text: string }[];
}

export function getHeatIntelligence(d: ConduitData, risk: RiskBreakdown): RiskIntelligence {
  const factors: FactorInfo[] = [
    { label: 'Temperature', level: d.temperature > 30 ? 'High' : d.temperature > 25 ? 'Moderate' : 'Low' },
    { label: 'Humidity', level: d.humidity > 70 ? 'High' : d.humidity > 50 ? 'Moderate' : 'Low' },
    { label: 'Solar Exposure', level: d.solar > 700 ? 'High' : d.solar > 400 ? 'Moderate' : 'Low' },
    { label: 'WBGT', level: d.wbgt > 28 ? 'High' : d.wbgt > 25 ? 'Moderate' : 'Low' },
  ];
  const highCount = factors.filter((f) => f.level === 'High').length;
  const explanation =
    highCount >= 3
      ? 'Elevated temperature, humidity and solar exposure are combining to create high heat-stress conditions.'
      : highCount >= 2
        ? 'Several environmental factors are elevated, producing moderate-to-high heat-stress conditions.'
        : 'Heat-stress factors are currently within manageable range.';

  return {
    title: 'Heat Risk',
    icon: 'Flame',
    score: risk.heat,
    level: risk.heatLevel,
    factors,
    explanation,
    actions: [
      { group: 'For Communities', text: 'Avoid prolonged outdoor exposure during peak heat.' },
      { group: 'For Farmers', text: 'Schedule demanding outdoor work during cooler periods.' },
      { group: 'For Authorities', text: 'Consider issuing a local heat advisory.' },
    ],
  };
}

export function getRainfallIntelligence(d: ConduitData, risk: RiskBreakdown): RiskIntelligence {
  const factors: FactorInfo[] = [
    { label: 'Rainfall Volume', level: d.rainfall > 30 ? 'High' : d.rainfall > 15 ? 'Moderate' : 'Low' },
    { label: 'Humidity', level: d.humidity > 70 ? 'High' : d.humidity > 50 ? 'Moderate' : 'Low' },
    { label: 'Atmospheric Pressure', level: d.pressure < 1010 ? 'High' : d.pressure < 1015 ? 'Moderate' : 'Low' },
  ];
  const explanation =
    d.rainfall > 30
      ? 'Heavy rainfall combined with high humidity and low pressure indicates active precipitation and potential for localized flooding.'
      : d.rainfall > 15
        ? 'Moderate rainfall with sustained humidity suggests continued wet conditions.'
        : 'Rainfall is within normal range.';

  return {
    title: 'Rainfall Risk',
    icon: 'CloudRain',
    score: risk.rainfall,
    level: risk.rainfallLevel,
    factors,
    explanation,
    actions: [
      { group: 'For Communities', text: 'Stay alert for localized flooding in low-lying areas.' },
      { group: 'For Farmers', text: 'Delay planting or fertilizer application until conditions stabilize.' },
      { group: 'For Authorities', text: 'Monitor drainage infrastructure and update advisories.' },
    ],
  };
}

export function getEnvironmentalIntelligence(
  d: ConduitData,
  risk: RiskBreakdown,
): RiskIntelligence {
  const factors: FactorInfo[] = [
    { label: 'UV Index', level: d.uv > 8 ? 'High' : d.uv > 5 ? 'Moderate' : 'Low' },
    { label: 'Wind Speed', level: d.wind > 25 ? 'High' : d.wind > 15 ? 'Moderate' : 'Low' },
    { label: 'Humidity', level: d.humidity > 70 ? 'High' : d.humidity > 50 ? 'Moderate' : 'Low' },
    { label: 'Pressure Stability', level: Math.abs(d.pressure - 1013) > 8 ? 'High' : 'Low' },
  ];
  const explanation =
    d.uv > 8 && d.wind > 20
      ? 'High UV and elevated winds are increasing environmental stress on crops, livestock and people.'
      : d.uv > 8
        ? 'Elevated UV exposure is the primary driver of environmental stress.'
        : 'Environmental conditions are moderately stable with some stress factors.';

  return {
    title: 'Environmental Stress',
    icon: 'Leaf',
    score: risk.environmental,
    level: risk.environmentalLevel,
    factors,
    explanation,
    actions: [
      { group: 'For Communities', text: 'Use sun protection and limit midday outdoor activity.' },
      { group: 'For Farmers', text: 'Secure loose equipment and shade vulnerable crops.' },
      { group: 'For Authorities', text: 'Monitor air quality and wind-driven fire risk.' },
    ],
  };
}

export const ALL_INTELLIGENCE = [
  getHeatIntelligence,
  getRainfallIntelligence,
  getEnvironmentalIntelligence,
] as const;

// ---------------------------------------------------------------------------
// Metric cards (environmental data)
// ---------------------------------------------------------------------------

function spark(base: number, vol: number, n: number): number[] {
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v += (Math.sin(i * 0.7) + (Math.random() - 0.5)) * vol;
    out.push(Number(v.toFixed(1)));
  }
  return out;
}

export function getMetrics(d: ConduitData): MetricReading[] {
  return [
    {
      label: 'Temperature',
      value: d.temperature,
      unit: '°C',
      delta: 2.1,
      deltaLabel: 'vs. yesterday',
      icon: 'Thermometer',
      history: spark(d.temperature, 0.8, 24),
    },
    {
      label: 'Rainfall',
      value: d.rainfall,
      unit: 'mm',
      delta: 24,
      deltaLabel: 'today',
      icon: 'CloudRain',
      history: spark(d.rainfall, 2.5, 24),
    },
    {
      label: 'Humidity',
      value: d.humidity,
      unit: '%',
      delta: 8,
      deltaLabel: 'vs. yesterday',
      icon: 'Droplets',
      history: spark(d.humidity, 2, 24),
    },
    {
      label: 'Wind',
      value: d.wind,
      unit: 'km/h',
      delta: -1.5,
      deltaLabel: 'vs. yesterday',
      icon: 'Wind',
      history: spark(d.wind, 1.5, 24),
    },
    {
      label: 'Atmospheric Pressure',
      value: d.pressure,
      unit: 'hPa',
      delta: -2,
      deltaLabel: 'vs. yesterday',
      icon: 'Gauge',
      history: spark(d.pressure, 0.8, 24),
    },
    {
      label: 'Solar / UV',
      value: d.uv,
      unit: 'UV index',
      delta: 1.5,
      deltaLabel: 'vs. yesterday',
      icon: 'Sun',
      history: spark(d.uv, 0.6, 24),
    },
    {
      label: 'WBGT',
      value: d.wbgt,
      unit: '°C',
      delta: 1.8,
      deltaLabel: 'vs. yesterday',
      icon: 'ThermometerSun',
      history: spark(d.wbgt, 0.5, 24),
    },
  ];
}

// ---------------------------------------------------------------------------
// Trend history generation
// ---------------------------------------------------------------------------

export function generateTrends(hours: number): TrendPoint[] {
  const points: TrendPoint[] = [];
  const now = new Date();
  let temp = 28;
  let rain = 5;
  let hum = 65;
  for (let i = hours - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * (hours <= 24 ? 60 * 60 * 1000 : 60 * 60 * 1000 * (hours / 24)));
    const hourOfDay = time.getHours();
    // Diurnal cycle
    const diurnal = Math.sin(((hourOfDay - 6) / 24) * Math.PI * 2) * 4;
    temp = 27 + diurnal + (Math.random() - 0.5) * 1.5;
    rain = Math.max(0, rain + (Math.random() - 0.45) * (hours <= 24 ? 3 : 8));
    if (hourOfDay > 14 && hourOfDay < 19 && Math.random() > 0.7) rain += Math.random() * 15;
    hum = 60 + Math.sin(((hourOfDay - 6) / 24) * Math.PI * 2 + Math.PI) * 12 + (Math.random() - 0.5) * 4;
    hum = Math.max(35, Math.min(95, hum));
    const data: ConduitData = {
      ...DEMO_DATA,
      temperature: Number(temp.toFixed(1)),
      rainfall: Number(rain.toFixed(1)),
      humidity: Math.round(hum),
      solar: Math.max(0, 600 + diurnal * 120 + (Math.random() - 0.5) * 100),
      uv: Math.max(0, 7 + diurnal / 2 + (Math.random() - 0.5)),
      wbgt: Number((temp - 2 + hum / 100 * 3).toFixed(1)),
    };
    const risk = computeRisk(data);
    points.push({
      t: hours <= 24 ? `${hourOfDay}:00` : time.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      temperature: data.temperature,
      rainfall: data.rainfall,
      humidity: data.humidity,
      risk: risk.overall,
    });
  }
  return points;
}

// ---------------------------------------------------------------------------
// Data access entry point — replace with real Conduit fetch later
// ---------------------------------------------------------------------------

export async function getConduitData(): Promise<ConduitData> {
  // TODO: Connect JKUAT Conduit API here.
  // return fetch('/api/conduit/latest').then(r => r.json());
  return DEMO_DATA;
}
