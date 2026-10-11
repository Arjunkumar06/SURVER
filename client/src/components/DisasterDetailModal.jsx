import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  X, 
  Sparkles, 
  Satellite, 
  Navigation, 
  Users, 
  MapPin, 
  Layers, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Droplet, 
  Utensils, 
  Ambulance, 
  ShieldAlert, 
  Anchor, 
  HeartPulse,
  TrendingUp,
  Globe,
  Warehouse,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { analyzeEmergencyAI } from '../services/api';
import { createDisasterIcon, createFacilityIcon } from './CommandMap';

// Client-side Haversine distance calculator
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return 0;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

// Leaflet Modal InvalidateSize Fix Component
function ModalMapFix({ center }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const timer1 = setTimeout(() => {
      map.invalidateSize();
      if (center) {
        map.setView(center, 9);
      }
    }, 150);

    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [map, center]);

  return null;
}

export default function DisasterDetailModal({ 
  zone, 
  allDisasters = [], 
  allFacilities = [], 
  onClose, 
  onOptimize, 
  onViewSatellite 
}) {
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState(null);

  if (!zone || !zone.location) return null;

  // 1. Calculate Nearby Danger Zones (Radius = 500km, sorted nearest first)
  const nearbyDangerZones = useMemo(() => {
    return allDisasters
      .filter(d => (d.id !== zone.id && d.code !== zone.code) && d.location)
      .map(d => ({
        ...d,
        distanceKm: calculateDistanceKm(
          zone.location.lat,
          zone.location.lng,
          d.location.lat,
          d.location.lng
        )
      }))
      .filter(d => d.distanceKm <= 500)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [zone, allDisasters]);

  // 2. Calculate Nearest Resource Facilities (Sorted by distance km)
  const nearestFacilities = useMemo(() => {
    const reachable = allFacilities
      .filter(f => f.location && f.status === 'Operational')
      .map(f => ({
        ...f,
        distanceKm: calculateDistanceKm(
          zone.location.lat,
          zone.location.lng,
          f.location.lat,
          f.location.lng
        )
      }))
      .filter(f => f.distanceKm <= 500)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    if (reachable.length > 0) return reachable;

    // If remote area with no facilities within 500km, show nearest global ones
    return [...allFacilities]
      .filter(f => f.location)
      .map(f => ({
        ...f,
        distanceKm: calculateDistanceKm(zone.location.lat, zone.location.lng, f.location.lat, f.location.lng)
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 3);
  }, [zone, allFacilities]);

  // 3. Resource Requirements and Shortage Breakdown Table
  const reqs = aiResult?.resourceRequirements || zone.suggestedRequirements || {
    waterKits: Math.round((zone.affectedPopulation || 5000) * 0.1),
    foodKits: Math.round((zone.affectedPopulation || 5000) * 0.06),
    ambulances: 3,
    rescueTeams: 4,
    boats: zone.type === 'Flood' ? 2 : 0,
    medicalKits: Math.round((zone.affectedPopulation || 5000) * 0.04)
  };

  const resourceItems = [
    { key: 'waterKits', label: 'Water Kits', unit: 'kits', icon: Droplet },
    { key: 'foodKits', label: 'Food Kits', unit: 'kits', icon: Utensils },
    { key: 'ambulances', label: 'Ambulances', unit: 'units', icon: Ambulance },
    { key: 'rescueTeams', label: 'Rescue Teams', unit: 'teams', icon: ShieldAlert },
    { key: 'boats', label: 'Rescue Boats', unit: 'vessels', icon: Anchor },
    { key: 'medicalKits', label: 'Medical Kits', unit: 'kits', icon: HeartPulse }
  ];

  const requirementsTable = useMemo(() => {
    return resourceItems.map(({ key, label, unit, icon }) => {
      const required = Math.max(0, reqs[key] || 0);

      let nearbyAvailable = 0;
      nearestFacilities.forEach(f => {
        nearbyAvailable += (f.inventory?.[key] || 0);
      });

      const allocated = Math.min(required, nearbyAvailable);
      const shortage = Math.max(0, required - nearbyAvailable);

      return {
        key,
        label,
        unit,
        icon,
        required,
        nearbyAvailable,
        allocated,
        shortage,
        isDeficit: shortage > 0
      };
    });
  }, [reqs, nearestFacilities]);

  const handleRunAIAnalysis = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const payload = {
        id: zone.id,
        code: zone.code,
        name: zone.name,
        country: zone.country,
        region: zone.region,
        type: zone.type,
        severity: zone.severity,
        riskScore: zone.riskScore,
        affectedPopulation: zone.affectedPopulation,
        affectedAreaKm2: zone.affectedAreaKm2,
        roadAccessibilityPercent: zone.roadAccessibilityPercent,
        waterExpansionPercent: zone.waterExpansionPercent || 265.6,
        description: zone.description
      };
      const result = await analyzeEmergencyAI(payload);
      setAiResult(result);
    } catch (err) {
      setError(err.message || 'AI analysis request failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative isolate border border-slate-200">
        
        {/* SECTION 1: MODAL HEADER */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-30">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 text-xs font-mono font-extrabold bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-lg shadow-sm">
              {zone.code}
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight font-mono">
                  {zone.name}
                </h2>
                <span className="text-xs text-slate-500 font-semibold">
                  ({zone.country || zone.location?.country || 'Global'})
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {zone.region || zone.location?.address || 'Disaster Risk Sector'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-xs font-bold font-mono rounded-lg shadow-sm ${
              zone.severity === 'Critical' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
              zone.severity === 'High' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
              'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              {zone.severity}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* SECTION 2: ZONE STATISTICS & SUMMARY MATRIX */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Disaster Type</span>
              <div className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-1.5 font-mono">
                <AlertTriangle className="w-4 h-4 text-cyan-600" />
                <span>{zone.type}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Risk Evaluation</span>
              <div className="text-sm sm:text-base font-bold text-rose-600 flex items-center space-x-1.5 font-mono">
                <span>{aiResult?.riskScore || zone.riskScore}/100</span>
                <span className="text-[10px] text-slate-500 uppercase">({aiResult?.severity || zone.severity})</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Affected Population</span>
              <div className="text-sm sm:text-base font-bold text-cyan-700 flex items-center space-x-1.5 font-mono">
                <Users className="w-4 h-4 text-cyan-600" />
                <span>{(zone.affectedPopulation || 8400).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Road Accessibility</span>
              <div className="text-sm sm:text-base font-bold text-amber-700 flex items-center space-x-1.5 font-mono">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>{zone.roadAccessibilityPercent || 40}%</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: CONTAINED GEOGRAPHIC LEAFLET MAP */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 font-mono">
                <Globe className="w-3.5 h-3.5 text-cyan-600" />
                <span>Sector GIS Location & Regional Proximity</span>
              </span>
              <span className="text-[11px] font-mono text-cyan-700 font-bold">
                GPS: {zone.location.lat.toFixed(4)}, {zone.location.lng.toFixed(4)}
              </span>
            </div>

            <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100 z-0 isolate shadow-inner">
              <MapContainer
                key={`modal-map-${zone.id || zone.code}`}
                center={[zone.location.lat, zone.location.lng]}
                zoom={9}
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

                <ModalMapFix center={[zone.location.lat, zone.location.lng]} />

                {/* Primary Selected Zone Circle & Pin */}
                <Circle
                  center={[zone.location.lat, zone.location.lng]}
                  radius={(zone.affectedAreaKm2 || 8) * 220}
                  pathOptions={{
                    color: zone.severity === 'Critical' ? '#e11d48' : '#d97706',
                    fillColor: zone.severity === 'Critical' ? '#e11d48' : '#d97706',
                    fillOpacity: 0.28,
                    weight: 3
                  }}
                />
                <Marker
                  position={[zone.location.lat, zone.location.lng]}
                  icon={createDisasterIcon(zone.severity, zone.code, true)}
                >
                  <Popup>
                    <div className="text-slate-900 font-sans text-xs space-y-1">
                      <strong className="text-cyan-700">{zone.code} (Target)</strong>
                      <p>{zone.name}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Nearby Danger Zones Pins */}
                {nearbyDangerZones.map(nz => (
                  <Marker
                    key={`modal-nz-${nz.id || nz.code}`}
                    position={[nz.location.lat, nz.location.lng]}
                    icon={createDisasterIcon(nz.severity, nz.code, false)}
                  >
                    <Popup>
                      <div className="text-slate-900 font-sans text-xs space-y-1">
                        <strong className="text-rose-600">{nz.code}</strong>
                        <p>{nz.name}</p>
                        <p className="text-amber-700 font-mono">Distance: {nz.distanceKm} km</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Nearest Resource Facility Pins */}
                {nearestFacilities.map(fac => (
                  <Marker
                    key={`modal-fac-${fac.id || fac.name}`}
                    position={[fac.location.lat, fac.location.lng]}
                    icon={createFacilityIcon(fac.type)}
                  >
                    <Popup>
                      <div className="text-slate-900 font-sans text-xs space-y-1">
                        <strong className="text-cyan-700">{fac.name}</strong>
                        <p className="text-slate-500 font-mono">Distance: {fac.distanceKm} km</p>
                        <p className="text-emerald-600 font-mono">Water Kits: {fac.inventory?.waterKits || 0}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* SECTION 4: NEARBY DANGER ZONES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5 font-mono">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Geographic Danger Zones (Within 500 km Radius)</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {nearbyDangerZones.length} Sector(s) Detected
              </span>
            </div>

            {nearbyDangerZones.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nearbyDangerZones.map((nz) => (
                  <div
                    key={nz.id || nz.code}
                    className="p-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-between text-xs transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 font-mono font-bold text-[10px] bg-cyan-50 text-cyan-800 rounded border border-cyan-200">
                          {nz.code}
                        </span>
                        <strong className="text-slate-900">{nz.name}</strong>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        <span>{nz.country || 'Region'}</span> | <span>Severity: <strong className="text-rose-600">{nz.severity}</strong></span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Distance</span>
                      <span className="text-xs font-mono font-extrabold text-amber-700">
                        {nz.distanceKm} km
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-xs text-slate-500 text-center">
                No secondary critical disaster zones detected within 500 km radius.
              </div>
            )}
          </div>

          {/* SECTION 5: NEAREST LOGISTICS FACILITIES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5 font-mono">
                <Warehouse className="w-3.5 h-3.5 text-cyan-600" />
                <span>Nearest Resource Logistics Depots</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {nearestFacilities.length} Reachable Facilities
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nearestFacilities.map((fac) => (
                <div
                  key={fac.id || fac.name}
                  className="p-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl space-y-1.5 text-xs transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                        {fac.type}
                      </span>
                      <h4 className="font-bold text-slate-900 pt-1">{fac.name}</h4>
                    </div>
                    <span className="text-xs font-mono font-extrabold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {fac.distanceKm} km
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-1.5 text-[11px] font-mono text-slate-500 border-t border-slate-200">
                    <div>Water: <strong className="text-cyan-700">{fac.inventory?.waterKits || 0}</strong></div>
                    <div>Food: <strong className="text-amber-700">{fac.inventory?.foodKits || 0}</strong></div>
                    <div>Ambulances: <strong className="text-emerald-700">{fac.inventory?.ambulances || 0}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: RESOURCE REQUIREMENTS & SHORTAGE FULFILLMENT TABLE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Resource Requirements & Supply Fulfillment Matrix
              </h3>
              <span className="text-[11px] text-slate-500">
                Objective supply matching from nearby depots
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Resource Item</th>
                    <th className="p-3">Required</th>
                    <th className="p-3">Nearby Available</th>
                    <th className="p-3">Allocated</th>
                    <th className="p-3">Shortage</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-900">
                  {requirementsTable.map((row) => (
                    <tr key={row.key} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-sans font-medium text-slate-900 flex items-center space-x-2">
                        <row.icon className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                        <span>{row.label}</span>
                      </td>
                      <td className="p-3 font-bold">{row.required} {row.unit}</td>
                      <td className="p-3 text-cyan-700">{row.nearbyAvailable} {row.unit}</td>
                      <td className="p-3 text-emerald-700 font-bold">{row.allocated} {row.unit}</td>
                      <td className={`p-3 font-bold ${row.isDeficit ? 'text-rose-600' : 'text-slate-500'}`}>
                        {row.isDeficit ? `-${row.shortage} ${row.unit}` : '0'}
                      </td>
                      <td className="p-3 font-sans">
                        {row.isDeficit ? (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded text-[10px] font-bold">
                            ⚠ Deficit
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold">
                            ✓ Fulfilled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 7: SATELLITE RADAR OBSERVATION */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-700 shrink-0">
                <Satellite className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-cyan-800 font-mono">
                    SENTINEL-1 C-BAND SAR OBSERVATION
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-mono font-bold">
                    100% Cloud Penetration
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Surface Inundation: <strong className="text-slate-900">{zone.waterCoverageBeforeKm2 || 3.2} km²</strong> → <strong className="text-cyan-700">{zone.waterCoverageAfterKm2 || 11.7} km²</strong> (<span className="text-rose-600 font-bold">+{zone.waterExpansionPercent || 265.6}% Expansion</span>)
                </p>
              </div>
            </div>

            {onViewSatellite && (
              <button
                onClick={() => onViewSatellite(zone)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-xs font-semibold text-cyan-700 rounded-xl border border-slate-300 transition shrink-0 shadow-sm"
              >
                Inspect Satellite
              </button>
            )}
          </div>

          {/* SECTION 8: GEMINI AI EMERGENCY INTELLIGENCE */}
          <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-purple-200/60 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4.5 h-4.5 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-wide font-mono">
                  GEMINI AI DISASTER INTELLIGENCE
                </h3>
              </div>
              <button
                onClick={handleRunAIAnalysis}
                disabled={analyzing}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-sm"
              >
                {analyzing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Analyzing Satellite Telemetry...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{aiResult ? 'Re-Analyze with Gemini' : 'Analyze With Gemini AI'}</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-100 border border-rose-300 rounded-xl text-xs text-rose-800">
                {error}
              </div>
            )}

            {aiResult && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-purple-800 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI Urgency Assessment:</span>
                    <strong className="text-rose-600 uppercase font-mono">{aiResult.urgency}</strong>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Model: {aiResult.aiModelUsed || 'Gemini 1.5 Flash'}
                  </span>
                </div>

                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block font-mono">
                    AI Evidence & Reasoning Checklist:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {aiResult.reasoning.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-cyan-600 font-bold">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 9: STICKY ACTION BUTTONS FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white sticky bottom-0 z-30 flex items-center justify-between mt-auto backdrop-blur-md">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-xl transition border border-slate-300"
          >
            Close
          </button>

          <button
            onClick={() => {
              onOptimize && onOptimize(zone);
              onClose();
            }}
            className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-mono rounded-xl text-xs font-extrabold flex items-center space-x-2 transition shadow-sm"
          >
            <Navigation className="w-4 h-4" />
            <span>OPTIMIZE RESOURCE RESPONSE</span>
          </button>
        </div>

      </div>
    </div>
  );
}
