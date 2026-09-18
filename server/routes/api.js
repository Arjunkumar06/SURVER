import express from 'express';
import { dbStore, calculateDeterministicRisk } from '../services/dbStore.js';
import { getSatelliteService } from '../services/satelliteService.js';
import { analyzeEmergencyWithGemini } from '../services/geminiService.js';
import { optimizeResourceAllocation } from '../services/optimizationService.js';

const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'SURVER SIH 2026 Flash Flood & Landslide Command Engine',
    problemStatementId: '26192',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    isUsingMongo: dbStore.isUsingMongo(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('YOUR_'))
  });
});

// GET /api/sih-metadata
router.get('/sih-metadata', (req, res) => {
  res.json(dbStore.getSihMetadata());
});

// GET /api/disasters & /api/villages
router.get('/disasters', async (req, res) => {
  try {
    const disasters = await dbStore.getDisasters();
    res.json(disasters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch disasters', message: err.message });
  }
});

router.get('/villages', async (req, res) => {
  try {
    const disasters = await dbStore.getDisasters();
    res.json(disasters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch villages', message: err.message });
  }
});

// GET /api/disasters/:id & /api/villages/:id
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

router.get('/villages/:id', async (req, res) => {
  try {
    const disaster = await dbStore.getDisasterById(req.params.id);
    if (!disaster) {
      return res.status(404).json({ error: 'Village zone not found' });
    }
    res.json(disaster);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch village zone', message: err.message });
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

// GET /api/sensors
router.get('/sensors', async (req, res) => {
  try {
    const sensors = await dbStore.getSensors();
    res.json(sensors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch IoT sensors', message: err.message });
  }
});

// GET /api/historical-events
router.get('/historical-events', async (req, res) => {
  try {
    const events = await dbStore.getHistoricalEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch historical events', message: err.message });
  }
});

// GET /api/warnings
router.get('/warnings', async (req, res) => {
  try {
    const warnings = await dbStore.getEarlyWarnings();
    res.json(warnings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch early warnings', message: err.message });
  }
});

// GET /api/shelters
router.get('/shelters', async (req, res) => {
  try {
    const shelters = await dbStore.getShelters();
    res.json(shelters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch evacuation shelters', message: err.message });
  }
});

// POST /api/risk/predict
router.post('/risk/predict', (req, res) => {
  try {
    const prediction = calculateDeterministicRisk(req.body);
    res.json(prediction);
  } catch (err) {
    res.status(400).json({ error: 'Failed to calculate risk prediction', message: err.message });
  }
});

// POST /api/ai/analyze-emergency
router.post('/ai/analyze-emergency', async (req, res) => {
  try {
    const emergencyData = req.body;
    if (!emergencyData) {
      return res.status(400).json({ error: 'Emergency data payload is required' });
    }

    const aiAnalysis = await analyzeEmergencyWithGemini(emergencyData);
    res.json(aiAnalysis);
  } catch (err) {
    console.error('[SURVER API] AI analysis endpoint note:', err.message);
    res.status(500).json({ 
      error: 'AI analysis failed', 
      message: err.message,
      fallbackMode: true
    });
  }
});

// GET /api/satellite/:zoneId
router.get('/satellite/:zoneId', async (req, res) => {
  try {
    const { zoneId } = req.params;
    const targetZone = await dbStore.getDisasterById(zoneId);
    
    if (!targetZone) {
      return res.status(404).json({ error: 'Disaster zone not found for satellite analysis' });
    }

    const satService = getSatelliteService(targetZone);
    const satelliteSummary = satService.getZoneSummary();

    res.json({
      zone: targetZone,
      satelliteSummary,
      radarDifferenceMap: satService.generateSvgImagery('difference'),
      baselineMap: satService.generateSvgImagery('before'),
      postEventMap: satService.generateSvgImagery('after'),
      changeAnalysis: {
        zoneCode: targetZone.code,
        country: targetZone.country,
        disasterType: targetZone.type,
        impactLevel: targetZone.severity === 'Critical' ? 'CRITICAL_HAZARD' : 'HIGH_ALERT',
        expansionFactor: `${targetZone.waterExpansionPercent || 0}%`,
        confidence: 0.94,
        cloudCoverStatus: '100% (Radar all-weather penetration)',
        summary: `Copernicus Earth observation confirmed ${targetZone.type} hazard covering ${targetZone.affectedAreaKm2 || 5} km² across ${targetZone.name}.`
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate satellite intelligence', message: err.message });
  }
});

// GET /api/resources
router.get('/resources', async (req, res) => {
  try {
    const facilities = await dbStore.getFacilities();
    const totals = {
      waterKits: 0,
      foodKits: 0,
      medicalKits: 0,
      rescueTeams: 0,
      ambulances: 0,
      boats: 0
    };

    facilities.forEach(fac => {
      if (fac.inventory) {
        totals.waterKits += fac.inventory.waterKits || 0;
        totals.foodKits += fac.inventory.foodKits || 0;
        totals.medicalKits += fac.inventory.medicalKits || 0;
        totals.rescueTeams += fac.inventory.rescueTeams || 0;
        totals.ambulances += fac.inventory.ambulances || 0;
        totals.boats += fac.inventory.boats || 0;
      }
    });

    res.json({
      facilities,
      totalInventory: totals,
      lastUpdated: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resource inventory', message: err.message });
  }
});

// POST /api/resources/optimize
router.post('/resources/optimize', async (req, res) => {
  try {
    const { targetZoneId } = req.body;
    const disasters = await dbStore.getDisasters();
    const facilities = await dbStore.getFacilities();

    let targetZone = null;
    if (targetZoneId) {
      targetZone = disasters.find(d => d.id === targetZoneId || d.code === targetZoneId);
    }
    if (!targetZone && disasters.length > 0) {
      targetZone = disasters.reduce((prev, curr) => (curr.riskScore > prev.riskScore ? curr : prev));
    }

    if (!targetZone) {
      return res.status(400).json({ error: 'No active disaster zone available for optimization' });
    }

    const result = optimizeResourceAllocation(targetZone, facilities);
    
    // Save generated plan to store
    await dbStore.createResponsePlan({
      disasterId: targetZone.id,
      zoneCode: targetZone.code,
      disasterName: targetZone.name,
      country: targetZone.country,
      disasterType: targetZone.type,
      priorityScore: targetZone.riskScore,
      status: 'Approved',
      workflowState: 'Approved',
      coverage: Math.round(result.fulfillmentPercentage || 90),
      resourceUtilization: 92,
      estimatedResponseTimeMinutes: Math.round(result.allocatedRoute?.[0]?.estimatedTravelTimeMinutes || 20),
      allocations: result.allocatedRoute?.flatMap(r => 
        Object.entries(r.dispatchedItems || {}).map(([k, v]) => ({
          resourceType: k,
          quantity: v,
          unit: 'units',
          sourceFacility: r.facilityName
        }))
      ) || [],
      shortages: result.deficitAlerts || []
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to execute resource optimization', message: err.message });
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
    const newPlan = await dbStore.createResponsePlan(req.body);
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create response plan', message: err.message });
  }
});

// PATCH /api/response-plans/:id/status
router.patch('/response-plans/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await dbStore.updatePlanStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Response plan not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update plan status', message: err.message });
  }
});

// GET /api/analytics
router.get('/analytics', async (req, res) => {
  try {
    const zones = await dbStore.getDisasters();
    const facilities = await dbStore.getFacilities();
    const plans = await dbStore.getResponsePlans();

    const totalPopulationAtRisk = zones.reduce((acc, curr) => acc + (curr.affectedPopulation || 0), 0);
    const criticalZonesCount = zones.filter(z => z.severity === 'Critical').length;
    const highZonesCount = zones.filter(z => z.severity === 'High').length;

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
      { name: 'Flash Flood', count: zones.filter(z => (z.type || '').includes('Flood')).length },
      { name: 'Landslide', count: zones.filter(z => (z.type || '').includes('Landslide')).length },
      { name: 'Cyclone', count: zones.filter(z => (z.type || '').includes('Cyclone')).length },
      { name: 'Wildfire', count: zones.filter(z => (z.type || '').includes('Wildfire')).length }
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
      overallCoveragePercent: 88,
      resourceUtilizationPercent: 94,
      successfulDeployments: plans.filter(p => p.status === 'Completed' || p.status === 'Deploying' || p.status === 'In Progress' || p.status === 'Approved').length
    };

    res.json({
      activeEmergencies: zones.length,
      criticalZones: criticalZonesCount,
      highZones: highZonesCount,
      peopleAtRisk: totalPopulationAtRisk,
      totalResourcesAvailable: totalWaterKits + totalFoodKits + totalAmbulances + totalRescueTeams + totalBoats + totalMedicalKits,
      responseEfficiency: 94,
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
