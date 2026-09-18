import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  AlertTriangle, 
  Warehouse, 
  Cross, 
  ShieldAlert, 
  Truck, 
  Sparkles, 
  Navigation,
  CheckCircle2,
  Globe,
  Layers,
  Cpu,
  History,
  Home,
  CloudRain,
  Mountain,
  Droplet
} from 'lucide-react';

// Fix for default Leaflet icon urls
delete L.Icon.Default.prototype._getIconUrl;

// Custom Leaflet DivIcon Generators
export function createDisasterIcon(severity, code, isSelected = false) {
  const colorClass = 
    severity === 'Critical' ? '#FF2E54' :
    severity === 'High' ? '#F59E0B' :
    severity === 'Moderate' ? '#F59E0B' : '#10B981';

  const size = isSelected ? 44 : 36;
  const borderSize = isSelected ? '3px' : '2px';

  return L.divIcon({
    className: 'custom-disaster-icon',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${size}px;
        height: ${size}px;
        background: ${colorClass};
        border: ${borderSize} solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 20px ${colorClass};
        color: white;
        font-weight: 800;
        font-size: ${isSelected ? '12px' : '10px'};
        font-family: 'JetBrains Mono', monospace;
        transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
        transition: transform 0.2s ease;
      ">
        <span>${code.replace('ZONE ', 'Z-')}</span>
        ${isSelected ? `
        <div style="
          position: absolute;
          width: ${size + 18}px;
          height: ${size + 18}px;
          border: 2px solid ${colorClass};
          border-radius: 50%;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          opacity: 0.85;
        "></div>
        ` : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

export function createSensorIcon(status, type) {
  const color = 
    status === 'CRITICAL' ? '#FF2E54' :
    status === 'WARNING' ? '#F59E0B' : '#10B981';

  return L.divIcon({
    className: 'custom-sensor-icon',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        background: #0B0F19;
        border: 2px solid ${color};
        border-radius: 50%;
        box-shadow: 0 0 12px ${color};
        color: ${color};
        font-weight: 800;
        font-size: 11px;
        font-family: 'JetBrains Mono', monospace;
      ">
        <span>⚡</span>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13]
  });
}

export function createShelterIcon() {
  return L.divIcon({
    className: 'custom-shelter-icon',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: #0B0F19;
        border: 2px solid #00F0FF;
        border-radius: 6px;
        box-shadow: 0 0 14px #00F0FF;
        color: #00F0FF;
        font-weight: 800;
        font-size: 12px;
      ">
        <span>⛺</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
}

export function createFacilityIcon(type) {
  let bg = '#00F0FF';
  let letter = 'W';

  if (type === 'Hospital') {
    bg = '#FF2E54';
    letter = 'H';
  } else if (type === 'Rescue Station') {
    bg = '#F59E0B';
    letter = 'R';
  } else if (type === 'Ambulance Station') {
    bg = '#10B981';
    letter = 'A';
  } else if (type === 'Emergency Center') {
    bg = '#A855F7';
    letter = 'E';
  }

  return L.divIcon({
    className: 'custom-facility-icon',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        background: #0B0F19;
        border: 2px solid ${bg};
        border-radius: 8px;
        box-shadow: 0 0 14px ${bg};
        color: ${bg};
        font-weight: 800;
        font-size: 12px;
        font-family: 'JetBrains Mono', monospace;
      ">
        <span>${letter}</span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
}

// Controller component to smoothly fly to selected zone
function MapFocusController({ selectedZone }) {
  const map = useMap();
  useEffect(() => {
    if (selectedZone && selectedZone.location) {
      map.flyTo([selectedZone.location.lat, selectedZone.location.lng], 9, {
        duration: 1.5
      });
    }
  }, [selectedZone, map]);

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

export default function CommandMap({ 
  disasters = [], 
  facilities = [], 
  sensors = [],
  shelters = [],
  selectedZone, 
  onSelectZone, 
  onAnalyzeZone, 
  onOptimizeZone,
  activeAllocations = [],
  className = "w-full h-full"
}) {
  const globalCenter = [30.5568, 79.5661]; // Default focus on Uttarakhand / Himalayan Hilly Region
  const [activeLayers, setActiveLayers] = useState({
    villages: true,
    shelters: true,
    facilities: true,
    radii: true
  });

  const toggleLayer = (key) => {
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-white/15 shadow-[0_16px_40px_0_rgba(0,0,0,0.85)] ${className}`}>
      <MapContainer
        center={selectedZone?.location ? [selectedZone.location.lat, selectedZone.location.lng] : globalCenter}
        zoom={selectedZone ? 9 : 6.5}
        minZoom={2}
        maxZoom={18}
        worldCopyJump={true}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* Watermark-Free OpenStreetMap Standard Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFocusController selectedZone={selectedZone} />

        {/* Disaster Inundation / Impact Danger Radii */}
        {activeLayers.radii && disasters.map((disaster) => {
          if (!disaster.location) return null;
          const isSelected = selectedZone?.id === disaster.id || selectedZone?.code === disaster.code;

          const color = 
            disaster.severity === 'Critical' ? '#FF2E54' :
            disaster.severity === 'High' ? '#F59E0B' :
            disaster.severity === 'Moderate' ? '#F59E0B' : '#10B981';

          const radiusMeters = (disaster.affectedAreaKm2 || 5) * 220;

          return (
            <React.Fragment key={`zone-circle-${disaster.id || disaster.code}`}>
              <Circle
                center={[disaster.location.lat, disaster.location.lng]}
                radius={radiusMeters}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.35 : 0.2,
                  weight: isSelected ? 3 : 2,
                  dashArray: isSelected ? undefined : '6, 8'
                }}
              />
              {activeLayers.villages && (
                <Marker
                  position={[disaster.location.lat, disaster.location.lng]}
                  icon={createDisasterIcon(disaster.severity, disaster.code, isSelected)}
                  eventHandlers={{
                    click: () => onSelectZone && onSelectZone(disaster)
                  }}
                >
                  <Popup>
                    <div className="text-[#F8FAFC] font-mono min-w-[280px] space-y-2.5">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-extrabold text-xs text-[#00F0FF] tracking-wide">
                            {disaster.code}
                          </span>
                          <span className="text-[10px] text-[#94A3B8] font-bold">
                            ({disaster.state || disaster.country || 'Hilly Region'})
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg ${
                          disaster.severity === 'Critical' ? 'bg-[#FF2E54]/20 text-[#FF2E54] border border-[#FF2E54]/50' :
                          disaster.severity === 'High' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/50' :
                          'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50'
                        }`}>
                          {disaster.severity}
                        </span>
                      </div>

                      <div className="text-xs space-y-1.5 text-[#94A3B8]">
                        <p className="font-bold text-white text-sm">{disaster.village || disaster.name}</p>
                        <p className="text-[11px] text-[#00F0FF]">{disaster.tehsil || 'Tehsil'}, {disaster.district || 'District'} ({disaster.state || 'State'})</p>

                        <div className="grid grid-cols-2 gap-1.5 py-1.5 text-[11px] bg-[#0B0F19] p-2 rounded-xl border border-white/10">
                          <div><span className="text-[#94A3B8]">Rainfall:</span> <strong className="text-[#00F0FF]">{disaster.environmentalData?.rainfallMm || 95} mm/h</strong></div>
                          <div><span className="text-[#94A3B8]">Soil Moisture:</span> <strong className="text-[#FF2E54]">{disaster.environmentalData?.soilSaturationPercent || 85}%</strong></div>
                          <div><span className="text-[#94A3B8]">Slope Incline:</span> <strong className="text-[#F59E0B]">{disaster.slopeAngleDegrees || 38}°</strong></div>
                          <div><span className="text-[#94A3B8]">Stability Index:</span> <strong className="text-[#F59E0B]">{disaster.slopeStabilityIndex || 0.42}</strong></div>
                          <div><span className="text-[#94A3B8]">Risk Score:</span> <strong className="text-[#FF2E54]">{disaster.riskScore}/100</strong></div>
                          <div><span className="text-[#94A3B8]">Lead Time:</span> <strong className="text-[#00F0FF]">{disaster.leadTimeMinutes || 28} min</strong></div>
                          <div className="col-span-2"><span className="text-[#94A3B8]">Population at Risk:</span> <strong className="text-white">{(disaster.affectedPopulation || 0).toLocaleString()}</strong></div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center space-x-2">
                        <button
                          onClick={() => onAnalyzeZone && onAnalyzeZone(disaster)}
                          className="flex-1 px-2.5 py-1.5 cyber-btn-purple rounded-xl text-xs flex items-center justify-center space-x-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Inspect AI</span>
                        </button>
                        <button
                          onClick={() => onOptimizeZone && onOptimizeZone(disaster)}
                          className="flex-1 px-2.5 py-1.5 cyber-btn-cyan rounded-xl text-xs flex items-center justify-center space-x-1"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Evacuate</span>
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </React.Fragment>
          );
        })}

        {/* Resource Facilities */}
        {activeLayers.facilities && facilities.map((fac) => {
          if (!fac.location) return null;
          return (
            <Marker
              key={`facility-${fac.id || fac.name}`}
              position={[fac.location.lat, fac.location.lng]}
              icon={createFacilityIcon(fac.type)}
            >
              <Popup>
                <div className="text-[#F8FAFC] font-mono min-w-[220px] space-y-2">
                  <div className="border-b border-white/10 pb-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#00F0FF]">
                      {fac.type} ({fac.state || fac.country || 'Regional'})
                    </span>
                    <h4 className="font-bold text-sm text-white">{fac.name}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[11px] text-[#94A3B8]">
                    <div>Water: <strong className="text-[#00F0FF]">{fac.inventory?.waterKits || 0}</strong></div>
                    <div>Food: <strong className="text-[#F59E0B]">{fac.inventory?.foodKits || 0}</strong></div>
                    <div>Ambulances: <strong className="text-[#10B981]">{fac.inventory?.ambulances || 0}</strong></div>
                    <div>Rescue: <strong className="text-[#F59E0B]">{fac.inventory?.rescueTeams || 0}</strong></div>
                    <div>Boats: <strong className="text-[#00F0FF]">{fac.inventory?.boats || 0}</strong></div>
                    <div>Medical: <strong className="text-[#FF2E54]">{fac.inventory?.medicalKits || 0}</strong></div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Active Dispatch Route Polylines */}
        {activeAllocations && activeAllocations.length > 0 && selectedZone?.location && (
          activeAllocations.map((alloc, idx) => {
            if (!alloc.lat || !alloc.lng) return null;
            return (
              <Polyline
                key={`route-${idx}-${alloc.sourceFacility}`}
                positions={[
                  [alloc.lat, alloc.lng],
                  [selectedZone.location.lat, selectedZone.location.lng]
                ]}
                pathOptions={{
                  color: '#00F0FF',
                  weight: 3.5,
                  opacity: 0.9,
                  dashArray: '8, 8',
                  dashOffset: '4'
                }}
              />
            );
          })
        )}
      </MapContainer>

      {/* Layer Switcher Controls (Top Right Overlay) */}
      <div className="absolute top-3 right-3 z-[10] flex items-center space-x-2 font-mono">
        <div className="cyber-card p-1.5 rounded-2xl flex items-center space-x-1.5 border border-white/10 text-xs">
          <button
            onClick={() => toggleLayer('villages')}
            className={`px-2.5 py-1 rounded-xl transition ${activeLayers.villages ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 font-bold' : 'text-[#94A3B8]'}`}
          >
            Villages
          </button>
          <button
            onClick={() => toggleLayer('facilities')}
            className={`px-2.5 py-1 rounded-xl transition ${activeLayers.facilities ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-bold' : 'text-[#94A3B8]'}`}
          >
            Depots
          </button>
          <button
            onClick={() => toggleLayer('radii')}
            className={`px-2.5 py-1 rounded-xl transition ${activeLayers.radii ? 'bg-[#FF2E54]/20 text-[#FF2E54] border border-[#FF2E54]/40 font-bold' : 'text-[#94A3B8]'}`}
          >
            Risk Radii
          </button>
        </div>

        {selectedZone && (
          <button
            onClick={() => onSelectZone && onSelectZone(null)}
            className="flex items-center space-x-1.5 cyber-pill-active px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            <Globe className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Reset View</span>
          </button>
        )}
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[10] cyber-card p-3.5 rounded-2xl text-xs space-y-2 shadow-2xl font-mono">
        <div className="font-extrabold text-[#F8FAFC] text-[11px] uppercase tracking-widest flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF]"></span>
          <span>SIH 2026 GIS Legend</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10.5px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E54]"></span>
            <span className="text-[#94A3B8] font-bold">Critical Risk</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
            <span className="text-[#94A3B8] font-bold">High Warning</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
            <span className="text-[#94A3B8] font-bold">Nominal</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-md border border-[#00F0FF] bg-[#0B0F19] text-[#00F0FF] text-[9px] flex items-center justify-center font-bold">W</span>
            <span className="text-[#94A3B8] font-bold">NDRF Depot</span>
          </div>
        </div>
      </div>
    </div>
  );
}
