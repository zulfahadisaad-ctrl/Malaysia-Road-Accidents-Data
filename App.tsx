
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import MalaysiaMap from './components/MalaysiaMap';
import DataCharts from './components/DataCharts';
import ComparisonView from './components/ComparisonView';
import { DashboardState, VehicleType, RoadType, AccidentHotspot } from './types';
import { INITIAL_HOTSPOTS, INITIAL_STATS } from './constants';
import { fetchAccidentInsights, getStructuredAccidentData } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    hotspots: INITIAL_HOTSPOTS,
    stats: INITIAL_STATS,
    isLoading: false,
    lastUpdated: new Date().toLocaleString(),
    groundingSources: []
  });

  const [selectedVehicles, setSelectedVehicles] = useState<VehicleType[]>(Object.values(VehicleType));
  const [selectedRoads, setSelectedRoads] = useState<RoadType[]>(Object.values(RoadType));
  const [insights, setInsights] = useState<string>("");
  const [activeHotspot, setActiveHotspot] = useState<AccidentHotspot | null>(null);

  // Comparison State
  const [compareYear1, setCompareYear1] = useState<number>(2023);
  const [compareYear2, setCompareYear2] = useState<number>(2024);

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const [structured, textInsights] = await Promise.all([
        getStructuredAccidentData(),
        fetchAccidentInsights()
      ]);
      
      setState({
        hotspots: structured.hotspots,
        stats: structured.stats,
        isLoading: false,
        lastUpdated: new Date().toLocaleString(),
        groundingSources: textInsights.sources
      });
      setInsights(textInsights.text);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const filteredHotspots = useMemo(() => {
    return state.hotspots.filter(h => {
      const hasVehicle = h.vehicleTypes.some(v => selectedVehicles.includes(v));
      const hasRoad = selectedRoads.includes(h.roadType);
      // For general display, we might want to show the "active" year (e.g. 2024)
      // but the comparison view will access all hotspots.
      // Let's filter by road/vehicle, but keep all years for the map to filter internally if needed
      // Actually, let's just show hotspots from the latest year on the map to keep it clean.
      const isLatestYear = h.year === 2024;
      return hasVehicle && hasRoad && isLatestYear;
    });
  }, [state.hotspots, selectedVehicles, selectedRoads]);

  const availableYears = useMemo(() => {
    // Explicitly define the Set type as number to ensure correct inference for the sort method
    const years = new Set<number>(state.stats.annual.map(s => Number(s.name)));
    state.hotspots.forEach(h => years.add(h.year));
    // Explicitly type 'a' and 'b' to avoid arithmetic operation errors on unknown types
    return Array.from(years).sort((a: number, b: number) => b - a);
  }, [state.stats.annual, state.hotspots]);

  const totalFatalities = filteredHotspots.reduce((sum, h) => sum + h.fatalities, 0);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar
        selectedVehicles={selectedVehicles}
        setSelectedVehicles={setSelectedVehicles}
        selectedRoads={selectedRoads}
        setSelectedRoads={setSelectedRoads}
        onRefresh={fetchData}
        isLoading={state.isLoading}
      />

      <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 custom-scrollbar">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Malaysia Road Safety Overview</h2>
            <p className="text-slate-500 text-sm">Last updated: {state.lastUpdated}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-slate-600 uppercase">Live Data Connected</span>
            </div>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Fatalities (2024 Map)" 
            value={totalFatalities.toString()} 
            trend="+5.2%" 
            icon={<svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>} 
          />
          <StatCard 
            title="Active Hotspots (2024)" 
            value={filteredHotspots.length.toString()} 
            icon={<svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} 
          />
          <StatCard 
            title="Avg. Weekly Cases" 
            value={Math.round(state.stats.weekly.reduce((s, d) => s + d.value, 0) / 7).toString()} 
            icon={<svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>} 
          />
          <StatCard 
            title="Motorcycle Ratio" 
            value="~65%" 
            trend="Critically High"
            trendColor="text-red-500"
            icon={<svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Comparative Analysis Section */}
            <ComparisonView
              year1={compareYear1}
              year2={compareYear2}
              onYear1Change={setCompareYear1}
              onYear2Change={setCompareYear2}
              availableYears={availableYears}
              hotspots={state.hotspots}
              annualStats={state.stats.annual}
            />

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">2024 Geographical Hotspots</h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Interactive View</span>
              </div>
              <MalaysiaMap 
                hotspots={filteredHotspots} 
                onHotspotClick={setActiveHotspot}
              />
              
              {activeHotspot && (
                <div className="mt-6 p-4 bg-slate-900 text-white rounded-xl flex justify-between items-center animate-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h4 className="font-bold">{activeHotspot.name}</h4>
                    <p className="text-sm text-slate-400">{activeHotspot.roadType} • {activeHotspot.fatalities} Fatalities in {activeHotspot.year}</p>
                  </div>
                  <button onClick={() => setActiveHotspot(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              )}
            </div>

            <DataCharts stats={state.stats} />
          </div>

          {/* Insights Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                AI Safety Insights
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar text-sm leading-relaxed text-slate-600">
                {insights ? (
                  <div className="prose prose-slate prose-sm max-w-none">
                    {insights.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 gap-4">
                    <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    <p>No insights generated yet. Sync with DOSM to fetch the latest analysis.</p>
                  </div>
                )}
              </div>

              {state.groundingSources.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Sources & References</h4>
                  <ul className="space-y-2">
                    {state.groundingSources.slice(0, 3).map((source, i) => (
                      <li key={i}>
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 transition-colors font-medium truncate"
                        >
                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; trend?: string; trendColor?: string; icon: React.ReactNode }> = ({ 
  title, value, trend, trendColor = 'text-emerald-500', icon 
}) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      {trend && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-50 ${trendColor}`}>{trend}</span>}
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  </div>
);

export default App;
