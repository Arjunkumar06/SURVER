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
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <h1 className="text-xl font-mono font-extrabold text-slate-900 uppercase tracking-wider">
              Early Warning & Hyper-Local Lead Time Command
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300 rounded">
              IMMINENT IMPACT ADVISORIES
            </span>
          </div>
          <p className="text-xs text-slate-600 font-mono mt-1">
            Actionable lead time forecasts, multi-factor risk triggers, and safe shelter evacuation dispatching.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-600" />
          <span>RE-SYNC WARNINGS</span>
        </button>
      </div>

      {dispatchSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center space-x-3 text-emerald-800 font-mono text-xs animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{dispatchSuccess}</span>
        </div>
      )}

      {/* Warnings Cards List */}
      <div className="space-y-4 font-mono">
        {warnings.map((warning) => {
          const isCritical = warning.warningLevel === 'CRITICAL' || warning.riskScore >= 85;
          const levelBg = isCritical ? 'bg-rose-100 border-rose-300 text-rose-800' : 'bg-amber-100 border-amber-300 text-amber-900';

          return (
            <div key={warning.id} className={`bg-white rounded-2xl p-5 border ${isCritical ? 'border-rose-300 shadow-md ring-1 ring-rose-200' : 'border-slate-200 shadow-sm'} space-y-4`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${levelBg} flex items-center space-x-1.5`}>
                    <AlertTriangle className="w-4 h-4" />
                    <span>{warning.warningLevel} WARNING</span>
                  </span>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">{warning.location}</h2>
                    <span className="text-xs text-slate-500">{warning.hazardType} Threat Vector</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500">TIME TO IMPACT (LEAD TIME)</div>
                    <div className="text-lg font-extrabold text-cyan-700 flex items-center justify-end space-x-1">
                      <Clock className="w-4 h-4 text-cyan-600 animate-pulse" />
                      <span>{warning.leadTimeMinutes} MIN</span>
                    </div>
                  </div>
                  <div className="text-right border-l border-slate-200 pl-4">
                    <div className="text-[10px] text-slate-500">RISK SCORE</div>
                    <div className="text-lg font-extrabold text-rose-600">{warning.riskScore} / 100</div>
                  </div>
                </div>
              </div>

              {/* Warning Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 text-[10.5px]">MULTI-SOURCE TRIGGER FACTORS</span>
                  <div className="text-slate-900 font-semibold leading-relaxed">{warning.triggerFactors}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 text-[10.5px]">POPULATION AT RISK</span>
                  <div className="text-slate-900 font-semibold flex items-center space-x-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>{warning.affectedPopulation?.toLocaleString()} Citizens Exposed</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 text-[10.5px]">RECOMMENDED SAFE SHELTER</span>
                  <div className="text-cyan-700 font-semibold flex items-center space-x-1.5">
                    <Navigation className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{warning.safeShelter?.name} ({warning.safeShelter?.distanceKm} km, {warning.safeShelter?.travelTimeMinutes} min)</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-600 flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>{warning.recommendedAction}</span>
                </div>

                <button
                  onClick={() => handleTriggerEvacuation(warning)}
                  disabled={dispatchingId === warning.id}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
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
