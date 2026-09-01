import { useState, useMemo } from 'react';
import { Landing } from '@/pages/Landing';
import { DashboardShell, type PageId } from '@/components/DashboardShell';
import { Dashboard } from '@/pages/Dashboard';
import { RiskIntelligence } from '@/pages/RiskIntelligence';
import { MapView } from '@/pages/MapView';
import { Trends } from '@/pages/Trends';
import { Copilot } from '@/pages/Copilot';
import { Simulator } from '@/pages/Simulator';
import { DEMO_DATA, computeRisk } from '@/data/conduit';

type View = 'landing' | 'app';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [page, setPage] = useState<PageId>('dashboard');

  const data = DEMO_DATA;
  const risk = useMemo(() => computeRisk(data), [data]);

  if (view === 'landing') {
    return <Landing onEnter={() => setView('app')} />;
  }

  return (
    <DashboardShell
      current={page}
      onNavigate={setPage}
      onExit={() => setView('landing')}
    >
      {page === 'dashboard' && <Dashboard data={data} risk={risk} onNavigate={setPage} />}
      {page === 'risk' && <RiskIntelligence data={data} risk={risk} />}
      {page === 'map' && <MapView data={data} risk={risk} />}
      {page === 'trends' && <Trends />}
      {page === 'copilot' && <Copilot data={data} risk={risk} />}
      {page === 'simulator' && <Simulator data={data} risk={risk} />}
    </DashboardShell>
  );
}
