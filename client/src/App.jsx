import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DisasterZones from './pages/DisasterZones';
import SatelliteIntelligence from './pages/SatelliteIntelligence';
import Resources from './pages/Resources';
import ResponsePlans from './pages/ResponsePlans';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans">
        {/* Top Command Header */}
        <Header />

        {/* Main Content Layout with Sidebar */}
        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 overflow-y-auto min-h-[calc(100vh-4rem)] bg-[#060913]">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/zones" element={<DisasterZones />} />
              <Route path="/satellite" element={<SatelliteIntelligence />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/plans" element={<ResponsePlans />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
