/**
 * SURVER Centralized Multi-Zone Satellite Intelligence & Earth Observation Model
 *
 * Provides dedicated, zone-specific satellite telemetry, sensor parameters,
 * damage assessments, and dynamic SVG satellite imagery for all global disaster zones.
 */

// Helper to generate a deterministic integer hash from any string
function hashString(str) {
  let hash = 0;
  if (!str) return 12345;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Dynamic SVG Generator for realistic, zone-specific satellite radar & optical imagery
export function generateZoneSatelliteSvg(zone, type = 'before') {
  if (!zone) return '';

  const dtype = (zone.type || '').toLowerCase();
  const isFlood = dtype.includes('flood');
  const isLandslide = dtype.includes('landslide');
  const isCyclone = dtype.includes('cyclone');
  const isWildfire = dtype.includes('wildfire');

  const code = zone.code || 'ZONE';
  const name = zone.name || 'Disaster Sector';
  const village = zone.village || zone.ward || zone.tehsil || zone.district || zone.city || name;
  const country = zone.country || 'Global';
  const state = zone.state ? `${zone.state}, ${country}` : country;
  
  const latNum = zone.location?.lat || 27.7172;
  const lngNum = zone.location?.lng || 85.3240;
  const lat = latNum.toFixed(4);
  const lng = lngNum.toFixed(4);
  const date = zone.satelliteObservationDate || '2026-08-30';
  const area = zone.affectedAreaKm2 || (isFlood ? 11.7 : 8.5);

  // Deterministic seed offsets for unique zone geography & vector paths
  const seedStr = `${code}_${name}_${lat}_${lng}`;
  const seed = hashString(seedStr);
  const offA = (seed % 90) - 45;       // -45 to +45
  const offB = ((seed >> 3) % 80) - 40; // -40 to +40
  const offC = ((seed >> 6) % 60) - 30; // -30 to +30

  const cleanId = String(zone.id || code).replace(/[^a-zA-Z0-9]/g, '_');
  const gridId = `grid_${cleanId}_${type}`;
  const heatGradId = `heatGrad_${cleanId}_${type}`;

  // Colors & Themes based on disaster type
  let bg = '#090d16';
  let gridColor = '#1e293b';
  let terrainBase = '#152238';
  let terrainStroke = '#1e3a5f';
  let activeOverlay = '';
  let badgeColor = '#38bdf8';
  let badgeTitle = `PRE-DISASTER BASELINE (T-0) • ${code}`;
  let badgeMetric = `Normal Area: ${zone.waterCoverageBeforeKm2 || 3.2} km²`;
  let statusBadge = '● Normal State';
  let sensorLabel = zone.satelliteSource || 'Sentinel-1 C-SAR';

  if (type === 'before') {
    // Normal pre-disaster baseline customized per zone
    if (isFlood) {
      activeOverlay = `
        <!-- Baseline River / Catchment Network for ${village} -->
        <path d="M 0,${180 + offA} Q ${180 + offB},${190 - offC} ${280 + offA},${210 + offB} T 600,${230 + offC}" fill="none" stroke="#38bdf8" stroke-width="12" stroke-linecap="round" opacity="0.85"/>
        <path d="M ${120 + offB},0 Q ${150 + offA},100 ${200 + offC},${185 + offA}" fill="none" stroke="#38bdf8" stroke-width="6" opacity="0.7"/>
        <circle cx="${280 + offA}" cy="${210 + offB}" r="6" fill="#38bdf8" opacity="0.9"/>
        <text x="${295 + offA}" y="${215 + offB}" fill="#93c5fd" font-size="10" font-weight="700">${village.toUpperCase()} RIVER CHANNEL</text>
      `;
      badgeMetric = `Baseline Water: ${zone.waterCoverageBeforeKm2 || 3.2} km²`;
    } else if (isLandslide) {
      terrainBase = '#1e251d';
      terrainStroke = '#2d3b2a';
      activeOverlay = `
        <!-- Stable Mountain Ridge & Contour for ${village} -->
        <path d="M 0,${380 + offB} Q ${180 + offA},${120 + offC} ${320 + offB},${180 + offA} T 600,${80 + offB}" fill="none" stroke="#4ade80" stroke-width="5" stroke-dasharray="6,4" opacity="0.6"/>
        <polygon points="${80 + offA},400 ${180 + offB},${140 + offC} ${300 + offA},400" fill="#243321" stroke="#3b5233" stroke-width="1.5" opacity="0.8"/>
        <polygon points="${260 + offC},400 ${380 + offA},${100 + offB} ${500 + offC},400" fill="#2a3d27" stroke="#3b5233" stroke-width="1.5" opacity="0.8"/>
        <text x="${190 + offB}" y="${160 + offC}" fill="#86efac" font-size="10" font-weight="700">${village.toUpperCase()} RIDGE (${zone.environmentalData?.slopeDegrees || 38}° SLOPE)</text>
      `;
      badgeTitle = `PRE-EVENT SLOPE BASELINE • ${code}`;
      badgeMetric = `Slope Stability: Normal (${zone.environmentalData?.slopeDegrees || 38}°)`;
      badgeColor = '#4ade80';
    } else if (isCyclone) {
      activeOverlay = `
        <!-- Coastal Shoreline for ${village} -->
        <path d="M ${440 + offA},0 Q ${400 + offB},150 ${420 + offC},250 Q ${450 + offA},350 ${420 + offB},400 L 600,400 L 600,0 Z" fill="#0369a1" opacity="0.75"/>
        <path d="M 0,${220 + offC} Q ${200 + offA},${220 + offB} ${420 + offC},250" fill="none" stroke="#38bdf8" stroke-width="8" opacity="0.8"/>
        <text x="${450 + offA}" y="60" fill="#7dd3fc" font-size="10" font-weight="700">${village.toUpperCase()} COASTAL BAY</text>
      `;
      badgeTitle = `PRE-CYCLONE COASTAL BASELINE • ${code}`;
      badgeMetric = `Tidal Baseline: +0.4m MSL`;
      badgeColor = '#38bdf8';
    } else if (isWildfire) {
      terrainBase = '#1c2419';
      activeOverlay = `
        <!-- Canopy Baseline for ${village} -->
        <rect x="${60 + offA}" y="${80 + offB}" width="${460 + offC}" height="240" rx="8" fill="#14532d" opacity="0.5" stroke="#166534" stroke-width="1.5"/>
        <circle cx="${180 + offA}" cy="${180 + offB}" r="45" fill="#15803d" opacity="0.6"/>
        <circle cx="${340 + offC}" cy="${200 + offA}" r="60" fill="#15803d" opacity="0.6"/>
        <text x="${80 + offA}" y="${105 + offB}" fill="#86efac" font-size="10" font-weight="700">${village.toUpperCase()} CANOPY COVER</text>
      `;
      badgeTitle = `PRE-FIRE CANOPY BASELINE • ${code}`;
      badgeMetric = `Fuel Moisture: 45% (Healthy)`;
      badgeColor = '#4ade80';
    }
  } else if (type === 'after') {
    // Post-disaster detection customized per zone
    badgeTitle = `POST-EVENT SATELLITE DETECTION (${date.split(' ')[0]}) • ${code}`;
    badgeColor = '#f87171';
    statusBadge = '▲ CRITICAL IMPACT';

    if (isFlood) {
      activeOverlay = `
        <!-- Inundated Flood Polygon -->
        <path d="M ${20 + offA},${80 + offB} Q ${150 + offC},${40 + offA} ${320 + offB},${90 + offC} Q ${480 + offA},${140 + offB} ${560 + offC},${200 + offA} Q ${520 + offB},${320 + offC} ${380 + offA},${360 + offB} Q ${200 + offC},${380 + offA} ${40 + offB},${320 + offC} Z" fill="#0284c7" fill-opacity="0.6" stroke="#38bdf8" stroke-width="2.5"/>
        <path d="M ${80 + offB},${120 + offC} Q ${220 + offA},${100 + offB} ${350 + offC},${150 + offA} Q ${440 + offB},${220 + offC} ${420 + offA},${290 + offB} Q ${280 + offC},${340 + offA} ${100 + offB},${260 + offC} Z" fill="#0369a1" fill-opacity="0.7"/>
        <circle cx="${280 + offA}" cy="${210 + offB}" r="14" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
        <text x="${302 + offA}" y="${215 + offB}" fill="#f87171" font-size="11" font-weight="800">${village.toUpperCase()} INUNDATED SECTOR</text>
      `;
      badgeMetric = `Inundated Extent: ${zone.waterCoverageAfterKm2 || area} km² (+${zone.waterExpansionPercent || 265}%)`;
    } else if (isLandslide) {
      terrainBase = '#2b1e16';
      activeOverlay = `
        <!-- Debris Flow & Scar Polygon -->
        <polygon points="${240 + offA},${60 + offB} ${350 + offC},${80 + offA} ${430 + offB},${370 + offC} ${170 + offA},${380 + offB}" fill="#b45309" fill-opacity="0.65" stroke="#f59e0b" stroke-width="2.5"/>
        <path d="M ${280 + offA},${90 + offB} L ${300 + offC},${360 + offA} M ${300 + offB},${110 + offC} L ${250 + offA},${350 + offB}" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4"/>
        <circle cx="${290 + offA}" cy="${240 + offB}" r="13" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
        <text x="${310 + offA}" y="${245 + offB}" fill="#fca5a5" font-size="11" font-weight="800">${village.toUpperCase()} DEBRIS SLIP SCAR</text>
      `;
      badgeMetric = `Debris Slip Area: ${area} km² (Displacement)`;
    } else if (isCyclone) {
      activeOverlay = `
        <!-- Storm Surge Inundation & Eye Vortex -->
        <path d="M ${260 + offA},0 Q ${180 + offB},${160 + offC} ${210 + offA},${280 + offB} Q ${230 + offC},360 180,400 L 600,400 L 600,0 Z" fill="#0284c7" fill-opacity="0.65" stroke="#38bdf8" stroke-width="2.5"/>
        <ellipse cx="${420 + offA}" cy="${180 + offB}" rx="110" ry="80" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="10,6"/>
        <circle cx="${420 + offA}" cy="${180 + offB}" r="12" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
        <text x="${300 + offA}" y="${140 + offB}" fill="#f87171" font-size="11" font-weight="800">${village.toUpperCase()} SURGE: 4.2m INLAND</text>
      `;
      badgeMetric = `Surge Extent: ${area} km² (Wind: ${zone.environmentalData?.windSpeedKmph || 145} km/h)`;
    } else if (isWildfire) {
      terrainBase = '#2b1712';
      activeOverlay = `
        <!-- Active Fire Front & Burn Scar Perimeter -->
        <path d="M ${90 + offA},${90 + offB} Q ${240 + offC},${40 + offA} ${380 + offB},${100 + offC} Q ${520 + offA},${160 + offB} ${490 + offC},${290 + offA} Q ${380 + offB},360 210,340 Q ${70 + offA},300 ${90 + offA},${90 + offB} Z" fill="#7f1d1d" fill-opacity="0.75" stroke="#ef4444" stroke-width="3"/>
        <circle cx="${270 + offA}" cy="${200 + offB}" r="50" fill="#ea580c" fill-opacity="0.8"/>
        <circle cx="${270 + offA}" cy="${200 + offB}" r="22" fill="#facc15" fill-opacity="0.9"/>
        <text x="${300 + offA}" y="${205 + offB}" fill="#fef08a" font-size="11" font-weight="800">${village.toUpperCase()} THERMAL CORE (${zone.environmentalData?.temperatureC || 38}°C)</text>
      `;
      badgeMetric = `Burn Perimeter: ${area} km² (High Anomaly)`;
    }
  } else if (type === 'difference') {
    // SAR / InSAR / Thermal Delta Heatmap customized per zone
    badgeTitle = isFlood ? `SAR DUAL-POL (VV/VH) LOG-RATIO DIFFERENCE • ${code}` :
                 isLandslide ? `InSAR INTERFEROMETRIC COHERENCE LOSS • ${code}` :
                 isCyclone ? `STORM SURGE WATER DELTA HEATMAP • ${code}` :
                 `THERMAL IR VEGETATION RADIANCE MAP • ${code}`;
    badgeColor = '#fbbf24';
    statusBadge = '● Anomaly Confirmed';

    if (isFlood) {
      activeOverlay = `
        <defs>
          <radialGradient id="${heatGradId}" cx="45%" cy="55%" r="45%">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.9"/>
            <stop offset="40%" stop-color="#f97316" stop-opacity="0.75"/>
            <stop offset="70%" stop-color="#eab308" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.1"/>
          </radialGradient>
        </defs>
        <ellipse cx="${280 + offA}" cy="${220 + offB}" rx="220" ry="140" fill="url(#${heatGradId})" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4"/>
        <text x="${180 + offA}" y="${225 + offB}" fill="#ffffff" font-size="12" font-weight="800">Δ SAR BACKSCATTER (${village.toUpperCase()}): -6.8 dB</text>
      `;
      badgeMetric = `Specular Water Drop: -6.8 dB (Confidence 95%)`;
    } else if (isLandslide) {
      activeOverlay = `
        <polygon points="${240 + offA},${60 + offB} ${350 + offC},${80 + offA} ${430 + offB},${370 + offC} ${170 + offA},${380 + offB}" fill="#ef4444" fill-opacity="0.75" stroke="#f87171" stroke-width="2"/>
        <text x="${190 + offA}" y="${240 + offB}" fill="#ffffff" font-size="12" font-weight="800">COHERENCE LOSS (${village.toUpperCase()}): +4.2 dB</text>
      `;
      badgeMetric = `Slope Displacement: +4.2 dB Drop`;
    } else if (isCyclone) {
      activeOverlay = `
        <rect x="${190 + offA}" y="${40 + offB}" width="360" height="320" rx="12" fill="#ef4444" fill-opacity="0.65" stroke="#f87171" stroke-width="2.5"/>
        <text x="${220 + offA}" y="${200 + offB}" fill="#ffffff" font-size="12" font-weight="800">SURGE DELTA (${village.toUpperCase()}): +9.3 km²</text>
      `;
      badgeMetric = `Radar Surge Delta: -8.2 dB`;
    } else if (isWildfire) {
      activeOverlay = `
        <circle cx="${280 + offA}" cy="${200 + offB}" r="140" fill="#dc2626" fill-opacity="0.8" stroke="#facc15" stroke-width="3"/>
        <text x="${180 + offA}" y="${205 + offB}" fill="#ffffff" font-size="12" font-weight="800">THERMAL RADIANCE (${village.toUpperCase()}): +8.5 W/m²</text>
      `;
      badgeMetric = `Thermal Rad Delta: +8.5 W/m²`;
    }
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%" style="background:${bg}; font-family: 'JetBrains Mono', monospace;">
      <defs>
        <pattern id="${gridId}" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="${gridColor}" stroke-width="0.8"/>
        </pattern>
      </defs>

      <!-- Background Grid -->
      <rect width="600" height="400" fill="url(#${gridId})" />

      <!-- Base Terrain Boundary -->
      <path d="M 0,0 L 480,0 Q ${440 + offA},160 ${460 + offB},260 Q ${480 + offC},360 450,400 L 0,400 Z" fill="${terrainBase}" stroke="${terrainStroke}" stroke-width="1.5" />

      <!-- Roads & Urban Grid -->
      <path d="M 40,50 L 420,50 M 60,120 L 400,120 M 40,280 L 410,280 M 160,20 L 160,380 M 300,20 L 300,380" stroke="#334155" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.5"/>

      <!-- Settlements / Facilities -->
      <rect x="${70 + offA}" y="${70 + offB}" width="40" height="28" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1" opacity="0.8"/>
      <rect x="${130 + offC}" y="${70 + offB}" width="45" height="28" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1" opacity="0.8"/>
      <rect x="${80 + offB}" y="${230 + offA}" width="55" height="35" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1" opacity="0.8"/>
      <rect x="${220 + offA}" y="${240 + offC}" width="65" height="40" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1" opacity="0.8"/>

      <!-- Dynamic Disaster & Satellite Overlays -->
      ${activeOverlay}

      <!-- Top Header Telemetry Badge -->
      <rect x="16" y="16" width="340" height="54" rx="6" fill="#0b1120" fill-opacity="0.92" stroke="#334155" stroke-width="1.2"/>
      <text x="28" y="34" fill="#94a3b8" font-size="9" font-weight="700" letter-spacing="0.8">${badgeTitle}</text>
      <text x="28" y="52" fill="${badgeColor}" font-size="11.5" font-weight="800">${badgeMetric}</text>

      <!-- GPS Watermark Box -->
      <rect x="16" y="342" width="290" height="44" rx="5" fill="#0b1120" fill-opacity="0.92" stroke="#334155" stroke-width="1"/>
      <text x="26" y="358" fill="#38bdf8" font-size="10" font-weight="800">${code} • ${village.substring(0, 24).toUpperCase()}</text>
      <text x="26" y="374" fill="#64748b" font-size="9">${state} | GPS: ${lat}° N, ${lng}° E</text>

      <!-- Sensor Status Bottom Right Badge -->
      <rect x="360" y="342" width="224" height="44" rx="6" fill="#0b1120" fill-opacity="0.92" stroke="#334155" stroke-width="1.2"/>
      <text x="372" y="358" fill="#64748b" font-size="8.5">SENSOR: ${sensorLabel}</text>
      <text x="372" y="374" fill="${badgeColor}" font-size="10.5" font-weight="700">${statusBadge}</text>
    </svg>
  `;

  // Return base64 data URI so <img> tags or inline SVGs render immediately without network delays
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

// Master Satellite Data Generator for every zone
export function getSatelliteDataByZone(zone) {
  if (!zone) return null;

  const dtype = (zone.type || '').toLowerCase();
  const isFlood = dtype.includes('flood');
  const isLandslide = dtype.includes('landslide');
  const isCyclone = dtype.includes('cyclone');
  const isWildfire = dtype.includes('wildfire');

  const village = zone.village || zone.ward || zone.tehsil || zone.district || zone.city || zone.name || 'Disaster Sector';
  const beforeKm2 = isWildfire ? (zone.affectedAreaKm2 || 18.2) : (zone.waterCoverageBeforeKm2 || (isFlood ? 3.2 : (isCyclone ? 3.5 : 0.8)));
  const afterKm2 = (isWildfire || isLandslide) ? (zone.affectedAreaKm2 || (isWildfire ? 18.2 : 6.4)) : (zone.waterCoverageAfterKm2 || zone.affectedAreaKm2 || (isFlood ? 11.7 : 8.5));
  const expansion = isWildfire ? 0 : (zone.waterExpansionPercent || (beforeKm2 > 0 ? Number((((afterKm2 - beforeKm2) / beforeKm2) * 100).toFixed(1)) : 220));

  let primary = "Sentinel-1 C-SAR";
  let mode = "SAR Dual-Pol IW (VV/VH)";
  let polarization = "VV + VH";
  let source = "Copernicus Data Space Ecosystem";
  let cloudPenetration = "100% (Radar all-weather penetration)";
  let sarBackscatterDeltaDb = -6.8;
  let statusBannerText = `DEMO / SIMULATED RADAR PIPELINE (${zone.code || 'ZONE'})`;
  let diffTitle = `SAR DUAL-POLARIZATION (VV/VH) LOG-RATIO DIFFERENCE (${village.toUpperCase()})`;
  let diffMetricLabel = "Δ Inundated Surface Delta";
  let diffMetricValue = `+${(afterKm2 - beforeKm2).toFixed(2)} km²`;

  let primaryMetricLabel = "Pre-Event Baseline Extent";
  let primaryMetricValue = `${beforeKm2} km²`;
  let secondaryMetricLabel = "Current Disaster Inundation";
  let secondaryMetricValue = `${afterKm2} km²`;
  let impactMetricLabel = "Inundation Expansion";
  let impactMetricValue = `+${expansion}%`;
  let deltaMetricLabel = "SAR Backscatter Delta";
  let deltaMetricValue = `${sarBackscatterDeltaDb} dB`;

  let damageFlags = [
    `Primary arterial transit corridor in ${zone.region || zone.country} impaired to ${zone.roadAccessibilityPercent || 40}% capacity`,
    `Direct perimeter exposure of ${(zone.affectedPopulation || 5000).toLocaleString()} vulnerable citizens in ${village}`,
    `Telemetry confirmed via ${zone.environmentalData?.sensorSource || 'Ground Sensor Array #01'}`
  ];

  if (isLandslide) {
    primary = "Sentinel-2 MSI & ALOS PALSAR";
    mode = "Optical SWIR & InSAR Coherence";
    polarization = "SWIR B11/B12 + InSAR";
    cloudPenetration = "85% (Combined optical-InSAR interferometry)";
    sarBackscatterDeltaDb = +4.2;
    statusBannerText = `DEMO / SIMULATED OPTICAL & InSAR PIPELINE (${zone.code || 'ZONE'})`;
    diffTitle = `InSAR INTERFEROMETRIC SURFACE COHERENCE LOSS (${village.toUpperCase()})`;
    diffMetricLabel = "Slope Ground Displacement";
    diffMetricValue = `${zone.affectedAreaKm2 || 6.4} km² Debris Zone`;

    primaryMetricLabel = "Pre-Event Stable Slope Area";
    primaryMetricValue = `${beforeKm2} km²`;
    secondaryMetricLabel = "Active Debris Slip Zone";
    secondaryMetricValue = `${zone.affectedAreaKm2 || 6.4} km²`;
    impactMetricLabel = "Slope Incline Threat";
    impactMetricValue = `${zone.environmentalData?.slopeDegrees || 42}° Incline`;
    deltaMetricLabel = "InSAR Coherence Drop";
    deltaMetricValue = `+${sarBackscatterDeltaDb} dB`;

    damageFlags = [
      `Highland access pass cut off by debris flow in ${village}, ${zone.state || zone.country}`,
      `${(zone.affectedPopulation || 3000).toLocaleString()} residents cut off across steep mountain terrain (${zone.environmentalData?.slopeDegrees || 42}° slope)`,
      `Geotechnical alert: ${zone.environmentalData?.soilSaturationPercent || 98}% soil moisture saturation recorded`
    ];
  } else if (isCyclone) {
    primary = "Sentinel-1 C-SAR & Doppler Array";
    mode = "SAR Marine Inundation & Wind Scatterometer";
    polarization = "VV + VH (High Resolution)";
    cloudPenetration = "100% (Dense rain-band penetration)";
    sarBackscatterDeltaDb = -8.2;
    statusBannerText = `DEMO / SIMULATED CYCLONE RADAR & DOPPLER PIPELINE (${zone.code || 'ZONE'})`;
    diffTitle = `COASTAL STORM SURGE INUNDATION & EYE VORTEX (${village.toUpperCase()})`;
    diffMetricLabel = "Storm Surge Inundated Footprint";
    diffMetricValue = `+${afterKm2} km²`;

    primaryMetricLabel = "Normal Coastal Baseline";
    primaryMetricValue = `${beforeKm2} km²`;
    secondaryMetricLabel = "Storm Surge Inundation";
    secondaryMetricValue = `${afterKm2} km²`;
    impactMetricLabel = "Cyclone Wind Intensity";
    impactMetricValue = `${zone.environmentalData?.windSpeedKmph || 145} km/h`;
    deltaMetricLabel = "Surge Backscatter Drop";
    deltaMetricValue = `${sarBackscatterDeltaDb} dB`;

    damageFlags = [
      `Coastal barrier bridges and ports flooded in ${village}, ${zone.country}`,
      `Category 4 hurricane storm surge penetrating inland across ${zone.name}`,
      `Doppler radar alert: ${zone.environmentalData?.windSpeedKmph || 145} km/h peak gusts recorded`
    ];
  } else if (isWildfire) {
    primary = "VIIRS Thermal IR & Sentinel-2 SWIR";
    mode = "Short-Wave Infrared & Brightness Temperature";
    polarization = "SWIR B12 / Thermal Band I4";
    cloudPenetration = "100% (SWIR Smoke Penetration)";
    sarBackscatterDeltaDb = -3.5;
    statusBannerText = `DEMO / SIMULATED THERMAL & SWIR PIPELINE (${zone.code || 'ZONE'})`;
    diffTitle = `THERMAL RADIATION & VEGETATION BURN SEVERITY (${village.toUpperCase()})`;
    diffMetricLabel = "Thermal Anomaly Perimeter";
    diffMetricValue = `${afterKm2} km² Burn Core`;

    primaryMetricLabel = "Pre-Fire Green Canopy";
    primaryMetricValue = `${zone.affectedAreaKm2 || 14.5} km²`;
    secondaryMetricLabel = "Active Thermal Fire Front";
    secondaryMetricValue = `${afterKm2} km²`;
    impactMetricLabel = "Core Ambient Temp";
    impactMetricValue = `${zone.environmentalData?.temperatureC || 38}°C`;
    deltaMetricLabel = "Thermal Radiance Anomaly";
    deltaMetricValue = `+8.5 W/m²`;

    damageFlags = [
      `Wildland-urban interface escape roads threatened in ${village}`,
      `Severe thermal radiation core covering ${zone.affectedAreaKm2 || 14.5} km² with dense smoke plumes`,
      `Extreme fire weather: ${zone.environmentalData?.temperatureC || 38}°C and ${zone.environmentalData?.windSpeedKmph || 85} km/h wind gusts`
    ];
  }

  return {
    zoneId: zone.id || zone.code,
    zoneCode: zone.code,
    zoneName: zone.name,
    village: village,
    country: zone.country || 'Global',
    region: zone.region || zone.state || 'Regional Sector',
    disasterType: zone.type || 'Flood',
    severity: zone.severity || 'Critical',
    riskScore: zone.riskScore || 90,
    observationDate: zone.satelliteObservationDate || '2026-08-30 04:12 UTC',
    satellite: {
      primary,
      mode,
      polarization,
      source,
      cloudPenetration,
      missionId: `S1A_IW_GRDH_${(zone.code || 'ZONE').replace(/\s+/g, '')}_${(zone.country || 'GL').substring(0, 2).toUpperCase()}`,
      resolutionMeters: 10,
      statusBannerText,
      diffTitle,
      diffMetricLabel,
      diffMetricValue
    },
    imagery: {
      before: generateZoneSatelliteSvg(zone, 'before'),
      after: generateZoneSatelliteSvg(zone, 'after'),
      difference: generateZoneSatelliteSvg(zone, 'difference')
    },
    analysis: {
      primaryMetricLabel,
      primaryMetricValue,
      secondaryMetricLabel,
      secondaryMetricValue,
      impactMetricLabel,
      impactMetricValue,
      deltaMetricLabel,
      deltaMetricValue,
      baselineAreaKm2: beforeKm2,
      currentAreaKm2: afterKm2,
      expansionPercentage: expansion,
      sarBackscatterDeltaDb,
      damageFlags
    },
    environmentalData: {
      ...(zone.environmentalData || {}),
      rainfallMm: zone.environmentalData?.rainfallMm || 0,
      temperatureC: zone.environmentalData?.temperatureC || 24,
      windSpeedKmph: zone.environmentalData?.windSpeedKmph || 30,
      sensorSource: zone.environmentalData?.sensorSource || 'Ground Sensor Array #01'
    }
  };
}

