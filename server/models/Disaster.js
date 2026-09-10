import mongoose from 'mongoose';

const DisasterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  country: { type: String, default: 'Nepal' },
  region: { type: String, default: 'Bagmati Province' },
  type: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'], required: true },
  riskScore: { type: Number, min: 0, max: 100, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: String,
    city: String,
    country: String
  },
  affectedPopulation: { type: Number, required: true },
  affectedAreaKm2: { type: Number, required: true },
  roadAccessibilityPercent: { type: Number, min: 0, max: 100, required: true },
  waterCoverageBeforeKm2: { type: Number, default: 0 },
  waterCoverageAfterKm2: { type: Number, default: 0 },
  waterExpansionPercent: { type: Number, default: 0 },
  satelliteSource: { type: String, default: 'Sentinel-1 SAR' },
  satelliteObservationDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, enum: ['Active', 'Contained', 'Resolved'], default: 'Active' },
  description: String,
  environmentalData: {
    rainfallMm: Number,
    riverLevelM: Number,
    soilSaturationPercent: Number,
    windSpeedKmph: Number
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
