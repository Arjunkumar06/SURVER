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
  Sliders,
  Cpu,
  CloudRain,
  Mountain,
  Droplet,
  Compass,
  Award
} from 'lucide-react';
import { 
  fetchDisasters, 
  fetchResources, 
  optimizeResources, 
  fetchResponsePlans,
  fetchAnalytics,
  fetchSensors
} from '../services/api';
import CommandMap from '../components/CommandMap';
import DisasterDetailModal from '../components/DisasterDetailModal';
import ExplainableAIPanel from '../components/ExplainableAIPanel';
import OptimizationResultCard from '../components/OptimizationResultCard';

const SENSOR_MODES = [
  { id: 'All Sensor Modes', label: 'All Modes', source: 'All Observation Telemetry' },
  { id: 'Real-Time Multi-Source IoT Fusion', label: 'IoT Data Fusion', source: 'Rain, Soil, Slope & IoT Sensors' },
  { id: 'Real-Time Satellite Mode', label: 'Satellite Mode', source: 'Copernicus Sentinel-1/2 SAR' },
  { id: 'Environmental Sensor Mode', label: 'Environmental Sensor', source: 'Geotechnical Soil & Inclinometer Array' },
  { id: 'IoT Water-Level Sensor Mode', label: 'IoT Water-Level', source: 'Ultrasonic & Hydrostatic River Telemetry' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [sensors, setSensors] = useState([]);
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
    responseEfficiency: 94
  });

  const selectedZoneRef = useRef(selectedZone);
  selectedZoneRef.current = selectedZone;

  // Initial load
  const loadInitialData = async () => {
    try {
      const [disasterList, resourceData, analyticsData, sensorData] = await Promise.all([
        fetchDisasters(),
        fetchResources(),
        fetchAnalytics().catch(() => null),
        fetchSensors().catch(() => [])
      ]);

      setDisasters(disasterList);
      setFacilities(resourceData.facilities || []);
      setSensors(sensorData || []);

      if (disasterList.length > 0 && !selectedZoneRef.current) {
        setSelectedZone(disasterList[0]);
      }

      if (analyticsData) {
        setStats({
          activeEmergencies: analyticsData.activeEmergencies || disasterList.length,
          criticalZones: analyticsData.criticalZones || 4,
          peopleAtRisk: analyticsData.peopleAtRisk || 42600,
          totalResourcesAvailable: analyticsData.totalResourcesAvailable || 11200,
          responseEfficiency: analyticsData.responseEfficiency || 94
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
            responseEfficiency: analyticsData.responseEfficiency || 94
          });
        }
      } catch {
        // Silent catch for polling resilience
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const countries = ['All', ...new Set(disasters.map(d => d.state || d.country || d.location?.country).filter(Boolean))];

  const filteredDisasters = disasters.filter(d => {
    const matchesCountry = selectedCountry === 'All' || (d.state || d.country || d.location?.country) === selectedCountry;
    const matchesSensor = activeSensorMode === 'All Sensor Modes' || d.sensorMode === activeSensorMode || activeSensorMode === 'Real-Time Multi-Source IoT Fusion';
    return matchesCountry && matchesSensor;
  });

  const handleSensorModeChange = (modeId) => {
    setActiveSensorMode(modeId);
    const matching = disasters.filter(d => {
      const matchesCountry = selectedCountry === 'All' || (d.state || d.country || d.location?.country) === selectedCountry;
      const matchesSensor = modeId === 'All Sensor Modes' || d.sensorMode === modeId;
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

  // Selected Zone Telemetry
  const activeRainfall = selectedZone?.environmentalData?.rainfallMm || 112.5;
  const activeSoilMoisture = selectedZone?.environmentalData?.soilSaturationPercent || 89;
  const activeSlopeAngle = selectedZone?.slopeAngleDegrees || 38;
  const activeSlopeStability = selectedZone?.slopeStabilityIndex || 0.42;
  const activeLeadTime = selectedZone?.leadTimeMinutes || 28;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* SIH 2026 Master Flash Flood & Landslide Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cyber-card p-5 rounded-2xl border border-[#00F0FF]/40 shadow-[0_0_30px_rgba(0,240,255,0.15)] relative">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-[#00F0FF]/15 border border-[#00F0FF]/50 text-[#00F0FF] rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <ShieldAlert className="w-6 h-6 animate-pulse-slow text-[#00F0FF]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-base sm:text-lg font-mono font-extrabold text-[#F8FAFC] tracking-wider uppercase">
                FLASH FLOOD & LANDSLIDE RISK COMMAND CENTER
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/50 rounded-full font-mono font-bold">
                SIH 2026 PS-26192 (NDRF / MHA)
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono">
              Multi-Source Data Fusion Engine: Rainfall + Soil Moisture + Slope Stability + Historical Events + Real-Time IoT Sensors
            </p>
          </div>
        </div>

        {/* Real-time Status Badge */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <div className="flex items-center space-x-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
              <span className="text-[11px] font-mono font-bold text-[#10B981]">
                DATA FUSION ACTIVE
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#94A3B8]">
              LAST SYNC: <strong className="text-[#00F0FF]">{lastUpdatedTime}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* SIH 2026 8-Card Risk & Telemetry KPI Dashboard Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono">
        {/* 1. Flash Flood Risk */}
        <div className="p-3.5 cyber-card-interactive rounded-2xl border-[#FF2E54]/50 bg-[#FF2E54]/10 space-y-1">
          <div className="text-[9.5px] font-bold text-[#FF2E54] uppercase">FLASH FLOOD RISK</div>
          <div className="text-lg font-extrabold text-[#FF2E54]">CRITICAL</div>
          <div className="text-[9px] text-[#94A3B8]">Score 94/100</div>
        </div>

        {/* 2. Landslide Risk */}
        <div className="p-3.5 cyber-card-interactive rounded-2xl border-[#F59E0B]/50 bg-[#F59E0B]/10 space-y-1">
          <div className="text-[9.5px] font-bold text-[#F59E0B] uppercase">LANDSLIDE RISK</div>
          <div className="text-lg font-extrabold text-[#F59E0B]">HIGH</div>
          <div className="text-[9px] text-[#94A3B8]">38° Incline</div>
        </div>

        {/* 3. Rainfall */}
        <div className="p-3.5 cyber-card-interactive rounded-2xl border-white/10 space-y-1">
          <div className="text-[9.5px] font-bold text-[#94A3B8] uppercase flex items-center space-x-1">
            <CloudRain className="w-3 h-3 text-[#00F0FF]" />
            <span>RAINFALL</span>
          </div>
          <div className="text-lg font-extrabold text-[#00F0FF]">{activeRainfall} <span className="text-xs font-normal">mm/h</span></div>
          <div className="text-[9px] text-[#00F0FF]">Threshold: 60</div>
        </div>

        {/* 4. Soil Moisture */}
        <div className="p-3.5 cyber-card-interactive rounded-2xl border-white/10 space-y-1">
          <div className="text-[9.5px] font-bold text-[#94A3B8] uppercase flex items-center space-x-1">
            <Droplet className="w-3 h-3 text-[#00F0FF]" />
            <span>SOIL MOISTURE</span>
          </div>
          <div className="text-lg font-extrabold text-[#F8FAFC]">{activeSoilMoisture}%</div>
          <div className="text-[9px] text-[#FF2E54]">Saturation High</div>
        </div>

        {/* 5. Slope Stability */}
        <div className="p-3.5 cyber-card-interactive rounded-2xl border-white/10 space-y-1">
          <div className="text-[9.5px] font-bold text-[#94A3B8] uppercase flex items-center space-x-1">
            <Mountain className="w-3 h-3 text-[#F59E0B]" />
            <span>SLOPE STABILITY</span>
          </div>
          <div className="text-lg font-extrabold text-[#F59E0B]">{activeSlopeStability}</div>
          <div className="text-[9px] text-[#F59E0B]">{activeSlopeAngle}° Incline</div>
        </div>

        {/* 6. Time to Impact */}
        <div className="p-3.5 cyber-card-interactive rounded-2xl border-[#00F0FF]/50 bg-[#00F0FF]/10 space-y-1">
          <div className="text-[9.5px] font-bold text-[#00F0FF] uppercase flex items-center space-x-1">
            <Clock className="w-3 h-3 text-[#00F0FF] animate-pulse" />
            <span>LEAD TIME</span>
          </div>
          <div className="text-lg font-extrabold text-[#00F0FF]">{activeLeadTime} MIN</div>
          <div className="text-[9px] text-[#00F0FF]">Evacuation Ready</div>
        </div>

        {/* 7. Villages at Risk */}
        <div className="p-3.5 cyber-card-interactive rounded-2xl border-white/10 space-y-1">
          <div className="text-[9.5px] font-bold text-[#94A3B8] uppercase">VILLAGES AT RISK</div>
          <div className="text-lg font-extrabold text-[#F8FAFC]">{disasters.length}</div>
          <div className="text-[9px] text-[#94A3B8]">Hilly State Wards</div>
        </div>

        {/* 8. People at Risk */}
        <div className="p-3.5 cyber-card-interactive rounded-2xl border-white/10 space-y-1">
          <div className="text-[9.5px] font-bold text-[#94A3B8] uppercase">PEOPLE AT RISK</div>
          <div className="text-lg font-extrabold text-[#A855F7]">{stats.peopleAtRisk.toLocaleString()}</div>
          <div className="text-[9px] text-[#A855F7]">In Danger Zones</div>
        </div>
      </div>

      {/* Sensor Mode & Region Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3.5 cyber-card border border-white/10 rounded-2xl shadow-xl font-mono">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider shrink-0 flex items-center space-x-1 mr-1">
            <Radio className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Multi-Source Layer:</span>
          </span>
          {SENSOR_MODES.map((sm) => (
            <button
              key={sm.id}
              onClick={() => handleSensorModeChange(sm.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition shrink-0 ${
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

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 border-t lg:border-t-0 border-white/10 pt-2 lg:pt-0">
          <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider shrink-0 flex items-center space-x-1 mr-1">
            <Filter className="w-3 h-3 text-[#00F0FF]" />
            <span>State/Region:</span>
          </span>
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelectedCountry(c);
                const firstInCountry = disasters.find(d => c === 'All' || (d.state || d.country || d.location?.country) === c);
                if (firstInCountry) setSelectedZone(firstInCountry);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition shrink-0 ${
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

      {/* Main Command Center Grid: Map & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
        {/* Left Column: Interactive Hyper-Local GIS Map (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#00F0FF] animate-pulse"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                Hyper-Local GIS Early Warning Map
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#94A3B8]">Target Village:</span>
              <span className="font-bold text-[#00F0FF] bg-[#00F0FF]/15 px-2 py-0.5 rounded border border-[#00F0FF]/40">
                {selectedZone?.code || 'ZONE'}
              </span>
              <span className="text-[#94A3B8]">({selectedZone?.village || selectedZone?.name})</span>
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

        {/* Right Column: Village Selector, Quick Evacuation Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Hilly Village Risk Sectors ({filteredDisasters.length})
            </h2>
            <button
              onClick={() => handleOptimize()}
              disabled={optimizing}
              className="px-4 py-2.5 cyber-btn-cyan rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition"
            >
              {optimizing ? (
                <span>OPTIMIZING...</span>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>EVACUATE & DISPATCH</span>
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
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-xs font-bold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 rounded-full">
                        {zone.code}
                      </span>
                      <span className="text-xs font-bold text-[#94A3B8]">
                        {zone.state || zone.district || zone.country}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight">{zone.village || zone.name}</h3>
                    <div className="flex items-center space-x-3 text-xs text-[#94A3B8]">
                      <span>Lead Time: <strong className="text-[#00F0FF]">{zone.leadTimeMinutes || 28}m</strong></span>
                      <span>Rainfall: <strong className="text-[#F8FAFC]">{zone.environmentalData?.rainfallMm || 95}mm/h</strong></span>
                      <span>Risk: <strong className="text-[#FF2E54]">{zone.riskScore}/100</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalZone(zone);
                      }}
                      className="px-3 py-1.5 cyber-btn-purple rounded-xl text-xs font-bold flex items-center space-x-1 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>INSPECT</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Disaster-Specific Telemetry Snippet */}
          {selectedZone && (
            <div className="p-3.5 cyber-card border border-white/10 rounded-2xl space-y-2 text-xs shadow-xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-[#00F0FF] flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>{selectedZone.village || selectedZone.name} Data Fusion</span>
                </span>
                <span className="text-[10px] text-[#F59E0B] font-bold bg-[#F59E0B]/15 px-2 py-0.5 rounded-lg border border-[#F59E0B]/30">
                  {selectedZone.warningLevel || 'CRITICAL'} WARNING
                </span>
              </div>

              <div className="text-[#94A3B8] space-y-1">
                <div>Rainfall: <strong className="text-[#00F0FF]">{selectedZone.environmentalData?.rainfallMm || 112.5} mm/hr</strong> • Saturation: <strong className="text-[#FF2E54]">{selectedZone.environmentalData?.soilSaturationPercent || 89}%</strong></div>
                <div>Slope: <strong className="text-[#F59E0B]">{selectedZone.slopeAngleDegrees || 38}° ({selectedZone.slopeStabilityIndex || 0.42} Stability Index)</strong></div>
                <div>Safe Shelter: <strong className="text-[#10B981]">{selectedZone.safeShelter?.name || 'Joshimath Refuge Dome'} ({selectedZone.safeShelter?.distanceKm || 2.4} km)</strong></div>
              </div>

              <button
                onClick={() => navigate('/warnings')}
                className="w-full py-2 cyber-pill text-[#00F0FF] hover:text-white rounded-xl text-xs font-bold border border-white/10 flex items-center justify-center space-x-1.5 transition"
              >
                <span>OPEN EARLY WARNING DISPATCH PANEL</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Optimization Results Manifest & Explainable AI */}
      {optimizationResult && (
        <div className="space-y-6 animate-fade-in">
          <ExplainableAIPanel
            explanation={optimizationResult.explanation}
            priorityZones={optimizationResult.priorityZones}
            currentZone={selectedZone}
            onSelectZone={(z) => handleSelectZone(z)}
          />

          <OptimizationResultCard
            optimizationResult={optimizationResult}
            onPlanDeployed={() => navigate('/plans')}
          />
        </div>
      )}

      {/* Modal for Deep Zone Inspection */}
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
