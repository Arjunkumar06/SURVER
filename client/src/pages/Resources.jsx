import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Warehouse, 
  Cross, 
  Truck, 
  ShieldAlert, 
  Anchor, 
  Droplet, 
  Utensils, 
  HeartPulse,
  Activity,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Globe
} from 'lucide-react';
import { fetchResources } from '../services/api';

export default function Resources() {
  const [resourcesData, setResourcesData] = useState({ facilities: [], totalInventory: {} });
  const [loading, setLoading] = useState(true);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await fetchResources();
      setResourcesData(data);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
    const interval = setInterval(loadInventory, 5000);
    return () => clearInterval(interval);
  }, []);

  const total = resourcesData.totalInventory || {};

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg sm:text-xl font-mono font-extrabold text-slate-900 tracking-wider uppercase">
              Emergency Resource Inventory & Facilities
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-100 text-cyan-800 border border-cyan-300 rounded">
              Global Logistics Pool
            </span>
          </div>
          <p className="text-xs text-slate-600 font-mono mt-0.5">
            Real-time multi-depot stock monitoring across regional emergency stations
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
          <Globe className="w-3.5 h-3.5 text-cyan-600" />
          <span>Active Depots: {resourcesData.facilities?.length || 6}</span>
        </div>
      </div>

      {/* Aggregated Total Stock Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 relative shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Water Kits</span>
            <Droplet className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-700 font-mono">
            {(total.waterKits || 1600).toLocaleString()}
          </div>
          <p className="text-[10px] font-mono text-slate-500">Filtration & Rations</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 relative shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Food Kits</span>
            <Utensils className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono">
            {(total.foodKits || 1550).toLocaleString()}
          </div>
          <p className="text-[10px] font-mono text-slate-500">MRE Emergency Packs</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 relative shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Ambulances</span>
            <Truck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            {total.ambulances || 20}
          </div>
          <p className="text-[10px] font-mono text-slate-500">Advanced Life Support</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 relative shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Rescue Teams</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono">
            {total.rescueTeams || 16}
          </div>
          <p className="text-[10px] font-mono text-slate-500">NDRF / USAR Certified</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 relative shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Rescue Boats</span>
            <Anchor className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-700 font-mono">
            {total.boats || 8}
          </div>
          <p className="text-[10px] font-mono text-slate-500">Inflatable Jet Vessels</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 relative shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Medical Kits</span>
            <HeartPulse className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 font-mono">
            {(total.medicalKits || 2000).toLocaleString()}
          </div>
          <p className="text-[10px] font-mono text-slate-500">Trauma & Wound Care</p>
        </div>
      </div>

      {/* Facility Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
          Emergency Logistics Depots & Stations ({resourcesData.facilities?.length || 6} Facilities)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resourcesData.facilities?.map((fac) => (
            <div
              key={fac.id || fac.name}
              className="bg-white rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between relative border border-slate-200"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 font-mono">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-lg border border-cyan-200 shadow-sm">
                      {fac.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      ({fac.country || 'Regional'})
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 pt-1">{fac.name}</h3>
                  <p className="text-xs text-slate-500">{fac.location?.address || 'Metro Sector Facility'}</p>
                </div>

                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {fac.status || 'Operational'}
                </span>
              </div>

              {/* Inventory Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Water Kits:</span>
                  <strong className="text-cyan-700 font-bold">{fac.inventory?.waterKits || 0}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Food Kits:</span>
                  <strong className="text-amber-700 font-bold">{fac.inventory?.foodKits || 0}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ambulances:</span>
                  <strong className="text-emerald-700 font-bold">{fac.inventory?.ambulances || 0}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rescue Teams:</span>
                  <strong className="text-amber-700 font-bold">{fac.inventory?.rescueTeams || 0}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Boats:</span>
                  <strong className="text-cyan-700 font-bold">{fac.inventory?.boats || 0}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Medical Kits:</span>
                  <strong className="text-rose-600 font-bold">{fac.inventory?.medicalKits || 0}</strong>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                <span>GPS: {fac.location?.lat?.toFixed(4)}, {fac.location?.lng?.toFixed(4)}</span>
                <span className="text-emerald-700 flex items-center space-x-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Staged & Operational</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
