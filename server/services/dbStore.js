import mongoose from 'mongoose';
import { 
  initialDisasters, 
  initialFacilities, 
  initialResponsePlans,
  initialSensors,
  initialHistoricalEvents,
  initialShelters,
  sihMetadata
} from '../data/seedData.js';
import { Disaster } from '../models/Disaster.js';
import { ResourceFacility } from '../models/Resource.js';
import { ResponsePlan } from '../models/ResponsePlan.js';

let isMongoConnected = false;

// In-memory runtime fallback storage
let memoryDisasters = JSON.parse(JSON.stringify(initialDisasters));
let memoryFacilities = JSON.parse(JSON.stringify(initialFacilities));
let memoryPlans = JSON.parse(JSON.stringify(initialResponsePlans));
let memorySensors = JSON.parse(JSON.stringify(initialSensors));
let memoryHistoricalEvents = JSON.parse(JSON.stringify(initialHistoricalEvents));
let memoryShelters = JSON.parse(JSON.stringify(initialShelters));

export async function connectDB(uri) {
  if (!uri || uri.trim() === '' || uri.includes('YOUR_')) {
    console.log('[SURVER DB] Operating with in-memory resilient data store.');
    return;
  }
  try {
    const connectPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    await connectPromise;
    isMongoConnected = true;
    console.log('[SURVER DB] Connected successfully to MongoDB');

    // Seed if empty
    const countDisasters = await Disaster.countDocuments();
    if (countDisasters === 0) {
      await Disaster.insertMany(initialDisasters);
      console.log('[SURVER DB] Seeded Disasters into MongoDB');
    }
    const countFacs = await ResourceFacility.countDocuments();
    if (countFacs === 0) {
      await ResourceFacility.insertMany(initialFacilities);
      console.log('[SURVER DB] Seeded Resource Facilities into MongoDB');
    }
    const countPlans = await ResponsePlan.countDocuments();
    if (countPlans === 0) {
      await ResponsePlan.insertMany(initialResponsePlans);
      console.log('[SURVER DB] Seeded Response Plans into MongoDB');
    }
  } catch (err) {
    console.log('[SURVER DB] MongoDB offline or unavailable. Running in resilient memory store mode.');
    isMongoConnected = false;
  }
}

// Dynamic Live Telemetry Simulation Engine
let lastTickTime = Date.now();

function updateLiveTelemetry() {
  const now = Date.now();
  const elapsedSec = (now - lastTickTime) / 1000;
  lastTickTime = now;

  memoryDisasters.forEach((d, idx) => {
    const offset = (idx + 1) * 1.7;
    const wave = Math.sin(now / 5000 + offset);
    const waveFast = Math.cos(now / 2500 + offset);

    d.lastTelemetryTime = new Date().toISOString();

    if (d.type === 'Flood' || d.type === 'Flash Flood' || d.type === 'Flash Flood & Landslide') {
      const baseExpansion = d.waterExpansionPercent || 250;
      const delta = Math.round(wave * 4.5 * 10) / 10;
      d.waterExpansionPercent = Number((Math.max(10, baseExpansion + delta)).toFixed(1));
      
      const before = d.waterCoverageBeforeKm2 || 3.0;
      d.waterCoverageAfterKm2 = Number((before * (1 + d.waterExpansionPercent / 100)).toFixed(1));
    }

    if (d.environmentalData) {
      if (d.environmentalData.windSpeedKmph !== undefined) {
        const baseWind = d.environmentalData.windSpeedKmph;
        d.environmentalData.windSpeedKmph = Math.max(10, Math.round(baseWind + waveFast * 3));
      }
      if (d.environmentalData.rainfallMm !== undefined) {
        d.environmentalData.rainfallMm = Number((d.environmentalData.rainfallMm + Math.abs(wave) * 0.1).toFixed(1));
      }
    }

    // Dynamic Prototype Multi-Factor Risk Model recalculation
    const rainfall = d.environmentalData?.rainfallMm || 60;
    const soilMoisture = d.environmentalData?.soilSaturationPercent || 80;
    const slopeAngle = d.slopeAngleDegrees || 35;
    const slopeStability = d.slopeStabilityIndex || 0.55;
    const histLandslides = d.historicalLandslideCount || 4;

    const rfScore = Math.min(30, Math.round(rainfall * 0.3));
    const smScore = Math.min(20, Math.round(soilMoisture * 0.22));
    const slopeScore = Math.min(20, Math.round((slopeAngle / 45 * 10) + ((1 - slopeStability) * 10)));
    const histScore = Math.min(15, Math.round(histLandslides * 2.5));
    const iotScore = d.iotStatus === 'CRITICAL' ? 15 : d.iotStatus === 'WARNING' ? 10 : 7;

    const totalRisk = Math.min(99, Math.max(25, rfScore + smScore + slopeScore + histScore + iotScore));
    d.riskScore = totalRisk;
    
    d.warningLevel = totalRisk >= 85 ? 'CRITICAL' : totalRisk >= 65 ? 'WARNING' : totalRisk >= 45 ? 'ADVISORY' : 'WATCH';
  });

  // Dynamic IoT Sensor Reading Variations
  memorySensors.forEach((s) => {
    if (s.type === 'Rain Gauge') {
      const delta = (Math.random() - 0.5) * 1.5;
      s.value = Number(Math.max(10, s.value + delta).toFixed(1));
    } else if (s.type === 'Soil Moisture') {
      const delta = (Math.random() - 0.4) * 0.5;
      s.value = Number(Math.min(99, Math.max(40, s.value + delta)).toFixed(1));
    }
  });
}

