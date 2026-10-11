import React, { useState, useEffect } from 'react';
import { Radio, Satellite, Sparkles, Activity, Info, X, ShieldAlert, Award, FileText, Menu } from 'lucide-react';
import { fetchHealth, fetchSystemMetadata } from '../services/api';

export default function Header({ onToggleMobileNav }) {
  const [health, setHealth] = useState({ status: 'healthy', isUsingMongo: false });
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const [systemData, setSystemData] = useState(null);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch(() => setHealth({ status: 'offline' }));

    fetchSystemMetadata().then(setSystemData);

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left: Branding & Subtitle */}
        <div className="flex items-center space-x-3.5">
          {/* Mobile menu toggle button */}
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-sm">
            <Satellite className="w-5 h-5 animate-pulse-slow" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-wider text-slate-900 font-mono">
                SURVER
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
                NDRF NATIONAL COMMAND | MHA
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium tracking-tight hidden sm:block">
              Autonomous Flash Flood & Landslide Early Warning Grid (NDRF / MHA / IMD)
            </p>
          </div>
        </div>

        {/* Right: System Directory & Status Badges */}
        <div className="flex items-center space-x-2.5">
          {/* System Directory Trigger Button */}
          <button
            onClick={() => setShowDirectoryModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-xl text-xs font-mono font-bold text-blue-800 transition-all shadow-2xs"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">SYSTEM DIRECTORY</span>
            <Info className="w-3.5 h-3.5 text-blue-600" />
          </button>

          {/* Real-time Clock */}
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 rounded-xl" title="Real-time system synchronization clock">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>LIVE {currentTime}</span>
          </div>

          {/* Live Monitoring Reticle Badge */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-mono font-bold text-emerald-700">
            <span className="relative flex h-2 w-2 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>REAL-TIME STREAM</span>
          </div>

          {/* Gemini AI Status Badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-xl text-xs font-mono font-bold text-purple-700">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>RISK ENGINE</span>
          </div>

          {/* System Operational Indicator */}
          <div className="flex items-center space-x-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-mono font-bold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden sm:inline">OPERATIONAL</span>
          </div>
        </div>
      </header>

      {/* National Operational Specification Modal */}
      {showDirectoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-5 animate-fade-in relative text-slate-900">
            <button
              onClick={() => setShowDirectoryModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg bg-slate-100 border border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-blue-600">
              <ShieldAlert className="w-7 h-7 shrink-0" />
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-blue-700 uppercase">
                  NATIONAL OPERATIONAL SPECIFICATION
                </span>
                <h2 className="text-lg font-mono font-extrabold text-slate-900">
                  Standard: {systemData?.standardId || 'NDRF-MHA-EWS-2026'}
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-blue-700 font-extrabold text-sm">
                  {systemData?.title || 'National Flash Flood & Landslide Early Warning Grid for Mountainous Terrains'}
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div><span className="text-slate-900 font-bold">Organization:</span> {systemData?.organization || 'Ministry of Home Affairs (MHA), Govt. of India'}</div>
                  <div><span className="text-slate-900 font-bold">Department:</span> {systemData?.department || 'National Disaster Response Force (NDRF) & NDMA'}</div>
                  <div><span className="text-slate-900 font-bold">Category:</span> {systemData?.category || 'Mission-Critical Civil Protection Architecture'}</div>
                  <div><span className="text-slate-900 font-bold">Theme:</span> {systemData?.theme || 'Autonomous Early Warning & Sensor Fusion'}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-slate-900 font-bold flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Integrated Data Fusion & Prediction Scope</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-sans">
                  Predicts hyper-local flash flood and landslide risks at village/ward level by fusing 5 authoritative multi-source datasets:
                  IMD Doppler rainfall, CWC soil saturation, GSI slope stability models, historical disaster inventories, and real-time field IoT telemetry. Generates actionable lead time for early evacuation & resource dispatch.
                </p>
              </div>

              {/* Operational Protocol Notice */}
              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 flex items-start space-x-3 text-blue-700">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-extrabold text-xs uppercase tracking-wider">Operational Protocol Notice</div>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
                    {systemData?.disclaimer || 'Operational civil protection stream synchronized with IMD Doppler radar arrays, ISRO Cartosat/Sentinel SAR constellations, and State Disaster Management Authorities (SDMAs). Field dispatches execute under National Disaster Management Guidelines.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDirectoryModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold transition"
              >
                CLOSE DIRECTORY
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

