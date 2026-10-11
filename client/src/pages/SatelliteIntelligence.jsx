import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Compass,
  ZoomIn,
  ZoomOut,
  Move
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { fetchDisasters, fetchSatelliteData, analyzeEmergencyAI } from '../services/api';
import { getSatelliteDataByZone } from '../data/satelliteData';
import { createDisasterIcon } from '../components/CommandMap';

// Map controller to smoothly center map on selected zone without overriding user zoom
function MapCenterController({ lat, lng }) {
  const map = useMap();
  const lastCoordsRef = useRef(null);

  useEffect(() => {
    if (lat !== undefined && lng !== undefined && map) {
      const coordKey = `${Number(lat).toFixed(4)},${Number(lng).toFixed(4)}`;
      if (lastCoordsRef.current !== coordKey) {
        lastCoordsRef.current = coordKey;
        const currentZoom = map.getZoom();
        const targetZoom = currentZoom && currentZoom > 10 ? currentZoom : 10;
        map.setView([lat, lng], targetZoom, { animate: true });
      }
      const timer = setTimeout(() => map.invalidateSize(), 150);
      return () => clearTimeout(timer);
    }
  }, [lat, lng, map]);
  return null;
}

// Interactive Vector SVG and RFC 2397 Base64 Satellite Image Viewer with Persistent Zoom & Pan
function SatelliteImageViewer({ rawSvg, src, alt, className = '' }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(Number((prev + 0.35).toFixed(2)), 3.5));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoom((prev) => {
      const next = Math.max(Number((prev - 0.35).toFixed(2)), 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = (e) => {
    e.stopPropagation();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const maxPan = (zoom - 1) * 240;
    const newX = Math.max(-maxPan, Math.min(maxPan, panStartRef.current.x + dx));
    const newY = Math.max(-maxPan, Math.min(maxPan, panStartRef.current.y + dy));
    setPan({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (!e.ctrlKey && !e.metaKey && Math.abs(e.deltaY) < 10) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.5));
    } else {
      setZoom((prev) => {
        const next = Math.max(Number((prev - 0.25).toFixed(2)), 1);
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-full overflow-hidden select-none ${
        zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
      } ${className}`}
    >
      {/* Zoom HUD Overlay Controls (Top Right) */}
      <div className="absolute top-2.5 right-2.5 z-20 flex items-center space-x-1 bg-slate-900/85 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-700/80 shadow-md">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In (+)"
          className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <span className="text-[10px] font-mono font-bold text-cyan-400 min-w-[36px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          title="Zoom Out (-)"
          className={`p-1 rounded-lg transition ${
            zoom <= 1 
              ? 'text-slate-600 cursor-not-allowed' 
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        {zoom > 1 && (
          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset Zoom (100%)"
            className="ml-1 px-1.5 py-0.5 rounded-md bg-slate-800 text-[9.5px] font-mono text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            1x
          </button>
        )}
      </div>

      {/* Panning Status Notice when zoomed in */}
      {zoom > 1 && (
        <div className="absolute bottom-2 left-2 z-20 pointer-events-none px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-xs text-[9px] font-mono text-slate-400 border border-slate-800 flex items-center space-x-1">
          <Move className="w-2.5 h-2.5 text-cyan-400" />
          <span>DRAG TO PAN</span>
        </div>
      )}

      {/* Scaled Image & Vector Canvas */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
        className="w-full h-full flex items-center justify-center pointer-events-none"
      >
        {rawSvg ? (
          <div
            className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover"
            dangerouslySetInnerHTML={{ __html: rawSvg }}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
}

export default function SatelliteIntelligence() {
  const [disasters, setDisasters] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'before' | 'after' | 'difference'
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);

  // Load all disaster zones with live periodic refresh
  useEffect(() => {
    const load = () => {
      fetchDisasters()
        .then((zones) => {
          setDisasters(zones);
          if (zones.length > 0 && !selectedZoneId) {
            const initialId = zones[0].id || zones[0].code;
            setSelectedZoneId(initialId);
          }
        })
        .catch(console.error);
    };

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [selectedZoneId]);

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
      <div className="p-6 max-w-7xl mx-auto text-slate-500 text-xs text-center font-mono">
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
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans bg-slate-50 text-slate-900">
      {/* Header & Sector Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg sm:text-xl font-mono font-extrabold text-slate-900 tracking-wider uppercase">
              Earth Observation & Multi-Zone Satellite Intelligence
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded">
              Copernicus Satellite Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Synthetic Aperture Radar (SAR), optical, and thermal anomaly change detection for real-time disaster footprints
          </p>
        </div>

        {/* Selected Sector Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-mono font-bold text-slate-600 shrink-0">SELECTED SECTOR:</label>
          <select
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="bg-white border border-slate-300 text-blue-700 font-mono font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 max-w-xs truncate shadow-xs"
          >
            {disasters.map((z) => (
              <option key={z.id || z.code} value={z.id || z.code} className="bg-white text-slate-900">
                {z.code} — {z.name} ({z.country || 'Global'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Zone Title & Provenance Notice Banner */}
      <div className="p-4 bg-white rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs relative border border-slate-200">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl shrink-0 mt-0.5">
            <DisasterIcon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold bg-blue-100 text-blue-800 rounded-lg">
                {activeZone.code}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                {activeZone.name}
              </h2>
              <span className="text-xs font-mono text-slate-500">
                ({country} • {region})
              </span>
              <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                activeZone.severity === 'Critical' ? 'bg-red-50 text-red-700 border border-red-200' :
                'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {activeZone.severity} ({activeZone.riskScore}/100)
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              {satellite.statusBannerText} • Telemetry Source: <strong className="text-slate-900">{environmentalData?.sensorSource}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto text-[11px] font-mono text-slate-500 shrink-0 border-t md:border-t-0 border-slate-200 pt-2 md:pt-0">
          <span>Mission: <strong className="text-blue-700 font-bold">{satellite.primary}</strong></span>
          <span className="text-emerald-700 font-semibold">{satellite.cloudPenetration}</span>
        </div>
      </div>

      {/* Satellite Imagery View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider flex items-center space-x-1.5">
            <Satellite className="w-4 h-4 text-blue-600" />
            <span>{satellite.mode}</span>
          </span>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
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
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Satellite Imagery Display Area */}
      <div className="bg-white rounded-2xl p-5 space-y-5 shadow-xs relative border border-slate-200">
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Before Tile */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                  <span>Pre-Disaster Baseline (T-0)</span>
                </span>
                <span className="text-slate-500">Area: {analysis.baselineAreaKm2} km²</span>
              </div>
              <div className="h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-300 relative bg-slate-900 shadow-inner">
                <SatelliteImageViewer
                  key={`before-${activeZone.id || activeZone.code}`}
                  rawSvg={imagery.beforeSvg}
                  src={imagery.before}
                  alt={`Pre-Disaster Satellite Baseline for ${activeZone.name}`}
                />
              </div>
            </div>

            {/* After Tile */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-red-600 uppercase tracking-wider flex items-center space-x-1">
                  <span>Post-Event Detection (T+6H Observation)</span>
                </span>
                <span className="text-blue-700 font-bold">
                  Impact: {analysis.currentAreaKm2} km² ({isFlood || isCyclone ? `+${analysis.expansionPercentage}%` : 'Critical Perimeter'})
                </span>
              </div>
              <div className="h-72 sm:h-80 rounded-2xl overflow-hidden border-2 border-red-500 relative bg-slate-900 shadow-md">
                <SatelliteImageViewer
                  key={`after-${activeZone.id || activeZone.code}`}
                  rawSvg={imagery.afterSvg}
                  src={imagery.after}
                  alt={`Post-Disaster Satellite Observation for ${activeZone.name}`}
                />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'before' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-700 uppercase tracking-wider">
                Full-Frame Pre-Disaster Baseline (T-0 Observation)
              </span>
              <span className="text-slate-500">Baseline Extent: {analysis.baselineAreaKm2} km²</span>
            </div>
            <div className="h-96 rounded-2xl overflow-hidden border border-slate-300 relative bg-slate-900 shadow-md">
              <SatelliteImageViewer
                key={`before-full-${activeZone.id || activeZone.code}`}
                rawSvg={imagery.beforeSvg}
                src={imagery.before}
                alt="Baseline Full"
              />
            </div>
          </div>
        )}

        {viewMode === 'after' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-red-600 uppercase tracking-wider">
                Full-Frame Peak Event Detection (T+6H)
              </span>
              <span className="text-red-700 font-bold">
                Impact Footprint: {analysis.currentAreaKm2} km²
              </span>
            </div>
            <div className="h-96 rounded-2xl overflow-hidden border-2 border-red-500 relative bg-slate-900 shadow-md">
              <SatelliteImageViewer
                key={`after-full-${activeZone.id || activeZone.code}`}
                rawSvg={imagery.afterSvg}
                src={imagery.after}
                alt="Peak Event Full"
              />
            </div>
          </div>
        )}

        {viewMode === 'difference' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-amber-700 uppercase tracking-wider">
                {satellite.diffTitle}
              </span>
              <span className="text-amber-800 font-bold">
                {satellite.diffMetricLabel}: {satellite.diffMetricValue}
              </span>
            </div>
            <div className="h-96 rounded-2xl overflow-hidden border-2 border-amber-500 relative bg-slate-900 shadow-md">
              <SatelliteImageViewer
                key={`diff-full-${activeZone.id || activeZone.code}`}
                rawSvg={imagery.differenceSvg}
                src={imagery.difference}
                alt="Difference Heatmap Full"
              />
            </div>
          </div>
        )}

        {/* Change Metrics Matrix Row (Dynamic 4-Card Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-slate-500">{analysis.primaryMetricLabel}</span>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {analysis.primaryMetricValue}
            </div>
            <p className="text-[10px] font-mono text-slate-500">{country} Baseline</p>
          </div>

          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-blue-700">{analysis.secondaryMetricLabel}</span>
            <div className="text-lg font-bold text-blue-800 font-mono">
              {analysis.secondaryMetricValue}
            </div>
            <p className="text-[10px] font-mono text-blue-700">Current Disaster Footprint</p>
          </div>

          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-red-700">{analysis.impactMetricLabel}</span>
            <div className="text-lg font-bold text-red-800 font-mono">
              {analysis.impactMetricValue}
            </div>
            <p className="text-[10px] font-mono text-red-700 font-bold">▲ HIGH PRIORITY</p>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-amber-800">{analysis.deltaMetricLabel}</span>
            <div className="text-lg font-bold text-amber-900 font-mono">
              {analysis.deltaMetricValue}
            </div>
            <p className="text-[10px] font-mono text-amber-700">Spectral Anomaly Shift</p>
          </div>
        </div>

        {/* Telemetry and Damage Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Orbital Parameters */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs font-mono">
            <span className="font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-200 pb-1.5">
              Copernicus Satellite Orbital Parameters
            </span>
            <div className="space-y-1.5 text-slate-600 text-[11px]">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>Mission:</span>
                <span className="font-bold text-slate-900">{satellite.primary}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>Sensor Mode:</span>
                <span className="text-blue-700 font-bold">{satellite.mode}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>Polarization / Band:</span>
                <span className="text-slate-800 font-semibold">{satellite.polarization}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>Observation Date:</span>
                <span className="text-slate-800">{satelliteData.observationDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Spatial Resolution:</span>
                <span className="text-emerald-700 font-bold">{satellite.resolutionMeters} meters GSD</span>
              </div>
            </div>
          </div>

          {/* Infrastructure Damage Assessment */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs font-mono">
            <span className="font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-200 pb-1.5">
              Sector Damage & Threat Indicators
            </span>
            <ul className="space-y-2 text-slate-600 text-[11px]">
              {analysis.damageFlags?.map((flag, idx) => (
                <li key={idx} className="flex items-start space-x-2 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  <span className="text-red-600 font-bold">⚠</span>
                  <span className="text-red-700 font-semibold">{flag}</span>
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
            <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Sector GIS Center: {activeZone.name}</span>
            </span>
            <span className="text-blue-700 font-bold">
              {activeZone.location?.lat?.toFixed(4)}°, {activeZone.location?.lng?.toFixed(4)}°
            </span>
          </div>

          <div className="h-64 rounded-2xl overflow-hidden border border-slate-200 relative z-0 isolate shadow-xs">
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
                  color: activeZone.severity === 'Critical' ? '#dc2626' : '#d97706',
                  fillColor: activeZone.severity === 'Critical' ? '#dc2626' : '#d97706',
                  fillOpacity: 0.25,
                  weight: 2
                }}
              />
              <Marker
                position={[activeZone.location?.lat, activeZone.location?.lng]}
                icon={createDisasterIcon(activeZone.severity, activeZone.code, true)}
              >
                <Popup>
                  <div className="text-xs text-slate-900 space-y-1 font-mono">
                    <strong className="text-blue-700">{activeZone.code} — {activeZone.name}</strong>
                    <p>{country} • {activeZone.type}</p>
                    <p className="text-red-600 font-bold">Risk: {activeZone.riskScore}/100</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Right Column: Gemini AI Telemetry Assessment (6 cols) */}
        <div className="lg:col-span-6 p-5 bg-white rounded-2xl space-y-4 shadow-xs border border-purple-200 flex flex-col justify-between relative">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-mono font-extrabold text-slate-900 tracking-wider uppercase">
                  Gemini AI Assessment: {activeZone.code}
                </h3>
              </div>
              <button
                onClick={handleRunAI}
                disabled={analyzingAI}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition shadow-xs"
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
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-mono">
                {aiError}
              </div>
            )}

            {aiResult ? (
              <div className="space-y-3 pt-1 text-xs font-mono">
                <div className="flex items-center justify-between bg-purple-50/70 p-2.5 rounded-xl border border-purple-200">
                  <span className="text-purple-900 font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI Urgency:</span>
                    <strong className="text-red-700 uppercase">{aiResult.urgency}</strong>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Model: {aiResult.aiModelUsed || 'Gemini 1.5 Flash'}
                  </span>
                </div>

                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    AI Satellite & Environmental Reasoning:
                  </span>
                  <ul className="space-y-1.5 text-slate-800">
                    {aiResult.reasoning?.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed font-mono">
                Click <strong>Analyze With Gemini AI</strong> to evaluate current satellite radar, thermal, and environmental indicators for <strong>{activeZone.name} ({country})</strong>.
              </div>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 flex items-center justify-between">
            <span>Target: {activeZone.code} • {country}</span>
            <span className="font-mono text-blue-700 font-bold">SURVER AI Pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}

