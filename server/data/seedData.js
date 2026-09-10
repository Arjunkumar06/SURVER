export const initialDisasters = [
  // ==========================================
  // NEPAL SCENARIOS
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
      address: "Seti River Gorge Mountain Pass",
      city: "Pokhara",
      country: "Nepal"
    },
    affectedPopulation: 3200,
    affectedAreaKm2: 6.4,
    roadAccessibilityPercent: 45,
    waterCoverageBeforeKm2: 0.8,
    waterCoverageAfterKm2: 1.4,
    waterExpansionPercent: 75.0,
    satelliteSource: "Sentinel-2 MSI",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Slope destabilization and debris flow blocking access to highland settlements following prolonged precipitation.",
    environmentalData: {
      rainfallMm: 210.0,
      riverLevelM: 3.2,
      soilSaturationPercent: 98,
      windSpeedKmph: 28,
      slopeDegrees: 42,
      temperatureC: 19,
      sensorSource: "Geotechnical Slope Inclinometer #NP-PK04"
    },
    suggestedRequirements: {
      waterKits: 320,
      foodKits: 250,
      ambulances: 2,
      rescueTeams: 4,
      boats: 0,
      medicalKits: 200
    },
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "zone-nepal-3",
    name: "Biratnagar Koshi Basin Floodplain",
    code: "ZONE NP-3",
    country: "Nepal",
    region: "Koshi Province",
    type: "Flood",
    severity: "Moderate",
    riskScore: 58,
    sensorMode: "IoT Water-Level Sensor Mode",
    location: {
      lat: 26.4525,
      lng: 87.2718,
      address: "Saptakoshi Embankment Overflow Area",
      city: "Biratnagar",
      country: "Nepal"
    },
    affectedPopulation: 1800,
    affectedAreaKm2: 3.8,
    roadAccessibilityPercent: 68,
    waterCoverageBeforeKm2: 0.9,
    waterCoverageAfterKm2: 2.7,
    waterExpansionPercent: 200.0,
    satelliteSource: "Sentinel-1 SAR",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Agricultural inundation and eastern boundary road submersion following embankment overflow.",
    environmentalData: {
      rainfallMm: 110.0,
      riverLevelM: 2.8,
      soilSaturationPercent: 82,
      windSpeedKmph: 25,
      slopeDegrees: 4,
      temperatureC: 28,
      sensorSource: "Ultrasonic River Gauge #NP-KS09"
    },
    suggestedRequirements: {
      waterKits: 180,
      foodKits: 120,
      ambulances: 1,
      rescueTeams: 2,
      boats: 1,
      medicalKits: 90
    },
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: "zone-nepal-4",
    name: "Langtang Mountain Forest Fire Sector",
    code: "ZONE NP-4",
    country: "Nepal",
    region: "Bagmati Province",
    type: "Wildfire",
    severity: "Moderate",
    riskScore: 62,
    sensorMode: "Weather Sensor Mode",
    location: {
      lat: 28.1750,
      lng: 85.5500,
      address: "Langtang Ridge Forest Sector",
      city: "Rasuwa",
      country: "Nepal"
    },
    affectedPopulation: 1400,
    affectedAreaKm2: 5.1,
    roadAccessibilityPercent: 50,
    waterCoverageBeforeKm2: 0.1,
    waterCoverageAfterKm2: 0.1,
    waterExpansionPercent: 0,
    satelliteSource: "VIIRS Thermal Anomalies",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Dry season mountain ridge brush fire spreading under high valley winds. Approaching foothill villages.",
    environmentalData: {
      rainfallMm: 0.0,
      riverLevelM: 0.8,
      soilSaturationPercent: 18,
      windSpeedKmph: 52,
      slopeDegrees: 35,
      temperatureC: 31,
      sensorSource: "Thermal Met-Station #NP-LT02"
    },
    suggestedRequirements: {
      waterKits: 150,
      foodKits: 100,
      ambulances: 2,
      rescueTeams: 3,
      boats: 0,
      medicalKits: 120
    },
    createdAt: new Date(Date.now() - 10800000).toISOString()
  },

  // ==========================================
  // INDIA SCENARIOS
  // ==========================================
  {
    id: "zone-india-1",
    name: "Chennai Marina Coastal Basin",
    code: "ZONE IN-1",
    country: "India",
    region: "Tamil Nadu",
    type: "Flood",
    severity: "Critical",
    riskScore: 89,
    sensorMode: "Real-Time Satellite Mode",
    location: {
      lat: 13.0475,
      lng: 80.2824,
      address: "Marina Lowland Coastal Drainage Sector",
      city: "Chennai",
      country: "India"
    },
    affectedPopulation: 7600,
    affectedAreaKm2: 10.5,
    roadAccessibilityPercent: 42,
    waterCoverageBeforeKm2: 2.8,
    waterCoverageAfterKm2: 10.5,
    waterExpansionPercent: 275.0,
    satelliteSource: "Sentinel-1 SAR",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Northeast monsoon surge and coastal drainage bottleneck inundating urban lowlands.",
    environmentalData: {
      rainfallMm: 175.0,
      riverLevelM: 4.4,
      soilSaturationPercent: 94,
      windSpeedKmph: 45,
      slopeDegrees: 2,
      temperatureC: 27,
      sensorSource: "Smart City Stormwater Array #IN-CH01"
    },
    suggestedRequirements: {
      waterKits: 760,
      foodKits: 450,
      ambulances: 3,
      rescueTeams: 4,
      boats: 2,
      medicalKits: 300
    },
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: "zone-india-2",
    name: "Kerala Idukki Highland Landslide Sector",
    code: "ZONE IN-2",
    country: "India",
    region: "Kerala",
    type: "Landslide",
    severity: "High",
    riskScore: 78,
    sensorMode: "Environmental Sensor Mode",
    location: {
      lat: 9.8494,
      lng: 76.9804,
      address: "Western Ghats Mountain Pass Slope 4",
      city: "Idukki",
      country: "India"
    },
    affectedPopulation: 2100,
    affectedAreaKm2: 4.2,
    roadAccessibilityPercent: 48,
    waterCoverageBeforeKm2: 0.3,
    waterCoverageAfterKm2: 0.9,
    waterExpansionPercent: 200.0,
    satelliteSource: "Sentinel-2 Multispectral",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Slope instability and debris flow blocking access to hill communities after 48h non-stop monsoon downpours.",
    environmentalData: {
      rainfallMm: 210.0,
      riverLevelM: 2.1,
      soilSaturationPercent: 98,
      windSpeedKmph: 35,
      slopeDegrees: 48,
      temperatureC: 20,
      sensorSource: "Ghats Soil Pore Pressure Probe #IN-KL03"
    },
    suggestedRequirements: {
      waterKits: 250,
      foodKits: 180,
      ambulances: 2,
      rescueTeams: 3,
      boats: 0,
      medicalKits: 150
    },
    createdAt: new Date(Date.now() - 18000000).toISOString()
  },
  {
    id: "zone-india-3",
    name: "Odisha Coastal Cyclone Superstorm Basin",
    code: "ZONE IN-3",
    country: "India",
    region: "Odisha",
    type: "Cyclone",
    severity: "Critical",
    riskScore: 91,
    sensorMode: "Weather Sensor Mode",
    location: {
      lat: 19.8135,
      lng: 85.8312,
      address: "Puri Coastal Inundation Sector",
      city: "Puri",
      country: "India"
    },
    affectedPopulation: 9500,
    affectedAreaKm2: 13.8,
    roadAccessibilityPercent: 32,
    waterCoverageBeforeKm2: 3.5,
    waterCoverageAfterKm2: 12.8,
    waterExpansionPercent: 265.7,
    satelliteSource: "Sentinel-1 SAR / INSAT-3D",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Category 4 tropical cyclone landfall causing 3.8m storm surge across low-lying coastal estuaries.",
    environmentalData: {
      rainfallMm: 240.0,
      riverLevelM: 5.1,
      soilSaturationPercent: 96,
      windSpeedKmph: 145,
      slopeDegrees: 1,
      temperatureC: 25,
      sensorSource: "Doppler Weather Radar Paradip #IN-OD01"
    },
    suggestedRequirements: {
      waterKits: 950,
      foodKits: 600,
      ambulances: 4,
      rescueTeams: 6,
      boats: 3,
      medicalKits: 400
    },
    createdAt: new Date(Date.now() - 21600000).toISOString()
  },

  // ==========================================
  // UNITED STATES SCENARIOS
  // ==========================================
  {
    id: "zone-usa-1",
    name: "Tampa Bay Coastal Hurricane Surge Zone",
    code: "ZONE US-1",
    country: "United States",
    region: "Florida",
    type: "Cyclone",
    severity: "Critical",
    riskScore: 94,
    sensorMode: "Real-Time Satellite Mode",
    location: {
      lat: 27.9506,
      lng: -82.4572,
      address: "Hillsborough Bay Barrier Coastal Zone",
      city: "Tampa",
      country: "United States"
    },
    affectedPopulation: 9200,
    affectedAreaKm2: 14.5,
    roadAccessibilityPercent: 35,
    waterCoverageBeforeKm2: 4.2,
    waterCoverageAfterKm2: 14.5,
    waterExpansionPercent: 245.2,
    satelliteSource: "Sentinel-1 SAR",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Category 4 hurricane storm surge penetrating 4km inland. Major bridges closed, extensive barrier island inundation.",
    environmentalData: {
      rainfallMm: 225.0,
      riverLevelM: 5.2,
      soilSaturationPercent: 96,
      windSpeedKmph: 130,
      slopeDegrees: 1,
      temperatureC: 28,
      sensorSource: "NOAA Coastal Buoy #US-FL42"
    },
    suggestedRequirements: {
      waterKits: 920,
      foodKits: 600,
      ambulances: 5,
      rescueTeams: 6,
      boats: 4,
      medicalKits: 450
    },
    createdAt: new Date(Date.now() - 25200000).toISOString()
  },
  {
    id: "zone-usa-2",
    name: "California Sierra Foothills Wildfire Complex",
    code: "ZONE US-2",
    country: "United States",
    region: "California",
    type: "Wildfire",
    severity: "Critical",
    riskScore: 90,
    sensorMode: "Weather Sensor Mode",
    location: {
      lat: 37.7749,
      lng: -119.5383,
      address: "Sierra National Forest Pine Ridge",
      city: "Mariposa",
      country: "United States"
    },
    affectedPopulation: 6800,
    affectedAreaKm2: 18.2,
    roadAccessibilityPercent: 40,
    waterCoverageBeforeKm2: 0.2,
    waterCoverageAfterKm2: 0.2,
    waterExpansionPercent: 0,
    satelliteSource: "GOES-16 Fire Detection & VIIRS",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Fast-moving brush and timber fire driven by 60mph Diablo gusts. Dense smoke plumes obstructing mountain escape routes.",
    environmentalData: {
      rainfallMm: 0.0,
      riverLevelM: 0.4,
      soilSaturationPercent: 12,
      windSpeedKmph: 85,
      slopeDegrees: 38,
      temperatureC: 38,
      sensorSource: "CalFire Remote Automated Weather Station #US-CA08"
    },
    suggestedRequirements: {
      waterKits: 700,
      foodKits: 450,
      ambulances: 4,
      rescueTeams: 5,
      boats: 0,
      medicalKits: 350
    },
    createdAt: new Date(Date.now() - 28800000).toISOString()
  },

  // ==========================================
  // JAPAN SCENARIOS
  // ==========================================
  {
    id: "zone-japan-1",
    name: "Tokyo Arakawa River Inundation Sector",
    code: "ZONE JP-1",
    country: "Japan",
    region: "Kanto",
    type: "Flood",
    severity: "High",
    riskScore: 81,
    sensorMode: "Real-Time Satellite Mode",
    location: {
      lat: 35.7350,
      lng: 139.8100,
      address: "Arakawa Lowland Floodplain District",
      city: "Tokyo",
      country: "Japan"
    },
    affectedPopulation: 5800,
    affectedAreaKm2: 7.6,
    roadAccessibilityPercent: 60,
    waterCoverageBeforeKm2: 2.1,
    waterCoverageAfterKm2: 7.6,
    waterExpansionPercent: 261.9,
    satelliteSource: "Sentinel-1 SAR",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Typhoon storm surge causing Arakawa drainage overflow. High-density urban wards experiencing localized basement and road flooding.",
    environmentalData: {
      rainfallMm: 160.0,
      riverLevelM: 4.1,
      soilSaturationPercent: 89,
      windSpeedKmph: 65,
      slopeDegrees: 2,
      temperatureC: 24,
      sensorSource: "JMA Automated River Telemetry #JP-TK01"
    },
    suggestedRequirements: {
      waterKits: 580,
      foodKits: 350,
      ambulances: 4,
      rescueTeams: 3,
      boats: 2,
      medicalKits: 280
    },
    createdAt: new Date(Date.now() - 32400000).toISOString()
  },

  // ==========================================
  // EUROPE SCENARIOS
  // ==========================================
  {
    id: "zone-europe-1",
    name: "Rhine River Basin Urban Flood Corridor",
    code: "ZONE EU-1",
    country: "Germany",
    region: "North Rhine-Westphalia",
    type: "Flood",
    severity: "High",
    riskScore: 84,
    sensorMode: "Real-Time Satellite Mode",
    location: {
      lat: 50.9375,
      lng: 6.9603,
      address: "Rhine Lowland Urban Sector",
      city: "Cologne",
      country: "Germany"
    },
    affectedPopulation: 6400,
    affectedAreaKm2: 9.2,
    roadAccessibilityPercent: 55,
    waterCoverageBeforeKm2: 2.5,
    waterCoverageAfterKm2: 9.2,
    waterExpansionPercent: 268.0,
    satelliteSource: "Sentinel-1 C-SAR",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Unprecedented summer downpours caused the Rhine to breach containment walls, inundating commercial and residential sectors.",
    environmentalData: {
      rainfallMm: 165.0,
      riverLevelM: 6.2,
      soilSaturationPercent: 92,
      windSpeedKmph: 40,
      slopeDegrees: 3,
      temperatureC: 18,
      sensorSource: "Federal Hydrological Telemetry #DE-RH01"
    },
    suggestedRequirements: {
      waterKits: 640,
      foodKits: 400,
      ambulances: 4,
      rescueTeams: 4,
      boats: 3,
      medicalKits: 300
    },
    createdAt: new Date(Date.now() - 35000000).toISOString()
  },
  {
    id: "zone-europe-2",
    name: "Aosta Valley Alpine Debris Slip Zone",
    code: "ZONE EU-2",
    country: "Italy",
    region: "Aosta Valley",
    type: "Landslide",
    severity: "High",
    riskScore: 79,
    sensorMode: "Environmental Sensor Mode",
    location: {
      lat: 45.7370,
      lng: 7.3201,
      address: "Alpine Pass Corridor 12",
      city: "Aosta",
      country: "Italy"
    },
    affectedPopulation: 2400,
    affectedAreaKm2: 5.1,
    roadAccessibilityPercent: 38,
    waterCoverageBeforeKm2: 0.4,
    waterCoverageAfterKm2: 1.1,
    waterExpansionPercent: 175.0,
    satelliteSource: "Sentinel-2 InSAR",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Glacial melt and heavy rain caused high-altitude rockfall and mudslides, blocking mountain transit.",
    environmentalData: {
      rainfallMm: 140.0,
      riverLevelM: 2.4,
      soilSaturationPercent: 95,
      windSpeedKmph: 30,
      slopeDegrees: 52,
      temperatureC: 12,
      sensorSource: "Alpine Geotechnical Seismic Sensor #IT-AV05"
    },
    suggestedRequirements: {
      waterKits: 240,
      foodKits: 180,
      ambulances: 2,
      rescueTeams: 4,
      boats: 0,
      medicalKits: 180
    },
    createdAt: new Date(Date.now() - 38000000).toISOString()
  },

  // ==========================================
  // SOUTH AMERICA SCENARIOS
  // ==========================================
  {
    id: "zone-brazil-1",
    name: "Amazon Solimões River Basin Inundation",
    code: "ZONE SA-1",
    country: "Brazil",
    region: "Amazonas",
    type: "Flood",
    severity: "Critical",
    riskScore: 93,
    sensorMode: "Real-Time Satellite Mode",
    location: {
      lat: -3.1190,
      lng: -60.0217,
      address: "Solimões Floodplain Riverside Sector",
      city: "Manaus",
      country: "Brazil"
    },
    affectedPopulation: 11200,
    affectedAreaKm2: 24.5,
    roadAccessibilityPercent: 25,
    waterCoverageBeforeKm2: 8.5,
    waterCoverageAfterKm2: 24.5,
    waterExpansionPercent: 188.2,
    satelliteSource: "Sentinel-1 SAR Radar",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Severe tropical rain belt expansion caused historical Amazon flooding, isolating riverbank indigenous settlements.",
    environmentalData: {
      rainfallMm: 310.0,
      riverLevelM: 8.4,
      soilSaturationPercent: 99,
      windSpeedKmph: 35,
      slopeDegrees: 1,
      temperatureC: 30,
      sensorSource: "Amazon Hydro-Radar Probe #BR-MN01"
    },
    suggestedRequirements: {
      waterKits: 1120,
      foodKits: 800,
      ambulances: 3,
      rescueTeams: 6,
      boats: 8,
      medicalKits: 600
    },
    createdAt: new Date(Date.now() - 41000000).toISOString()
  },

  // ==========================================
  // AFRICA SCENARIOS
  // ==========================================
  {
    id: "zone-africa-1",
    name: "Sofala Coastal Storm Surge & Estuary Flood",
    code: "ZONE AF-1",
    country: "Mozambique",
    region: "Sofala Province",
    type: "Cyclone",
    severity: "Critical",
    riskScore: 95,
    sensorMode: "Real-Time Satellite Mode",
    location: {
      lat: -19.8436,
      lng: 34.8389,
      address: "Pungwe River Coastal Estuary",
      city: "Beira",
      country: "Mozambique"
    },
    affectedPopulation: 12500,
    affectedAreaKm2: 21.0,
    roadAccessibilityPercent: 20,
    waterCoverageBeforeKm2: 5.0,
    waterCoverageAfterKm2: 21.0,
    waterExpansionPercent: 320.0,
    satelliteSource: "Sentinel-1 SAR",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "Tropical cyclone landfall combined with extreme coastal surge submerged vast coastal agricultural zones.",
    environmentalData: {
      rainfallMm: 280.0,
      riverLevelM: 6.8,
      soilSaturationPercent: 98,
      windSpeedKmph: 155,
      slopeDegrees: 1,
      temperatureC: 29,
      sensorSource: "Mozambique Disaster Telemetry #MZ-SO02"
    },
    suggestedRequirements: {
      waterKits: 1250,
      foodKits: 900,
      ambulances: 4,
      rescueTeams: 8,
      boats: 7,
      medicalKits: 700
    },
    createdAt: new Date(Date.now() - 44000000).toISOString()
  },

  // ==========================================
  // OCEANIA SCENARIOS
  // ==========================================
  {
    id: "zone-australia-1",
    name: "Queensland Fitzroy Basin Flood Corridor",
    code: "ZONE OC-1",
    country: "Australia",
    region: "Queensland",
    type: "Flood",
    severity: "High",
    riskScore: 82,
    sensorMode: "Real-Time Satellite Mode",
    location: {
      lat: -23.3750,
      lng: 150.5100,
      address: "Fitzroy River Catchment Sector",
      city: "Rockhampton",
      country: "Australia"
    },
    affectedPopulation: 4800,
    affectedAreaKm2: 12.4,
    roadAccessibilityPercent: 50,
    waterCoverageBeforeKm2: 3.1,
    waterCoverageAfterKm2: 12.4,
    waterExpansionPercent: 300.0,
    satelliteSource: "Sentinel-1 SAR",
    satelliteObservationDate: "2026-08-29",
    status: "Active",
    description: "La Niña monsoon trough created extensive riverine flooding, cutting off regional highway corridors.",
    environmentalData: {
      rainfallMm: 205.0,
      riverLevelM: 7.1,
      soilSaturationPercent: 91,
      windSpeedKmph: 50,
      slopeDegrees: 2,
      temperatureC: 26,
      sensorSource: "Bureau of Meteorology Telemetry #AU-QLD09"
    },
    suggestedRequirements: {
      waterKits: 480,
      foodKits: 350,
      ambulances: 3,
      rescueTeams: 4,
      boats: 4,
      medicalKits: 250
    },
    createdAt: new Date(Date.now() - 47000000).toISOString()
  }
];

