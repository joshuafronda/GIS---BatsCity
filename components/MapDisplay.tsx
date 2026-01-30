import React, { useEffect, useRef } from 'react';
import { HAZARD_LAYER_TO_COLUMN, type MunicipalityRisk, type RiskLevel } from '../types';
import riskDataJson from '../data/batangas-risk.json';

// Access Leaflet from the global window object (loaded via CDN)
declare const L: any;

interface MapDisplayProps {
  activeLayer: string;
  onAreaClick: (area: string) => void;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  Low: '#22c55e',
  Moderate: '#f59e0b',
  High: '#ef4444',
};

const HAZARD_ICONS: Record<string, string> = {
  'risk-volcano': 'fa-volcano',
  'risk-eq-landslide': 'fa-mountain-sun',
  'risk-rain-landslide': 'fa-cloud-rain',
  'risk-liquefaction': 'fa-droplet',
  'risk-storm-surge': 'fa-wind',
  'risk-tsunami': 'fa-water',
};

const gisNodes = [
  // --- TOURISM ---
  { id: 'laiya', name: 'Laiya Beach', cat: 'tourism', lat: 13.6521, lng: 121.3789, color: '#3b82f6', icon: 'fa-sun' },
  { id: 'anilao', name: 'Anilao Sanctuary', cat: 'tourism', lat: 13.6934, lng: 120.8931, color: '#3b82f6', icon: 'fa-fish' },
  { id: 'calatagan', name: 'Calatagan Cape', cat: 'tourism', lat: 13.7844, lng: 120.6122, color: '#3b82f6', icon: 'fa-lighthouse' },

  // --- INDUSTRIAL ---
  { id: 'batangas-port', name: 'Batangas Int. Port', cat: 'industry', lat: 13.7554, lng: 121.0454, color: '#0f172a', icon: 'fa-ship' },
  { id: 'taal-basilica', name: 'St. Martin Basilica', cat: 'heritage', lat: 13.8821, lng: 120.9234, color: '#6366f1', icon: 'fa-church' },
];

const riskData = riskDataJson as MunicipalityRisk[];

const MapDisplay: React.FC<MapDisplayProps> = ({ activeLayer, onAreaClick }) => {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        zoomControl: false,
        attributionControl: false
      }).setView([13.85, 121.05], 10);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const isHazardLayer = activeLayer in HAZARD_LAYER_TO_COLUMN;
    const hazardColumn = isHazardLayer ? HAZARD_LAYER_TO_COLUMN[activeLayer] : null;

    if (isHazardLayer && hazardColumn && riskData.length > 0) {
      riskData.forEach((row) => {
        const riskLevel = row[hazardColumn] as RiskLevel;
        const color = RISK_COLORS[riskLevel] ?? '#94a3b8';
        const icon = HAZARD_ICONS[activeLayer] ?? 'fa-triangle-exclamation';
        const hazardLabel = activeLayer.replace('risk-', '').replace(/-/g, ' ');

        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div class="relative group">
              <div style="background: ${color};" class="w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white text-xs transition-all duration-300 hover:scale-110 animate-soft-pulse">
                <i class="fas ${icon}"></i>
              </div>
              <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[9px] font-bold uppercase px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider border border-slate-100 pointer-events-none">
                ${row.Municipality} · ${riskLevel}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([row.lat, row.lng], { icon: customIcon })
          .addTo(mapRef.current)
          .bindPopup(`
            <div class="p-4 bg-white text-slate-800 rounded-2xl min-w-[200px] border-none">
              <div class="flex items-center justify-between mb-4">
                <span class="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border" style="background: ${color}20; border-color: ${color}40; color: ${color};">${riskLevel}</span>
              </div>
              <h4 class="text-xs font-bold uppercase tracking-tight mb-2">${row.Municipality}</h4>
              <p class="text-[10px] text-slate-500 mb-2">${hazardLabel}</p>
              <div class="space-y-1 pt-2 border-t border-slate-50 font-mono text-[9px] text-slate-400">
                <p>N ${row.lat.toFixed(5)}° E ${row.lng.toFixed(5)}°</p>
              </div>
            </div>
          `);
        markersRef.current.push(marker);
      });
    } else {
      gisNodes.forEach((node) => {
        const isVisible = activeLayer === 'all' || activeLayer === node.cat;
        if (isVisible) {
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
              <div class="relative group">
                <div style="background: ${node.color};" class="w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white text-xs transition-all duration-300 hover:scale-110">
                  <i class="fas ${node.icon}"></i>
                </div>
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[9px] font-bold uppercase px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider border border-slate-100 pointer-events-none">
                  ${node.name}
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const marker = L.marker([node.lat, node.lng], { icon: customIcon })
            .addTo(mapRef.current)
            .bindPopup(`
              <div class="p-4 bg-white text-slate-800 rounded-2xl min-w-[200px] border-none">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-slate-50 border border-slate-100">${node.cat}</span>
                </div>
                <h4 class="text-xs font-bold uppercase tracking-tight mb-2">${node.name}</h4>
                <div class="space-y-1 pt-2 border-t border-slate-50 font-mono text-[9px] text-slate-400">
                  <p>N ${node.lat.toFixed(5)}° E ${node.lng.toFixed(5)}°</p>
                </div>
              </div>
            `);
          markersRef.current.push(marker);
        }
      });
    }

    if (activeLayer !== 'all' && markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.4));
    }
  }, [activeLayer]);

  return (
    <div className="relative w-full h-full">
      <div id="map"></div>

      {/* Modern Minimal Controls */}
      <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-2">
        <button 
          onClick={() => mapRef.current?.setView([13.85, 121.05], 10)}
          className="w-12 h-12 bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <i className="fas fa-crosshairs text-base"></i>
        </button>
        <div className="flex flex-col bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-lg overflow-hidden">
          <button 
            onClick={() => mapRef.current?.zoomIn()}
            className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 border-b border-slate-50 transition-all"
          >
            <i className="fas fa-plus"></i>
          </button>
          <button 
            onClick={() => mapRef.current?.zoomOut()}
            className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
          >
            <i className="fas fa-minus"></i>
          </button>
        </div>
      </div>

      {/* Floating Status */}
      <div className="absolute top-6 left-6 z-[1000] pointer-events-none flex flex-col gap-2">
        <div className="bg-white/70 backdrop-blur-xl px-5 py-3 rounded-2xl border border-slate-100 shadow-lg flex items-center gap-4">
          <div className={`w-2 h-2 rounded-full shadow-sm animate-pulse ${activeLayer in HAZARD_LAYER_TO_COLUMN ? 'bg-red-500' : 'bg-blue-500'}`}></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              {activeLayer in HAZARD_LAYER_TO_COLUMN ? 'Risk Monitoring' : 'Sector Live'}
            </p>
            <p className="text-xs font-bold text-slate-900 capitalize tracking-tight">
              {activeLayer === 'all' ? 'Standard Core' : activeLayer.replace('risk-', '').replace(/-/g, ' ')}
            </p>
          </div>
        </div>
        {activeLayer in HAZARD_LAYER_TO_COLUMN && (
          <div className="bg-white/70 backdrop-blur-xl px-4 py-2 rounded-2xl border border-slate-100 shadow-lg flex items-center gap-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Legend</span>
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: RISK_COLORS.Low }}></span><span className="text-[10px] font-medium text-slate-600">Low</span></span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: RISK_COLORS.Moderate }}></span><span className="text-[10px] font-medium text-slate-600">Moderate</span></span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: RISK_COLORS.High }}></span><span className="text-[10px] font-medium text-slate-600">High</span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapDisplay;
