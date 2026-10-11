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
  Award,
  X
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'COMMAND CENTER',
    items: [
      { name: 'Flash Flood Command', path: '/', icon: LayoutDashboard },
      { name: 'Village / Ward Risk', path: '/zones', icon: MapPin },
    ]
  },
  {
    title: 'EARLY WARNING & INTEL',
    items: [
      { name: 'Live IoT Sensors', path: '/sensors', icon: Cpu },
      { name: 'Early Warnings', path: '/warnings', icon: ShieldAlert },
      { name: 'Satellite Intelligence', path: '/satellite', icon: Satellite },
    ]
  },
  {
    title: 'DISASTER RESPONSE',
    items: [
      { name: 'Resources & Depots', path: '/resources', icon: Boxes },
      { name: 'Response Plans', path: '/plans', icon: ClipboardList },
    ]
  },
  {
    title: 'ANALYTICS & HISTORY',
    items: [
      { name: 'Historical Intelligence', path: '/history', icon: History },
      { name: 'Analytics Benchmarks', path: '/analytics', icon: BarChart3 },
    ]
  }
];

export default function Sidebar({ isOpen, onCloseMobileNav }) {
  return (
    <>
      {/* Mobile Drawer Overlay Back-Drop */}
      {isOpen && (
        <div 
          onClick={onCloseMobileNav} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside className={`
        fixed md:sticky top-16 left-0 z-40 md:z-10
        w-64 bg-white border-r border-slate-200 
        flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] 
        transition-transform duration-300 ease-in-out shadow-xs
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top Nav Links */}
        <div className="p-4 space-y-5 overflow-y-auto">
          <div className="flex items-center justify-between md:hidden pb-2 border-b border-slate-200">
            <span className="text-xs font-mono font-bold text-slate-900 uppercase">Navigation</span>
            <button onClick={onCloseMobileNav} className="p-1 text-slate-500 hover:text-slate-900">
              <X className="w-4 h-4" />
            </button>
          </div>

          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <div className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>{group.title}</span>
              </div>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={onCloseMobileNav}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 font-extrabold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0 text-blue-600" />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Info Card */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/50">
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 text-xs shadow-2xs">
            <div className="flex items-center justify-between text-slate-900 font-bold font-mono">
              <span className="flex items-center space-x-1.5 text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                <span>NDRF EARLY WARNING v2.4</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 font-bold">
                MHA LIVE
              </span>
            </div>
            <p className="text-[10.5px] text-slate-500 leading-tight font-mono">
              Autonomous multi-source flash flood & landslide defense network.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

