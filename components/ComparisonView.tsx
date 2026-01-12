
import React from 'react';
import { AccidentHotspot, StatisticsData } from '../types';

interface ComparisonViewProps {
  year1: number;
  year2: number;
  onYear1Change: (year: number) => void;
  onYear2Change: (year: number) => void;
  availableYears: number[];
  hotspots: AccidentHotspot[];
  annualStats: { name: string; value: number }[];
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  year1,
  year2,
  onYear1Change,
  onYear2Change,
  availableYears,
  hotspots,
  annualStats
}) => {
  const getYearData = (year: number) => {
    const fatalities = annualStats.find(s => s.name === year.toString())?.value || 0;
    const hotspotCount = hotspots.filter(h => h.year === year).length;
    return { fatalities, hotspotCount };
  };

  const data1 = getYearData(year1);
  const data2 = getYearData(year2);

  const calcChange = (v1: number, v2: number) => {
    if (v1 === 0) return 0;
    return ((v2 - v1) / v1) * 100;
  };

  const fatalitiesChange = calcChange(data1.fatalities, data2.fatalities);
  const hotspotChange = calcChange(data1.hotspotCount, data2.hotspotCount);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h3 className="text-lg font-bold text-slate-800">Annual Comparative Analysis</h3>
        <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl border border-slate-100">
          <select
            value={year1}
            onChange={(e) => onYear1Change(Number(e.target.value))}
            className="bg-white border-none text-sm font-semibold text-slate-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
          >
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="text-slate-400 font-bold text-xs uppercase">vs</span>
          <select
            value={year2}
            onChange={(e) => onYear2Change(Number(e.target.value))}
            className="bg-white border-none text-sm font-semibold text-slate-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
          >
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Fatalities Comparison Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fatalities</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${fatalitiesChange > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {fatalitiesChange > 0 ? '+' : ''}{fatalitiesChange.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] text-slate-400 font-medium mb-1">{year1}</p>
              <p className="text-xl font-bold text-slate-800">{data1.fatalities.toLocaleString()}</p>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-medium mb-1">{year2}</p>
              <p className="text-xl font-bold text-slate-900">{data2.fatalities.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
            <div 
              className="bg-slate-400 transition-all duration-500" 
              style={{ width: `${(data1.fatalities / (data1.fatalities + data2.fatalities)) * 100}%` }}
            ></div>
            <div 
              className="bg-blue-600 transition-all duration-500" 
              style={{ width: `${(data2.fatalities / (data1.fatalities + data2.fatalities)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Hotspots Comparison Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hotspot Count</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${hotspotChange > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {hotspotChange > 0 ? '+' : ''}{hotspotChange.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] text-slate-400 font-medium mb-1">{year1}</p>
              <p className="text-xl font-bold text-slate-800">{data1.hotspotCount}</p>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-medium mb-1">{year2}</p>
              <p className="text-xl font-bold text-slate-900">{data2.hotspotCount}</p>
            </div>
          </div>
          <div className="mt-4 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
            <div 
              className="bg-slate-400 transition-all duration-500" 
              style={{ width: `${(data1.hotspotCount / (data1.hotspotCount + data2.hotspotCount)) * 100}%` }}
            ></div>
            <div 
              className="bg-orange-500 transition-all duration-500" 
              style={{ width: `${(data2.hotspotCount / (data1.hotspotCount + data2.hotspotCount)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 text-[10px] text-slate-400 font-medium">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
          <span>Baseline ({year1})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <span>Target ({year2})</span>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
