export const sihMetadata = {
  problemId: "26192",
  title: "Flash Flood Prediction System for Hilly Regions using Multi-Source Data",
  organization: "Ministry of Home Affairs",
  department: "National Disaster Response Force (NDRF), DM Division",
  category: "Software",
  theme: "Disaster Management",
  disclaimer: "Prototype system for Smart India Hackathon 2026 demonstration. Risk predictions shown use simulated/demo data and are not a substitute for official disaster warnings."
};

export const initialDisasters = [
  // ==========================================
  // INDIAN HILLY REGION SCENARIOS (SIH 2026 PROBLEM STATEMENT 26192)
  // ==========================================
  {
    id: "zone-uk-1",
    name: "Joshimath Slope Failure & Alaknanda Flash Flood Sector",
    code: "ZONE UK-01",
    country: "India",
    state: "Uttarakhand",
    district: "Chamoli",
    tehsil: "Joshimath",
    village: "Joshimath Ward 4 & 5",
    ward: "Ward 4 (Sunil)",
    region: "Hilly Region Sector",
    type: "Flash Flood & Landslide",
    severity: "Critical",
    warningLevel: "CRITICAL",
    riskScore: 94,
    leadTimeMinutes: 28,
    sensorMode: "Real-Time Multi-Source IoT Fusion",
    location: {
      lat: 30.5568,
      lng: 79.5661,
      address: "Alaknanda River Confluence & Slope Corridor",
      city: "Joshimath",
      state: "Uttarakhand",
      country: "India"
    },
    affectedPopulation: 4820,
    affectedAreaKm2: 8.5,
    roadAccessibilityPercent: 32,
    waterCoverageBeforeKm2: 1.2,
    waterCoverageAfterKm2: 5.8,
    waterExpansionPercent: 383.3,
    slopeAngleDegrees: 38,
    slopeStabilityIndex: 0.42,
    historicalLandslideCount: 6,
    iotStatus: "CRITICAL",
    evacuationReadiness: "EVACUATION RECOMMENDED",
    safeShelter: {
      id: "SHELTER-UK01",
      name: "Joshimath High Ground Refuge Dome",
      distanceKm: 2.4,
      travelTimeMinutes: 14,
      capacity: 800
    },
    satelliteSource: "Sentinel-1 SAR + ALOS PALSAR",
    satelliteObservationDate: "2026-08-30",
    status: "Active",
    description: "Cloudburst rainfall over upper Alaknanda catchment combined with high soil saturation and slope instability triggered imminent flash flood and landslide risk.",
    environmentalData: {
      rainfallMm: 112.5,
      riverLevelM: 5.8,
      soilSaturationPercent: 89,
      windSpeedKmph: 45,
      slopeDegrees: 38,
      temperatureC: 17,
      sensorSource: "IoT Telemetric Cluster #UK-JM01"
    },
    suggestedRequirements: {
      waterKits: 480,
      foodKits: 350,
      ambulances: 4,
      rescueTeams: 5,
      boats: 2,
      medicalKits: 300
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "zone-uk-2",
    name: "Kedarnath Mandakini Basin Torrential Corridor",
    code: "ZONE UK-02",
    country: "India",
    state: "Uttarakhand",
    district: "Rudraprayag",
    tehsil: "Ukhimath",
    village: "Gaurikund / Rambara Corridor",
    ward: "Ward 2",
    region: "Hilly Region Sector",
    type: "Flash Flood",
    severity: "Critical",
    warningLevel: "CRITICAL",
    riskScore: 91,
    leadTimeMinutes: 35,
    sensorMode: "Real-Time Multi-Source IoT Fusion",
    location: {
      lat: 30.6522,
      lng: 79.0256,
      address: "Mandakini River Headwaters",
      city: "Gaurikund",
      state: "Uttarakhand",
      country: "India"
    },
    affectedPopulation: 6100,
    affectedAreaKm2: 12.4,
    roadAccessibilityPercent: 28,
    waterCoverageBeforeKm2: 2.1,
    waterCoverageAfterKm2: 8.9,
    waterExpansionPercent: 323.8,
    slopeAngleDegrees: 44,
    slopeStabilityIndex: 0.48,
    historicalLandslideCount: 9,
    iotStatus: "CRITICAL",
    evacuationReadiness: "EVACUATION RECOMMENDED",
    safeShelter: {
      id: "SHELTER-UK02",
      name: "Pipalkoti NDRF High Ground Staging Camp",
      distanceKm: 8.1,
      travelTimeMinutes: 32,
      capacity: 1500
    },
    satelliteSource: "Sentinel-1 SAR",
    satelliteObservationDate: "2026-08-30",
    status: "Active",
    description: "Rapid water level rise in Mandakini river driven by localized cloudburst and steep catchment runoff.",
    environmentalData: {
      rainfallMm: 128.0,
      riverLevelM: 6.4,
      soilSaturationPercent: 94,
      windSpeedKmph: 50,
      slopeDegrees: 44,
      temperatureC: 15,
      sensorSource: "Hydrological River Radar #UK-KN02"
    },
    suggestedRequirements: {
      waterKits: 610,
      foodKits: 450,
      ambulances: 5,
      rescueTeams: 6,
      boats: 3,
      medicalKits: 400
    },
    createdAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: "zone-hp-1",
    name: "Kullu Valley Beas River Surge Sector",
    code: "ZONE HP-01",
    country: "India",
    state: "Himachal Pradesh",
    district: "Kullu",
    tehsil: "Manali",
    village: "Solang Nallah & Palchan",
    ward: "Ward 1",
    region: "Hilly Region Sector",
    type: "Flash Flood",
    severity: "High",
    warningLevel: "WARNING",
    riskScore: 84,
    leadTimeMinutes: 42,
    sensorMode: "Real-Time Multi-Source IoT Fusion",
    location: {
      lat: 32.2432,
      lng: 77.1892,
      address: "Beas River Basin Sector, Palchan",
      city: "Manali / Kullu",
      state: "Himachal Pradesh",
      country: "India"
    },
    affectedPopulation: 5400,
    affectedAreaKm2: 9.2,
    roadAccessibilityPercent: 52,
    waterCoverageBeforeKm2: 1.8,
    waterCoverageAfterKm2: 5.4,
    waterExpansionPercent: 200.0,
    slopeAngleDegrees: 32,
    slopeStabilityIndex: 0.55,
    historicalLandslideCount: 5,
    iotStatus: "WARNING",
    evacuationReadiness: "STANDBY FOR EVACUATION",
    safeShelter: {
      id: "SHELTER-HP01",
      name: "Kullu Indoor Sports Complex Refuge Center",
      distanceKm: 3.5,
      travelTimeMinutes: 18,
      capacity: 1200
    },
    satelliteSource: "Sentinel-2 MSI",
    satelliteObservationDate: "2026-08-30",
    status: "Active",
    description: "Beas river surge washing over low banks after continuous overnight mountain precipitation.",
    environmentalData: {
      rainfallMm: 95.0,
      riverLevelM: 4.5,
      soilSaturationPercent: 84,
      windSpeedKmph: 32,
      slopeDegrees: 32,
      temperatureC: 18,
      sensorSource: "Hydro-Acoustic Sensor #HP-KL01"
    },
    suggestedRequirements: {
      waterKits: 540,
      foodKits: 380,
      ambulances: 3,
      rescueTeams: 4,
      boats: 2,
      medicalKits: 280
    },
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "zone-sk-1",
    name: "Lachen Teesta Stage III Glacial Flash Flood Corridor",
    code: "ZONE SK-01",
    country: "India",
    state: "Sikkim",
    district: "North Sikkim",
    tehsil: "Chungthang",
    village: "Lachen Valley / Chungthang",
    ward: "Ward 3",
    region: "Hilly Region Sector",
    type: "Flash Flood & Landslide",
    severity: "Critical",
    warningLevel: "CRITICAL",
    riskScore: 96,
    leadTimeMinutes: 18,
    sensorMode: "Real-Time Multi-Source IoT Fusion",
    location: {
      lat: 27.7025,
      lng: 88.5492,
      address: "Teesta River High Altitude Basin",
      city: "Chungthang",
      state: "Sikkim",
      country: "India"
    },
    affectedPopulation: 2850,
    affectedAreaKm2: 7.1,
    roadAccessibilityPercent: 20,
    waterCoverageBeforeKm2: 1.1,
    waterCoverageAfterKm2: 5.9,
    waterExpansionPercent: 436.3,
    slopeAngleDegrees: 48,
    slopeStabilityIndex: 0.36,
    historicalLandslideCount: 8,
    iotStatus: "CRITICAL",
    evacuationReadiness: "IMMEDIATE EVACUATION REQUIRED",
    safeShelter: {
      id: "SHELTER-SK01",
      name: "Chungthang High Ground Battalion Shelter",
      distanceKm: 4.2,
      travelTimeMinutes: 22,
      capacity: 600
    },
    satelliteSource: "Sentinel-1 SAR",
    satelliteObservationDate: "2026-08-30",
    status: "Active",
    description: "Rapid surge in upper Teesta basin caused by high-altitude lake discharge and torrential downpour.",
    environmentalData: {
      rainfallMm: 145.0,
      riverLevelM: 7.8,
      soilSaturationPercent: 97,
      windSpeedKmph: 55,
      slopeDegrees: 48,
      temperatureC: 12,
      sensorSource: "Glacial Lake Outburst Radar #SK-LC01"
    },
    suggestedRequirements: {
      waterKits: 280,
      foodKits: 200,
      ambulances: 2,
      rescueTeams: 5,
      boats: 3,
      medicalKits: 220
    },
    createdAt: new Date(Date.now() - 5400000).toISOString()
  },
  {
    id: "zone-mg-1",
    name: "Cherrapunji Plateau Extreme Runoff Sector",
    code: "ZONE MG-01",
    country: "India",
    state: "Meghalaya",
    district: "East Khasi Hills",
    tehsil: "Sohra",
    village: "Nohkalikai / Sohra Sector",
    ward: "Ward 1",
    region: "Hilly Region Sector",
    type: "Flash Flood",
    severity: "High",
    warningLevel: "WARNING",
    riskScore: 82,
    leadTimeMinutes: 40,
    sensorMode: "Real-Time Multi-Source IoT Fusion",
    location: {
      lat: 25.2986,
      lng: 91.7324,
      address: "Sohra High-Volume Catchment Plain",
      city: "Cherrapunji / Sohra",
      state: "Meghalaya",
      country: "India"
    },
    affectedPopulation: 4100,
    affectedAreaKm2: 10.5,
    roadAccessibilityPercent: 60,
    waterCoverageBeforeKm2: 2.5,
    waterCoverageAfterKm2: 7.5,
    waterExpansionPercent: 200.0,
    slopeAngleDegrees: 28,
    slopeStabilityIndex: 0.62,
    historicalLandslideCount: 4,
    iotStatus: "WARNING",
    evacuationReadiness: "STANDBY FOR EVACUATION",
    safeShelter: {
      id: "SHELTER-MG01",
      name: "Sohra Community Higher Elevation Hall",
      distanceKm: 2.1,
      travelTimeMinutes: 12,
      capacity: 1000
    },
    satelliteSource: "Sentinel-2 MSI",
    satelliteObservationDate: "2026-08-30",
    status: "Active",
    description: "Monsoonal deluge causing high velocity overland runoff and flash flooding across lower valley settlements.",
    environmentalData: {
      rainfallMm: 180.0,
      riverLevelM: 4.8,
      soilSaturationPercent: 91,
      windSpeedKmph: 40,
      slopeDegrees: 28,
      temperatureC: 21,
      sensorSource: "High-Volume Pluviometer #MG-CP01"
    },
    suggestedRequirements: {
      waterKits: 410,
      foodKits: 300,
      ambulances: 3,
      rescueTeams: 4,
      boats: 1,
      medicalKits: 250
    },
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },

  // ==========================================
  // NEPAL & GLOBAL SCENARIOS (PRESERVED)
  // ==========================================
  {
    id: "zone-nepal-1",
    name: "Kathmandu Flood Zone — Bagmati River Basin",
    code: "ZONE NP-1",
    country: "Nepal",
    region: "Bagmati Province",
    type: "Flood",
    severity: "Critical",
    riskScore: 92,
    sensorMode: "Real-Time Satellite Mode",
    location: {
      lat: 27.7172,
      lng: 85.3240,
      address: "Bagmati River Basin Sector, Kathmandu Valley",
      city: "Kathmandu",
      country: "Nepal"
    },
    affectedPopulation: 8400,
    affectedAreaKm2: 11.7,
    roadAccessibilityPercent: 40,
    waterCoverageBeforeKm2: 3.2,
    waterCoverageAfterKm2: 11.7,
    waterExpansionPercent: 265.6,
    satelliteSource: "Sentinel-1 SAR",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Monsoonal flash flooding and severe cloudburst over Kathmandu Valley caused rapid overflowing of the Bagmati river.",
    environmentalData: {
      rainfallMm: 195.0,
      riverLevelM: 4.9,
      soilSaturationPercent: 97,
      windSpeedKmph: 42,
      slopeDegrees: 8,
      temperatureC: 22,
      sensorSource: "IoT Hydrostatic River Station #NP-BG01"
    },
    suggestedRequirements: {
      waterKits: 840,
      foodKits: 500,
      ambulances: 3,
      rescueTeams: 4,
      boats: 2,
      medicalKits: 350
    },
    createdAt: new Date().toISOString()
  }
];

export const initialSensors = [
  {
    id: "RAIN-UK01",
    name: "Joshimath Heights Rain Gauge",
    type: "Rain Gauge",
    village: "Joshimath Ward 4 & 5",
    district: "Chamoli",
    state: "Uttarakhand",
    value: 112.5,
    unit: "mm/hr",
    status: "CRITICAL",
    batteryPercent: 92,
    signalStrengthPercent: 98,
    lastUpdated: "Just now"
  },
  {
    id: "SOIL-UK01",
    name: "Joshimath Slope Moisture Probe",
    type: "Soil Moisture",
    village: "Joshimath Ward 4 & 5",
    district: "Chamoli",
    state: "Uttarakhand",
    value: 89,
    unit: "%",
    status: "CRITICAL",
    batteryPercent: 88,
    signalStrengthPercent: 95,
    lastUpdated: "Just now"
  },
  {
    id: "SLOPE-UK01",
    name: "Joshimath Geotechnical Inclinometer",
    type: "Slope Stability",
    village: "Joshimath Ward 4 & 5",
    district: "Chamoli",
    state: "Uttarakhand",
    value: 0.42,
    unit: "Index",
    status: "WARNING",
    batteryPercent: 85,
    signalStrengthPercent: 90,
    lastUpdated: "2 mins ago"
  },
  {
    id: "WATER-UK02",
    name: "Alaknanda Hydrostatic Level Gauge",
    type: "Water Level",
    village: "Joshimath Ward 4 & 5",
    district: "Chamoli",
    state: "Uttarakhand",
    value: 5.8,
    unit: "meters",
    status: "CRITICAL",
    batteryPercent: 96,
    signalStrengthPercent: 99,
    lastUpdated: "Just now"
  },
  {
    id: "RAIN-HP01",
    name: "Kullu Solang Catchment Pluviometer",
    type: "Rain Gauge",
    village: "Solang Nallah & Palchan",
    district: "Kullu",
    state: "Himachal Pradesh",
    value: 95.0,
    unit: "mm/hr",
    status: "WARNING",
    batteryPercent: 90,
    signalStrengthPercent: 94,
    lastUpdated: "1 min ago"
  },
  {
    id: "SOIL-HP01",
    name: "Palchan Forest Moisture Sensor",
    type: "Soil Moisture",
    village: "Solang Nallah & Palchan",
    district: "Kullu",
    state: "Himachal Pradesh",
    value: 84,
    unit: "%",
    status: "ONLINE",
    batteryPercent: 91,
    signalStrengthPercent: 96,
    lastUpdated: "3 mins ago"
  },
  {
    id: "RAIN-SK01",
    name: "Lachen Teesta High Altitude Pluviometer",
    type: "Rain Gauge",
    village: "Lachen Valley / Chungthang",
    district: "North Sikkim",
    state: "Sikkim",
    value: 145.0,
    unit: "mm/hr",
    status: "CRITICAL",
    batteryPercent: 84,
    signalStrengthPercent: 89,
    lastUpdated: "Just now"
  },
  {
    id: "WATER-SK01",
    name: "Teesta Stage III Flash Surge Radar",
    type: "Water Level",
    village: "Lachen Valley / Chungthang",
    district: "North Sikkim",
    state: "Sikkim",
    value: 7.8,
    unit: "meters",
    status: "CRITICAL",
    batteryPercent: 87,
    signalStrengthPercent: 91,
    lastUpdated: "Just now"
  }
];

export const initialHistoricalEvents = [
  {
    id: "HIST-2023-UK01",
    title: "Joshimath Landslide & Subsidence Crisis",
    date: "2023-01-05",
    hazardType: "Landslide",
    state: "Uttarakhand",
    district: "Chamoli",
    location: "Joshimath Town & Marwari Corridor",
    severity: "Critical",
    rainfallMm: 142.0,
    affectedPopulation: 5200,
    description: "Widespread slope instability and subterranean water seepage causing rapid ground subsidence and building structural failures."
  },
  {
    id: "HIST-2023-HP01",
    title: "Beas River Monsoon Flash Flood Deluge",
    date: "2023-07-09",
    hazardType: "Flash Flood",
    state: "Himachal Pradesh",
    district: "Kullu",
    location: "Manali - Kullu Beas River Valley",
    severity: "Critical",
    rainfallMm: 185.0,
    affectedPopulation: 12400,
    description: "Record cloudburst rainfall causing catastrophic river surge washing over NH-3 highways and urban market plazas."
  },
  {
    id: "HIST-2023-SK01",
    title: "South Lhonak GLOF Teesta Dam Breach",
    date: "2023-10-04",
    hazardType: "Flash Flood",
    state: "Sikkim",
    district: "North Sikkim",
    location: "Chungthang & Lachen Valley",
    severity: "Critical",
    rainfallMm: 165.0,
    affectedPopulation: 8500,
    description: "Glacial lake outburst flood triggering massive surge along Teesta river, destroying Teesta Stage III dam infrastructure."
  },
  {
    id: "HIST-2021-UK02",
    title: "Rishiganga Glacier Breach & Flash Flood",
    date: "2021-02-07",
    hazardType: "Flash Flood & Landslide",
    state: "Uttarakhand",
    district: "Chamoli",
    location: "Raini & Tapovan Gorge",
    severity: "Critical",
    rainfallMm: 98.0,
    affectedPopulation: 3400,
    description: "Rock ice avalanche into Rishiganga river creating massive flood wave downstream."
  }
];

export const initialShelters = [
  {
    id: "SHELTER-UK01",
    name: "Joshimath High Ground Refuge Dome",
    district: "Chamoli",
    state: "Uttarakhand",
    village: "Joshimath Ward 4 & 5",
    elevationM: 2100,
    capacity: 800,
    currentOccupancy: 120,
    distanceKm: 2.4,
    travelTimeMinutes: 14,
    recommendedRoute: "Joshimath Bypass High-Ground Ridge Road",
    status: "OPEN"
  },
  {
    id: "SHELTER-UK02",
    name: "Pipalkoti NDRF High Ground Staging Camp",
    district: "Chamoli",
    state: "Uttarakhand",
    village: "Gaurikund / Rambara Corridor",
    elevationM: 1450,
    capacity: 1500,
    currentOccupancy: 340,
    distanceKm: 8.1,
    travelTimeMinutes: 32,
    recommendedRoute: "Helipad Access Road 2",
    status: "OPEN"
  },
  {
    id: "SHELTER-HP01",
    name: "Kullu Indoor Sports Complex Refuge Center",
    district: "Kullu",
    state: "Himachal Pradesh",
    village: "Solang Nallah & Palchan",
    elevationM: 1280,
    capacity: 1200,
    currentOccupancy: 210,
    distanceKm: 3.5,
    travelTimeMinutes: 18,
    recommendedRoute: "Left Bank Bypass Highway",
    status: "OPEN"
  },
  {
    id: "SHELTER-SK01",
    name: "Chungthang High Ground Battalion Shelter",
    district: "North Sikkim",
    state: "Sikkim",
    village: "Lachen Valley / Chungthang",
    elevationM: 1750,
    capacity: 600,
    currentOccupancy: 85,
    distanceKm: 4.2,
    travelTimeMinutes: 22,
    recommendedRoute: "Army Ridge Access Footpath",
    status: "OPEN"
  }
];

export const initialFacilities = [
  {
    id: "fac-uk-1",
    name: "NDRF 15th Battalion Logistics Base — Joshimath",
    code: "HUB-UK01",
    location: { lat: 30.5600, lng: 79.5700, city: "Joshimath", state: "Uttarakhand", country: "India" },
    status: "Operational",
    inventory: { waterKits: 4500, foodKits: 3200, medicalKits: 1400, rescueTeams: 12, ambulances: 8, boats: 4 }
  },
  {
    id: "fac-hp-1",
    name: "Himachal State Disaster Relief Depot — Kullu",
    code: "HUB-HP01",
    location: { lat: 31.9500, lng: 77.1000, city: "Kullu", state: "Himachal Pradesh", country: "India" },
    status: "Operational",
    inventory: { waterKits: 3800, foodKits: 2800, medicalKits: 950, rescueTeams: 10, ambulances: 6, boats: 3 }
  },
  {
    id: "fac-sk-1",
    name: "Sikkim High-Altitude Emergency Depot — Gangtok",
    code: "HUB-SK01",
    location: { lat: 27.3300, lng: 88.6100, city: "Gangtok", state: "Sikkim", country: "India" },
    status: "Operational",
    inventory: { waterKits: 2500, foodKits: 2000, medicalKits: 800, rescueTeams: 8, ambulances: 5, boats: 4 }
  },
  {
    id: "fac-nepal-1",
    name: "Kathmandu Central Emergency Logistics Hub",
    code: "HUB-NP01",
    location: { lat: 27.7000, lng: 85.3400, city: "Kathmandu", country: "Nepal" },
    status: "Operational",
    inventory: { waterKits: 5000, foodKits: 3500, medicalKits: 1200, rescueTeams: 15, ambulances: 8, boats: 4 }
  }
];

export const initialResponsePlans = [
  {
    id: "RP-26192-01",
    disasterId: "zone-uk-1",
    zoneCode: "ZONE UK-01",
    disasterName: "Joshimath Slope Failure & Alaknanda Flash Flood Sector",
    country: "India",
    disasterType: "Flash Flood & Landslide",
    priorityScore: 96,
    status: "Approved",
    workflowState: "In Execution",
    coverage: 88,
    resourceUtilization: 94,
    estimatedResponseTimeMinutes: 14,
    allocations: [
      { resourceType: "ambulances", quantity: 4, unit: "units", sourceFacility: "NDRF 15th Battalion Base", lat: 30.5600, lng: 79.5700 },
      { resourceType: "waterKits", quantity: 480, unit: "kits", sourceFacility: "NDRF 15th Battalion Base", lat: 30.5600, lng: 79.5700 },
      { resourceType: "foodKits", quantity: 350, unit: "kits", sourceFacility: "NDRF 15th Battalion Base", lat: 30.5600, lng: 79.5700 },
      { resourceType: "rescueTeams", quantity: 5, unit: "teams", sourceFacility: "NDRF 15th Battalion Base", lat: 30.5600, lng: 79.5700 },
      { resourceType: "boats", quantity: 2, unit: "vessels", sourceFacility: "NDRF 15th Battalion Base", lat: 30.5600, lng: 79.5700 },
      { resourceType: "medicalKits", quantity: 300, unit: "kits", sourceFacility: "Joshimath District Civil Hospital", lat: 30.5500, lng: 79.5600 }
    ],
    shortages: [],
    explanation: {
      summary: "Joshimath Sector (ZONE UK-01) prioritized with 96/100 score due to 112.5 mm/hr cloudburst rainfall, 89% soil saturation, 0.42 slope stability index, 4,820 residents exposed, and 28-minute time-to-impact.",
      factors: [
        { title: "Extreme Rainfall Intensity", score: "+30 pts", detail: "112.5 mm/hr cloudburst exceeding 60 mm/hr threshold" },
        { title: "Soil Saturation & Moisture", score: "+20 pts", detail: "89% soil saturation reducing shear strength" },
        { title: "Slope Instability Index", score: "+20 pts", detail: "38° slope angle with 0.42 stability index" },
        { title: "Historical Vulnerability", score: "+13 pts", detail: "6 previous recorded landslide events" },
        { title: "Real-Time IoT Trigger", score: "+13 pts", detail: "Critical rain & Alaknanda river level alerts" }
      ]
    },
    createdAt: new Date().toISOString()
  }
];
