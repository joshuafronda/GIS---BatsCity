
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MapDisplay from './components/MapDisplay';
import { gisService } from './services/geminiService';
import { AIResponse } from './types';

const App: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<string>('all');
  const [query, setQuery] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userLoc, setUserLoc] = useState<{ latitude: number, longitude: number } | undefined>();
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => console.warn("GPS Restricted", err)
      );
    }
  }, []);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setAiResponse(null);
    try {
      const result = await gisService.queryBatangasMap(searchQuery, userLoc);
      setAiResponse(result);
    } catch (error) {
      console.error("GIS Exception", error);
    } finally {
      setLoading(false);
      setQuery('');
    }
  }, [userLoc]);

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        activeLayer={activeLayer} 
        onLayerChange={setActiveLayer} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-white">
        {/* Clean Header */}
        <header className="h-20 px-8 md:px-12 flex items-center justify-between z-[1001] bg-white/70 backdrop-blur-xl border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 active:scale-95 transition-all"
            >
              <i className="fas fa-bars-staggered"></i>
            </button>
            <div className="hidden sm:block">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Workspace</h2>
              <p className="text-slate-900 font-bold text-base tracking-tight capitalize">
                {activeLayer === 'all' ? 'Provincial Overview' : activeLayer.replace('risk-', '').replace('-', ' ')}
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative group">
              <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder="Search landmarks or technical coordinates..."
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 pl-14 pr-6 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all duration-300 font-medium shadow-sm"
              />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-0.5">Live Telemetry</span>
              <span className="text-[11px] font-mono text-slate-400">
                {userLoc ? `${userLoc.latitude.toFixed(4)}°N, ${userLoc.longitude.toFixed(4)}°E` : '13.75°N, 121.05°E'}
              </span>
            </div>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 relative flex flex-col p-4 md:p-6 bg-[#fcfcfd]">
          <div className="flex-1 relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 bg-white">
            <MapDisplay activeLayer={activeLayer} onAreaClick={handleSearch} />
          </div>

          {/* AI Info Panel */}
          {(loading || aiResponse) && (
            <div className="absolute bottom-10 right-10 z-[1002] w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
                      <i className="fas fa-microchip text-xs text-white"></i>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-800">Spatial Intelligence</span>
                  </div>
                  <button onClick={() => setAiResponse(null)} className="text-slate-300 hover:text-slate-500 transition-colors">
                    <i className="fas fa-times text-sm"></i>
                  </button>
                </div>
                <div className="p-7 max-h-[450px] overflow-y-auto custom-scrollbar">
                  {loading ? (
                    <div className="flex flex-col items-center py-12 gap-5 text-center">
                      <div className="w-12 h-12 border-3 border-slate-100 border-t-blue-500 rounded-full animate-spin"></div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Querying GIS Nodes...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-[13px] text-slate-600 leading-relaxed font-medium">
                        {aiResponse?.text}
                      </div>
                      {aiResponse?.groundingLinks && aiResponse.groundingLinks.length > 0 && (
                        <div className="pt-6 border-t border-slate-50">
                          <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4 italic">Grounding Sources</h4>
                          <div className="flex flex-wrap gap-2">
                            {aiResponse.groundingLinks.map((chunk: any, idx) => {
                              const mapData = chunk.maps;
                              if (!mapData) return null;
                              return (
                                <a 
                                  key={idx}
                                  href={mapData.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 px-4 py-2 bg-slate-50 text-slate-800 rounded-xl text-[11px] font-bold border border-slate-100 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                                >
                                  <i className="fas fa-map-pin text-blue-500"></i>
                                  {mapData.title || 'GIS Location'}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Footer */}
        <footer className="h-10 bg-white border-t border-slate-50 flex items-center px-12 text-[9px] font-bold text-slate-400 tracking-widest uppercase shrink-0">
          <div className="flex items-center gap-10">
            <span className="flex items-center gap-2 text-blue-500"><div className="w-1 h-1 rounded-full bg-blue-500"></div> System Integrity verified</span>
          </div>
          <div className="ml-auto font-mono opacity-50">
            LOC: 13.8584N 121.0566E
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
