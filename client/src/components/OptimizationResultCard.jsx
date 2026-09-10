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
    <div className="cyber-card rounded-2xl p-5 space-y-5 shadow-2xl border border-[#00F0FF]/30 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 font-mono">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 rounded-xl shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              AI RESPONSE PLAN
            </span>
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wide">
              {targetZone.code} — <span className="text-[#FF2E54]">{targetZone.severity}</span>
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 font-sans">
            Dispatch routes optimized for minimum transit time and maximum survival probability
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[10px] text-[#94A3B8] uppercase font-mono tracking-wider">Response Time</span>
            <p className="text-base font-bold text-[#00F0FF] font-mono flex items-center justify-end space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{estimatedResponseTime} mins</span>
            </p>
          </div>
          <div className="text-right border-l border-white/10 pl-3">
            <span className="text-[10px] text-[#94A3B8] uppercase font-mono tracking-wider">Coverage</span>
            <p className="text-base font-bold text-[#10B981] font-mono">{coverage}%</p>
          </div>
          <div className="text-right border-l border-white/10 pl-3">
            <span className="text-[10px] text-[#94A3B8] uppercase font-mono tracking-wider">Depot Utilization</span>
            <p className="text-base font-bold text-[#A855F7] font-mono">{resourceUtilization}%</p>
          </div>
        </div>
      </div>

      {/* Resource Shortage Alert Warning */}
      {shortages && shortages.length > 0 && (
        <div className="p-4 bg-[#F59E0B]/10 backdrop-blur-xl border border-[#F59E0B]/40 rounded-xl space-y-2 shadow-[0_0_20px_rgba(245,158,11,0.15)] font-mono">
          <div className="flex items-center space-x-2 text-[#F59E0B] font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B] animate-pulse" />
            <span>⚠ REAL-WORLD RESOURCE SHORTAGE DETECTED</span>
          </div>
          {shortages.map((shortage, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#F59E0B] gap-1 bg-[#030712]/60 p-2.5 rounded-lg border border-[#F59E0B]/30 font-mono">
              <div>
                <strong>{shortage.label || shortage.resourceType}:</strong> Required <span className="text-white font-bold">{shortage.required}</span>, Allocated <span className="text-[#00F0FF] font-bold">{shortage.availableAllocated}</span>.
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-[#FF2E54]/20 text-[#FF2E54] font-mono font-bold rounded-lg border border-[#FF2E54]/40">
                  Shortage: -{shortage.shortage} {shortage.unit}
                </span>
              </div>
            </div>
          ))}
          <p className="text-[11px] text-[#F59E0B]/80 italic font-sans">
            SURVER accounts for real-world supply limits and flags deficit items for regional mutual aid escalation.
          </p>
        </div>
      )}

      {/* Allocation Dispatch Manifest */}
      <div className="space-y-3 font-mono">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#94A3B8] flex items-center justify-between">
          <span>Active Resource Dispatch Manifest:</span>
          <span className="text-[11px] text-[#00F0FF] font-bold">{allocations.length} Shipments Scheduled</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
          {allocations.map((item, idx) => (
            <div key={idx} className="p-3 cyber-card-interactive rounded-xl flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-white flex items-center space-x-1.5 font-mono">
                  <span className="text-[#00F0FF] font-mono font-bold">{item.quantity} {item.unit}</span>
                  <span className="text-[#F8FAFC]">({item.label || item.resourceType})</span>
                </div>
                <div className="text-[11px] text-[#94A3B8] flex items-center space-x-1 font-mono">
                  <span>From:</span>
                  <span className="text-[#F8FAFC] font-medium">{item.sourceFacility}</span>
                </div>
              </div>

              <div className="text-right shrink-0 flex items-center space-x-1 text-[#00F0FF] font-mono text-[11px]">
                <ArrowRight className="w-3 h-3 text-[#94A3B8]" />
                <span className="font-bold">{item.destinationZone || targetZone.code}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 font-mono">
        <div className="text-xs text-[#94A3B8]">
          Status: <span className="text-[#00F0FF] font-bold">{deployed ? 'DEPLOYED & BROADCAST' : 'Ready for Execution'}</span>
        </div>

        <button
          onClick={handleDeployPlan}
          disabled={deploying || deployed}
          className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition ${
            deployed
              ? 'bg-[#10B981]/20 border border-[#10B981]/50 text-[#10B981] cursor-default shadow-[0_0_20px_rgba(16,185,129,0.25)]'
              : 'cyber-btn-cyan'
          }`}
        >
          {deployed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>PLAN ACTIVE & DEPLOYED</span>
            </>
          ) : deploying ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-[#030712]/30 border-t-[#030712] rounded-full animate-spin"></span>
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
