import React, { useState, useEffect, useMemo } from 'react';
import { 
  Satellite, 
  Layers, 
  Activity, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Eye, 
  Sliders, 
  AlertTriangle,
  ArrowRight,
  Maximize2,
  Globe,
  MapPin,
  Flame,
  Wind,
  Mountain,
  Droplet,
  Compass
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { fetchDisasters, fetchSatelliteData, analyzeEmergencyAI } from '../services/api';
import { getSatelliteDataByZone } from '../data/satelliteData';
import { createDisasterIcon } from '../components/CommandMap';

// Map controller to smoothly center map on selected zone
function MapCenterController({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lng !== undefined && map) {
      map.setView([lat, lng], 10, { animate: true });
      const timer = setTimeout(() => map.invalidateSize(), 150);
      return () => clearTimeout(timer);
    }
  }, [lat, lng, map]);
  return null;
}

export default function SatelliteIntelligence() {
  const [disasters, setDisasters] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'before' | 'after' | 'difference'
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);

  // Load all disaster zones
  useEffect(() => {
    fetchDisasters()
      .then((zones) => {
        setDisasters(zones);
        if (zones.length > 0) {
          const initialId = zones[0].id || zones[0].code;
          setSelectedZoneId(initialId);
        }
      })
      .catch(console.error);
  }, []);

  // Find currently active zone
  const activeZone = useMemo(() => {
    return disasters.find(d => d.id === selectedZoneId || d.code === selectedZoneId) || disasters[0];
  }, [disasters, selectedZoneId]);

  // Compute zone-specific satellite intelligence data model
  const satelliteData = useMemo(() => {
    if (!activeZone) return null;
    return getSatelliteDataByZone(activeZone);
  }, [activeZone]);

  // Reset AI result when zone changes
  useEffect(() => {
    setAiResult(null);
    setAiError(null);
  }, [selectedZoneId]);

  const handleRunAI = async () => {
    if (!activeZone) return;
    setAnalyzingAI(true);
    setAiError(null);

    try {
      const payload = {
        id: activeZone.id,
        code: activeZone.code,
        name: activeZone.name,
        country: activeZone.country,
        region: activeZone.region,
        type: activeZone.type,
        severity: activeZone.severity,
        riskScore: activeZone.riskScore,
        affectedPopulation: activeZone.affectedPopulation,
        affectedAreaKm2: activeZone.affectedAreaKm2,
        roadAccessibilityPercent: activeZone.roadAccessibilityPercent,
        waterExpansionPercent: activeZone.waterExpansionPercent,
        environmentalData: activeZone.environmentalData,
        satelliteData: satelliteData?.satellite
      };
      const res = await analyzeEmergencyAI(payload);
      setAiResult(res);
    } catch (err) {
      setAiError(err.message || 'AI analysis failed');
    } finally {
      setAnalyzingAI(false);
    }
  };

  if (!activeZone || !satelliteData) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-slate-400 text-xs text-center">
        Loading Earth Observation data...
      </div>
    );
  }

  const { disasterType, country, region, satellite, imagery, analysis, environmentalData } = satelliteData;
  const isFlood = disasterType.toLowerCase().includes('flood');
  const isLandslide = disasterType.toLowerCase().includes('landslide');
  const isCyclone = disasterType.toLowerCase().includes('cyclone');
  const isWildfire = disasterType.toLowerCase().includes('wildfire');

  const DisasterIcon = isWildfire ? Flame : (isCyclone ? Wind : (isLandslide ? Mountain : Droplet));

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Sector Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg sm:text-xl font-mono font-extrabold text-[#F8FAFC] tracking-wider uppercase">
              Earth Observation & Multi-Zone Satellite Intelligence
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 rounded">
              Copernicus Satellite Pipeline
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            Synthetic Aperture Radar (SAR), optical, and thermal anomaly change detection for real-time disaster footprints
          </p>
        </div>

        {/* Selected Sector Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-mono font-bold text-[#94A3B8] shrink-0">SELECTED SECTOR:</label>
          <select
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="cyber-card border border-white/10 text-[#00F0FF] font-mono font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#00F0FF] max-w-xs truncate shadow-lg"
          >
            {disasters.map((z) => (
              <option key={z.id || z.code} value={z.id || z.code} className="bg-[#030712] text-[#F8FAFC]">
                {z.code} — {z.name} ({z.country || 'Global'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Zone Title & Provenance Notice Banner */}
      <div className="p-4 cyber-card rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xl relative border border-white/10">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] rounded-xl shrink-0 mt-0.5 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <DisasterIcon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 rounded-lg shadow">
                {activeZone.code}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {activeZone.name}
              </h2>
              <span className="text-xs font-mono text-[#94A3B8]">
                ({country} • {region})
              </span>
              <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                activeZone.severity === 'Critical' ? 'bg-[#FF2E54]/20 text-[#FF2E54] border border-[#FF2E54]/50 shadow-[0_0_10px_rgba(255,46,84,0.3)]' :
                'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
              }`}>
                {activeZone.severity} ({activeZone.riskScore}/100)
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono">
              {satellite.statusBannerText} • Telemetry Source: <strong className="text-[#F8FAFC]">{environmentalData?.sensorSource}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto text-[11px] font-mono text-[#94A3B8] shrink-0 border-t md:border-t-0 border-white/10 pt-2 md:pt-0">
          <span>Mission: <strong className="text-[#00F0FF] font-bold">{satellite.primary}</strong></span>
          <span className="text-[#10B981] font-semibold">{satellite.cloudPenetration}</span>
        </div>
      </div>

      {/* Satellite Imagery View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 cyber-card rounded-2xl border border-white/10">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider flex items-center space-x-1.5">
            <Satellite className="w-4 h-4 text-[#00F0FF]" />
            <span>{satellite.mode}</span>
          </span>
          <span className="text-xs text-[#94A3B8] font-mono hidden sm:inline">
            • {satelliteData.observationDate}
          </span>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { mode: 'split', label: 'Side-by-Side Split' },
            { mode: 'before', label: 'T-0 Baseline' },
            { mode: 'after', label: 'T+6H Detection' },
            { mode: 'difference', label: 'Δ Change Heatmap' }
          ].map((item) => (
            <button
              key={item.mode}
              onClick={() => setViewMode(item.mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition shrink-0 ${
                viewMode === item.mode
                  ? 'cyber-pill-active'
                  : 'cyber-pill text-[#94A3B8] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Satellite Imagery Display Area */}
      <div className="cyber-card rounded-2xl p-5 space-y-5 shadow-2xl relative border border-white/10">
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Before Tile */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#94A3B8] uppercase tracking-wider flex items-center space-x-1">
                  <span>Pre-Disaster Baseline (T-0)</span>
                </span>
                <span className="text-[#94A3B8]">Area: {analysis.baselineAreaKm2} km²</span>
              </div>
              <div className="h-72 sm:h-80 rounded-2xl overflow-hidden border border-white/10 relative bg-[#030712] shadow-2xl">
                <img
                  key={`before-${activeZone.id || activeZone.code}`}
                  src={imagery.before}
                  alt={`Pre-Disaster Satellite Baseline for ${activeZone.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* After Tile */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#FF2E54] uppercase tracking-wider flex items-center space-x-1">
                  <span>Post-Event Detection (T+6H Observation)</span>
                </span>
                <span className="text-[#00F0FF] font-bold">
                  Impact: {analysis.currentAreaKm2} km² ({isFlood || isCyclone ? `+${analysis.expansionPercentage}%` : 'Critical Perimeter'})
                </span>
              </div>
              <div className="h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#FF2E54]/50 relative bg-[#030712] shadow-[0_0_25px_rgba(255,46,84,0.25)]">
                <img
                  key={`after-${activeZone.id || activeZone.code}`}
                  src={imagery.after}
                  alt={`Post-Disaster Satellite Observation for ${activeZone.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'before' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#94A3B8] uppercase tracking-wider">
                Full-Frame Pre-Disaster Baseline (T-0 Observation)
              </span>
              <span className="text-[#94A3B8]">Baseline Extent: {analysis.baselineAreaKm2} km²</span>
            </div>
            <div className="h-96 rounded-2xl overflow-hidden border border-white/10 relative bg-[#030712] shadow-2xl">
              <img
                key={`before-full-${activeZone.id || activeZone.code}`}
                src={imagery.before}
                alt="Baseline Full"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {viewMode === 'after' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#FF2E54] uppercase tracking-wider">
                Full-Frame Peak Event Detection (T+6H)
              </span>
              <span className="text-[#FF2E54] font-bold">
                Impact Footprint: {analysis.currentAreaKm2} km²
              </span>
            </div>
            <div className="h-96 rounded-2xl overflow-hidden border border-[#FF2E54]/50 relative bg-[#030712] shadow-[0_0_30px_rgba(255,46,84,0.3)]">
              <img
                key={`after-full-${activeZone.id || activeZone.code}`}
                src={imagery.after}
                alt="Peak Event Full"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {viewMode === 'difference' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#F59E0B] uppercase tracking-wider">
                {satellite.diffTitle}
              </span>
              <span className="text-[#F59E0B] font-bold">
                {satellite.diffMetricLabel}: {satellite.diffMetricValue}
              </span>
            </div>
            <div className="h-96 rounded-2xl overflow-hidden border border-[#F59E0B]/50 relative bg-[#030712] shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <img
                key={`diff-full-${activeZone.id || activeZone.code}`}
                src={imagery.difference}
                alt="Difference Heatmap Full"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Change Metrics Matrix Row (Dynamic 4-Card Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
          <div className="p-3.5 cyber-card-interactive rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-[#94A3B8]">{analysis.primaryMetricLabel}</span>
            <div className="text-lg font-bold text-white font-mono">
              {analysis.primaryMetricValue}
            </div>
            <p className="text-[10px] font-mono text-[#94A3B8]">{country} Baseline</p>
          </div>

          <div className="p-3.5 cyber-card-interactive rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-[#94A3B8]">{analysis.secondaryMetricLabel}</span>
            <div className="text-lg font-bold text-[#00F0FF] font-mono">
              {analysis.secondaryMetricValue}
            </div>
            <p className="text-[10px] font-mono text-[#00F0FF]">Current Disaster Footprint</p>
          </div>

          <div className="p-3.5 cyber-card-interactive border-[#FF2E54]/40 rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-[#FF2E54]">{analysis.impactMetricLabel}</span>
            <div className="text-lg font-bold text-[#FF2E54] font-mono">
              {analysis.impactMetricValue}
            </div>
            <p className="text-[10px] font-mono text-[#FF2E54] font-bold">▲ HIGH PRIORITY</p>
          </div>

          <div className="p-3.5 cyber-card-interactive rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-[#94A3B8]">{analysis.deltaMetricLabel}</span>
            <div className="text-lg font-bold text-[#F59E0B] font-mono">
              {analysis.deltaMetricValue}
            </div>
            <p className="text-[10px] font-mono text-[#94A3B8]">Spectral Anomaly Shift</p>
          </div>
        </div>

        {/* Telemetry and Damage Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Orbital Parameters */}
          <div className="p-4 cyber-card-interactive rounded-xl space-y-2 text-xs font-mono">
            <span className="font-bold text-[#F8FAFC] uppercase tracking-wider block border-b border-white/10 pb-1.5">
              Copernicus Satellite Orbital Parameters
            </span>
            <div className="space-y-1.5 text-[#94A3B8] text-[11px]">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Mission:</span>
                <span className="font-bold text-white">{satellite.primary}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Sensor Mode:</span>
                <span className="text-[#00F0FF]">{satellite.mode}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Polarization / Band:</span>
                <span className="text-[#F8FAFC]">{satellite.polarization}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Observation Date:</span>
                <span className="text-[#F8FAFC]">{satelliteData.observationDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Spatial Resolution:</span>
                <span className="text-[#10B981] font-bold">{satellite.resolutionMeters} meters GSD</span>
              </div>
            </div>
          </div>

          {/* Infrastructure Damage Assessment */}
          <div className="p-4 cyber-card-interactive rounded-xl space-y-2 text-xs font-mono">
            <span className="font-bold text-[#F8FAFC] uppercase tracking-wider block border-b border-white/10 pb-1.5">
              Sector Damage & Threat Indicators
            </span>
            <ul className="space-y-2 text-[#94A3B8] text-[11px]">
              {analysis.damageFlags?.map((flag, idx) => (
                <li key={idx} className="flex items-start space-x-2 bg-[#FF2E54]/15 p-2 rounded-lg border border-[#FF2E54]/30">
                  <span className="text-[#FF2E54] font-bold">⚠</span>
                  <span className="text-[#FF2E54] font-semibold">{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mini Geographic Sector Map & Gemini AI Analysis Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Geographic Location Map (6 cols) */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Sector GIS Center: {activeZone.name}</span>
            </span>
            <span className="text-[#00F0FF] font-bold">
              {activeZone.location?.lat?.toFixed(4)}°, {activeZone.location?.lng?.toFixed(4)}°
            </span>
          </div>

          <div className="h-64 rounded-2xl overflow-hidden border border-white/10 relative z-0 isolate shadow-2xl">
            <MapContainer
              key={`map-${activeZone.id || activeZone.code}`}
              center={[activeZone.location?.lat || 27.7172, activeZone.location?.lng || 85.3240]}
              zoom={10}
              minZoom={2}
              maxZoom={18}
              worldCopyJump={true}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapCenterController lat={activeZone.location?.lat} lng={activeZone.location?.lng} />
              
              <Circle
                center={[activeZone.location?.lat, activeZone.location?.lng]}
                radius={(activeZone.affectedAreaKm2 || 8) * 220}
                pathOptions={{
                  color: activeZone.severity === 'Critical' ? '#FF2E54' : '#F59E0B',
                  fillColor: activeZone.severity === 'Critical' ? '#FF2E54' : '#F59E0B',
                  fillOpacity: 0.25,
                  weight: 2
                }}
              />
              <Marker
                position={[activeZone.location?.lat, activeZone.location?.lng]}
                icon={createDisasterIcon(activeZone.severity, activeZone.code, true)}
              >
                <Popup>
                  <div className="text-xs text-[#F8FAFC] space-y-1 font-mono">
                    <strong className="text-[#00F0FF]">{activeZone.code} — {activeZone.name}</strong>
                    <p>{country} • {activeZone.type}</p>
                    <p className="text-[#FF2E54] font-bold">Risk: {activeZone.riskScore}/100</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Right Column: Gemini AI Telemetry Assessment (6 cols) */}
        <div className="lg:col-span-6 p-5 cyber-card rounded-2xl space-y-4 shadow-2xl border border-[#A855F7]/40 flex flex-col justify-between relative">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#A855F7]" />
                <h3 className="text-xs font-mono font-extrabold text-[#F8FAFC] tracking-wider uppercase">
                  Gemini AI Assessment: {activeZone.code}
                </h3>
              </div>
              <button
                onClick={handleRunAI}
                disabled={analyzingAI}
                className="px-3.5 py-1.5 cyber-btn-purple text-white rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition"
              >
                {analyzingAI ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Analyzing {activeZone.code}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{aiResult ? 'Re-Evaluate' : 'Analyze With Gemini AI'}</span>
                  </>
                )}
              </button>
            </div>

            {aiError && (
              <div className="p-3 bg-[#FF2E54]/20 border border-[#FF2E54]/40 rounded-xl text-xs text-[#FF2E54] font-mono">
                {aiError}
              </div>
            )}

            {aiResult ? (
              <div className="space-y-3 pt-1 text-xs font-mono">
                <div className="flex items-center justify-between bg-[#030712]/60 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[#A855F7] font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>AI Urgency:</span>
                    <strong className="text-[#FF2E54] uppercase">{aiResult.urgency}</strong>
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono">
                    Model: {aiResult.aiModelUsed || 'Gemini 1.5 Flash'}
                  </span>
                </div>

                <div className="space-y-2 cyber-card p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                    AI Satellite & Environmental Reasoning:
                  </span>
                  <ul className="space-y-1.5 text-[#F8FAFC]">
                    {aiResult.reasoning?.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-[#00F0FF] font-bold">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-4 cyber-card rounded-xl border border-white/10 text-xs text-[#94A3B8] leading-relaxed font-mono">
                Click <strong>Analyze With Gemini AI</strong> to evaluate current satellite radar, thermal, and environmental indicators for <strong>{activeZone.name} ({country})</strong>.
              </div>
            )}
          </div>

          <div className="text-[11px] font-mono text-[#94A3B8] pt-2 border-t border-white/10 flex items-center justify-between">
            <span>Target: {activeZone.code} • {country}</span>
            <span className="font-mono text-[#00F0FF] font-bold">SURVER AI Pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
