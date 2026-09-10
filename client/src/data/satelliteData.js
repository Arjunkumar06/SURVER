/**
 * SURVER Centralized Multi-Zone Satellite Intelligence & Earth Observation Model
 *
 * Provides dedicated, zone-specific satellite telemetry, sensor parameters,
 * damage assessments, and dynamic SVG satellite imagery for all global disaster zones.
 */

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
  const country = zone.country || 'Global';
  const lat = zone.location?.lat?.toFixed(4) || '27.7172';
  const lng = zone.location?.lng?.toFixed(4) || '85.3240';
  const date = zone.satelliteObservationDate || '2026-08-29';
  const area = zone.affectedAreaKm2 || (isFlood ? 11.7 : 8.5);

  // Colors & Themes based on disaster type
  let bg = '#090d16';
  let gridColor = '#1e293b';
  let terrainBase = '#152238';
  let terrainStroke = '#1e3a5f';
  let activeOverlay = '';
  let badgeColor = '#38bdf8';
  let badgeTitle = 'PRE-DISASTER BASELINE (T-0)';
  let badgeMetric = `Normal Area: ${zone.waterCoverageBeforeKm2 || 3.2} km²`;
  let statusBadge = '● Normal State';
  let sensorLabel = zone.satelliteSource || 'Sentinel-1 C-SAR';

  if (type === 'before') {
    // Normal pre-disaster state
    if (isFlood) {
      activeOverlay = `
        <!-- Baseline River / Water Network -->
        <path d="M 0,180 Q 180,190 280,210 T 500,230" fill="none" stroke="#38bdf8" stroke-width="12" stroke-linecap="round" opacity="0.85"/>
        <path d="M 120,0 Q 150,100 200,185" fill="none" stroke="#38bdf8" stroke-width="6" opacity="0.7"/>
      `;
      badgeMetric = `Baseline Water: ${zone.waterCoverageBeforeKm2 || 3.2} km²`;
    } else if (isLandslide) {
      terrainBase = '#1e251d';
      terrainStroke = '#2d3b2a';
      activeOverlay = `
        <!-- Stable Mountain Ridge & Valley Contour -->
        <path d="M 50,380 Q 180,120 320,180 T 560,80" fill="none" stroke="#4ade80" stroke-width="6" stroke-dasharray="6,4" opacity="0.6"/>
        <polygon points="120,380 220,160 340,380" fill="#243321" stroke="#3b5233" stroke-width="1.5" opacity="0.8"/>
        <polygon points="300,380 420,110 520,380" fill="#2a3d27" stroke="#3b5233" stroke-width="1.5" opacity="0.8"/>
      `;
      badgeTitle = 'PRE-EVENT SLOPE BASELINE';
      badgeMetric = `Slope Stability: Normal (38°-48°)`;
      badgeColor = '#4ade80';
    } else if (isCyclone) {
      activeOverlay = `
        <!-- Coastal Baseline Shoreline -->
        <path d="M 460,0 Q 420,150 440,250 Q 460,350 430,400 L 600,400 L 600,0 Z" fill="#0369a1" opacity="0.75"/>
        <path d="M 0,220 Q 200,220 440,250" fill="none" stroke="#38bdf8" stroke-width="8" opacity="0.8"/>
      `;
      badgeTitle = 'PRE-CYCLONE COASTAL BASELINE';
      badgeMetric = `Tidal Baseline: +0.4m MSL`;
      badgeColor = '#38bdf8';
    } else if (isWildfire) {
      terrainBase = '#1c2419';
      activeOverlay = `
        <!-- Dense Green Canopy Baseline -->
        <rect x="60" y="80" width="480" height="240" rx="8" fill="#14532d" opacity="0.5" stroke="#166534" stroke-width="1.5"/>
        <circle cx="180" cy="180" r="45" fill="#15803d" opacity="0.6"/>
        <circle cx="340" cy="200" r="60" fill="#15803d" opacity="0.6"/>
      `;
      badgeTitle = 'PRE-FIRE CANOPY BASELINE';
      badgeMetric = `Fuel Moisture: 45% (Healthy)`;
      badgeColor = '#4ade80';
    }
  } else if (type === 'after') {
    // Post-disaster peak detection
    badgeTitle = `POST-EVENT SATELLITE DETECTION (${date.split(' ')[0]})`;
    badgeColor = '#f87171';
    statusBadge = '▲ CRITICAL IMPACT';

    if (isFlood) {
      activeOverlay = `
        <!-- Inundated Flood Polygon (Translucent Cyan/Blue flood zone) -->
        <path d="M 20,80 Q 150,40 320,90 Q 480,140 560,200 Q 520,320 380,360 Q 200,380 40,320 Z" fill="#0284c7" fill-opacity="0.55" stroke="#38bdf8" stroke-width="2.5"/>
        <path d="M 80,120 Q 220,100 350,150 Q 440,220 420,290 Q 280,340 100,260 Z" fill="#0369a1" fill-opacity="0.65"/>
        <circle cx="280" cy="210" r="14" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
        <text x="300" y="215" fill="#f87171" font-size="11" font-weight="700">SUBMERGED METRO SECTOR</text>
      `;
      badgeMetric = `Inundated Extent: ${zone.waterCoverageAfterKm2 || area} km² (+${zone.waterExpansionPercent || 265}%)`;
    } else if (isLandslide) {
      terrainBase = '#2b1e16';
      activeOverlay = `
        <!-- Debris Flow & Scar Polygon (Red/Orange avalanche trail) -->
        <polygon points="260,70 340,90 420,370 180,380" fill="#b45309" fill-opacity="0.6" stroke="#f59e0b" stroke-width="2.5"/>
        <path d="M 290,100 L 310,360 M 310,120 L 260,350 M 330,130 L 370,360" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4"/>
        <circle cx="300" cy="240" r="12" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
        <text x="320" y="245" fill="#fca5a5" font-size="11" font-weight="700">ROAD BLOCKED (DEBRIS FLOW)</text>
      `;
      badgeMetric = `Debris Slip Area: ${area} km² (Slope Displacement)`;
    } else if (isCyclone) {
      activeOverlay = `
        <!-- Storm Surge Inundation & Eye Vortex -->
        <path d="M 280,0 Q 200,160 220,280 Q 240,360 180,400 L 600,400 L 600,0 Z" fill="#0284c7" fill-opacity="0.65" stroke="#38bdf8" stroke-width="2.5"/>
        <ellipse cx="440" cy="180" rx="110" ry="80" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="10,6"/>
        <circle cx="440" cy="180" r="12" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
        <text x="320" y="140" fill="#f87171" font-size="11" font-weight="700">STORM SURGE: 4.2m INLAND</text>
      `;
      badgeMetric = `Storm Surge Extent: ${area} km² (Wind: ${zone.environmentalData?.windSpeedKmph || 145} km/h)`;
    } else if (isWildfire) {
      terrainBase = '#2b1712';
      activeOverlay = `
        <!-- Active Fire Front & Burn Scar Perimeter (Glowing Red/Amber) -->
        <path d="M 90,90 Q 240,40 380,100 Q 520,160 490,290 Q 380,360 210,340 Q 70,300 90,90 Z" fill="#7f1d1d" fill-opacity="0.7" stroke="#ef4444" stroke-width="3"/>
        <circle cx="280" cy="200" r="50" fill="#ea580c" fill-opacity="0.8"/>
        <circle cx="280" cy="200" r="22" fill="#facc15" fill-opacity="0.9"/>
        <text x="310" y="205" fill="#fef08a" font-size="11" font-weight="700">ACTIVE THERMAL CORE (38°C)</text>
      `;
      badgeMetric = `Burn Perimeter: ${area} km² (High Thermal Anomaly)`;
    }
  } else if (type === 'difference') {
    // SAR / InSAR / Thermal Delta Heatmap
    badgeTitle = isFlood ? 'SAR DUAL-POL (VV/VH) LOG-RATIO DIFFERENCE' :
                 isLandslide ? 'InSAR INTERFEROMETRIC COHERENCE LOSS' :
                 isCyclone ? 'STORM SURGE WATER DELTA HEATMAP' :
                 'THERMAL IR VEGETATION RADIANCE MAP';
    badgeColor = '#fbbf24';
    statusBadge = '● Anomaly Confirmed';

    if (isFlood) {
      activeOverlay = `
        <defs>
          <radialGradient id="heatGrad" cx="45%" cy="55%" r="45%">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.9"/>
            <stop offset="40%" stop-color="#f97316" stop-opacity="0.75"/>
            <stop offset="70%" stop-color="#eab308" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.1"/>
          </radialGradient>
        </defs>
        <ellipse cx="280" cy="220" rx="220" ry="140" fill="url(#heatGrad)" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4"/>
        <text x="220" y="225" fill="#ffffff" font-size="12" font-weight="800">Δ SAR BACKSCATTER: -6.8 dB</text>
      `;
      badgeMetric = `Specular Water Drop: -6.8 dB (Confidence 95%)`;
    } else if (isLandslide) {
      activeOverlay = `
        <polygon points="260,70 340,90 420,370 180,380" fill="#ef4444" fill-opacity="0.75" stroke="#f87171" stroke-width="2"/>
        <text x="210" y="240" fill="#ffffff" font-size="12" font-weight="800">COHERENCE LOSS: +4.2 dB</text>
      `;
      badgeMetric = `Slope Deformation: +4.2 dB Coherence Drop`;
    } else if (isCyclone) {
      activeOverlay = `
        <rect x="200" y="40" width="360" height="320" rx="12" fill="#ef4444" fill-opacity="0.65" stroke="#f87171" stroke-width="2.5"/>
        <text x="240" y="200" fill="#ffffff" font-size="12" font-weight="800">SURGE INUNDATION DELTA: +9.3 km²</text>
      `;
      badgeMetric = `Coastal Radar Surge Delta: -8.2 dB`;
    } else if (isWildfire) {
      activeOverlay = `
        <circle cx="280" cy="200" r="140" fill="#dc2626" fill-opacity="0.8" stroke="#facc15" stroke-width="3"/>
        <text x="200" y="205" fill="#ffffff" font-size="12" font-weight="800">THERMAL RADIANCE: +8.5 W/m²</text>
      `;
      badgeMetric = `Thermal Rad Delta: +8.5 W/m² (Severe)`;
    }
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%" style="background:${bg}; font-family: 'JetBrains Mono', monospace;">
      <defs>
        <pattern id="grid_${type}_${code.replace(/[^a-zA-Z0-9]/g, '')}" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="${gridColor}" stroke-width="0.8"/>
        </pattern>
      </defs>

      <!-- Background Grid -->
      <rect width="600" height="400" fill="url(#grid_${type}_${code.replace(/[^a-zA-Z0-9]/g, '')})" />

      <!-- Base Terrain Boundary -->
      <path d="M 0,0 L 480,0 Q 440,160 460,260 Q 480,360 450,400 L 0,400 Z" fill="${terrainBase}" stroke="${terrainStroke}" stroke-width="1.5" />

      <!-- Roads & Urban Grid -->
      <path d="M 40,50 L 420,50 M 60,120 L 400,120 M 40,280 L 410,280 M 160,20 L 160,380 M 300,20 L 300,380" stroke="#334155" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.5"/>

      <!-- Settlements / Facilities -->
      <rect x="70" y="70" width="40" height="28" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1" opacity="0.8"/>
      <rect x="130" y="70" width="45" height="28" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1" opacity="0.8"/>
      <rect x="80" y="230" width="55" height="35" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1" opacity="0.8"/>
      <rect x="220" y="240" width="65" height="40" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1" opacity="0.8"/>

      <!-- Dynamic Disaster & Satellite Overlays -->
      ${activeOverlay}

      <!-- Top Header Telemetry Badge -->
      <rect x="16" y="16" width="310" height="54" rx="6" fill="#0b1120" fill-opacity="0.9" stroke="#334155" stroke-width="1.2"/>
      <text x="28" y="34" fill="#94a3b8" font-size="9.5" font-weight="700" letter-spacing="0.8">${badgeTitle}</text>
      <text x="28" y="52" fill="${badgeColor}" font-size="12" font-weight="800">${badgeMetric}</text>

      <!-- GPS Watermark Box -->
      <rect x="16" y="348" width="260" height="38" rx="5" fill="#0b1120" fill-opacity="0.9" stroke="#334155" stroke-width="1"/>
      <text x="26" y="364" fill="#38bdf8" font-size="10" font-weight="800">${code} • ${country.toUpperCase()}</text>
      <text x="26" y="377" fill="#64748b" font-size="9">GPS: ${lat}° N, ${lng}° E</text>

      <!-- Sensor Status Bottom Right Badge -->
      <rect x="370" y="342" width="214" height="44" rx="6" fill="#0b1120" fill-opacity="0.9" stroke="#334155" stroke-width="1.2"/>
      <text x="382" y="358" fill="#64748b" font-size="8.5">SENSOR: ${sensorLabel}</text>
      <text x="382" y="374" fill="${badgeColor}" font-size="10.5" font-weight="700">${statusBadge}</text>
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

  const beforeKm2 = isWildfire ? (zone.affectedAreaKm2 || 18.2) : (zone.waterCoverageBeforeKm2 || (isFlood ? 3.2 : (isCyclone ? 3.5 : 0.8)));
  const afterKm2 = (isWildfire || isLandslide) ? (zone.affectedAreaKm2 || (isWildfire ? 18.2 : 6.4)) : (zone.waterCoverageAfterKm2 || zone.affectedAreaKm2 || (isFlood ? 11.7 : 8.5));
  const expansion = isWildfire ? 0 : (zone.waterExpansionPercent || (beforeKm2 > 0 ? Number((((afterKm2 - beforeKm2) / beforeKm2) * 100).toFixed(1)) : 220));

  let primary = "Sentinel-1 C-SAR";
  let mode = "SAR Dual-Pol IW (VV/VH)";
  let polarization = "VV + VH";
  let source = "Copernicus Data Space Ecosystem";
  let cloudPenetration = "100% (Radar all-weather penetration)";
  let sarBackscatterDeltaDb = -6.8;
  let statusBannerText = "DEMO / SIMULATED SATELLITE RADAR PIPELINE (Sentinel-1 C-Band)";
  let diffTitle = "SAR DUAL-POLARIZATION (VV/VH) LOG-RATIO DIFFERENCE HEATMAP";
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
    `Direct perimeter exposure of ${(zone.affectedPopulation || 5000).toLocaleString()} vulnerable citizens in ${zone.name}`,
    `Telemetry confirmed via ${zone.environmentalData?.sensorSource || 'Ground Sensor Array #01'}`
  ];

  if (isLandslide) {
    primary = "Sentinel-2 MSI & ALOS PALSAR";
    mode = "Optical SWIR & InSAR Coherence";
    polarization = "SWIR B11/B12 + InSAR";
    cloudPenetration = "85% (Combined optical-InSAR interferometry)";
    sarBackscatterDeltaDb = +4.2;
    statusBannerText = "DEMO / SIMULATED SATELLITE OPTICAL & InSAR PIPELINE (Sentinel-2 & ALOS)";
    diffTitle = "InSAR INTERFEROMETRIC SURFACE COHERENCE LOSS HEATMAP";
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
      `Highland access pass cut off by debris flow in ${zone.region || zone.country}`,
      `${(zone.affectedPopulation || 3000).toLocaleString()} residents cut off across steep mountain terrain (${zone.environmentalData?.slopeDegrees || 42}° slope)`,
      `Geotechnical alert: ${zone.environmentalData?.soilSaturationPercent || 98}% soil moisture saturation recorded`
    ];
  } else if (isCyclone) {
    primary = "Sentinel-1 C-SAR & Doppler Array";
    mode = "SAR Marine Inundation & Wind Scatterometer";
    polarization = "VV + VH (High Resolution)";
    cloudPenetration = "100% (Dense rain-band penetration)";
    sarBackscatterDeltaDb = -8.2;
    statusBannerText = "DEMO / SIMULATED CYCLONE RADAR & DOPPLER PIPELINE (Sentinel-1 C-SAR)";
    diffTitle = "COASTAL STORM SURGE INUNDATION & EYE VORTEX HEATMAP";
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
      `Coastal barrier bridges and ports flooded in ${zone.region || zone.country}`,
      `Category 4 hurricane storm surge penetrating inland across ${zone.name}`,
      `Doppler radar alert: ${zone.environmentalData?.windSpeedKmph || 145} km/h peak gusts recorded`
    ];
  } else if (isWildfire) {
    primary = "VIIRS Thermal IR & Sentinel-2 SWIR";
    mode = "Short-Wave Infrared & Brightness Temperature";
    polarization = "SWIR B12 / Thermal Band I4";
    cloudPenetration = "100% (SWIR Smoke Penetration)";
    sarBackscatterDeltaDb = -3.5;
    statusBannerText = "DEMO / SIMULATED THERMAL & SWIR WILDFIRE PIPELINE (VIIRS & Sentinel-2)";
    diffTitle = "THERMAL RADIATION & VEGETATION BURN SEVERITY HEATMAP";
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
      `Wildland-urban interface escape roads threatened in ${zone.region || zone.country}`,
      `Severe thermal radiation core covering ${zone.affectedAreaKm2 || 14.5} km² with dense smoke plumes`,
      `Extreme fire weather: ${zone.environmentalData?.temperatureC || 38}°C and ${zone.environmentalData?.windSpeedKmph || 85} km/h wind gusts`
    ];
  }

  return {
    zoneId: zone.id || zone.code,
    zoneCode: zone.code,
    zoneName: zone.name,
    country: zone.country || 'Global',
    region: zone.region || 'Regional Sector',
    disasterType: zone.type || 'Flood',
    severity: zone.severity || 'Critical',
    riskScore: zone.riskScore || 90,
    observationDate: zone.satelliteObservationDate || '2026-08-29 04:12 UTC',
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
