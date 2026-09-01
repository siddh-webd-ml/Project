import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Thermometer, CloudRain, Droplets } from 'lucide-react';
import {
  STATION,
  type ConduitData,
  type RiskBreakdown,
  colorForLevel,
} from '@/data/conduit';
import { RiskBadge } from '@/components/RiskBadge';

// Custom div icon for the station
const stationIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:24px;height:24px;">
    <div style="position:absolute;inset:0;border-radius:50%;background:#22d3ee;box-shadow:0 0 16px 4px rgba(34,211,238,0.6);animation:pulseSlow 2s ease-in-out infinite;"></div>
    <div style="position:absolute;inset:6px;border-radius:50%;background:#0a1622;border:2px solid #67e8f9;"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export function MapView({ data, risk }: { data: ConduitData; risk: RiskBreakdown }) {
  const riskColor = colorForLevel(risk.level);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-white md:text-3xl">Monitoring Map</h1>
        <p className="text-sm text-slate-400">
          Live Conduit environmental monitoring station at {STATION.location}.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Map */}
        <div className="glass overflow-hidden rounded-2xl lg:col-span-2 animate-fade-in-up">
          <div className="h-[420px] w-full md:h-[500px]">
            <MapContainer
              center={[STATION.lat, STATION.lng]}
              zoom={14}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              <Circle
                center={[STATION.lat, STATION.lng]}
                radius={800}
                pathOptions={{ color: riskColor, fillColor: riskColor, fillOpacity: 0.08, weight: 1 }}
              />
              <Marker position={[STATION.lat, STATION.lng]} icon={stationIcon}>
                <Popup>
                  <div style={{ minWidth: 200 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                      {STATION.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>
                      {STATION.location}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <PopupRow label="Temperature" value={`${data.temperature}°C`} />
                      <PopupRow label="Rainfall" value={`${data.rainfall} mm`} />
                      <PopupRow label="Humidity" value={`${data.humidity}%`} />
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 6,
                        marginTop: 4,
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                      }}>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>Risk Level</span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: riskColor,
                        }}>
                          {risk.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Station info panel */}
        <div className="space-y-4 animate-fade-in-up delay-100">
          <div className="glass rounded-2xl p-5">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Monitoring Station
            </div>
            <div className="font-display text-lg font-bold text-white">{STATION.name}</div>
            <div className="text-sm text-slate-400">{STATION.location}</div>
            <div className="mt-2 text-xs text-slate-500">
              {STATION.lat.toFixed(4)}°S, {STATION.lng.toFixed(4)}°E
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Current Readings
            </div>
            <div className="space-y-3">
              <StationMetric icon={Thermometer} label="Temperature" value={`${data.temperature}°C`} color="#f97316" />
              <StationMetric icon={CloudRain} label="Rainfall" value={`${data.rainfall} mm`} color="#38bdf8" />
              <StationMetric icon={Droplets} label="Humidity" value={`${data.humidity}%`} color="#22d3ee" />
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Risk Level
            </div>
            <div className="flex items-center justify-between">
              <span className="font-display text-3xl font-bold" style={{ color: riskColor }}>
                {risk.overall}
              </span>
              <RiskBadge level={risk.level} size="lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PopupRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{value}</span>
    </div>
  );
}

function StationMetric({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Thermometer;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <span className="text-sm text-slate-300">{label}</span>
      </div>
      <span className="font-display font-semibold text-white tabular-nums">{value}</span>
    </div>
  );
}
