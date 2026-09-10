import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Users, 
  MapPin, 
  Sparkles, 
  Navigation, 
  Satellite, 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  Droplet,
  Utensils,
  Ambulance,
  ShieldAlert,
  Anchor,
  TrendingUp,
  Globe,
  X
} from 'lucide-react';
import { fetchDisasters, fetchResources, createDisaster, optimizeResources } from '../services/api';
import DisasterDetailModal from '../components/DisasterDetailModal';

export default function DisasterZones() {
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterCountry, setFilterCountry] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZoneModal, setSelectedZoneModal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newZoneData, setNewZoneData] = useState({
    name: '',
    code: '',
    country: 'Nepal',
    region: 'Bagmati Province',
    type: 'Flood',
    severity: 'High',
    riskScore: 75,
    affectedPopulation: 3500,
    affectedAreaKm2: 6.5,
    roadAccessibilityPercent: 55,
    waterExpansionPercent: 190,
    lat: 27.7172,
    lng: 85.3240,
    description: ''
  });

  const loadData = async () => {
    try {
      const [disasterList, resourceData] = await Promise.all([
        fetchDisasters(),
        fetchResources().catch(() => ({ facilities: [] }))
      ]);
      setDisasters(disasterList);
      setFacilities(resourceData.facilities || []);
    } catch (err) {
      console.error('Failed to load disaster zones:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const countries = ['All', ...new Set(disasters.map(d => d.country || d.location?.country).filter(Boolean))];

  const filteredDisasters = disasters.filter((z) => {
    const matchesSeverity = filterSeverity === 'All' || z.severity === filterSeverity;
    const matchesCountry = filterCountry === 'All' || (z.country || z.location?.country) === filterCountry;
    const matchesSearch = z.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          z.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (z.country || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          z.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesCountry && matchesSearch;
  });

  const handleCreateZone = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newZoneData.name,
        code: newZoneData.code.toUpperCase(),
        country: newZoneData.country,
        region: newZoneData.region,
        type: newZoneData.type,
        severity: newZoneData.severity,
        riskScore: Number(newZoneData.riskScore),
        affectedPopulation: Number(newZoneData.affectedPopulation),
        affectedAreaKm2: Number(newZoneData.affectedAreaKm2),
        roadAccessibilityPercent: Number(newZoneData.roadAccessibilityPercent),
        waterExpansionPercent: Number(newZoneData.waterExpansionPercent),
        location: {
          lat: Number(newZoneData.lat),
          lng: Number(newZoneData.lng),
          address: `${newZoneData.name} Sector`,
          city: newZoneData.region,
          country: newZoneData.country
        },
        description: newZoneData.description || 'Emergency incident recorded.'
      };
      await createDisaster(payload);
      setShowAddModal(false);
      loadData();
    } catch (err) {
      console.error('Error creating disaster:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg sm:text-xl font-mono font-extrabold text-[#F8FAFC] tracking-wider uppercase">
              Global Hazard Sectors Directory
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 rounded">
              Worldwide Registry
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            Real-time geospatial hazard zones monitored by Sentinel SAR and Gemini AI
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 cyber-btn-cyan rounded-xl text-xs font-mono font-extrabold flex items-center space-x-1.5 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>REGISTER HAZARD INCIDENT</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 cyber-card border border-white/10 rounded-2xl shadow-xl">
        <div className="relative w-full sm:w-80 font-mono">
          <Search className="w-4 h-4 text-[#00F0FF] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by zone code, name or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full cyber-card border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#00F0FF] shadow-inner"
          />
        </div>

        {/* Country and Severity Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto font-mono">
          {/* Country Selector */}
          <div className="flex items-center space-x-1">
            <span className="text-xs text-[#94A3B8] font-bold shrink-0 flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Country:</span>
            </span>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="cyber-card border border-white/10 text-[#00F0FF] font-bold text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-[#00F0FF] shadow"
            >
              {countries.map(c => (
                <option key={c} value={c} className="bg-[#030712] text-white">{c}</option>
              ))}
            </select>
          </div>

          {/* Severity Filter Pills */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-[#94A3B8] font-bold shrink-0 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>Severity:</span>
            </span>
            {['All', 'Critical', 'High', 'Moderate'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-xl transition shrink-0 ${
                  filterSeverity === sev
                    ? 'cyber-pill-active'
                    : 'cyber-pill text-[#94A3B8] hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disaster Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDisasters.map((zone) => {
          return (
            <div
              key={zone.id || zone.code}
              className="cyber-card rounded-2xl p-5 space-y-4 shadow-2xl flex flex-col justify-between relative border border-white/10"
            >
              <div className="space-y-3">
                {/* Zone Top Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 text-xs font-bold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 rounded-xl shadow-sm">
                      {zone.code}
                    </span>
                    <span className="text-xs font-bold text-[#94A3B8]">
                      {zone.country || zone.location?.country || 'Nepal'}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    zone.severity === 'Critical' ? 'bg-[#FF2E54]/20 text-[#FF2E54] border border-[#FF2E54]/50 shadow-[0_0_10px_rgba(255,46,84,0.3)]' :
                    zone.severity === 'High' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]' :
                    'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                  }`}>
                    {zone.severity}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white leading-snug">{zone.name}</h3>
                  <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">{zone.description}</p>
                </div>

                {/* Key Metrics Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono cyber-card p-3 rounded-xl border border-white/10">
                  <div>
                    <span className="text-[#94A3B8] text-[10px]">Disaster:</span>
                    <p className="font-bold text-white">{zone.type}</p>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] text-[10px]">Risk Score:</span>
                    <p className="font-bold text-[#FF2E54]">{zone.riskScore}/100</p>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] text-[10px]">Population:</span>
                    <p className="font-bold text-[#A855F7]">{(zone.affectedPopulation || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] text-[10px]">Area Extent:</span>
                    <p className="font-bold text-white">{zone.affectedAreaKm2} km²</p>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[#94A3B8] text-[10px]">Road Accessibility:</span>
                    <span className="font-bold text-[#F59E0B] font-mono">{zone.roadAccessibilityPercent}%</span>
                  </div>
                </div>

                {/* Satellite Expansion Pill */}
                <div className="flex items-center space-x-2 text-xs font-mono text-[#F8FAFC] bg-[#00F0FF]/10 p-2.5 rounded-xl border border-[#00F0FF]/30 shadow-inner">
                  <Satellite className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  <span>
                    Flood expansion: <strong className="text-[#00F0FF] font-extrabold">+{zone.waterExpansionPercent || 265.6}%</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center space-x-2 font-mono">
                <button
                  onClick={() => setSelectedZoneModal(zone)}
                  className="flex-1 py-2 cyber-btn-purple text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>INSPECT & AI</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/', { state: { autoOptimizeZone: zone } });
                  }}
                  className="px-3 py-2 cyber-btn-cyan text-[#030712] rounded-xl text-xs font-bold flex items-center space-x-1 transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>DISPATCH</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Inspection Modal */}
      {selectedZoneModal && (
        <DisasterDetailModal
          zone={selectedZoneModal}
          allDisasters={disasters}
          allFacilities={facilities}
          onClose={() => setSelectedZoneModal(null)}
          onOptimize={() => {
            setSelectedZoneModal(null);
            navigate('/');
          }}
          onViewSatellite={() => {
            setSelectedZoneModal(null);
            navigate('/satellite');
          }}
        />
      )}

      {/* Add New Incident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#030712]/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="cyber-card rounded-2xl w-full max-w-lg shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-white/10 p-6 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Register Emergency Incident</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-white/10 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateZone} className="space-y-3.5 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Zone Code (e.g. ZONE NP-4)</label>
                  <input
                    type="text"
                    required
                    placeholder="ZONE NP-4"
                    value={newZoneData.code}
                    onChange={(e) => setNewZoneData({ ...newZoneData, code: e.target.value })}
                    className="w-full cyber-card border border-white/10 rounded-xl p-2 text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Country</label>
                  <input
                    type="text"
                    required
                    placeholder="Nepal"
                    value={newZoneData.country}
                    onChange={(e) => setNewZoneData({ ...newZoneData, country: e.target.value })}
                    className="w-full cyber-card border border-white/10 rounded-xl p-2 text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Sector Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chitwan Flood Basin"
                    value={newZoneData.name}
                    onChange={(e) => setNewZoneData({ ...newZoneData, name: e.target.value })}
                    className="w-full cyber-card border border-white/10 rounded-xl p-2 text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Disaster Type</label>
                  <select
                    value={newZoneData.type}
                    onChange={(e) => setNewZoneData({ ...newZoneData, type: e.target.value })}
                    className="w-full cyber-card border border-white/10 rounded-xl p-2 text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="Flood" className="bg-[#030712]">Flood</option>
                    <option value="Landslide" className="bg-[#030712]">Landslide</option>
                    <option value="Cyclone" className="bg-[#030712]">Cyclone</option>
                    <option value="Wildfire" className="bg-[#030712]">Wildfire</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Severity</label>
                  <select
                    value={newZoneData.severity}
                    onChange={(e) => setNewZoneData({ ...newZoneData, severity: e.target.value })}
                    className="w-full cyber-card border border-white/10 rounded-xl p-2 text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="Critical" className="bg-[#030712]">Critical</option>
                    <option value="High" className="bg-[#030712]">High</option>
                    <option value="Moderate" className="bg-[#030712]">Moderate</option>
                    <option value="Low" className="bg-[#030712]">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Risk Score (0-100)</label>
                  <input
                    type="number"
                    value={newZoneData.riskScore}
                    onChange={(e) => setNewZoneData({ ...newZoneData, riskScore: e.target.value })}
                    className="w-full cyber-card border border-white/10 rounded-xl p-2 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Affected Pop</label>
                  <input
                    type="number"
                    value={newZoneData.affectedPopulation}
                    onChange={(e) => setNewZoneData({ ...newZoneData, affectedPopulation: e.target.value })}
                    className="w-full cyber-card border border-white/10 rounded-xl p-2 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newZoneData.lat}
                    onChange={(e) => setNewZoneData({ ...newZoneData, lat: e.target.value })}
                    className="w-full cyber-card border border-white/10 rounded-xl p-2 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newZoneData.lng}
                    onChange={(e) => setNewZoneData({ ...newZoneData, lng: e.target.value })}
                    className="w-full cyber-card border border-white/10 rounded-xl p-2 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/10 font-mono">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 cyber-pill text-[#94A3B8] rounded-xl font-bold border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 cyber-btn-cyan rounded-xl font-bold"
                >
                  Create Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
