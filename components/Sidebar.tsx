
import React from 'react';

interface SidebarProps {
  activeLayer: string;
  onLayerChange: (layer: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeLayer, onLayerChange, isOpen, onClose }) => {
  const mainLayers = [
    { id: 'all', name: 'Standard View', icon: 'fa-compass', desc: 'Unified provincial core' },
    { id: 'tourism', name: 'Leisure & Resorts', icon: 'fa-sun', desc: 'Coastal zones' },
    { id: 'heritage', name: 'Cultural Heritage', icon: 'fa-landmark', desc: 'Historical sites' },
    { id: 'industry', name: 'Economic Hubs', icon: 'fa-bolt', desc: 'Logistics & energy' },
  ];

  const hazardLayers = [
    { id: 'risk-volcano', name: 'Volcano', icon: 'fa-volcano' },
    { id: 'risk-eq-landslide', name: 'Seismic Landslide', icon: 'fa-mountain-sun' },
    { id: 'risk-rain-landslide', name: 'Rain Landslide', icon: 'fa-cloud-rain' },
    { id: 'risk-liquefaction', name: 'Liquefaction', icon: 'fa-droplet' },
    { id: 'risk-storm-surge', name: 'Storm Surge', icon: 'fa-wind' },
    { id: 'risk-tsunami', name: 'Tsunami', icon: 'fa-water' },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-200/40 backdrop-blur-sm z-[2000] md:hidden transition-opacity"
          onClick={onClose}
        ></div>
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[2001] w-[300px] bg-white/80 backdrop-blur-2xl flex flex-col 
        border-r border-slate-200 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Branding */}
        <div className="p-10 pb-6">
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-200">
              <i className="fas fa-satellite text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Batangas <span className="text-blue-600">GIS</span>
              </h1>
              <p className="text-[10px] font-medium text-slate-400 tracking-[0.2em] uppercase mt-1">
                Spatial Intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
          {/* Main Layers */}
          <div className="space-y-1 mt-4">
            <h2 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Discovery</h2>
            {mainLayers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => onLayerChange(layer.id)}
                className={`w-full group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  activeLayer === layer.id
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <i className={`fas ${layer.icon} text-sm w-5 text-center ${activeLayer === layer.id ? 'text-blue-400' : 'text-slate-300 group-hover:text-blue-500'}`}></i>
                <div className="text-left">
                  <span className="text-xs font-semibold block">{layer.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Hazard Section - Calm but Informative */}
          <div className="mt-10">
            <h3 className="px-4 text-[10px] font-bold text-red-400 uppercase tracking-widest mb-4">Risk Monitoring</h3>
            <div className="space-y-1">
              {hazardLayers.map((hazard) => (
                <button
                  key={hazard.id}
                  onClick={() => onLayerChange(hazard.id)}
                  className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-2xl text-[11px] font-semibold transition-all border ${
                    activeLayer === hazard.id
                      ? 'bg-red-50 border-red-100 text-red-700 shadow-sm'
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-red-50/50'
                  }`}
                >
                  <i className={`fas ${hazard.icon} w-5 text-center ${activeLayer === hazard.id ? 'text-red-500' : 'text-slate-200'}`}></i>
                  <span>{hazard.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-8 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Node Sync Active</span>
          </div>
          <p className="text-[9px] text-slate-300 font-medium tracking-tight leading-relaxed">
            Satellite data synchronized with <br/> provincial emergency center.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
