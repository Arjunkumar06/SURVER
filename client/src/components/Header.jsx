import React, { useState, useEffect } from 'react';
import { Radio, Satellite, Sparkles, ShieldCheck, Activity, Bell } from 'lucide-react';
import { fetchHealth } from '../services/api';

export default function Header() {
  const [health, setHealth] = useState({ status: 'healthy', isUsingMongo: false, geminiConfigured: false });
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch(() => setHealth({ status: 'offline', isUsingMongo: false, geminiConfigured: false }));

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-[#030712]/90 backdrop-blur-2xl border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
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
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-[#00F0FF] via-white to-[#A855F7] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,240,255,0.4)] font-mono">
              SURVER
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono bg-[#0B0F19] text-[#00F0FF] border border-[#00F0FF]/50 rounded-lg shadow-[0_0_12px_rgba(0,240,255,0.3)]">
              NEO-CYBER COMMAND
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-medium tracking-tight">
            Satellite AI Emergency Resource Orchestration Network
          </p>
        </div>
      </div>

      {/* Right: HUD Telemetry & Status Badges */}
      <div className="flex items-center space-x-3">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 cyber-pill text-xs font-mono text-[#F8FAFC]">
          <Activity className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>UTC {currentTime}</span>
        </div>

        {/* Live Monitoring Reticle Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#0B0F19] border border-[#00F0FF]/50 rounded-xl text-xs font-mono font-bold text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.25)]">
          <Radio className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
          <span>LIVE MONITORING</span>
        </div>

        {/* Gemini AI Status Badge */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0B0F19] border border-[#A855F7]/60 rounded-xl text-xs font-mono font-bold text-[#A855F7] shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
          <span>GEMINI AI ENGINE</span>
        </div>

        {/* System Operational Indicator */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 bg-[#0B0F19] border border-[#10B981]/60 rounded-xl text-xs font-mono font-bold text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span>SYSTEM OPERATIONAL</span>
        </div>
      </div>
    </header>
  );
}
