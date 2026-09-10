import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Users, 
  Boxes, 
  Zap, 
  Activity, 
  Sparkles, 
  Navigation, 
  TrendingUp, 
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  RotateCcw,
  Globe,
  Filter,
  Radio,
  Eye,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { 
  fetchDisasters, 
  fetchResources, 
  optimizeResources, 
  fetchResponsePlans,
  fetchAnalytics
} from '../services/api';
import CommandMap from '../components/CommandMap';
import DisasterDetailModal from '../components/DisasterDetailModal';
import ExplainableAIPanel from '../components/ExplainableAIPanel';
import OptimizationResultCard from '../components/OptimizationResultCard';

const SENSOR_MODES = [
  { id: 'All Sensor Modes', label: 'All Modes', source: 'All Observation Telemetry' },
  { id: 'Real-Time Satellite Mode', label: 'Satellite Mode', source: 'Copernicus Sentinel-1/2 SAR' },
  { id: 'Environmental Sensor Mode', label: 'Environmental Sensor', source: 'Geotechnical Soil & Inclinometer Array' },
  { id: 'IoT Water-Level Sensor Mode', label: 'IoT Water-Level', source: 'Ultrasonic & Hydrostatic River Telemetry' },
  { id: 'Weather Sensor Mode', label: 'Weather Doppler', source: 'Doppler Radar & Thermal Weather Stations' },
  { id: 'Manual / Simulated Demo Mode', label: 'Manual/Demo', source: 'Calibrated Simulation Dataset' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [modalZone, setModalZone] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [activeSensorMode, setActiveSensorMode] = useState('All Sensor Modes');
  const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date().toUTCString().split(' ')[4] + ' UTC');
  const [stats, setStats] = useState({
    activeEmergencies: 8,
    criticalZones: 4,
    peopleAtRisk: 42600,
    totalResourcesAvailable: 11200,
    responseEfficiency: 91
  });

  const selectedZoneRef = useRef(selectedZone);
  selectedZoneRef.current = selectedZone;

  // Initial load
  const loadInitialData = async () => {
    try {
      const [disasterList, resourceData, analyticsData] = await Promise.all([
        fetchDisasters(),
        fetchResources(),
        fetchAnalytics().catch(() => null)
      ]);

      setDisasters(disasterList);
      setFacilities(resourceData.facilities || []);

      if (disasterList.length > 0 && !selectedZoneRef.current) {
        setSelectedZone(disasterList[0]);
      }

      if (analyticsData) {
        setStats({
          activeEmergencies: analyticsData.activeEmergencies || disasterList.length,
          criticalZones: analyticsData.criticalZones || 4,
          peopleAtRisk: analyticsData.peopleAtRisk || 42600,
          totalResourcesAvailable: analyticsData.totalResourcesAvailable || 11200,
          responseEfficiency: analyticsData.responseEfficiency || 91
        });
      }
      setLastUpdatedTime(new Date().toUTCString().split(' ')[4] + ' UTC');
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Real-Time 3-Second Live Telemetry Monitoring Loop
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      setLastUpdatedTime(now.toUTCString().split(' ')[4] + ' UTC');

      try {
        const [disasterList, analyticsData] = await Promise.all([
          fetchDisasters().catch(() => null),
          fetchAnalytics().catch(() => null)
        ]);

        if (disasterList && disasterList.length > 0) {
          setDisasters(disasterList);
          if (selectedZoneRef.current) {
            const updated = disasterList.find(d => d.id === selectedZoneRef.current.id || d.code === selectedZoneRef.current.code);
            if (updated) {
              setSelectedZone(updated);
            }
          }
        }

        if (analyticsData) {
          setStats({
            activeEmergencies: analyticsData.activeEmergencies || 0,
            criticalZones: analyticsData.criticalZones || 0,
            peopleAtRisk: analyticsData.peopleAtRisk || 0,
            totalResourcesAvailable: analyticsData.totalResourcesAvailable || 0,
            responseEfficiency: analyticsData.responseEfficiency || 91
          });
        }
      } catch {
        // Silent catch for polling resilience
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const countries = ['All', ...new Set(disasters.map(d => d.country || d.location?.country).filter(Boolean))];

  const filteredDisasters = disasters.filter(d => {
    const matchesCountry = selectedCountry === 'All' || (d.country || d.location?.country) === selectedCountry;
    const matchesSensor = activeSensorMode === 'All Sensor Modes' || d.sensorMode === activeSensorMode || activeSensorMode === 'Manual / Simulated Demo Mode';
    return matchesCountry && matchesSensor;
  });

  const handleSensorModeChange = (modeId) => {
    setActiveSensorMode(modeId);
    const matching = disasters.filter(d => {
      const matchesCountry = selectedCountry === 'All' || (d.country || d.location?.country) === selectedCountry;
      const matchesSensor = modeId === 'All Sensor Modes' || d.sensorMode === modeId || modeId === 'Manual / Simulated Demo Mode';
      return matchesCountry && matchesSensor;
    });
    if (matching.length > 0) {
      setSelectedZone(matching[0]);
    }
  };

  const handleSelectZone = (zone) => {
    if (!zone) {
      setSelectedZone(null);
      return;
    }
    setSelectedZone(zone);
    if (zone.sensorMode) {
      setActiveSensorMode(zone.sensorMode);
    }
    if (optimizationResult) {
      handleOptimize(zone);
    }
  };

  const handleOptimize = async (targetZone = null) => {
    setOptimizing(true);
    try {
      const zoneToOptimize = targetZone || selectedZone || disasters[0];
      const result = await optimizeResources(zoneToOptimize?.id || zoneToOptimize?.code);
      setOptimizationResult(result);
      if (zoneToOptimize) {
        setSelectedZone(zoneToOptimize);
      }
    } catch (err) {
      console.error('Optimization error:', err);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Global Command & Real-Time Monitoring Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cyber-card p-4 sm:p-5 rounded-2xl border border-white/10 shadow-2xl relative">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <Globe className="w-5 h-5 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-base sm:text-lg font-mono font-extrabold text-[#F8FAFC] tracking-wider uppercase">
                Global Emergency Resource Orchestration Center
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 rounded-full font-mono font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                GIS HUD v2.5
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono">
              Copernicus Satellite SAR • Ground Telemetry • Gemini AI Risk Reasoning • Deterministic Logistics
            </p>
          </div>
        </div>

        {/* Real-time Status Badge & Last Updated Timestamp */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <div className="flex items-center space-x-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
              <span className="text-[11px] font-mono font-bold text-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                LIVE TELEMETRY ACTIVE
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#94A3B8]">
              LAST UPDATE: <strong className="text-[#00F0FF]">{lastUpdatedTime}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Sensor Mode & Country Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3.5 cyber-card border border-white/10 rounded-2xl shadow-xl">
        {/* Sensor Mode Selector */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider shrink-0 flex items-center space-x-1 mr-1">
            <Radio className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Sensor Mode:</span>
          </span>
          {SENSOR_MODES.map((sm) => (
            <button
              key={sm.id}
              onClick={() => handleSensorModeChange(sm.id)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl transition shrink-0 ${
                activeSensorMode === sm.id
                  ? 'cyber-pill-active'
                  : 'cyber-pill text-[#94A3B8] hover:text-white'
              }`}
              title={`Source: ${sm.source}`}
            >
              {sm.label}
            </button>
          ))}
        </div>

        {/* Country Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 border-t lg:border-t-0 border-white/10 pt-2 lg:pt-0">
          <span className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider shrink-0 flex items-center space-x-1 mr-1">
            <Filter className="w-3 h-3 text-[#00F0FF]" />
            <span>Country:</span>
          </span>
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelectedCountry(c);
                const firstInCountry = disasters.find(d => c === 'All' || (d.country || d.location?.country) === c);
                if (firstInCountry) setSelectedZone(firstInCountry);
              }}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-xl transition shrink-0 ${
                selectedCountry === c
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'cyber-pill text-[#94A3B8] hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 cyber-card-interactive rounded-2xl space-y-1 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
              Active Emergencies
            </span>
            <AlertTriangle className="w-4 h-4 text-[#00F0FF]" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {String(stats.activeEmergencies).padStart(2, '0')}
          </div>
          <p className="text-[10px] font-mono text-[#00F0FF]">{countries.length - 1} Countries Monitored</p>
        </div>

        <div className="p-4 cyber-card-interactive rounded-2xl space-y-1 relative border-[#FF2E54]/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#FF2E54] uppercase tracking-wider font-mono">
              Critical Zones
            </span>
            <ShieldAlert className="w-4 h-4 text-[#FF2E54] animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-[#FF2E54] font-mono">
            {String(stats.criticalZones).padStart(2, '0')}
          </div>
          <p className="text-[10px] font-mono text-[#FF2E54] font-bold">Immediate Priority</p>
        </div>

        <div className="p-4 cyber-card-interactive rounded-2xl space-y-1 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
              People At Risk
            </span>
            <Users className="w-4 h-4 text-[#A855F7]" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {stats.peopleAtRisk.toLocaleString()}
          </div>
          <p className="text-[10px] font-mono text-[#A855F7]">Within hazard polygons</p>
        </div>

        <div className="p-4 cyber-card-interactive rounded-2xl space-y-1 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
              Resources Available
            </span>
            <Boxes className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-extrabold text-[#10B981] font-mono">
            {stats.totalResourcesAvailable.toLocaleString()}
          </div>
          <p className="text-[10px] font-mono text-[#10B981]">{facilities.length} Regional Depots</p>
        </div>

        <div className="p-4 cyber-card-interactive rounded-2xl space-y-1 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
              Response Efficiency
            </span>
            <Zap className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-extrabold text-[#F59E0B] font-mono">
            {stats.responseEfficiency}%
          </div>
          <p className="text-[10px] font-mono text-[#F59E0B]">Optimal nearest routing</p>
        </div>
      </div>

      {/* Main Command Center Grid: Map & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Global Map (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#00F0FF] animate-pulse"></span>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F8FAFC]">
                Global Command GIS Map
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-[#94A3B8]">Targeting:</span>
              <span className="font-bold text-[#00F0FF] bg-[#00F0FF]/15 px-2 py-0.5 rounded border border-[#00F0FF]/40">
                {selectedZone?.code || 'ZONE'}
              </span>
              <span className="text-[#94A3B8]">({selectedZone?.country || 'Global'})</span>
            </div>
          </div>

          <div className="h-[520px] w-full relative z-0">
            <CommandMap
              disasters={filteredDisasters}
              facilities={facilities}
              selectedZone={selectedZone}
              onSelectZone={(z) => handleSelectZone(z)}
              onAnalyzeZone={(z) => setModalZone(z)}
              onOptimizeZone={(z) => handleOptimize(z)}
              activeAllocations={optimizationResult?.allocations || []}
            />
          </div>
        </div>

        {/* Right Column: Zone Selector, Quick Actions, and Live Optimization (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F8FAFC]">
              Active Hazard Sectors ({filteredDisasters.length})
            </h2>
            <button
              onClick={() => handleOptimize()}
              disabled={optimizing}
              className="px-4 py-2.5 cyber-btn-cyan rounded-xl text-xs font-mono font-extrabold flex items-center space-x-1.5 transition"
            >
              {optimizing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#030712]/30 border-t-[#030712] rounded-full animate-spin"></span>
                  <span>OPTIMIZING...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>OPTIMIZE RESPONSE</span>
                </>
              )}
            </button>
          </div>

          {/* Zones Compact Selector Cards */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredDisasters.map((zone) => {
              const isSelected = selectedZone?.id === zone.id || selectedZone?.code === zone.code;
              return (
                <div
                  key={zone.id || zone.code}
                  onClick={() => handleSelectZone(zone)}
                  className={`p-3.5 rounded-2xl transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'cyber-card border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.25)] ring-1 ring-[#00F0FF]/50'
                      : 'cyber-card-interactive'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="px-2 py-0.5 text-xs font-bold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 rounded-full shadow-[0_0_8px_rgba(0,240,255,0.2)]">
                        {zone.code}
                      </span>
                      <span className="text-xs font-bold text-[#94A3B8]">
                        {zone.country || 'Global'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight">{zone.name}</h3>
                    <div className="flex items-center space-x-3 text-xs text-[#94A3B8] font-mono">
                      <span>Type: <strong className="text-[#00F0FF]">{zone.type}</strong></span>
                      <span>Pop: <strong className="text-[#F8FAFC]">{(zone.affectedPopulation || 0).toLocaleString()}</strong></span>
                      <span>Risk: <strong className="text-[#FF2E54] font-mono">{zone.riskScore}/100</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalZone(zone);
                      }}
                      className="px-3 py-1.5 cyber-btn-purple rounded-xl text-xs font-mono font-bold flex items-center space-x-1 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>INSPECT</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Disaster-Specific Telemetry Snippet for Selected Zone */}
          {selectedZone && (
            <div className="p-3.5 cyber-card border border-white/10 rounded-2xl space-y-2 text-xs shadow-xl relative font-mono">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-[#00F0FF] font-mono flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
                  <span>{selectedZone.type} Sensor Telemetry</span>
                </span>
                <span className="text-[10px] text-[#F59E0B] font-mono font-bold bg-[#F59E0B]/15 px-2 py-0.5 rounded-lg border border-[#F59E0B]/30">
                  {selectedZone.sensorMode || activeSensorMode}
                </span>
              </div>

              {selectedZone.type === 'Flood' && (
                <p className="text-[#94A3B8]">
                  Water Inundation: <strong className="text-white">{selectedZone.waterCoverageBeforeKm2 || 3.2} km²</strong> → <strong className="text-[#00F0FF]">{selectedZone.waterCoverageAfterKm2 || 11.7} km²</strong> (<span className="text-[#FF2E54] font-bold">+{selectedZone.waterExpansionPercent || 266}%</span>)
                </p>
              )}
              {selectedZone.type === 'Landslide' && (
                <p className="text-[#94A3B8]">
                  Slope Risk: <strong className="text-[#F59E0B]">{selectedZone.environmentalData?.slopeDegrees || 42}° Incline</strong> • Soil Saturation: <strong className="text-[#FF2E54]">{selectedZone.environmentalData?.soilSaturationPercent || 98}%</strong>
                </p>
              )}
              {selectedZone.type === 'Cyclone' && (
                <p className="text-[#94A3B8]">
                  Wind Velocity: <strong className="text-[#FF2E54]">{selectedZone.environmentalData?.windSpeedKmph || 145} km/h</strong> • Storm Surge: <strong className="text-[#00F0FF]">{selectedZone.affectedAreaKm2 || 14.5} km² Surge Zone</strong>
                </p>
              )}
              {selectedZone.type === 'Wildfire' && (
                <p className="text-[#94A3B8]">
                  Thermal Core: <strong className="text-[#FF2E54]">{selectedZone.environmentalData?.temperatureC || 38}°C</strong> • Perimeter: <strong className="text-[#F59E0B]">{selectedZone.affectedAreaKm2 || 18.2} km² Burn Zone</strong>
                </p>
              )}

              <button
                onClick={() => navigate('/satellite')}
                className="w-full py-2 cyber-pill text-[#00F0FF] hover:text-white rounded-xl text-xs font-mono font-bold border border-white/10 flex items-center justify-center space-x-1.5 transition"
              >
                <span>VIEW EARTH OBSERVATION INTEL</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Optimization Results Manifest & Explainable AI */}
      {optimizationResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Explainable AI Panel with Interactive Zone Navigation */}
          <ExplainableAIPanel
            explanation={optimizationResult.explanation}
            priorityZones={optimizationResult.priorityZones}
            currentZone={selectedZone}
            onSelectZone={(z) => handleSelectZone(z)}
          />

          {/* Allocation Manifest & Shortage Warnings */}
          <OptimizationResultCard
            optimizationResult={optimizationResult}
            onPlanDeployed={() => navigate('/plans')}
          />
        </div>
      )}

      {/* Modal for Deep Zone Inspection & Gemini Run */}
      {modalZone && (
        <DisasterDetailModal
          zone={modalZone}
          allDisasters={disasters}
          allFacilities={facilities}
          onClose={() => setModalZone(null)}
          onOptimize={(z) => handleOptimize(z)}
          onViewSatellite={() => {
            setModalZone(null);
            navigate('/satellite');
          }}
        />
      )}
    </div>
  );
}
