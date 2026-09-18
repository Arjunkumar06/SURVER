export const sihMetadata = {
  problemId: "26192",
  title: "Flash Flood Prediction System for Hilly Regions using Multi-Source Data",
  organization: "Ministry of Home Affairs",
  department: "National Disaster Response Force (NDRF), DM Division",
  category: "Software",
  theme: "Disaster Management",
  disclaimer: "Prototype system for Smart India Hackathon 2026 demonstration. Risk predictions shown use simulated/demo data and are not a substitute for official disaster warnings."
};

export const fallbackDisasters = [
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
  }
];

export const fallbackSensors = [
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
  }
];

export const fallbackHistoricalEvents = [
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
    description: "Widespread slope instability and subterranean water seepage causing rapid ground subsidence."
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
    description: "Record cloudburst rainfall causing catastrophic river surge washing over NH-3 highways."
  }
];

export const fallbackShelters = [
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
  }
];

export const fallbackFacilities = [
  {
    id: "fac-uk-1",
    name: "NDRF 15th Battalion Logistics Base — Joshimath",
    code: "HUB-UK01",
    location: { lat: 30.5600, lng: 79.5700, city: "Joshimath", state: "Uttarakhand", country: "India" },
    status: "Operational",
    inventory: { waterKits: 4500, foodKits: 3200, medicalKits: 1400, rescueTeams: 12, ambulances: 8, boats: 4 }
  }
];

export const fallbackResponsePlans = [
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
    createdAt: new Date().toISOString()
  }
];

export const fallbackAnalytics = {
  activeEmergencies: 8,
  criticalZones: 4,
  peopleAtRisk: 42600,
  totalResourcesAvailable: 28700,
  responseEfficiency: 94,
  disasterDistribution: [
    { name: "Flash Flood", count: 4 },
    { name: "Landslide", count: 3 },
    { name: "Cyclone", count: 1 }
  ],
  resourceStockData: [
    { name: "Water Kits", count: 28700 },
    { name: "Food Kits", count: 19300 },
    { name: "Medical Kits", count: 7300 },
    { name: "Ambulances", count: 47 },
    { name: "Rescue Teams", count: 63 },
    { name: "Boats", count: 29 }
  ]
};
