
import React from 'react';
import { VehicleType, RoadType } from '../types';

interface SidebarProps {
  selectedVehicles: VehicleType[];
  setSelectedVehicles: (v: VehicleType[]) => void;
  selectedRoads: RoadType[];
  setSelectedRoads: (r: RoadType[]) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedVehicles,
  setSelectedVehicles,
  selectedRoads,
  setSelectedRoads,
  onRefresh,
  isLoading
}) => {
  const toggleVehicle = (type: VehicleType) => {
    if (selectedVehicles.includes(type)) {
      setSelectedVehicles(selectedVehicles.filter(v => v !== type));
    } else {
      setSelectedVehicles([...selectedVehicles, type]);
    }
  };

  const toggleRoad = (type: RoadType) => {
    if (selectedRoads.includes(type)) {
      setSelectedRoads(selectedRoads.filter(r => r !== type));
    } else {
      setSelectedRoads([...selectedRoads, type]);
    }
  };

  return (
    <div className="w-full lg:w-72 bg-white border-r border-slate-200 h-full overflow-y-auto p-6 flex flex-col gap-8 shrink-0">
      <div>
        <h1 className="text-xl font-bold text-slate-900 mb-1">SafetyMY</h1>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Accident Analysis Tool</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            Vehicle Types
          </h3>
          <div className="space-y-2">
            {Object.values(VehicleType).map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedVehicles.includes(type)}
                  onChange={() => toggleVehicle(type)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Road Categories
          </h3>
          <div className="space-y-2">
            {Object.values(RoadType).map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedRoads.includes(type)}
                  onChange={() => toggleRoad(type)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2
            ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sync with DOSM
            </>
          )}
        </button>
        <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
          Data powered by Gemini AI search grounding. Sources include DOSM, Ministry of Transport, and local news agencies.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
