import React, { useState, useEffect } from 'react';
import { Radio, Satellite, Sparkles, Activity, Info, X, ShieldAlert, Award, FileText } from 'lucide-react';
import { fetchHealth, fetchSihMetadata } from '../services/api';

export default function Header() {
  const [health, setHealth] = useState({ status: 'healthy', isUsingMongo: false });
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [showSihModal, setShowSihModal] = useState(false);
  const [sihData, setSihData] = useState(null);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch(() => setHealth({ status: 'offline' }));

    fetchSihMetadata().then(setSihData);

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header className="h-16 bg-[#030712]/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
        {/* Left: Branding & Subtitle */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#0B0F19] border border-[#00F0FF]/60 text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <Satellite className="w-5 h-5 animate-pulse-slow text-[#00F0FF]" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F0FF]"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-[#00F0FF] via-white to-[#A855F7] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,240,255,0.4)] font-mono">
                SURVER
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono bg-[#0B0F19] text-[#00F0FF] border border-[#00F0FF]/50 rounded-lg shadow-[0_0_12px_rgba(0,240,255,0.3)]">
                SIH 2026 PS-26192
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-medium tracking-tight">
              Hyper-Local Flash Flood & Landslide Early Warning System (NDRF / MHA)
            </p>
          </div>
        </div>

        {/* Right: SIH Info Badge & Status Badges */}
        <div className="flex items-center space-x-2.5">
          {/* SIH 2026 Info Trigger Button */}
          <button
            onClick={() => setShowSihModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0B0F19] hover:bg-[#151D2F] border border-[#F59E0B]/70 rounded-xl text-xs font-mono font-bold text-[#F59E0B] transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)]"
          >
            <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="hidden md:inline">SIH 2026 PS: 26192</span>
            <Info className="w-3.5 h-3.5 text-[#F59E0B]" />
          </button>

          {/* Real-time Clock */}
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 cyber-pill text-xs font-mono text-[#F8FAFC]">
            <Activity className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>UTC {currentTime}</span>
          </div>

          {/* Live Monitoring Reticle Badge */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#0B0F19] border border-[#00F0FF]/50 rounded-xl text-xs font-mono font-bold text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <Radio className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
            <span>LIVE FUSION</span>
          </div>

          {/* Gemini AI Status Badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-[#0B0F19] border border-[#A855F7]/60 rounded-xl text-xs font-mono font-bold text-[#A855F7] shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>RISK ENGINE</span>
          </div>

          {/* System Operational Indicator */}
          <div className="flex items-center space-x-2 px-3.5 py-1.5 bg-[#0B0F19] border border-[#10B981]/60 rounded-xl text-xs font-mono font-bold text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="hidden sm:inline">OPERATIONAL</span>
          </div>
        </div>
      </header>

      {/* SIH 2026 Problem Statement Modal */}
      {showSihModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="cyber-card w-full max-w-2xl rounded-3xl p-6 border border-[#F59E0B]/50 shadow-[0_0_50px_rgba(245,158,11,0.2)] space-y-5 animate-fade-in relative">
            <button
              onClick={() => setShowSihModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-[#F59E0B]">
              <Award className="w-7 h-7 shrink-0" />
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-[#F59E0B] uppercase">
                  SMART INDIA HACKATHON 2026
                </span>
                <h2 className="text-lg font-mono font-extrabold text-[#F8FAFC]">
                  Problem Statement ID: {sihData?.problemId || '26192'}
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3.5 bg-[#0B0F19] rounded-xl border border-white/10 space-y-1.5">
                <div className="text-[#00F0FF] font-extrabold text-sm">
                  {sihData?.title || 'Flash Flood Prediction System for Hilly Regions using Multi-Source Data'}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[#94A3B8]">
                  <div><span className="text-[#F8FAFC] font-bold">Organization:</span> {sihData?.organization || 'Ministry of Home Affairs'}</div>
                  <div><span className="text-[#F8FAFC] font-bold">Department:</span> {sihData?.department || 'NDRF, DM Division'}</div>
                  <div><span className="text-[#F8FAFC] font-bold">Category:</span> {sihData?.category || 'Software'}</div>
                  <div><span className="text-[#F8FAFC] font-bold">Theme:</span> {sihData?.theme || 'Disaster Management'}</div>
                </div>
              </div>

              <div className="p-3.5 bg-[#0B0F19] rounded-xl border border-white/10 space-y-2">
                <div className="text-[#F8FAFC] font-bold flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#00F0FF]" />
                  <span>Integrated Data Fusion & Prediction Scope</span>
                </div>
                <p className="text-[#94A3B8] leading-relaxed">
                  Predicts hyper-local flash flood and landslide risks at village/ward level by fusing 5 multi-source datasets:
                  Rainfall, Soil Moisture, Slope Stability, Historical Landslides, and Real-Time IoT Sensors. Generates actionable lead time for early evacuation & resource dispatch.
                </p>
              </div>

              {/* Safety Disclaimer */}
              <div className="p-3.5 bg-[#FF2E54]/10 rounded-xl border border-[#FF2E54]/40 flex items-start space-x-3 text-[#FF2E54]">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-extrabold text-xs uppercase tracking-wider">Prototype Safety Disclaimer</div>
                  <p className="text-[11px] text-[#F8FAFC]/90 leading-relaxed font-sans">
                    {sihData?.disclaimer || 'Prototype system for Smart India Hackathon 2026 demonstration. Risk predictions shown use simulated/demo data and are not a substitute for official disaster warnings.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowSihModal(false)}
                className="px-5 py-2 cyber-btn-cyan rounded-xl text-xs font-mono font-bold"
              >
                CLOSE INFO WINDOW
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