export const initialFacilities = [
  // ==========================================
  // NEPAL REGIONAL FACILITIES
  // ==========================================
  {
    id: "fac-np-1",
    name: "Kathmandu Central Emergency Logistics Hub",
    type: "Resource Warehouse",
    country: "Nepal",
    location: {
      lat: 27.6980,
      lng: 85.3150,
      address: "Tripureshwor Logistics Depo, Kathmandu"
    },
    inventory: {
      waterKits: 600,
      foodKits: 700,
      ambulances: 4,
      rescueTeams: 5,
      boats: 2,
      medicalKits: 400
    },
    status: "Operational"
  },
  {
    id: "fac-np-2",
    name: "Tribhuvan University Teaching Hospital Disaster Center",
    type: "Hospital",
    country: "Nepal",
    location: {
      lat: 27.7360,
      lng: 85.3310,
      address: "Maharajgunj Medical Campus, Kathmandu"
    },
    inventory: {
      waterKits: 150,
      foodKits: 100,
      ambulances: 5,
      rescueTeams: 1,
      boats: 0,
      medicalKits: 800
    },
    status: "Operational"
  },
  {
    id: "fac-np-3",
    name: "Bagmati Marine & Swiftwater Rescue Station",
    type: "Rescue Station",
    country: "Nepal",
    location: {
      lat: 27.6850,
      lng: 85.3400,
      address: "Balkhu Riverfront Quick-Response Unit"
    },
    inventory: {
      waterKits: 100,
      foodKits: 100,
      ambulances: 1,
      rescueTeams: 6,
      boats: 4,
      medicalKits: 150
    },
    status: "Operational"
  },
  {
    id: "fac-np-4",
    name: "Lalitpur Civic Ambulance Station Alpha",
    type: "Ambulance Station",
    country: "Nepal",
    location: {
      lat: 27.6680,
      lng: 85.3210,
      address: "Patan Rapid Medical Dispatch Post"
    },
    inventory: {
      waterKits: 80,
      foodKits: 50,
      ambulances: 6,
      rescueTeams: 0,
      boats: 0,
      medicalKits: 300
    },
    status: "Operational"
  },
  {
    id: "fac-np-5",
    name: "Pokhara Regional Disaster Warehouse",
    type: "Resource Warehouse",
    country: "Nepal",
    location: {
      lat: 28.2150,
      lng: 83.9920,
      address: "Lakeside Emergency Logistics Depo, Pokhara"
    },
    inventory: {
      waterKits: 450,
      foodKits: 350,
      ambulances: 3,
      rescueTeams: 4,
      boats: 2,
      medicalKits: 250
    },
    status: "Operational"
  },
  {
    id: "fac-np-6",
    name: "Biratnagar Eastern Regional Relief Base",
    type: "Emergency Center",
    country: "Nepal",
    location: {
      lat: 26.4600,
      lng: 87.2800,
      address: "Koshi Highway Emergency Supply Hub"
    },
    inventory: {
      waterKits: 300,
      foodKits: 250,
      ambulances: 2,
      rescueTeams: 3,
      boats: 2,
      medicalKits: 200
    },
    status: "Operational"
  },

  // ==========================================
  // INDIA REGIONAL FACILITIES
  // ==========================================
  {
    id: "fac-in-1",
    name: "Chennai Metro Central Relief Warehouse",
    type: "Resource Warehouse",
    country: "India",
    location: {
      lat: 13.0600,
      lng: 80.2400,
      address: "Grand Logistics Park, Central Hub, Chennai"
    },
    inventory: {
      waterKits: 800,
      foodKits: 600,
      ambulances: 4,
      rescueTeams: 5,
      boats: 3,
      medicalKits: 500
    },
    status: "Operational"
  },
  {
    id: "fac-in-2",
    name: "Tamil Nadu Regional Trauma Center",
    type: "Hospital",
    country: "India",
    location: {
      lat: 13.0750,
      lng: 80.2600,
      address: "Metro Central Medical Campus, Chennai"
    },
    inventory: {
      waterKits: 200,
      foodKits: 150,
      ambulances: 6,
      rescueTeams: 1,
      boats: 0,
      medicalKits: 900
    },
    status: "Operational"
  },
  {
    id: "fac-in-3",
    name: "Kochi Marine Emergency Hub",
    type: "Rescue Station",
    country: "India",
    location: {
      lat: 9.9312,
      lng: 76.2673,
      address: "Port Emergency Response Base, Kochi"
    },
    inventory: {
      waterKits: 400,
      foodKits: 300,
      ambulances: 3,
      rescueTeams: 6,
      boats: 5,
      medicalKits: 300
    },
    status: "Operational"
  },
  {
    id: "fac-in-4",
    name: "Bhubaneswar Cyclone Emergency Logistics Center",
    type: "Emergency Center",
    country: "India",
    location: {
      lat: 20.2961,
      lng: 85.8245,
      address: "State Disaster Management Staging Depo, Bhubaneswar"
    },
    inventory: {
      waterKits: 1000,
      foodKits: 800,
      ambulances: 5,
      rescueTeams: 8,
      boats: 4,
      medicalKits: 600
    },
    status: "Operational"
  },

  // ==========================================
  // JAPAN REGIONAL FACILITIES
  // ==========================================
  {
    id: "fac-jp-1",
    name: "Tokyo Disaster Prevention Center",
    type: "Resource Warehouse",
    country: "Japan",
    location: {
      lat: 35.6895,
      lng: 139.6917,
      address: "Shinjuku Emergency Logistics Terminal, Tokyo"
    },
    inventory: {
      waterKits: 900,
      foodKits: 750,
      ambulances: 5,
      rescueTeams: 6,
      boats: 3,
      medicalKits: 600
    },
    status: "Operational"
  },

  // ==========================================
  // USA REGIONAL FACILITIES
  // ==========================================
  {
    id: "fac-us-1",
    name: "Tampa Bay FEMA Regional Logistics Staging Depot",
    type: "Resource Warehouse",
    country: "United States",
    location: {
      lat: 27.9650,
      lng: -82.4400,
      address: "East Tampa Emergency Logistics Base, FL"
    },
    inventory: {
      waterKits: 1200,
      foodKits: 1000,
      ambulances: 6,
      rescueTeams: 8,
      boats: 6,
      medicalKits: 800
    },
    status: "Operational"
  },
  {
    id: "fac-us-2",
    name: "Central California Wildfire Response Station",
    type: "Rescue Station",
    country: "United States",
    location: {
      lat: 37.8000,
      lng: -119.5000,
      address: "Yosemite Sierra Incident Command Post, CA"
    },
    inventory: {
      waterKits: 800,
      foodKits: 600,
      ambulances: 4,
      rescueTeams: 8,
      boats: 0,
      medicalKits: 500
    },
    status: "Operational"
  },

  // ==========================================
  // EUROPE REGIONAL FACILITIES
  // ==========================================
  {
    id: "fac-eu-1",
    name: "Frankfurt Central European Relief Warehouse",
    type: "Resource Warehouse",
    country: "Germany",
    location: {
      lat: 50.1109,
      lng: 8.6821,
      address: "Central European Disaster Logistics Hub, Frankfurt"
    },
    inventory: {
      waterKits: 1600,
      foodKits: 1200,
      ambulances: 12,
      rescueTeams: 14,
      boats: 6,
      medicalKits: 1100
    },
    status: "Operational"
  },

  // ==========================================
  // SOUTH AMERICA REGIONAL FACILITIES
  // ==========================================
  {
    id: "fac-sa-1",
    name: "Manaus Amazon Emergency Operations Center",
    type: "Emergency Center",
    country: "Brazil",
    location: {
      lat: -3.1000,
      lng: -60.0000,
      address: "Amazon Basin Logistics Base, Manaus"
    },
    inventory: {
      waterKits: 1800,
      foodKits: 1300,
      ambulances: 8,
      rescueTeams: 12,
      boats: 14,
      medicalKits: 1000
    },
    status: "Operational"
  },

  // ==========================================
  // AFRICA REGIONAL FACILITIES
  // ==========================================
  {
    id: "fac-af-1",
    name: "Nairobi East Africa Relief Command Center",
    type: "Emergency Center",
    country: "Kenya",
    location: {
      lat: -1.2921,
      lng: 36.8219,
      address: "African Mutual Aid Logistics Base, Nairobi"
    },
    inventory: {
      waterKits: 2200,
      foodKits: 1600,
      ambulances: 10,
      rescueTeams: 16,
      boats: 10,
      medicalKits: 1300
    },
    status: "Operational"
  },

  // ==========================================
  // OCEANIA REGIONAL FACILITIES
  // ==========================================
  {
    id: "fac-oc-1",
    name: "Brisbane Asia-Pacific Disaster Logistics Hub",
    type: "Resource Warehouse",
    country: "Australia",
    location: {
      lat: -27.4698,
      lng: 153.0251,
      address: "Queensland Emergency Logistics Base, Brisbane"
    },
    inventory: {
      waterKits: 1400,
      foodKits: 1000,
      ambulances: 10,
      rescueTeams: 10,
      boats: 8,
      medicalKits: 900
    },
    status: "Operational"
  }
];

