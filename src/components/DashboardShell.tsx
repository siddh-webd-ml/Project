import { useState, type ReactNode } from 'react';
import {
  Droplets,
  LayoutDashboard,
  ShieldAlert,
  Map,
  TrendingUp,
  MessageSquare,
  Sliders,
  AlertTriangle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type PageId =
  | 'dashboard'
  | 'risk'
  | 'map'
  | 'trends'
  | 'copilot'
  | 'simulator';

interface NavItem {
  id: PageId;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
  { id: 'risk', label: 'Risk Intelligence', icon: ShieldAlert },
  { id: 'map', label: 'Monitoring Map', icon: Map },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
  { id: 'copilot', label: 'Climate Copilot', icon: MessageSquare },
  { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
];

export function DashboardShell({
  current,
  onNavigate,
  onExit,
  children,
}: {
  current: PageId;
  onNavigate: (p: PageId) => void;
  onExit: () => void;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <div className="min-h-screen bg-base-900 text-slate-200">
      {/* Demo banner */}
      {!bannerDismissed && (
        <div className="relative z-30 flex items-center justify-center gap-3 bg-amber-500/10 px-4 py-2 text-center border-b border-amber-500/20">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
          <span className="text-xs font-medium text-amber-200">
            <span className="font-bold uppercase tracking-wider">Demo Mode</span>
            <span className="mx-2 text-amber-500/50">—</span>
            Using realistic simulated data. Connect Conduit Data to go live.
          </span>
          <button
            onClick={() => setBannerDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex">
        {/* Sidebar — desktop */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/8 bg-base-800/50 backdrop-blur-xl lg:flex">
          <SidebarContent
            current={current}
            onNavigate={onNavigate}
            onExit={onExit}
          />
        </aside>

        {/* Sidebar — mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-60 border-r border-white/8 bg-base-800 animate-slide-in">
              <SidebarContent
                current={current}
                onNavigate={(p) => {
                  onNavigate(p);
                  setMobileOpen(false);
                }}
                onExit={onExit}
              />
            </aside>
          </div>
        )}

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top bar */}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/8 bg-base-900/80 px-4 py-3 backdrop-blur-xl lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-white/10 bg-white/5 p-2"
            >
              <LayoutDashboard className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-aqua-400" />
              <span className="font-display font-bold text-white">AquaGuard</span>
            </div>
            <div className="w-9" />
          </header>

          <main className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  current,
  onNavigate,
  onExit,
}: {
  current: PageId;
  onNavigate: (p: PageId) => void;
  onExit: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-aqua-500 shadow-lg shadow-aqua-500/30">
          <Droplets className="h-5 w-5 text-base-900" strokeWidth={2.5} />
        </div>
        <div>
          <div className="font-display text-base font-bold text-white">AquaGuard</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Climate Intelligence</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'bg-gradient-to-r from-sky-500/15 to-aqua-500/10 text-white border border-aqua-400/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent',
              )}
            >
              <item.icon
                className={cn(
                  'h-[18px] w-[18px] transition-colors',
                  active ? 'text-aqua-300' : 'text-slate-500 group-hover:text-slate-300',
                )}
              />
              {item.label}
              {active && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-aqua-400 shadow-[0_0_6px] shadow-aqua-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Exit */}
      <div className="px-3 py-4">
        <button
          onClick={onExit}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all hover:bg-white/5 hover:text-slate-300"
        >
          <Droplets className="h-[18px] w-[18px]" />
          Back to Landing
        </button>
      </div>
    </div>
  );
}
