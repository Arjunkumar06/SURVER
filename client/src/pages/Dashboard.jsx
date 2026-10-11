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
  Award,
  RefreshCw
} from 'lucide-react';
import { 
  fetchDisasters, 
  fetchResources, 
  optimizeResources, 
  fetchResponsePlans,
  fetchAnalytics,
  fetchSensors,
  fetchLiveSync
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

  const [isLiveSyncing, setIsLiveSyncing] = useState(false);
  const selectedZoneRef = useRef(selectedZone);
  selectedZoneRef.current = selectedZone;

  const handleManualSync = async () => {
    setIsLiveSyncing(true);
    try {
      await fetchLiveSync();
      await loadInitialData();
    } catch (err) {
      console.error('Manual live sync error:', err);
    } finally {
      setIsLiveSyncing(false);
    }
  };

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
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans bg-slate-50 text-slate-900">
      {/* Master Flash Flood & Landslide Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl">
            <ShieldAlert className="w-6 h-6 animate-pulse-slow text-red-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-base sm:text-lg font-mono font-extrabold text-slate-900 tracking-wider uppercase">
                FLASH FLOOD & LANDSLIDE RISK COMMAND CENTER
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-full font-mono font-bold">
                NDRF NATIONAL INCIDENT COMMAND
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Multi-Source Data Fusion Engine: Rainfall + Soil Moisture + Slope Stability + Historical Events + Real-Time IoT Sensors
            </p>
          </div>
        </div>

        {/* Real-time Status Badge & Sync Control */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <div className="flex items-center space-x-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[11px] font-mono font-bold text-emerald-700">
                LIVE REAL-TIME STREAM
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              LAST SYNC: <strong className="text-blue-600">{lastUpdatedTime}</strong>
            </span>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isLiveSyncing}
            className="flex items-center space-x-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-mono font-bold transition shadow-xs disabled:opacity-60 cursor-pointer"
            title="Fetch real-time weather and sensor data immediately"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLiveSyncing ? 'SYNCING...' : 'SYNC LIVE'}</span>
          </button>
        </div>
      </div>

      {/* Live Atmospheric & Satellite Telemetry HUD */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-3.5 sm:p-4 border border-blue-900/60 shadow-md font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wider text-cyan-300 uppercase">
                ATMOSPHERIC & SATELLITE LIVE TELEMETRY
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-cyan-400/30 text-[9.5px] font-bold">
                OPEN-METEO GFS + SENTINEL-1 SAR
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Sector: <strong className="text-white">{selectedZone?.name || 'Target Sector'}</strong> • 
              Temp: <strong className="text-cyan-300 ml-1">{selectedZone?.environmentalData?.temperatureC ?? 14}°C</strong> • 
              Rainfall: <strong className="text-blue-400 ml-1">{activeRainfall} mm/h</strong> • 
              Soil Saturation: <strong className="text-emerald-400 ml-1">{activeSoilMoisture}%</strong> • 
              Wind: <strong className="text-amber-300 ml-1">{selectedZone?.environmentalData?.windSpeedKmph ?? 25} km/h</strong> • 
              Pass Date: <strong className="text-slate-200 ml-1">{selectedZone?.satelliteObservationDate || new Date().toISOString().split('T')[0]}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 text-[10.5px] text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Real-time polling active (every 3s)</span>
        </div>
      </div>

      {/* 8-Card Risk & Telemetry KPI Dashboard Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono">
        {/* 1. Flash Flood Risk */}
        <div className="p-3.5 bg-red-50/80 border border-red-200 rounded-2xl space-y-1">
          <div className="text-[9.5px] font-bold text-red-700 uppercase">FLASH FLOOD RISK</div>
          <div className="text-lg font-extrabold text-red-800">CRITICAL</div>
          <div className="text-[9px] text-red-600">Score 94/100</div>
        </div>

        {/* 2. Landslide Risk */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1">
          <div className="text-[9.5px] font-bold text-amber-800 uppercase">LANDSLIDE RISK</div>
          <div className="text-lg font-extrabold text-amber-900">HIGH</div>
          <div className="text-[9px] text-amber-700">38° Incline</div>
        </div>

        {/* 3. Rainfall */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <div className="text-[9.5px] font-bold text-slate-500 uppercase flex items-center space-x-1">
            <CloudRain className="w-3 h-3 text-blue-600" />
            <span>RAINFALL</span>
          </div>
          <div className="text-lg font-extrabold text-blue-700">{activeRainfall} <span className="text-xs font-normal text-slate-500">mm/h</span></div>
          <div className="text-[9px] text-blue-600">Threshold: 60</div>
        </div>

        {/* 4. Soil Moisture */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <div className="text-[9.5px] font-bold text-slate-500 uppercase flex items-center space-x-1">
            <Droplet className="w-3 h-3 text-blue-600" />
            <span>SOIL MOISTURE</span>
          </div>
          <div className="text-lg font-extrabold text-slate-900">{activeSoilMoisture}%</div>
          <div className="text-[9px] text-red-600 font-bold">Saturation High</div>
        </div>

        {/* 5. Slope Stability */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <div className="text-[9.5px] font-bold text-slate-500 uppercase flex items-center space-x-1">
            <Mountain className="w-3 h-3 text-amber-600" />
            <span>SLOPE STABILITY</span>
          </div>
          <div className="text-lg font-extrabold text-amber-700">{activeSlopeStability}</div>
          <div className="text-[9px] text-amber-800">{activeSlopeAngle}° Incline</div>
        </div>

        {/* 6. Time to Impact */}
        <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-1">
          <div className="text-[9.5px] font-bold text-blue-800 uppercase flex items-center space-x-1">
            <Clock className="w-3 h-3 text-blue-600 animate-pulse" />
            <span>LEAD TIME</span>
          </div>
          <div className="text-lg font-extrabold text-blue-800">{activeLeadTime} MIN</div>
          <div className="text-[9px] text-blue-700">Evacuation Ready</div>
        </div>

        {/* 7. Villages at Risk */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <div className="text-[9.5px] font-bold text-slate-500 uppercase">VILLAGES AT RISK</div>
          <div className="text-lg font-extrabold text-slate-900">{disasters.length}</div>
          <div className="text-[9px] text-slate-500">Hilly Wards</div>
        </div>

        {/* 8. People at Risk */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <div className="text-[9.5px] font-bold text-slate-500 uppercase">PEOPLE AT RISK</div>
          <div className="text-lg font-extrabold text-purple-700">{stats.peopleAtRisk.toLocaleString()}</div>
          <div className="text-[9px] text-purple-600 font-bold">In Danger Zones</div>
        </div>
      </div>

      {/* Sensor Mode & Region Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs font-mono">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider shrink-0 flex items-center space-x-1 mr-1">
            <Radio className="w-3.5 h-3.5 text-blue-600" />
            <span>Multi-Source Layer:</span>
          </span>
          {SENSOR_MODES.map((sm) => (
            <button
              key={sm.id}
              onClick={() => handleSensorModeChange(sm.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition shrink-0 ${
                activeSensorMode === sm.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title={`Source: ${sm.source}`}
            >
              {sm.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 border-t lg:border-t-0 border-slate-200 pt-2 lg:pt-0">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider shrink-0 flex items-center space-x-1 mr-1">
            <Filter className="w-3 h-3 text-blue-600" />
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
                  ? 'bg-blue-50 text-blue-700 border border-blue-300 font-extrabold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Hyper-Local GIS Early Warning Map
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500">Target Village:</span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {selectedZone?.code || 'ZONE'}
              </span>
              <span className="text-slate-600 font-bold">({selectedZone?.village || selectedZone?.name})</span>
            </div>
          </div>

          <div className="h-[520px] w-full relative z-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Hilly Village Risk Sectors ({filteredDisasters.length})
            </h2>
            <button
              onClick={() => handleOptimize()}
              disabled={optimizing}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition shadow-xs"
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
                      ? 'bg-blue-50/70 border-2 border-blue-500 shadow-sm'
                      : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">
                        {zone.code}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {zone.state || zone.district || zone.country}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{zone.village || zone.name}</h3>
                    <div className="flex items-center space-x-3 text-xs text-slate-600">
                      <span>Lead Time: <strong className="text-blue-700">{zone.leadTimeMinutes || 28}m</strong></span>
                      <span>Rainfall: <strong className="text-slate-900">{zone.environmentalData?.rainfallMm || 95}mm/h</strong></span>
                      <span>Risk: <strong className="text-red-600">{zone.riskScore}/100</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalZone(zone);
                      }}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition shadow-2xs"
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
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2.5 text-xs shadow-xs relative">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-blue-700 flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  <span>{selectedZone.village || selectedZone.name} Data Fusion</span>
                </span>
                <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  {selectedZone.warningLevel || 'CRITICAL'} WARNING
                </span>
              </div>

              <div className="text-slate-600 space-y-1.5">
                <div>Rainfall: <strong className="text-blue-700">{selectedZone.environmentalData?.rainfallMm || 112.5} mm/hr</strong> • Saturation: <strong className="text-red-600">{selectedZone.environmentalData?.soilSaturationPercent || 89}%</strong></div>
                <div>Slope: <strong className="text-amber-800">{selectedZone.slopeAngleDegrees || 38}° ({selectedZone.slopeStabilityIndex || 0.42} Stability Index)</strong></div>
                <div>Safe Shelter: <strong className="text-emerald-700">{selectedZone.safeShelter?.name || 'Joshimath Refuge Dome'} ({selectedZone.safeShelter?.distanceKm || 2.4} km)</strong></div>
              </div>

              <button
                onClick={() => navigate('/warnings')}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition"
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