export const initialResponsePlans = [
  {
    id: "RP-1024",
    disasterId: "zone-nepal-1",
    zoneCode: "ZONE NP-1",
    disasterName: "Kathmandu Flood Zone — Bagmati River Basin",
    country: "Nepal",
    disasterType: "Flood",
    priorityScore: 94,
    status: "Approved",
    workflowState: "Approved",
    coverage: 82,
    resourceUtilization: 91,
    estimatedResponseTimeMinutes: 18,
    allocations: [
      { resourceType: "ambulances", quantity: 3, unit: "units", sourceFacility: "Lalitpur Civic Ambulance Station Alpha", lat: 27.6680, lng: 85.3210 },
      { resourceType: "waterKits", quantity: 600, unit: "kits", sourceFacility: "Kathmandu Central Emergency Logistics Hub", lat: 27.6980, lng: 85.3150 },
      { resourceType: "foodKits", quantity: 500, unit: "kits", sourceFacility: "Kathmandu Central Emergency Logistics Hub", lat: 27.6980, lng: 85.3150 },
      { resourceType: "rescueTeams", quantity: 4, unit: "teams", sourceFacility: "Bagmati Marine & Swiftwater Rescue Station", lat: 27.6850, lng: 85.3400 },
      { resourceType: "boats", quantity: 2, unit: "vessels", sourceFacility: "Bagmati Marine & Swiftwater Rescue Station", lat: 27.6850, lng: 85.3400 },
      { resourceType: "medicalKits", quantity: 350, unit: "kits", sourceFacility: "Tribhuvan University Teaching Hospital", lat: 27.7360, lng: 85.3310 }
    ],
    shortages: [
      { resourceType: "waterKits", required: 840, availableAllocated: 600, shortage: 240, severity: "High", unit: "kits", note: "Kathmandu central depot water filtration supply exhausted. Secondary dispatch requested from Pokhara regional depot." }
    ],
    explanation: {
      summary: "Kathmandu Flood Zone (ZONE NP-1) prioritized with 94/100 score due to critical monsoonal inundation, 8,400 vulnerable residents in Bagmati lowlands, +265.6% water expansion, and 40% road accessibility friction.",
      factors: [
        { title: "Critical Severity & Threat", score: "+35 pts", detail: "Bagmati river overflow affecting 11.7 km²" },
        { title: "High Population Exposure", score: "+28 pts", detail: "8,400 individuals in high-risk river basin" },
        { title: "Severe Water Inundation", score: "+16 pts", detail: "265.6% water expansion detected by Sentinel-1 SAR" },
        { title: "Reduced Road Accessibility", score: "+15 pts", detail: "40% accessibility requires specialized swiftwater boat units" }
      ]
    },
    createdAt: new Date().toISOString()
  }
];
