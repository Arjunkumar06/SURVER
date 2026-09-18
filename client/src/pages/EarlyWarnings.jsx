import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, AlertTriangle, ArrowRight, CheckCircle2, Navigation, Users, Boxes, Zap, RefreshCw } from 'lucide-react';
import { fetchEarlyWarnings, optimizeResources } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function EarlyWarnings() {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dispatchingId, setDispatchingId] = useState(null);
  const [dispatchSuccess, setDispatchSuccess] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchEarlyWarnings();
      setWarnings(data);
    } catch (err) {
      console.error('Failed to load warnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerEvacuation = async (warning) => {
    setDispatchingId(warning.id);
    setDispatchSuccess(null);
    try {
      const res = await optimizeResources(warning.zoneId);
      setDispatchSuccess(`Response plan generated for ${warning.location}! Evacuation & resource dispatch initiated.`);
      setTimeout(() => {
        navigate('/plans');
      }, 1500);
    } catch (err) {
      console.error('Failed to trigger evacuation dispatch:', err);
    } finally {
      setDispatchingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-6 h-6 text-[#FF2E54]" />
            <h1 className="text-xl font-mono font-extrabold text-[#F8FAFC] uppercase tracking-wider">
              Early Warning & Hyper-Local Lead Time Command
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#FF2E54]/20 text-[#FF2E54] border border-[#FF2E54]/50 rounded">
              SIH 2026 ALERTS
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">
            Actionable lead time forecasts, multi-factor risk triggers, and safe shelter evacuation dispatching.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#0B0F19] hover:bg-[#151D2F] border border-white/20 rounded-xl text-xs font-mono text-[#F8FAFC]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>RE-SYNC WARNINGS</span>
        </button>
      </div>

      {dispatchSuccess && (
        <div className="p-4 bg-[#10B981]/15 border border-[#10B981]/50 rounded-2xl flex items-center space-x-3 text-[#10B981] font-mono text-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{dispatchSuccess}</span>
        </div>
      )}

      {/* Warnings Cards List */}
      <div className="space-y-4 font-mono">
        {warnings.map((warning) => {
          const isCritical = warning.warningLevel === 'CRITICAL' || warning.riskScore >= 85;
          const levelBg = isCritical ? 'bg-[#FF2E54]/15 border-[#FF2E54] text-[#FF2E54]' : 'bg-[#F59E0B]/15 border-[#F59E0B] text-[#F59E0B]';

          return (
            <div key={warning.id} className={`cyber-card rounded-2xl p-5 border ${isCritical ? 'border-[#FF2E54]/60 shadow-[0_0_30px_rgba(255,46,84,0.2)]' : 'border-[#F59E0B]/50'} space-y-4`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${levelBg} flex items-center space-x-1.5`}>
                    <AlertTriangle className="w-4 h-4" />
                    <span>{warning.warningLevel} WARNING</span>
                  </span>
                  <div>
                    <h2 className="text-base font-extrabold text-[#F8FAFC]">{warning.location}</h2>
                    <span className="text-xs text-[#94A3B8]">{warning.hazardType} Threat Vector</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-[10px] text-[#94A3B8]">TIME TO IMPACT (LEAD TIME)</div>
                    <div className="text-lg font-extrabold text-[#00F0FF] flex items-center justify-end space-x-1">
                      <Clock className="w-4 h-4 text-[#00F0FF] animate-pulse" />
                      <span>{warning.leadTimeMinutes} MIN</span>
                    </div>
                  </div>
                  <div className="text-right border-l border-white/10 pl-4">
                    <div className="text-[10px] text-[#94A3B8]">RISK SCORE</div>
                    <div className="text-lg font-extrabold text-[#FF2E54]">{warning.riskScore} / 100</div>
                  </div>
                </div>
              </div>

              {/* Warning Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-[#0B0F19] rounded-xl border border-white/10 space-y-1">
                  <span className="text-[#94A3B8] text-[10.5px]">MULTI-SOURCE TRIGGER FACTORS</span>
                  <div className="text-[#F8FAFC] font-semibold leading-relaxed">{warning.triggerFactors}</div>
                </div>

                <div className="p-3 bg-[#0B0F19] rounded-xl border border-white/10 space-y-1">
                  <span className="text-[#94A3B8] text-[10.5px]">POPULATION AT RISK</span>
                  <div className="text-[#F8FAFC] font-semibold flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#F59E0B]" />
                    <span>{warning.affectedPopulation?.toLocaleString()} Citizens Exposed</span>
                  </div>
                </div>

                <div className="p-3 bg-[#0B0F19] rounded-xl border border-white/10 space-y-1">
                  <span className="text-[#94A3B8] text-[10.5px]">RECOMMENDED SAFE SHELTER</span>
                  <div className="text-[#00F0FF] font-semibold flex items-center space-x-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>{warning.safeShelter?.name} ({warning.safeShelter?.distanceKm} km, {warning.safeShelter?.travelTimeMinutes} min)</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-[#94A3B8] flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{warning.recommendedAction}</span>
                </div>

                <button
                  onClick={() => handleTriggerEvacuation(warning)}
                  disabled={dispatchingId === warning.id}
                  className="px-5 py-2.5 cyber-btn-crimson rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(255,46,84,0.4)] disabled:opacity-50"
                >
                  {dispatchingId === warning.id ? (
                    <span>GENERATING RESPONSE PLAN...</span>
                  ) : (
                    <>
                      <span>TRIGGER EVACUATION & RESOURCE DISPATCH</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
