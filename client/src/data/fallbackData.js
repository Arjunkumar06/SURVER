export const fallbackDisasters = [
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
    description: "Monsoonal flash flooding and severe cloudburst over Kathmandu Valley caused rapid overflowing of the Bagmati river. Submerged low-lying riverside corridors.",
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
  },
  {
    id: "zone-nepal-2",
    name: "Pokhara Seti Gorge Landslide Corridor",
    code: "ZONE NP-2",
    country: "Nepal",
    region: "Gandaki Province",
    type: "Landslide",
    severity: "High",
    riskScore: 78,
    sensorMode: "Environmental Sensor Mode",
    location: {
      lat: 28.2096,
      lng: 83.9856,
      address: "Seti River Gorge Bypass Sector",
      city: "Pokhara",
      country: "Nepal"
    },
    affectedPopulation: 3100,
    affectedAreaKm2: 4.8,
    roadAccessibilityPercent: 25,
    waterCoverageBeforeKm2: 0,
    waterCoverageAfterKm2: 0,
    waterExpansionPercent: 0,
    satelliteSource: "WorldView-3 Optical",
    satelliteObservationDate: "2026-08-28",
    status: "Active",
    description: "Slope failure along Pokhara-Mugling highway corridor triggered by persistent rains. Main transport artery blocked with debris.",
    environmentalData: {
      rainfallMm: 142.5,
      riverLevelM: 2.1,
      soilSaturationPercent: 88,
      windSpeedKmph: 18,
      slopeDegrees: 34,
      temperatureC: 19,
      sensorSource: "Geotechnical Inclinometer Node #NP-PK04"
    },
    suggestedRequirements: {
      waterKits: 310,
      foodKits: 250,
      ambulances: 2,
      rescueTeams: 3,
      boats: 0,
      medicalKits: 180
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "zone-nepal-3",
    name: "Koshi River Inundation Plain — Sunsari",
    code: "ZONE NP-3",
    country: "Nepal",
    region: "Koshi Province",
    type: "Flood",
    severity: "Critical",
    riskScore: 89,
    sensorMode: "Real-Time Satellite Mode",
    location: {
      lat: 26.6547,
      lng: 87.1685,
      address: "Sunsari Flood Embankment Sector",
      city: "Inaruwa / Sunsari",
      country: "Nepal"
    },
    affectedPopulation: 12500,
    affectedAreaKm2: 18.4,
    roadAccessibilityPercent: 30,
    waterCoverageBeforeKm2: 5.1,
    waterCoverageAfterKm2: 18.4,
    waterExpansionPercent: 260.8,
    satelliteSource: "Sentinel-1 SAR",
    satelliteObservationDate: "2026-08-30",
    status: "Active",
    description: "Breaching of Eastern Koshi Embankment spurred wide agricultural inundation affecting agricultural settlements across Sunsari district.",
    environmentalData: {
      rainfallMm: 210.0,
      riverLevelM: 6.8,
      soilSaturationPercent: 99,
      windSpeedKmph: 35,
      slopeDegrees: 2,
      temperatureC: 27,
      sensorSource: "Koshi Telemetric Gauge #NP-KS09"
    },
    suggestedRequirements: {
      waterKits: 1250,
      foodKits: 800,
      ambulances: 4,
      rescueTeams: 6,
      boats: 5,
      medicalKits: 500
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "zone-nepal-4",
    name: "Melamchi Valley Debris Flow Basin",
    code: "ZONE NP-4",
    country: "Nepal",
    region: "Bagmati Province",
    type: "Landslide",
    severity: "High",
    riskScore: 81,
    sensorMode: "Environmental Sensor Mode",
    location: {
      lat: 27.8315,
      lng: 85.5786,
      address: "Melamchi River Upper Watershed",
      city: "Sindhupalchok",
      country: "Nepal"
    },
    affectedPopulation: 2400,
    affectedAreaKm2: 7.2,
    roadAccessibilityPercent: 15,
    waterCoverageBeforeKm2: 1.1,
    waterCoverageAfterKm2: 2.8,
    waterExpansionPercent: 154.5,
    satelliteSource: "PlanetScope 3m",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Glacial river surge combined with landslide dam breach flooded Melamchi bazaar, isolating upstream rural communities.",
    environmentalData: {
      rainfallMm: 165.0,
      riverLevelM: 4.2,
      soilSaturationPercent: 94,
      windSpeedKmph: 22,
      slopeDegrees: 28,
      temperatureC: 16,
      sensorSource: "Sindhupalchok Acoustic Sensor #NP-ML02"
    },
    suggestedRequirements: {
      waterKits: 240,
      foodKits: 200,
      ambulances: 1,
      rescueTeams: 3,
      boats: 1,
      medicalKits: 150
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "zone-sl-1",
    name: "Colombo Kelani Ganga Submerged Sector",
    code: "ZONE LK-1",
    country: "Sri Lanka",
    region: "Western Province",
    type: "Flood",
    severity: "Critical",
    riskScore: 94,
    sensorMode: "Real-Time Satellite Mode",
    location: {
      lat: 6.9271,
      lng: 79.8612,
      address: "Kelani River Estuary Sector, Kolonnawa",
      city: "Colombo",
      country: "Sri Lanka"
    },
    affectedPopulation: 14200,
    affectedAreaKm2: 15.3,
    roadAccessibilityPercent: 35,
    waterCoverageBeforeKm2: 4.0,
    waterCoverageAfterKm2: 15.3,
    waterExpansionPercent: 282.5,
    satelliteSource: "Sentinel-1 SAR",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Tropical depression caused heavy monsoonal deluge along Kelani River. Water levels reached 8ft in low-lying industrial suburbs.",
    environmentalData: {
      rainfallMm: 240.0,
      riverLevelM: 7.2,
      soilSaturationPercent: 98,
      windSpeedKmph: 55,
      slopeDegrees: 3,
      temperatureC: 28,
      sensorSource: "Kelani Gauge #LK-CM01"
    },
    suggestedRequirements: {
      waterKits: 1400,
      foodKits: 900,
      ambulances: 5,
      rescueTeams: 5,
      boats: 4,
      medicalKits: 600
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "zone-sl-2",
    name: "Ratnapura Kalu Ganga Basin Inundation",
    code: "ZONE LK-2",
    country: "Sri Lanka",
    region: "Sabaragamuwa Province",
    type: "Flood",
    severity: "High",
    riskScore: 86,
    sensorMode: "Environmental Sensor Mode",
    location: {
      lat: 6.6828,
      lng: 80.3992,
      address: "Kalu Ganga River Bank Zone",
      city: "Ratnapura",
      country: "Sri Lanka"
    },
    affectedPopulation: 6800,
    affectedAreaKm2: 9.8,
    roadAccessibilityPercent: 45,
    waterCoverageBeforeKm2: 2.2,
    waterCoverageAfterKm2: 9.8,
    waterExpansionPercent: 345.4,
    satelliteSource: "Sentinel-2 MSI",
    satelliteObservationDate: "2026-08-30",
    status: "Active",
    description: "Severe mountain runoff flooded Ratnapura gem mining district and cut off primary access routes.",
    environmentalData: {
      rainfallMm: 185.0,
      riverLevelM: 5.6,
      soilSaturationPercent: 95,
      windSpeedKmph: 30,
      slopeDegrees: 12,
      temperatureC: 26,
      sensorSource: "Ratnapura Hydro station #LK-RN02"
    },
    suggestedRequirements: {
      waterKits: 680,
      foodKits: 450,
      ambulances: 3,
      rescueTeams: 4,
      boats: 3,
      medicalKits: 300
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "zone-usa-1",
    name: "Tampa Bay Storm Surge Zone — Hurricane Delta",
    code: "ZONE US-1",
    country: "USA",
    region: "Florida",
    type: "Cyclone",
    severity: "Critical",
    riskScore: 96,
    sensorMode: "Real-Time Satellite Mode",
    location: {
      lat: 27.9506,
      lng: -82.4572,
      address: "Tampa Coastal Bayfront Corridor",
      city: "Tampa",
      country: "USA"
    },
    affectedPopulation: 35000,
    affectedAreaKm2: 42.0,
    roadAccessibilityPercent: 50,
    waterCoverageBeforeKm2: 12.0,
    waterCoverageAfterKm2: 42.0,
    waterExpansionPercent: 250.0,
    satelliteSource: "NOAA-20 VIIRS / GOES-18",
    satelliteObservationDate: "2026-08-30",
    status: "Active",
    description: "Category 4 Hurricane landfall producing 10ft storm surge along Hillsborough Bay and widespread power grid outages.",
    environmentalData: {
      rainfallMm: 310.0,
      riverLevelM: 3.8,
      soilSaturationPercent: 99,
      windSpeedKmph: 215,
      slopeDegrees: 1,
      temperatureC: 29,
      sensorSource: "NOAA Coastal Buoy #8726607"
    },
    suggestedRequirements: {
      waterKits: 3500,
      foodKits: 2200,
      ambulances: 12,
      rescueTeams: 15,
      boats: 8,
      medicalKits: 1500
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "zone-japan-1",
    name: "Kagoshima Sakurajima Ash & Mudflow Area",
    code: "ZONE JP-1",
    country: "Japan",
    region: "Kyushu",
    type: "Volcano",
    severity: "High",
    riskScore: 82,
    sensorMode: "Environmental Sensor Mode",
    location: {
      lat: 31.5966,
      lng: 130.6572,
      address: "Sakurajima Volcanic Perimeter",
      city: "Kagoshima",
      country: "Japan"
    },
    affectedPopulation: 5200,
    affectedAreaKm2: 14.2,
    roadAccessibilityPercent: 60,
    waterCoverageBeforeKm2: 0,
    waterCoverageAfterKm2: 0,
    waterExpansionPercent: 0,
    satelliteSource: "JAXA ALOS-2 PALSAR-2",
    satelliteObservationDate: "2026-08-28",
    status: "Active",
    description: "Explosive eruption sent ash column 4,500m into air, followed by rain-induced lahars down Eastern slopes.",
    environmentalData: {
      rainfallMm: 85.0,
      riverLevelM: 1.5,
      soilSaturationPercent: 72,
      windSpeedKmph: 28,
      slopeDegrees: 25,
      temperatureC: 24,
      sensorSource: "JMA Volcanic Monitoring Station #JP-KG01"
    },
    suggestedRequirements: {
      waterKits: 520,
      foodKits: 400,
      ambulances: 4,
      rescueTeams: 5,
      boats: 0,
      medicalKits: 300
    },
    createdAt: new Date().toISOString()
  }
];

export const fallbackFacilities = [
  {
    id: "fac-nepal-1",
    name: "Kathmandu Central Emergency Logistics Hub",
    code: "HUB-NP01",
    location: { lat: 27.7000, lng: 85.3400, city: "Kathmandu", country: "Nepal" },
    status: "Operational",
    inventory: { waterKits: 5000, foodKits: 3500, medicalKits: 1200, rescueTeams: 15, ambulances: 8, boats: 4 }
  },
  {
    id: "fac-nepal-2",
    name: "Pokhara Western Regional Depot",
    code: "HUB-NP02",
    location: { lat: 28.2000, lng: 83.9900, city: "Pokhara", country: "Nepal" },
    status: "Operational",
    inventory: { waterKits: 2200, foodKits: 1800, medicalKits: 600, rescueTeams: 8, ambulances: 4, boats: 2 }
  },
  {
    id: "fac-sl-1",
    name: "Colombo National Disaster Storage Center",
    code: "HUB-LK01",
    location: { lat: 6.9100, lng: 79.8800, city: "Colombo", country: "Sri Lanka" },
    status: "Operational",
    inventory: { waterKits: 6500, foodKits: 4000, medicalKits: 1500, rescueTeams: 12, ambulances: 10, boats: 8 }
  },
  {
    id: "fac-usa-1",
    name: "FEMA Region IV Logistics Depot — Orlando",
    code: "HUB-US01",
    location: { lat: 28.5383, lng: -81.3792, city: "Orlando", country: "USA" },
    status: "Operational",
    inventory: { waterKits: 15000, foodKits: 10000, medicalKits: 4000, rescueTeams: 30, ambulances: 25, boats: 15 }
  }
];

export const fallbackResponsePlans = [
  {
    id: "RP-8491",
    disasterId: "zone-nepal-1",
    zoneCode: "ZONE NP-1",
    zoneName: "Kathmandu Flood Zone — Bagmati River Basin",
    allocatedResources: { waterKits: 840, foodKits: 500, ambulances: 3, rescueTeams: 4, boats: 2, medicalKits: 350 },
    priorityScore: 94,
    status: "Approved",
    workflowState: "In Execution",
    createdAt: new Date().toISOString()
  },
  {
    id: "RP-7230",
    disasterId: "zone-sl-1",
    zoneCode: "ZONE LK-1",
    zoneName: "Colombo Kelani Ganga Submerged Sector",
    allocatedResources: { waterKits: 1400, foodKits: 900, ambulances: 5, rescueTeams: 5, boats: 4, medicalKits: 600 },
    priorityScore: 96,
    status: "Approved",
    workflowState: "Approved",
    createdAt: new Date().toISOString()
  }
];

export const fallbackAnalytics = {
  activeEmergencies: 8,
  criticalZones: 4,
  peopleAtRisk: 87800,
  totalResourcesAvailable: 28700,
  responseEfficiency: 92,
  disasterDistribution: [
    { type: "Flood", count: 4 },
    { type: "Landslide", count: 2 },
    { type: "Cyclone", count: 1 },
    { type: "Volcano", count: 1 }
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
