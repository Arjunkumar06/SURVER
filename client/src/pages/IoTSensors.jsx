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
            <Cpu className="w-6 h-6 text-[#00F0FF]" />
            <h1 className="text-xl font-mono font-extrabold text-[#F8FAFC] uppercase tracking-wider">
              Real-Time IoT Sensor Telemetry Stream
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#0B0F19] text-[#10B981] border border-[#10B981]/50 rounded">
              SIH 2026 LIVE IoT
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">
            Multi-Source Real-Time Telemetry: Rain Gauges, Soil Moisture Saturation, Inclinometers & River Level Radars.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0B0F19] hover:bg-[#151D2F] border border-white/20 rounded-xl text-xs font-mono text-[#F8FAFC]"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>RE-SYNC SENSORS</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 cyber-card rounded-2xl border border-white/10 space-y-1">
          <div className="text-[11px] font-mono text-[#94A3B8] uppercase">Total Active Sensors</div>
          <div className="text-2xl font-mono font-extrabold text-[#F8FAFC]">{sensors.length}</div>
          <div className="text-[10px] text-[#10B981] font-mono">100% Coverage Target</div>
        </div>
        <div className="p-4 cyber-card rounded-2xl border border-[#10B981]/40 space-y-1 bg-[#10B981]/5">
          <div className="text-[11px] font-mono text-[#10B981] uppercase">Online Nominal</div>
          <div className="text-2xl font-mono font-extrabold text-[#10B981]">{onlineCount}</div>
          <div className="text-[10px] text-[#10B981] font-mono">Telemetry Nominal</div>
        </div>
        <div className="p-4 cyber-card rounded-2xl border border-[#F59E0B]/40 space-y-1 bg-[#F59E0B]/5">
          <div className="text-[11px] font-mono text-[#F59E0B] uppercase">Warning Threshold</div>
          <div className="text-2xl font-mono font-extrabold text-[#F59E0B]">{warningCount}</div>
          <div className="text-[10px] text-[#F59E0B] font-mono">Elevated Value Alerts</div>
        </div>
        <div className="p-4 cyber-card rounded-2xl border border-[#FF2E54]/40 space-y-1 bg-[#FF2E54]/5">
          <div className="text-[11px] font-mono text-[#FF2E54] uppercase">Critical Alerts</div>
          <div className="text-2xl font-mono font-extrabold text-[#FF2E54]">{criticalCount}</div>
          <div className="text-[10px] text-[#FF2E54] font-mono">Imminent Hazard Trigger</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 cyber-card rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search sensor ID, village, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0B0F19] border border-white/15 rounded-xl text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#94A3B8]">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#0B0F19] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00F0FF]"
            >
              <option value="All">All Types</option>
              <option value="Rain Gauge">Rain Gauge</option>
              <option value="Soil Moisture">Soil Moisture</option>
              <option value="Slope Stability">Slope Stability</option>
              <option value="Water Level">Water Level</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#94A3B8]">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#0B0F19] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00F0FF]"
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
            sensor.status === 'CRITICAL' ? 'bg-[#FF2E54]/15 border-[#FF2E54]/60 text-[#FF2E54]' :
            sensor.status === 'WARNING' ? 'bg-[#F59E0B]/15 border-[#F59E0B]/60 text-[#F59E0B]' :
            'bg-[#10B981]/15 border-[#10B981]/60 text-[#10B981]';

          return (
            <div key={sensor.id} className="cyber-card rounded-2xl p-4 border border-white/10 space-y-3 relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-[#00F0FF]">{sensor.id}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-[#0B0F19] text-[#94A3B8] rounded border border-white/10">
                      {sensor.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#F8FAFC] mt-1">{sensor.name}</h3>
                  <p className="text-[11px] text-[#94A3B8]">{sensor.village}, {sensor.district} ({sensor.state})</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${statusBg}`}>
                  {sensor.status}
                </span>
              </div>

              {/* Value & Gauge */}
              <div className="p-3 bg-[#0B0F19] rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#94A3B8] uppercase">Current Reading</div>
                  <div className="text-xl font-extrabold text-[#F8FAFC]">
                    {sensor.value} <span className="text-xs text-[#00F0FF] font-normal">{sensor.unit}</span>
                  </div>
                </div>
                <Radio className="w-5 h-5 text-[#00F0FF] animate-pulse" />
              </div>

              {/* Sensor Health Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[10.5px] text-[#94A3B8]">
                <div className="flex items-center space-x-1.5">
                  <Battery className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Battery: {sensor.batteryPercent}%</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Signal className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>Signal: {sensor.signalStrengthPercent}%</span>
                </div>
              </div>

              <div className="text-[9.5px] text-[#64748B] flex items-center justify-between pt-1 border-t border-white/5">
                <span>Last telemetry ping: {sensor.lastUpdated}</span>
                <span className="text-[#F59E0B]">DEMO IoT SENSOR</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
