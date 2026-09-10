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
    <div className="cyber-card rounded-2xl p-5 space-y-4 shadow-2xl relative border border-[#00F0FF]/30">
      {/* Header with Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40 rounded-xl shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-mono font-extrabold text-[#F8FAFC] tracking-wider uppercase">
                EXPLAINABLE AI: WHY WAS <span className="text-[#00F0FF]">{activeZoneData?.code || 'ZONE'}</span> PRIORITIZED?
              </h3>
              <span className="text-[11px] font-mono text-[#94A3B8]">
                ({activeZoneData?.country || 'Global'})
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-0.5 font-mono">
              Deterministic Multi-Criteria Scoring weighted against live satellite observations
            </p>
          </div>
        </div>

        {/* Priority Score & Zone Prev/Next Navigation Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center cyber-card border border-white/10 rounded-xl p-0.5">
            <button
              onClick={handlePrev}
              disabled={priorityZones.length <= 1}
              className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-white/10 disabled:opacity-30 rounded-lg transition"
              title="Previous Hazard Sector"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-[#00F0FF] px-2">
              {currentIndex + 1}/{priorityZones.length || 1}
            </span>
            <button
              onClick={handleNext}
              disabled={priorityZones.length <= 1}
              className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-white/10 disabled:opacity-30 rounded-lg transition"
              title="Next Hazard Sector"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-1 px-3 py-1 bg-[#00F0FF]/15 text-[#00F0FF] font-mono font-extrabold text-xs border border-[#00F0FF]/40 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <span>SCORE:</span>
            <span>{explanation.priorityScore || activeZoneData?.priorityScore || 94}/100</span>
          </div>
        </div>
      </div>

      {/* Priority Queue Navigation Bar (Clickable Zone Pills) */}
      {priorityZones && priorityZones.length > 0 && (
        <div className="flex items-center space-x-2 py-2 px-3 cyber-card border border-white/10 rounded-xl overflow-x-auto text-xs font-mono">
          <span className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider shrink-0">
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
                      ? 'cyber-pill-active'
                      : 'cyber-pill text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <span>#{idx + 1} {z.code}</span>
                  <span className="text-[10px] opacity-75">({z.country || 'Zone'})</span>
                  <span className="text-[10px] text-[#00F0FF] font-extrabold">[{z.priorityScore || 85} pts]</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary statement */}
      <div className="text-xs text-[#F8FAFC] leading-relaxed cyber-card p-3.5 rounded-xl border border-white/10 flex items-start space-x-2.5 shadow-inner">
        <div className="p-1 bg-[#A855F7]/20 border border-[#A855F7]/40 text-[#A855F7] rounded-lg shrink-0 mt-0.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
        <p>{explanation.summary}</p>
      </div>

      {/* Structured Scoring Factor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {explanation.factors?.map((factor, idx) => (
          <div key={idx} className="p-3.5 cyber-card-interactive rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>{factor.title}</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 rounded-lg">
                {factor.score}
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-normal">{factor.detail}</p>
          </div>
        ))}
      </div>

      {/* Mathematical Allocation Integrity Footer */}
      <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1 border-t border-white/10 font-mono">
        <span className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Deterministic mathematical priority & nearest-depot routing</span>
        </span>
        <span className="font-mono text-[#00F0FF] font-semibold">SURVER Geospatial Multi-Criteria Engine</span>
      </div>
    </div>
  );
}
