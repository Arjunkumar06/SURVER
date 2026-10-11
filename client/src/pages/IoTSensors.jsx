import React, { useState, useEffect } from 'react';
import { Cpu, Radio, AlertTriangle, CheckCircle2, Battery, Signal, RefreshCw, Search, Filter, Info } from 'lucide-react';
import { fetchSensors } from '../services/api';

export default function IoTSensors() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchSensors();
      setSensors(data);
    } catch (err) {
      console.error('Failed to load sensors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredSensors = sensors.filter((s) => {
    const matchesType = filterType === 'All' || s.type === filterType;
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const onlineCount = sensors.filter(s => s.status === 'ONLINE').length;
  const warningCount = sensors.filter(s => s.status === 'WARNING').length;
  const criticalCount = sensors.filter(s => s.status === 'CRITICAL').length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Cpu className="w-6 h-6 text-cyan-600" />
            <h1 className="text-xl font-mono font-extrabold text-slate-900 uppercase tracking-wider">
              Real-Time IoT Sensor Telemetry Stream
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded">
              REAL-TIME IOT TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-600 font-mono mt-1">
            Multi-Source Real-Time Telemetry: Rain Gauges, Soil Moisture Saturation, Inclinometers & River Level Radars.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-600" />
            <span>RE-SYNC SENSORS</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 shadow-sm">
          <div className="text-[11px] font-mono text-slate-500 uppercase">Total Active Sensors</div>
          <div className="text-2xl font-mono font-extrabold text-slate-900">{sensors.length}</div>
          <div className="text-[10px] text-emerald-600 font-mono">100% Coverage Target</div>
        </div>
        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1 shadow-sm">
          <div className="text-[11px] font-mono text-emerald-800 uppercase">Online Nominal</div>
          <div className="text-2xl font-mono font-extrabold text-emerald-700">{onlineCount}</div>
          <div className="text-[10px] text-emerald-700 font-mono">Telemetry Nominal</div>
        </div>
        <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1 shadow-sm">
          <div className="text-[11px] font-mono text-amber-800 uppercase">Warning Threshold</div>
          <div className="text-2xl font-mono font-extrabold text-amber-700">{warningCount}</div>
          <div className="text-[10px] text-amber-700 font-mono">Elevated Value Alerts</div>
        </div>
        <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-1 shadow-sm">
          <div className="text-[11px] font-mono text-rose-800 uppercase">Critical Alerts</div>
          <div className="text-2xl font-mono font-extrabold text-rose-700">{criticalCount}</div>
          <div className="text-[10px] text-rose-700 font-mono">Imminent Hazard Trigger</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 font-mono shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search sensor ID, village, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-600">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Types</option>
              <option value="Rain Gauge">Rain Gauge</option>
              <option value="Soil Moisture">Soil Moisture</option>
              <option value="Slope Stability">Slope Stability</option>
              <option value="Water Level">Water Level</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-600">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="ONLINE">ONLINE</option>
              <option value="WARNING">WARNING</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="OFFLINE">OFFLINE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {filteredSensors.map((sensor) => {
          const statusBg = 
            sensor.status === 'CRITICAL' ? 'bg-rose-100 border-rose-300 text-rose-800' :
            sensor.status === 'WARNING' ? 'bg-amber-100 border-amber-300 text-amber-900' :
            'bg-emerald-100 border-emerald-300 text-emerald-800';

          return (
            <div key={sensor.id} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 relative shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-cyan-700">{sensor.id}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                      {sensor.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{sensor.name}</h3>
                  <p className="text-[11px] text-slate-600">{sensor.village}, {sensor.district} ({sensor.state})</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${statusBg}`}>
                  {sensor.status}
                </span>
              </div>

              {/* Value & Gauge */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Current Reading</div>
                  <div className="text-xl font-extrabold text-slate-900">
                    {sensor.value} <span className="text-xs text-cyan-600 font-normal">{sensor.unit}</span>
                  </div>
                </div>
                <Radio className="w-5 h-5 text-cyan-600 animate-pulse" />
              </div>

              {/* Sensor Health Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[10.5px] text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <Battery className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Battery: {sensor.batteryPercent}%</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Signal className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Signal: {sensor.signalStrengthPercent}%</span>
                </div>
              </div>

              <div className="text-[9.5px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                <span>Last telemetry ping: {sensor.lastUpdated || 'Just now'}</span>
                <span className="text-emerald-700 font-bold">OPERATIONAL NODE</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
