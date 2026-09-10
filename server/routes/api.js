import express from 'express';
import { dbStore } from '../services/dbStore.js';
import { getSatelliteService } from '../services/satelliteService.js';
import { analyzeEmergencyWithGemini } from '../services/geminiService.js';
import { optimizeResourceAllocation } from '../services/optimizationService.js';

const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'SURVER Command Intelligence Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    isUsingMongo: dbStore.isUsingMongo(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('YOUR_'))
  });
});

// GET /api/disasters
router.get('/disasters', async (req, res) => {
  try {
    const disasters = await dbStore.getDisasters();
    res.json(disasters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch disasters', message: err.message });
  }
});

// GET /api/disasters/:id
router.get('/disasters/:id', async (req, res) => {
  try {
    const disaster = await dbStore.getDisasterById(req.params.id);
    if (!disaster) {
      return res.status(404).json({ error: 'Disaster zone not found' });
    }
    res.json(disaster);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch disaster zone', message: err.message });
  }
});

// POST /api/disasters
router.post('/disasters', async (req, res) => {
  try {
    const created = await dbStore.createDisaster(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create disaster zone', message: err.message });
  }
});

// POST /api/ai/analyze-emergency
router.post('/ai/analyze-emergency', async (req, res) => {
  try {
    const emergencyData = req.body;
    if (!emergencyData) {
      return res.status(400).json({ error: 'Emergency data payload is required' });
    }
    const analysis = await analyzeEmergencyWithGemini(emergencyData);

    // If a zone ID was provided, update suggested requirements in store
    if (emergencyData.id || emergencyData.code) {
      const zoneKey = emergencyData.id || emergencyData.code;
      await dbStore.updateDisaster(zoneKey, {
        riskScore: analysis.riskScore,
        severity: analysis.severity,
        suggestedRequirements: analysis.resourceRequirements
      });
    }

    res.json(analysis);
  } catch (err) {
    console.error('Error in /api/ai/analyze-emergency:', err);
    res.status(500).json({ error: 'Emergency analysis failed', message: err.message });
  }
});

// GET /api/satellite/:zoneId
router.get('/satellite/:zoneId', async (req, res) => {
  try {
    const zone = await dbStore.getDisasterById(req.params.zoneId);
    if (!zone) {
      return res.status(404).json({ error: 'Disaster zone not found' });
    }
    const satelliteService = getSatelliteService();
    const observation = await satelliteService.getObservation(zone);
    const changeAnalysis = await satelliteService.analyzeChange(zone);

    res.json({
      zone,
      observation,
      changeAnalysis
    });
  } catch (err) {
    res.status(500).json({ error: 'Satellite intelligence retrieval failed', message: err.message });
  }
});

// GET /api/resources
router.get('/resources', async (req, res) => {
  try {
    const facilities = await dbStore.getFacilities();

    // Aggregate inventory totals
    const aggregated = {
      waterKits: 0,
      foodKits: 0,
      ambulances: 0,
      rescueTeams: 0,
      boats: 0,
      medicalKits: 0
    };

    facilities.forEach(fac => {
      if (fac.inventory) {
        Object.keys(aggregated).forEach(key => {
          aggregated[key] += (fac.inventory[key] || 0);
        });
      }
    });

    res.json({
      facilities,
      totalInventory: aggregated,
      facilityCount: facilities.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resources', message: err.message });
  }
});

// POST /api/resources
router.post('/resources', async (req, res) => {
  try {
    const created = await dbStore.createFacility(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add resource facility', message: err.message });
  }
});

// POST /api/resources/optimize
router.post('/resources/optimize', async (req, res) => {
  try {
    const { targetZoneId } = req.body || {};
    const zones = await dbStore.getDisasters();
    const facilities = await dbStore.getFacilities();

    if (!zones.length) {
      return res.status(400).json({ error: 'No disaster zones available to optimize' });
    }

    const optimizationResult = optimizeResourceAllocation(zones, facilities, targetZoneId);
    
    // Auto-persist the generated response plan to database
    if (optimizationResult.responsePlan) {
      try {
        const savedPlan = await dbStore.createResponsePlan(optimizationResult.responsePlan);
        optimizationResult.savedPlan = savedPlan;
      } catch (saveErr) {
        console.warn('Could not auto-save response plan:', saveErr.message);
      }
    }

    res.json(optimizationResult);
  } catch (err) {
    console.error('Optimization error:', err);
    res.status(500).json({ error: 'Optimization computation failed', message: err.message });
  }
});

// GET /api/response-plans
router.get('/response-plans', async (req, res) => {
  try {
    const plans = await dbStore.getResponsePlans();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch response plans', message: err.message });
  }
});

// POST /api/response-plans
router.post('/response-plans', async (req, res) => {
  try {
    const created = await dbStore.createResponsePlan(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create response plan', message: err.message });
  }
});

// Valid state machine transitions
const VALID_WORKFLOW_TRANSITIONS = {
  'Approved': ['Deploying'],
  'Deploying': ['In Progress'],
  'In Progress': ['Completed'],
  'Completed': [] // Final state
};

// PATCH /api/response-plans/:id/status
router.patch('/response-plans/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const planId = req.params.id;
    
    const existingPlans = await dbStore.getResponsePlans();
    const currentPlan = existingPlans.find(p => p.id === planId || p._id === planId);

    if (!currentPlan) {
      return res.status(404).json({ error: 'Response plan not found' });
    }

    const currentStatus = currentPlan.status || 'Approved';
    const allowedNext = VALID_WORKFLOW_TRANSITIONS[currentStatus] || [];

    if (!allowedNext.includes(status) && status !== currentStatus) {
      return res.status(400).json({
        error: 'Invalid workflow state transition',
        message: `Cannot transition from '${currentStatus}' to '${status}'. Allowed next state: ${allowedNext.join(', ') || 'None (Completed)'}`
      });
    }

    const updated = await dbStore.updatePlanStatus(planId, status);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update plan status', message: err.message });
  }
});

// GET /api/analytics
router.get('/analytics', async (req, res) => {
  try {
    const zones = await dbStore.getDisasters();
    const facilities = await dbStore.getFacilities();
    const plans = await dbStore.getResponsePlans();

    const totalPopulationAtRisk = zones.reduce((sum, z) => sum + (Number(z.affectedPopulation) || 0), 0);
    const criticalZonesCount = zones.filter(z => z.severity === 'Critical').length;
    const highZonesCount = zones.filter(z => z.severity === 'High').length;

    // Aggregate inventory
    let totalWaterKits = 0;
    let totalFoodKits = 0;
    let totalAmbulances = 0;
    let totalRescueTeams = 0;
    let totalBoats = 0;
    let totalMedicalKits = 0;

    facilities.forEach(fac => {
      totalWaterKits += fac.inventory?.waterKits || 0;
      totalFoodKits += fac.inventory?.foodKits || 0;
      totalAmbulances += fac.inventory?.ambulances || 0;
      totalRescueTeams += fac.inventory?.rescueTeams || 0;
      totalBoats += fac.inventory?.boats || 0;
      totalMedicalKits += fac.inventory?.medicalKits || 0;
    });

    const disasterDistribution = [
      { name: 'Flood', count: zones.filter(z => z.type === 'Flood').length },
      { name: 'Landslide', count: zones.filter(z => z.type === 'Landslide').length },
      { name: 'Cyclone', count: zones.filter(z => z.type === 'Cyclone').length },
      { name: 'Wildfire', count: zones.filter(z => z.type === 'Wildfire').length }
    ];

    const resourceStockData = [
      { name: 'Water Kits', available: totalWaterKits, allocated: 600, demand: 840 },
      { name: 'Food Kits', available: totalFoodKits, allocated: 500, demand: 500 },
      { name: 'Ambulances', available: totalAmbulances, allocated: 3, demand: 3 },
      { name: 'Rescue Teams', available: totalRescueTeams, allocated: 4, demand: 4 },
      { name: 'Boats', available: totalBoats, allocated: 2, demand: 2 },
      { name: 'Medical Kits', available: totalMedicalKits, allocated: 350, demand: 350 }
    ];

    const efficiencyMetrics = {
      averageResponseTimeMinutes: 18,
      overallCoveragePercent: 82,
      resourceUtilizationPercent: 91,
      successfulDeployments: plans.filter(p => p.status === 'Completed' || p.status === 'Deploying' || p.status === 'In Progress').length
    };

    res.json({
      activeEmergencies: zones.length,
      criticalZones: criticalZonesCount,
      highZones: highZonesCount,
      peopleAtRisk: totalPopulationAtRisk,
      totalResourcesAvailable: totalWaterKits + totalFoodKits + totalAmbulances + totalRescueTeams + totalBoats + totalMedicalKits,
      responseEfficiency: 91,
      disasterDistribution,
      resourceStockData,
      efficiencyMetrics,
      lastUpdated: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate analytics', message: err.message });
  }
});

export default router;
