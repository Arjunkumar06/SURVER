import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Boxes, 
  Users, 
  AlertTriangle, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';
import { fetchAnalytics } from '../services/api';

const PIE_COLORS = ['#00F0FF', '#F59E0B', '#FF2E54', '#A855F7'];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      const data = await fetchAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 3000);
    return () => clearInterval(interval);
  }, []);

  const disasterData = analytics?.disasterDistribution && analytics.disasterDistribution.some(d => d.count > 0)
    ? analytics.disasterDistribution
    : null;

  const resourceData = analytics?.resourceStockData && analytics.resourceStockData.length > 0
    ? analytics.resourceStockData
    : null;

  const responseTrends = [
    { time: 'T-6h', responseTime: 28, coverage: 65, efficiency: 74 },
    { time: 'T-4h', responseTime: 24, coverage: 72, efficiency: 81 },
    { time: 'T-2h', responseTime: 20, coverage: 78, efficiency: 86 },
    { time: 'T-0h', responseTime: 18, coverage: analytics?.responseEfficiency || 91, efficiency: analytics?.responseEfficiency || 91 },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-xl font-mono font-extrabold text-slate-900 tracking-wider uppercase">
          Emergency Response Analytics & Efficiency
        </h1>
        <p className="text-xs text-slate-600 font-mono mt-0.5">
          Cross-sector telemetry, resource stock fulfillment, and algorithmic dispatch performance
        </p>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 relative shadow-sm">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Response Speed</span>
          <div className="text-2xl font-extrabold text-cyan-700 font-mono">18 mins</div>
          <p className="text-[10px] font-mono text-cyan-600">From alert to vehicle roll-out</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 relative shadow-sm">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Target Coverage</span>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">82%</div>
          <p className="text-[10px] font-mono text-emerald-600">Of total emergency demand</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 relative shadow-sm">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Depot Utilization</span>
          <div className="text-2xl font-extrabold text-purple-700 font-mono">91%</div>
          <p className="text-[10px] font-mono text-purple-600">Stock efficiency rating</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 relative shadow-sm">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">AI Confidence</span>
          <div className="text-2xl font-extrabold text-amber-700 font-mono">98.4%</div>
          <p className="text-[10px] font-mono text-amber-600">Radar & demographic sync</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Resource Demand vs Available vs Allocated (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 space-y-4 shadow-sm relative border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Resource Stock vs Demand vs Allocated Units
            </h3>
            <span className="text-[10px] text-cyan-800 font-mono font-bold bg-cyan-100 px-2 py-0.5 rounded-lg border border-cyan-300">Logistics Inventory</span>
          </div>

          <div className="h-72 w-full font-mono">
            {resourceData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resourceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="demand" fill="#e11d48" name="Target Demand" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="allocated" fill="#0891b2" name="Dispatched / Allocated" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-500 space-y-2">
                <BarChart3 className="w-8 h-8 text-slate-400 opacity-50" />
                <span className="text-xs font-mono font-bold text-slate-600">Telemetry Stream Not Available</span>
                <span className="text-[10px] font-mono text-slate-400">Resource inventory telemetry pending data sync</span>
              </div>
            )}
          </div>
        </div>

        {/* Disaster Type Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between relative border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Disaster Type Breakdown
            </h3>
            <span className="text-[10px] text-cyan-800 font-mono font-bold bg-cyan-100 px-2 py-0.5 rounded-lg border border-cyan-300">Active Incidents</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center font-mono">
            {disasterData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={disasterData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {disasterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-500 space-y-1">
                <Activity className="w-6 h-6 text-slate-400 opacity-50" />
                <span className="text-xs font-mono font-bold text-slate-500">Data Not Available</span>
              </div>
            )}
          </div>

          {disasterData && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs font-mono">
              {disasterData.map((entry, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                  <span className="text-slate-600">{entry.name}: <strong className="text-slate-900">{entry.count}</strong></span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Response Efficiency Timeline Area Chart */}
      <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm relative border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
            Algorithmic Response Efficiency & Convergence Timeline
          </h3>
          <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300">+17% Improvement over baseline</span>
        </div>

        <div className="h-64 w-full font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={responseTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCov" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="efficiency" stroke="#0891b2" fillOpacity={1} fill="url(#colorEff)" name="Efficiency Index (%)" />
              <Area type="monotone" dataKey="coverage" stroke="#059669" fillOpacity={1} fill="url(#colorCov)" name="Population Coverage (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
