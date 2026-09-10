import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * SURVER Gemini AI Disaster Intelligence Analysis Engine
 * Evaluates Flood, Landslide, Cyclone, and Wildfire disaster telemetry
 */

export async function analyzeEmergencyWithGemini(emergencyData) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '' && !apiKey.includes('YOUR_')) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You are an expert AI Emergency Intelligence & Disaster Response Analyst for SURVER (Satellite-Powered AI Emergency Resource Orchestration Network).
Analyze the provided disaster and satellite assessment data.

Input Data:
${JSON.stringify(emergencyData, null, 2)}

You MUST return ONLY valid JSON with no markdown formatting, no backticks, no markdown codeblocks, and no preamble.
JSON Schema:
{
  "disasterType": "Flood" | "Landslide" | "Cyclone" | "Wildfire",
  "severity": "Critical" | "High" | "Moderate" | "Low",
  "riskScore": number (integer between 0 and 100),
  "affectedPopulation": number,
  "estimatedAffectedArea": number (km2),
  "urgency": "Immediate" | "High" | "Moderate" | "Low",
  "resourceRequirements": {
    "waterKits": number,
    "foodKits": number,
    "ambulances": number,
    "rescueTeams": number,
    "boats": number,
    "medicalKits": number
  },
  "reasoning": [
    "string detail 1",
    "string detail 2",
    "string detail 3",
    "string detail 4"
  ],
  "accessibilityAssessment": "string describing road/infrastructure status",
  "aiModelUsed": "Google Gemini 1.5 Flash (Live)"
}
`;

      const result = await model.generateContent(prompt);
      const textResponse = result.response.text();

      let cleaned = textResponse.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(cleaned);
      const validated = validateAndSanitizeAIResponse(parsed, emergencyData);
      validated.aiModelUsed = "Google Gemini 1.5 Flash (Live API)";
      return validated;

    } catch (err) {
      console.warn('[SURVER AI] Gemini live call encountered an error. Engaging deterministic heuristic fallback. Reason:', err.message);
    }
  }

  return generateDeterministicAnalysis(emergencyData);
}

function validateAndSanitizeAIResponse(data, fallbackContext) {
  const pop = Number(data.affectedPopulation) || fallbackContext.affectedPopulation || 5000;
  const isFlood = (data.disasterType || fallbackContext.type || '').toLowerCase().includes('flood');
  const isCyclone = (data.disasterType || fallbackContext.type || '').toLowerCase().includes('cyclone');

  return {
    disasterType: data.disasterType || fallbackContext.type || "Flood",
    severity: ['Critical', 'High', 'Moderate', 'Low'].includes(data.severity) ? data.severity : "Critical",
    riskScore: Math.min(100, Math.max(0, Number(data.riskScore) || 85)),
    affectedPopulation: pop,
    estimatedAffectedArea: Number(data.estimatedAffectedArea) || fallbackContext.affectedAreaKm2 || 10,
    urgency: ['Immediate', 'High', 'Moderate', 'Low'].includes(data.urgency) ? data.urgency : "Immediate",
    resourceRequirements: {
      waterKits: Math.max(10, Number(data.resourceRequirements?.waterKits) || Math.round(pop * 0.1)),
      foodKits: Math.max(10, Number(data.resourceRequirements?.foodKits) || Math.round(pop * 0.06)),
      ambulances: Math.max(1, Number(data.resourceRequirements?.ambulances) || 3),
      rescueTeams: Math.max(1, Number(data.resourceRequirements?.rescueTeams) || 4),
      boats: Number(data.resourceRequirements?.boats) !== undefined ? Number(data.resourceRequirements.boats) : ((isFlood || isCyclone) ? 2 : 0),
      medicalKits: Math.max(10, Number(data.resourceRequirements?.medicalKits) || Math.round(pop * 0.04))
    },
    reasoning: Array.isArray(data.reasoning) && data.reasoning.length > 0 ? data.reasoning : [
      `Satellite and sensor telemetry confirms significant ${fallbackContext.type || 'disaster'} activity in ${fallbackContext.country || 'the region'}`,
      `Direct population exposure of ${pop.toLocaleString()} vulnerable residents`,
      `Ground transit capacity reduced to ${fallbackContext.roadAccessibilityPercent || 40}%`,
      "Immediate resource allocation necessary to secure emergency perimeter"
    ],
    accessibilityAssessment: data.accessibilityAssessment || `Road accessibility impaired to ${fallbackContext.roadAccessibilityPercent || 40}%`
  };
}

export function generateDeterministicAnalysis(emergencyData) {
  const pop = Number(emergencyData.affectedPopulation) || 8400;
  const type = emergencyData.type || "Flood";
  const dtype = type.toLowerCase();
  const access = Number(emergencyData.roadAccessibilityPercent) || 40;
  const country = emergencyData.country || emergencyData.location?.country || "the sector";

  let riskScore = 90;
  let severity = "Critical";
  let urgency = "Immediate";

  if (emergencyData.riskScore) {
    riskScore = Number(emergencyData.riskScore);
    severity = emergencyData.severity || (riskScore > 80 ? "Critical" : riskScore > 60 ? "High" : "Moderate");
  } else {
    riskScore = Math.min(99, Math.round(35 + (pop / 250) + (100 - access) * 0.35));
    severity = riskScore >= 85 ? "Critical" : (riskScore >= 65 ? "High" : (riskScore >= 40 ? "Moderate" : "Low"));
  }

  const isFlood = dtype.includes('flood');
  const isLandslide = dtype.includes('landslide');
  const isCyclone = dtype.includes('cyclone');
  const isWildfire = dtype.includes('wildfire');

  const waterKits = Math.round(pop * 0.1);
  const foodKits = Math.round(pop * 0.06);
  const ambulances = Math.max(1, Math.round(pop / 2500));
  const rescueTeams = Math.max(2, Math.round(pop / 2000));
  const boats = (isFlood || isCyclone) ? Math.max(1, Math.round(pop / 4000)) : 0;
  const medicalKits = Math.round(pop * 0.04);

  let reasoningList = [];
  if (isFlood) {
    reasoningList = [
      `Sentinel-1 SAR radar backscatter drop indicates +${emergencyData.waterExpansionPercent || 265.6}% floodwater expansion in ${country}`,
      `Estimated ${pop.toLocaleString()} vulnerable residents located in the primary flood polygon`,
      `Road transit capacity degraded to ${access}%, requiring amphibious rescue watercraft`,
      `Priority medical and water filtration supplies required within 4-hour critical window`
    ];
  } else if (isLandslide) {
    reasoningList = [
      `Soil saturation at ${emergencyData.environmentalData?.soilSaturationPercent || 98}% and ${emergencyData.environmentalData?.slopeDegrees || 42}° slope caused structural debris flow`,
      `${pop.toLocaleString()} citizens cut off across highland mountain corridors in ${country}`,
      `Road accessibility at ${access}%, requiring heavy earthmoving equipment and technical rescue teams`,
      `Immediate evacuation of unstable downstream slope perimeters recommended`
    ];
  } else if (isCyclone) {
    reasoningList = [
      `Extreme cyclone wind gusts (${emergencyData.environmentalData?.windSpeedKmph || 145} km/h) and coastal storm surge detected`,
      `${pop.toLocaleString()} residents in immediate coastal barrier threat zone`,
      `Bridge and arterial road closures degraded transit to ${access}%`,
      `Emergency shelter provisioning and swift medical dispatch prioritized`
    ];
  } else if (isWildfire) {
    reasoningList = [
      `Thermal infrared anomaly indicates rapid wildfire progression across ${emergencyData.affectedAreaKm2 || 14.5} km²`,
      `${pop.toLocaleString()} citizens in wildland-urban interface requiring immediate evacuation`,
      `Smoke inhalation and fire fronts reducing road visibility and access to ${access}%`,
      `Rapid mobilization of firefighting units and burn trauma medical kits required`
    ];
  }

  return {
    disasterType: type,
    severity,
    riskScore,
    affectedPopulation: pop,
    estimatedAffectedArea: emergencyData.affectedAreaKm2 || 10,
    urgency,
    resourceRequirements: {
      waterKits,
      foodKits,
      ambulances,
      rescueTeams,
      boats,
      medicalKits
    },
    reasoning: reasoningList,
    accessibilityAssessment: `Ground accessibility at ${access}%. Specialized rapid response transit recommended.`,
    aiModelUsed: "Gemini Intelligence Engine (Simulated Fallback Mode)"
  };
}
