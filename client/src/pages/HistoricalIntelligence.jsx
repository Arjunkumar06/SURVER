import React, { useState, useEffect } from 'react';
import { History, Calendar, MapPin, AlertTriangle, Search, Filter, ShieldCheck } from 'lucide-react';
import { fetchHistoricalEvents } from '../services/api';

export default function HistoricalIntelligence() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [filterState, setFilterState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchHistoricalEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load historical events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const states = ['All', ...new Set(events.map(e => e.state).filter(Boolean))];

  const filteredEvents = events.filter((e) => {
    const matchesType = filterType === 'All' || e.hazardType.includes(filterType);
    const matchesState = filterState === 'All' || e.state === filterState;
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesState && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <History className="w-6 h-6 text-[#A855F7]" />
            <h1 className="text-xl font-mono font-extrabold text-[#F8FAFC] uppercase tracking-wider">
              Historical Landslide & Flash Flood Intelligence
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/50 rounded">
              SIH 2026 ARCHIVE
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">
            Historical disaster inventories and rainfall-triggered event archives for hilly regions in India.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 cyber-card rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search event title, district, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0B0F19] border border-white/15 rounded-xl text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#A855F7]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#94A3B8]">Hazard:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#0B0F19] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#A855F7]"
            >
              <option value="All">All Hazards</option>
              <option value="Landslide">Landslide</option>
              <option value="Flash Flood">Flash Flood</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#94A3B8]">State:</span>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="bg-[#0B0F19] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#A855F7]"
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {filteredEvents.map((event) => (
          <div key={event.id} className="cyber-card rounded-2xl p-5 border border-white/10 space-y-3 relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span className="text-xs font-bold text-[#A855F7]">{event.date}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#0B0F19] text-[#00F0FF] rounded border border-[#00F0FF]/40">
                    {event.hazardType}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#F8FAFC] mt-1.5">{event.title}</h3>
                <div className="flex items-center space-x-1.5 text-xs text-[#94A3B8] mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{event.location}, {event.district} ({event.state})</span>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-[#FF2E54]/15 border border-[#FF2E54]/60 text-[#FF2E54] rounded-lg text-[10px] font-extrabold">
                {event.severity}
              </span>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed bg-[#0B0F19] p-3 rounded-xl border border-white/10">
              {event.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 bg-[#0B0F19] rounded-lg border border-white/5">
                <span className="text-[#64748B] text-[10px] uppercase">Recorded Rainfall</span>
                <div className="font-extrabold text-[#00F0FF]">{event.rainfallMm} mm</div>
              </div>
              <div className="p-2 bg-[#0B0F19] rounded-lg border border-white/5">
                <span className="text-[#64748B] text-[10px] uppercase">Impacted Citizens</span>
                <div className="font-extrabold text-[#F59E0B]">{event.affectedPopulation?.toLocaleString()} People</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
