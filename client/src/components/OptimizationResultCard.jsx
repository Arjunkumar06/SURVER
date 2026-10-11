import React, { useState } from 'react';
import { 
  Send, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Droplet, 
  Utensils, 
  Ambulance, 
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { createResponsePlan } from '../services/api';

export default function OptimizationResultCard({ 
  optimizationResult, 
  onPlanDeployed 
}) {
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  if (!optimizationResult) return null;

  const {
    targetZone,
    allocations = [],
    shortages = [],
    coverage = 82,
    resourceUtilization = 91,
    estimatedResponseTime = 18,
    explanation
  } = optimizationResult;

  const handleDeployPlan = async () => {
    setDeploying(true);
    try {
      const planPayload = {
        disasterId: targetZone.id || targetZone.code,
        zoneCode: targetZone.code,
        disasterName: targetZone.name,
        disasterType: targetZone.type,
        priorityScore: targetZone.priorityScore || explanation?.priorityScore || 94,
        status: 'Deploying',
        coverage,
        resourceUtilization,
        estimatedResponseTimeMinutes: estimatedResponseTime,
        allocations,
        shortages,
        explanation
      };
      const created = await createResponsePlan(planPayload);
      setDeployed(true);
      if (onPlanDeployed) onPlanDeployed(created);
    } catch (err) {
      console.error('Plan deploy error:', err);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 space-y-5 shadow-sm border border-slate-200 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 font-mono">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-cyan-100 text-cyan-800 border border-cyan-300 rounded-xl">
              AI RESPONSE PLAN
            </span>
            <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wide">
              {targetZone.code} — <span className="text-rose-600">{targetZone.severity}</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-sans">
            Dispatch routes optimized for minimum transit time and maximum survival probability
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Response Time</span>
            <p className="text-base font-bold text-cyan-700 font-mono flex items-center justify-end space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{estimatedResponseTime} mins</span>
            </p>
          </div>
          <div className="text-right border-l border-slate-200 pl-3">
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Coverage</span>
            <p className="text-base font-bold text-emerald-600 font-mono">{coverage}%</p>
          </div>
          <div className="text-right border-l border-slate-200 pl-3">
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Depot Utilization</span>
            <p className="text-base font-bold text-purple-700 font-mono">{resourceUtilization}%</p>
          </div>
        </div>
      </div>

      {/* Resource Shortage Alert Warning */}
      {shortages && shortages.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2 shadow-sm font-mono">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>⚠ REAL-WORLD RESOURCE SHORTAGE DETECTED</span>
          </div>
          {shortages.map((shortage, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-amber-900 gap-1 bg-white p-2.5 rounded-lg border border-amber-200 font-mono">
              <div>
                <strong>{shortage.label || shortage.resourceType}:</strong> Required <span className="text-slate-900 font-bold">{shortage.required}</span>, Allocated <span className="text-cyan-700 font-bold">{shortage.availableAllocated}</span>.
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 font-mono font-bold rounded-lg border border-rose-300">
                  Shortage: -{shortage.shortage} {shortage.unit}
                </span>
              </div>
            </div>
          ))}
          <p className="text-[11px] text-amber-800 italic font-sans">
            SURVER accounts for real-world supply limits and flags deficit items for regional mutual aid escalation.
          </p>
        </div>
      )}

      {/* Allocation Dispatch Manifest */}
      <div className="space-y-3 font-mono">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>Active Resource Dispatch Manifest:</span>
          <span className="text-[11px] text-cyan-700 font-bold">{allocations.length} Shipments Scheduled</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
          {allocations.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center space-x-1.5 font-mono">
                  <span className="text-cyan-700 font-mono font-bold">{item.quantity} {item.unit}</span>
                  <span className="text-slate-800">({item.label || item.resourceType})</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center space-x-1 font-mono">
                  <span>From:</span>
                  <span className="text-slate-900 font-medium">{item.sourceFacility}</span>
                </div>
              </div>

              <div className="text-right shrink-0 flex items-center space-x-1 text-cyan-700 font-mono text-[11px]">
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="font-bold">{item.destinationZone || targetZone.code}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-mono">
        <div className="text-xs text-slate-500">
          Status: <span className="text-cyan-700 font-bold">{deployed ? 'DEPLOYED & BROADCAST' : 'Ready for Execution'}</span>
        </div>

        <button
          onClick={handleDeployPlan}
          disabled={deploying || deployed}
          className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition shadow-sm ${
            deployed
              ? 'bg-emerald-100 border border-emerald-300 text-emerald-800 cursor-default'
              : 'bg-cyan-600 hover:bg-cyan-700 text-white'
          }`}
        >
          {deployed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>PLAN ACTIVE & DEPLOYED</span>
            </>
          ) : deploying ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Deploying to Field...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>APPROVE & DEPLOY RESPONSE PLAN</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
