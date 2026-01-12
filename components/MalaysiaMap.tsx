
import React, { useMemo } from 'react';
import { AccidentHotspot } from '../types';

interface MalaysiaMapProps {
  hotspots: AccidentHotspot[];
  onHotspotClick: (hotspot: AccidentHotspot) => void;
}

const MalaysiaMap: React.FC<MalaysiaMapProps> = ({ hotspots, onHotspotClick }) => {
  /**
   * Projection Logic:
   * Longitude: ~99.5°E to ~119.5°E (Range: 20°)
   * Latitude: ~0.8°N to ~7.5°N (Range: 6.7°)
   * We map these to a 100x100 relative coordinate system.
   */
  const projectX = (lng: number) => ((lng - 99) / (120 - 99)) * 100;
  const projectY = (lat: number) => (1 - (lat - 1) / (8 - 1)) * 100;

  const filteredHotspots = useMemo(() => {
    return hotspots.map(h => ({
      ...h,
      px: projectX(h.longitude),
      py: projectY(h.latitude)
    }));
  }, [hotspots]);

  return (
    <div className="relative w-full aspect-[21/8] bg-[#f0f4f8] border border-slate-200 rounded-2xl overflow-hidden shadow-inner cursor-default">
      {/* Geographical SVG Map Background */}
      <svg
        viewBox="0 0 100 35"
        className="absolute inset-0 w-full h-full p-4 opacity-40 select-none pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <g fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.2">
          {/* Peninsular Malaysia simplified outline */}
          <path d="M5,22 L8,24 L12,23 L15,22 L18,18 L20,14 L18,10 L15,8 L12,7 L8,9 L6,12 L5,16 Z" />
          <path d="M19,17 L22,23 L25,24 L27,22 L26,18 L24,14 L21,12 Z" />
          
          {/* East Malaysia (Sarawak & Sabah) simplified outline */}
          <path d="M55,28 L60,26 L65,25 L70,23 L75,22 L80,21 L85,20 L82,16 L78,14 L70,15 L62,18 L55,22 Z" />
          <path d="M85,20 L90,18 L94,15 L96,12 L98,8 L95,6 L90,5 L85,8 L82,12 Z" />
        </g>
        
        {/* Labeling */}
        <text x="12" y="32" fontSize="2" fill="#64748b" fontWeight="600" textAnchor="middle">PENINSULAR MALAYSIA</text>
        <text x="75" y="32" fontSize="2" fill="#64748b" fontWeight="600" textAnchor="middle">EAST MALAYSIA</text>
      </svg>

      <div className="absolute inset-0 p-4">
        {filteredHotspots.map((spot) => (
          <div
            key={spot.id}
            className="absolute group z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${spot.px}%`, top: `${spot.py}%` }}
          >
            <button
              onClick={() => onHotspotClick(spot)}
              className="relative flex items-center justify-center p-2 focus:outline-none"
              aria-label={`Hotspot: ${spot.name}`}
            >
              {/* Ping Animation */}
              <span className={`animate-ping absolute inline-flex h-6 w-6 rounded-full ${spot.fatalities > 30 ? 'bg-red-400' : 'bg-orange-400'} opacity-75`}></span>
              
              {/* Hotspot Dot */}
              <div className={`relative inline-flex rounded-full h-4 w-4 shadow-lg border-2 border-white ${spot.fatalities > 30 ? 'bg-red-600' : 'bg-orange-500'} group-hover:scale-150 transition-all duration-200 cursor-pointer z-10`}></div>
              
              {/* Enhanced Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[220px] px-4 py-3 bg-slate-900 text-white rounded-xl text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 pointer-events-none shadow-2xl z-50 border border-slate-700/50 backdrop-blur-md">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-bold leading-tight">{spot.name}</p>
                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] font-mono">{spot.year}</span>
                  </div>
                  <div className="h-px bg-white/10 w-full"></div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span className="text-slate-400">Fatalities:</span>
                    <span className={`font-bold text-right ${spot.fatalities > 30 ? 'text-red-400' : 'text-orange-400'}`}>
                      {spot.fatalities}
                    </span>
                    <span className="text-slate-400">Road:</span>
                    <span className="text-right truncate">{spot.roadType}</span>
                  </div>
                  <p className="text-[10px] text-blue-400 font-medium text-center pt-1">Click to analyze details</p>
                </div>
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Grid Overlay for context */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-4 pointer-events-none opacity-[0.03]">
        {Array.from({ length: 44 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-slate-900"></div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 text-[10px] font-bold space-y-2 shadow-xl ring-1 ring-black/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600 shadow-sm shadow-red-200"></div>
          <span className="text-slate-700">Critical Hotspot (>30)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-200"></div>
          <span className="text-slate-700">High Risk Hotspot</span>
        </div>
      </div>
    </div>
  );
};

export default MalaysiaMap;