// Tick live telemetry every 3 seconds
setInterval(updateLiveTelemetry, 3000);

export function calculateDeterministicRisk(data = {}) {
  const rainfall = Number(data.rainfallMm || data.rainfall || 75);
  const soilMoisture = Number(data.soilSaturationPercent || data.soilMoisture || 80);
  const slopeAngle = Number(data.slopeAngleDegrees || data.slopeAngle || 35);
  const slopeStability = Number(data.slopeStabilityIndex || data.slopeStability || 0.55);
  const histLandslides = Number(data.historicalLandslideCount || data.historicalLandslides || 4);
  const iotStatus = data.iotStatus || 'ONLINE';

  const rfContribution = Math.min(30, Math.round(rainfall * 0.3));
  const smContribution = Math.min(20, Math.round(soilMoisture * 0.22));
  const slopeContribution = Math.min(20, Math.round((slopeAngle / 45 * 10) + ((1 - slopeStability) * 10)));
  const histContribution = Math.min(15, Math.round(histLandslides * 2.5));
  const iotContribution = iotStatus === 'CRITICAL' ? 15 : iotStatus === 'WARNING' ? 10 : 7;

  const totalScore = Math.min(100, Math.max(0, rfContribution + smContribution + slopeContribution + histContribution + iotContribution));
  
  const riskLevel = 
    totalScore >= 81 ? 'CRITICAL' :
    totalScore >= 61 ? 'HIGH' :
    totalScore >= 41 ? 'ELEVATED' :
    totalScore >= 21 ? 'MODERATE' : 'LOW';

  const warningLevel = 
    totalScore >= 81 ? 'CRITICAL' :
    totalScore >= 65 ? 'WARNING' :
    totalScore >= 45 ? 'ADVISORY' :
    totalScore >= 25 ? 'WATCH' : 'NORMAL';

  const leadTimeMinutes = Math.max(12, Math.round(120 - (totalScore * 0.95)));

  return {
    overallRiskScore: totalScore,
    riskLevel,
    warningLevel,
    leadTimeMinutes,
    weightSchema: {
      rainfall: '30%',
      soilMoisture: '20%',
      slopeStability: '20%',
      historicalRisk: '15%',
      iotSignal: '15%'
    },
    breakdown: [
      { factor: 'Rainfall Intensity', currentVal: `${rainfall} mm/hr`, threshold: '60 mm/hr', contribution: rfContribution, maxPoints: 30, status: rfContribution >= 20 ? 'HIGH' : 'NORMAL' },
      { factor: 'Soil Saturation', currentVal: `${soilMoisture}%`, threshold: '75%', contribution: smContribution, maxPoints: 20, status: smContribution >= 15 ? 'HIGH' : 'NORMAL' },
      { factor: 'Slope Instability', currentVal: `${slopeAngle}° (${slopeStability} Index)`, threshold: '0.60 Index', contribution: slopeContribution, maxPoints: 20, status: slopeContribution >= 14 ? 'CRITICAL' : 'MODERATE' },
      { factor: 'Historical Vulnerability', currentVal: `${histLandslides} recorded events`, threshold: '3 events', contribution: histContribution, maxPoints: 15, status: histContribution >= 10 ? 'HIGH' : 'LOW' },
      { factor: 'IoT Sensor Signal', currentVal: iotStatus, threshold: 'ONLINE', contribution: iotContribution, maxPoints: 15, status: iotStatus }
    ],
    explanation: `PROTOTYPE RISK MODEL: ${data.name || 'Target Sector'} score of ${totalScore}/100 (${riskLevel}) driven primarily by ${rfContribution >= 20 ? 'heavy precipitation' : 'slope instability'} and ${smContribution >= 15 ? 'high soil moisture' : 'terrain vulnerability'}. Estimated lead time for evacuation: ${leadTimeMinutes} minutes.`
  };
}

