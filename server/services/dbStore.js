import mongoose from 'mongoose';
import { initialDisasters, initialFacilities, initialResponsePlans } from '../data/seedData.js';
import { Disaster } from '../models/Disaster.js';
import { ResourceFacility } from '../models/Resource.js';
import { ResponsePlan } from '../models/ResponsePlan.js';

let isMongoConnected = false;

// In-memory runtime fallback storage
let memoryDisasters = JSON.parse(JSON.stringify(initialDisasters));
let memoryFacilities = JSON.parse(JSON.stringify(initialFacilities));
let memoryPlans = JSON.parse(JSON.stringify(initialResponsePlans));

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
    // Unique seed offset per zone
    const offset = (idx + 1) * 1.7;
    const wave = Math.sin(now / 5000 + offset);
    const waveFast = Math.cos(now / 2500 + offset);

    d.lastTelemetryTime = new Date().toISOString();

    if (d.type === 'Flood' || d.type === 'Cyclone') {
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

    // Dynamic risk score calculation based on current telemetry state
    const popFactor = Math.min(25, (d.affectedPopulation || 5000) / 400);
    const accessFactor = ((100 - (d.roadAccessibilityPercent || 40)) / 100) * 20;
    const expansionFactor = Math.min(20, (d.waterExpansionPercent || 100) / 15);
    const rawRisk = Math.round(35 + popFactor + accessFactor + expansionFactor + wave * 2);
    d.riskScore = Math.min(98, Math.max(45, rawRisk));
  });
}

// Tick live telemetry every 3 seconds
setInterval(updateLiveTelemetry, 3000);

export const dbStore = {
  isUsingMongo: () => isMongoConnected,

  // Disasters
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

  async updateDisaster(id, updates) {
    if (isMongoConnected) {
      try {
        const updated = await Disaster.findOneAndUpdate(
          { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { id: id }, { code: id }] },
          { $set: updates },
          { new: true }
        ).lean();
        if (updated) return updated;
      } catch (e) {
        console.error('Mongo update failed:', e.message);
      }
    }
    const idx = memoryDisasters.findIndex(d => d.id === id || d.code?.toLowerCase() === id?.toLowerCase() || d._id === id);
    if (idx !== -1) {
      memoryDisasters[idx] = { ...memoryDisasters[idx], ...updates };
      return memoryDisasters[idx];
    }
    return null;
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

  async createFacility(data) {
    const newDoc = {
      ...data,
      id: data.id || `fac-${Date.now().toString(36)}`
    };
    if (isMongoConnected) {
      try {
        const created = await ResourceFacility.create(newDoc);
        return created.toObject();
      } catch (e) {
        console.error('Mongo facility create failed:', e.message);
      }
    }
    memoryFacilities.push(newDoc);
    return newDoc;
  },

  async updateFacilityInventory(facilityId, newInventory) {
    if (isMongoConnected) {
      try {
        await ResourceFacility.findOneAndUpdate(
          { $or: [{ _id: mongoose.isValidObjectId(facilityId) ? facilityId : null }, { id: facilityId }] },
          { $set: { inventory: newInventory, updatedAt: new Date() } }
        );
      } catch (e) {
        console.error('Mongo update inventory failed:', e.message);
      }
    }
    const idx = memoryFacilities.findIndex(f => f.id === facilityId || f._id === facilityId);
    if (idx !== -1) {
      memoryFacilities[idx].inventory = { ...memoryFacilities[idx].inventory, ...newInventory };
    }
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
    // Update existing if already present, or unshift new
    const existingIdx = memoryPlans.findIndex(p => p.id === newPlan.id || (p.zoneCode === newPlan.zoneCode && p.status === newPlan.status));
    if (existingIdx !== -1) {
      memoryPlans[existingIdx] = { ...memoryPlans[existingIdx], ...newPlan };
      return memoryPlans[existingIdx];
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
