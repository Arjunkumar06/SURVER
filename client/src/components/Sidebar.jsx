import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Cpu, 
  ShieldAlert, 
  Satellite, 
  History, 
  Boxes, 
  ClipboardList, 
  BarChart3,
  Zap,
  Award
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Flash Flood Command', path: '/', icon: LayoutDashboard },
  { name: 'Village / Ward Risk', path: '/zones', icon: MapPin },
  { name: 'Live IoT Sensors', path: '/sensors', icon: Cpu },
  { name: 'Early Warnings', path: '/warnings', icon: ShieldAlert },
  { name: 'Satellite Intelligence', path: '/satellite', icon: Satellite },
  { name: 'Historical Intelligence', path: '/history', icon: History },
  { name: 'Resources & Depots', path: '/resources', icon: Boxes },
  { name: 'Response Plans', path: '/plans', icon: ClipboardList },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#030712]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none shadow-[8px_0_32px_0_rgba(0,0,0,0.8)]">
      {/* Top Nav Links */}
      <div className="p-3.5 space-y-4 overflow-y-auto">
        <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between font-mono">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
            COMMAND NAVIGATION
          </div>
          <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF] animate-pulse"></span>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 ${
                    isActive
                      ? 'cyber-pill-active font-extrabold text-[#00F0FF] border border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.4)] bg-[#0B0F19]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B0F19] hover:border-white/20 border border-transparent backdrop-blur-md'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-[#00F0FF]" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info Card */}
      <div className="p-3.5 border-t border-white/10">
        <div className="p-3 cyber-card rounded-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#F8FAFC] font-bold font-mono">
            <span className="flex items-center space-x-1.5 text-[11px]">
              <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>SIH 2026 PS-26192</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.5 bg-[#0B0F19] text-[#10B981] rounded border border-[#10B981]/50 font-bold">
              NDRF
            </span>
          </div>
          <p className="text-[10.5px] text-[#94A3B8] leading-tight font-mono">
            Hilly region multi-source prediction, early warning & emergency dispatch.
          </p>
        </div>
      </div>
    </aside>
  );
}