export const dbStore = {
  isUsingMongo: () => isMongoConnected,
  getSihMetadata: () => sihMetadata,

  // Disasters & Villages
  async getDisasters() {
    updateLiveTelemetry();
    if (isMongoConnected) {
      try {
        const found = await Disaster.find().sort({ createdAt: -1 }).lean();
        if (found && found.length > 0) return found;
      } catch {
        return memoryDisasters;
      }
    }
    return memoryDisasters;
  },

  async getDisasterById(id) {
    if (isMongoConnected) {
      try {
        const d = await Disaster.findOne({ $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { id: id }, { code: id }] }).lean();
        if (d) return d;
      } catch {
        // fallback to memory
      }
    }
    return memoryDisasters.find(d => d.id === id || d.code?.toLowerCase() === id?.toLowerCase() || d._id === id);
  },

  async createDisaster(data) {
    const newDoc = {
      ...data,
      id: data.id || `zone-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };
    if (isMongoConnected) {
      try {
        const created = await Disaster.create(newDoc);
        return created.toObject();
      } catch (e) {
        console.error('Mongo create failed, using memory store:', e.message);
      }
    }
    memoryDisasters.unshift(newDoc);
    return newDoc;
  },

  // IoT Sensors
  async getSensors() {
    updateLiveTelemetry();
    return memorySensors;
  },

  // Historical Disaster Inventories
  async getHistoricalEvents() {
    return memoryHistoricalEvents;
  },

  // Safe Evacuation Shelters
  async getShelters() {
    return memoryShelters;
  },

  // Early Warning Cards
  async getEarlyWarnings() {
    updateLiveTelemetry();
    return memoryDisasters
      .filter(d => d.riskScore >= 60 || d.severity === 'Critical' || d.severity === 'High')
      .map(d => ({
        id: `WARN-${d.code || d.id}`,
        zoneId: d.id,
        location: `${d.village || d.name}, ${d.district || d.region}, ${d.state || d.country}`,
        hazardType: d.type || 'Flash Flood',
        riskScore: d.riskScore,
        warningLevel: d.warningLevel || (d.riskScore >= 85 ? 'CRITICAL' : 'WARNING'),
        leadTimeMinutes: d.leadTimeMinutes || Math.max(15, Math.round(120 - d.riskScore * 0.95)),
        affectedPopulation: d.affectedPopulation,
        triggerFactors: `Rainfall ${d.environmentalData?.rainfallMm || 95} mm/hr + Soil Moisture ${d.environmentalData?.soilSaturationPercent || 85}% + Slope ${d.slopeAngleDegrees || 38}°`,
        recommendedAction: d.evacuationReadiness || 'Prepare evacuation toward designated safe high-ground shelter.',
        safeShelter: d.safeShelter || memoryShelters[0],
        timestamp: new Date().toISOString()
      }));
  },

  // Resource Facilities
  async getFacilities() {
    if (isMongoConnected) {
      try {
        const found = await ResourceFacility.find().lean();
        if (found && found.length > 0) return found;
      } catch {
        return memoryFacilities;
      }
    }
    return memoryFacilities;
  },

  // Response Plans
  async getResponsePlans() {
    if (isMongoConnected) {
      try {
        const found = await ResponsePlan.find().sort({ createdAt: -1 }).lean();
        if (found && found.length > 0) return found;
      } catch {
        return memoryPlans;
      }
    }
    return memoryPlans;
  },

  async createResponsePlan(data) {
    const newPlan = {
      ...data,
      id: data.id || `RP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: data.status || 'Approved',
      workflowState: data.status || 'Approved',
      createdAt: new Date().toISOString()
    };
    if (isMongoConnected) {
      try {
        const created = await ResponsePlan.create(newPlan);
        return created.toObject();
      } catch (e) {
        console.error('Mongo plan create failed:', e.message);
      }
    }
    memoryPlans.unshift(newPlan);
    return newPlan;
  },

  async updatePlanStatus(id, status) {
    if (isMongoConnected) {
      try {
        const updated = await ResponsePlan.findOneAndUpdate(
          { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { id: id }] },
          { $set: { status, workflowState: status, updatedAt: new Date() } },
          { new: true }
        ).lean();
        if (updated) return updated;
      } catch (e) {
        console.error('Mongo plan status update failed:', e.message);
      }
    }
    const idx = memoryPlans.findIndex(p => p.id === id || p._id === id);
    if (idx !== -1) {
      memoryPlans[idx].status = status;
      memoryPlans[idx].workflowState = status;
      return memoryPlans[idx];
    }
    return null;
  }
};
