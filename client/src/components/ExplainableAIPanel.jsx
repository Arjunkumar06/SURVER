import React from 'react';
import { 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  MapPin,
  Layers,
  Globe
} from 'lucide-react';

export default function ExplainableAIPanel({ 
  explanation, 
  priorityZones = [], 
  currentZone,
  onSelectZone 
}) {
  if (!explanation) return null;

  // Find index of the currently active zone in priority list
  const activeZoneCode = explanation.targetZoneCode || currentZone?.code || (priorityZones[0]?.code);
  const activeIndex = priorityZones.findIndex(z => z.code === activeZoneCode || z.id === currentZone?.id);
  const currentIndex = activeIndex >= 0 ? activeIndex : 0;
  const activeZoneData = priorityZones[currentIndex] || currentZone;

  const handlePrev = () => {
    if (!priorityZones.length) return;
    const nextIdx = (currentIndex - 1 + priorityZones.length) % priorityZones.length;
    onSelectZone && onSelectZone(priorityZones[nextIdx]);
  };

  const handleNext = () => {
    if (!priorityZones.length) return;
    const nextIdx = (currentIndex + 1) % priorityZones.length;
    onSelectZone && onSelectZone(priorityZones[nextIdx]);
  };

  return (
    <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm relative border border-slate-200">
      {/* Header with Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-purple-100 text-purple-700 border border-purple-300 rounded-xl shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-mono font-extrabold text-slate-900 tracking-wider uppercase">
                EXPLAINABLE AI: WHY WAS <span className="text-cyan-700">{activeZoneData?.code || 'ZONE'}</span> PRIORITIZED?
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                ({activeZoneData?.country || 'Global'})
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5 font-mono">
              Deterministic Multi-Criteria Scoring weighted against live satellite observations
            </p>
          </div>
        </div>

        {/* Priority Score & Zone Prev/Next Navigation Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5">
            <button
              onClick={handlePrev}
              disabled={priorityZones.length <= 1}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 rounded-lg transition"
              title="Previous Hazard Sector"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-cyan-700 px-2">
              {currentIndex + 1}/{priorityZones.length || 1}
            </span>
            <button
              onClick={handleNext}
              disabled={priorityZones.length <= 1}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 rounded-lg transition"
              title="Next Hazard Sector"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-1 px-3 py-1 bg-cyan-100 text-cyan-800 font-mono font-extrabold text-xs border border-cyan-300 rounded-xl shadow-sm">
            <span>SCORE:</span>
            <span>{explanation.priorityScore || activeZoneData?.priorityScore || 94}/100</span>
          </div>
        </div>
      </div>

      {/* Priority Queue Navigation Bar (Clickable Zone Pills) */}
      {priorityZones && priorityZones.length > 0 && (
        <div className="flex items-center space-x-2 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto text-xs font-mono">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Priority Queue:
          </span>
          <div className="flex items-center space-x-2 shrink-0">
            {priorityZones.map((z, idx) => {
              const isSelected = z.code === activeZoneCode || z.id === activeZoneData?.id;
              return (
                <button
                  key={z.id || z.code}
                  onClick={() => onSelectZone && onSelectZone(z)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold transition ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>#{idx + 1} {z.code}</span>
                  <span className="text-[10px] opacity-75">({z.country || 'Zone'})</span>
                  <span className="text-[10px] text-cyan-600 font-extrabold">[{z.priorityScore || 85} pts]</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary statement */}
      <div className="text-xs text-slate-900 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start space-x-2.5 shadow-inner">
        <div className="p-1 bg-purple-100 border border-purple-300 text-purple-700 rounded-lg shrink-0 mt-0.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
        <p>{explanation.summary}</p>
      </div>

      {/* Structured Scoring Factor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {explanation.factors?.map((factor, idx) => (
          <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                <span>{factor.title}</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-100 text-cyan-800 border border-cyan-300 rounded-lg">
                {factor.score}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">{factor.detail}</p>
          </div>
        ))}
      </div>

      {/* Mathematical Allocation Integrity Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
        <span className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Deterministic mathematical priority & nearest-depot routing</span>
        </span>
        <span className="font-mono text-cyan-700 font-semibold">SURVER Geospatial Multi-Criteria Engine</span>
      </div>
    </div>
  );
}
