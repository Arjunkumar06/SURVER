const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchDisasters() {
  const res = await fetch(`${API_BASE}/disasters`);
  if (!res.ok) throw new Error('Failed to fetch disaster zones');
  return res.json();
}

export async function fetchDisasterById(id) {
  const res = await fetch(`${API_BASE}/disasters/${id}`);
  if (!res.ok) throw new Error('Failed to fetch disaster details');
  return res.json();
}

export async function createDisaster(data) {
  const res = await fetch(`${API_BASE}/disasters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create disaster');
  return res.json();
}

export async function analyzeEmergencyAI(emergencyData) {
  const res = await fetch(`${API_BASE}/ai/analyze-emergency`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emergencyData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'AI analysis request failed');
  }
  return res.json();
}

export async function fetchSatelliteData(zoneId) {
  const res = await fetch(`${API_BASE}/satellite/${zoneId}`);
  if (!res.ok) throw new Error('Failed to fetch satellite intelligence');
  return res.json();
}

export async function fetchResources() {
  const res = await fetch(`${API_BASE}/resources`);
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
}

export async function optimizeResources(targetZoneId = null) {
  const res = await fetch(`${API_BASE}/resources/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetZoneId })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Optimization request failed');
  }
  return res.json();
}

export async function fetchResponsePlans() {
  const res = await fetch(`${API_BASE}/response-plans`);
  if (!res.ok) throw new Error('Failed to fetch response plans');
  return res.json();
}

export async function createResponsePlan(planData) {
  const res = await fetch(`${API_BASE}/response-plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(planData)
  });
  if (!res.ok) throw new Error('Failed to save response plan');
  return res.json();
}

export async function updatePlanStatus(id, status) {
  const res = await fetch(`${API_BASE}/response-plans/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update plan status');
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}
