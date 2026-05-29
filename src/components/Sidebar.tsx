import React, { useState } from 'react';
import { SamplingParams } from '../lib/utils';
import { Settings, Play, Info, Calculator, Ruler } from 'lucide-react';

interface SidebarProps {
  params: SamplingParams;
  setParams: (params: SamplingParams) => void;
  onGenerate: () => void;
  onReferenceUpload: (data: string[][]) => void;
}

export default function Sidebar({
  params,
  setParams,
  onGenerate,
  onReferenceUpload
}: SidebarProps) {
  const [justGenerated, setJustGenerated] = useState(false);

  const handleGenerateClick = () => {
    // Vibrate briefly on mobile devices if supported
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(12);
    }
    
    onGenerate();
    setJustGenerated(true);
    setTimeout(() => {
      setJustGenerated(false);
    }, 1500);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        onReferenceUpload(rows);
      };
      reader.readAsText(file);
    }
  };

  return (
    <aside className="w-full lg:w-80 bg-white lg:border-r border-slate-200 lg:p-6 p-4 flex flex-col gap-6 shrink-0 lg:min-h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] lg:overflow-y-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-4">
            Información de la Obra
          </label>
          <input
            type="text"
            placeholder="Nombre de la obra"
            value={params.workName}
            onChange={(e) => setParams({ ...params, workName: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-base font-bold text-slate-400 uppercase tracking-wider">
            Kilómetro Inicial
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold">Km</span>
              <input
                type="number"
                value={params.startKm}
                onChange={(e) => setParams({ ...params, startKm: parseInt(e.target.value) || 0 })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-base font-mono"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold">m</span>
              <input
                type="number"
                step="0.001"
                value={params.startMetros}
                onChange={(e) => setParams({ ...params, startMetros: parseFloat(e.target.value) || 0 })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-base font-mono"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-base font-bold text-slate-400 uppercase tracking-wider">
            Kilómetro Final
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold">Km</span>
              <input
                type="number"
                value={params.endKm}
                onChange={(e) => setParams({ ...params, endKm: parseInt(e.target.value) || 0 })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-base font-mono"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold">m</span>
              <input
                type="number"
                step="0.001"
                value={params.endMetros}
                onChange={(e) => setParams({ ...params, endMetros: parseFloat(e.target.value) || 0 })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-base font-mono"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-base font-bold text-slate-400 uppercase tracking-wider">
            Muestreo
          </label>
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                <Calculator className="w-4 h-4" /> Muestras (M)
              </span>
              <input
                type="number"
                min="1"
                max="30"
                value={params.numSamples}
                onChange={(e) => setParams({ ...params, numSamples: parseInt(e.target.value) || 1 })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-base font-mono"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                <Ruler className="w-4 h-4" /> Ancho Franja (m)
              </span>
              <input
                type="number"
                step="0.1"
                value={params.stripWidth}
                onChange={(e) => setParams({ ...params, stripWidth: parseFloat(e.target.value) || 0 })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-base font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <button
            type="button"
            onClick={handleGenerateClick}
            className={`w-full py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.95] active:bg-slate-800 shadow-lg cursor-pointer touch-manipulation select-none ${
              justGenerated 
                ? 'bg-emerald-600 shadow-emerald-100 scale-[0.98]' 
                : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
            }`}
          >
            {justGenerated ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                <span>¡Muestras Generadas!</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Generar Muestras</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm text-blue-800 font-bold uppercase tracking-tighter">Funcionamiento</p>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
              El sistema utiliza una tabla interna de factores aleatorios (Factores A y B) para garantizar la integridad del muestreo.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
