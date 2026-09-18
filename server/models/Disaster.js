import mongoose from 'mongoose';

const DisasterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  country: { type: String, default: 'India' },
  state: { type: String, default: 'Uttarakhand' },
  district: { type: String, default: 'Chamoli' },
  tehsil: { type: String, default: 'Joshimath' },
  village: String,
  ward: String,
  region: { type: String, default: 'Hilly Region Sector' },
  type: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'], required: true },
  warningLevel: { type: String, enum: ['NORMAL', 'WATCH', 'ADVISORY', 'WARNING', 'CRITICAL'], default: 'WARNING' },
  riskScore: { type: Number, min: 0, max: 100, required: true },
  leadTimeMinutes: { type: Number, default: 45 },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: String,
    city: String,
    state: String,
    country: String
  },
  affectedPopulation: { type: Number, required: true },
  affectedAreaKm2: { type: Number, required: true },
  roadAccessibilityPercent: { type: Number, min: 0, max: 100, required: true },
  waterCoverageBeforeKm2: { type: Number, default: 0 },
  waterCoverageAfterKm2: { type: Number, default: 0 },
  waterExpansionPercent: { type: Number, default: 0 },
  slopeAngleDegrees: { type: Number, default: 35 },
  slopeStabilityIndex: { type: Number, default: 0.58 },
  historicalLandslideCount: { type: Number, default: 4 },
  iotStatus: { type: String, enum: ['ONLINE', 'WARNING', 'CRITICAL', 'OFFLINE'], default: 'ONLINE' },
  evacuationReadiness: { type: String, default: 'READY' },
  safeShelter: {
    id: String,
    name: String,
    distanceKm: Number,
    travelTimeMinutes: Number,
    capacity: Number
  },
  satelliteSource: { type: String, default: 'Sentinel-1 SAR' },
  satelliteObservationDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, enum: ['Active', 'Contained', 'Resolved'], default: 'Active' },
  description: String,
  environmentalData: {
    rainfallMm: Number,
    riverLevelM: Number,
    soilSaturationPercent: Number,
    windSpeedKmph: Number,
    sensorSource: String
  },
  suggestedRequirements: {
    waterKits: Number,
    foodKits: Number,
    ambulances: Number,
    rescueTeams: Number,
    boats: Number,
    medicalKits: Number
  },
  createdAt: { type: Date, default: Date.now }
});

export const Disaster = mongoose.models.Disaster || mongoose.model('Disaster', DisasterSchema);
