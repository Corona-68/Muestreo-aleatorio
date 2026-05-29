import { SamplingResult } from '../lib/utils';
import { Table as TableIcon, MapPin } from 'lucide-react';

export interface TableProps {
  results: SamplingResult[];
  randomN: number | null;
}

export default function PointsTable({ results, randomN }: TableProps) {
  if (results.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center border-dashed">
        <MapPin className="w-8 h-8 text-slate-200 mx-auto mb-4" />
        <p className="text-slate-400 font-medium">Ingresa los datos y genera las muestras</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Desktop View: Wide consolidated table */}
      <div className="hidden md:flex glass-card rounded-2xl overflow-hidden flex-col min-h-[400px]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50 sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <TableIcon className="w-4.5 h-4.5 text-blue-500" />
            <h3 className="text-lg font-bold text-slate-700 tracking-tight flex items-center gap-2">
              Resultados del Muestreo
              {randomN !== null && (
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded-md font-mono font-extrabold flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  N = {randomN}
                </span>
              )}
            </h3>
          </div>
          <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {results.length} muestras
          </span>
        </div>
        <div className="flex-1 overflow-x-auto w-full p-4">
          <table className="w-full min-w-[900px] text-center text-sm md:text-base border-collapse border border-slate-300">
            <thead className="bg-[#1e293b] text-white font-bold unicode-bidi">
              <tr className="border border-slate-300">
                <th rowSpan={2} className="px-3 py-4 border border-slate-300 text-center font-extrabold uppercase tracking-tight text-xs md:text-sm">N°</th>
                <th colSpan={2} className="px-3 py-2 border border-slate-300 text-center font-extrabold uppercase tracking-wider text-xs md:text-sm">Números Aleatorios</th>
                <th rowSpan={2} className="px-3 py-4 border border-slate-300 text-center font-extrabold text-xs md:text-sm leading-relaxed">
                  Distancia<br/>longitudinal<br/>
                  <span className="font-mono text-xs font-medium italic block text-blue-300">dL</span>
                  <span className="text-xs font-normal block text-slate-300">m</span>
                  <span className="text-[11px] font-normal tracking-wide block text-slate-400 mt-1">( a × L )</span>
                </th>
                <th rowSpan={2} className="px-3 py-4 border border-slate-300 text-center font-extrabold text-xs md:text-sm leading-relaxed">
                  Distancia<br/>Transversal<br/>
                  <span className="font-mono text-xs font-medium italic block text-blue-300">dA</span>
                  <span className="text-xs font-normal block text-slate-300">m</span>
                  <span className="text-[11px] font-normal tracking-wide block text-slate-400 mt-1">( b × A )</span>
                </th>
                <th rowSpan={2} className="px-3 py-4 border border-slate-300 text-center font-extrabold text-xs md:text-sm leading-relaxed">
                  Cadenamiento del<br/>sitio seleccionado<br/>
                  <span className="font-mono text-xs font-medium block text-blue-300">km</span>
                  <span className="text-[11px] font-normal tracking-wide block text-slate-400 mt-1">( Co + dL )</span>
                </th>
                <th rowSpan={2} className="px-3 py-4 border border-slate-300 text-center font-extrabold text-xs md:text-sm leading-relaxed">
                  Distancia<br/>transversal al eje<br/>
                  <span className="font-mono text-xs font-medium italic block text-blue-300">dA'</span>
                  <span className="text-xs font-normal block text-slate-300">m</span>
                  <span className="text-[11px] font-normal tracking-wide block text-slate-400 mt-1">( dA − A/2 )</span>
                </th>
                <th rowSpan={2} className="px-3 py-4 border border-slate-300 text-center font-extrabold uppercase tracking-tight text-xs md:text-sm">Lado</th>
              </tr>
              <tr className="border border-slate-300 bg-[#334155]">
                <th className="px-3 py-1.5 border border-slate-300 text-center font-mono font-bold text-xs md:text-sm">
                  A<br/>
                  <span className="text-[10px] font-normal text-slate-300">( a )</span>
                </th>
                <th className="px-3 py-1.5 border border-slate-300 text-center font-mono font-bold text-xs md:text-sm">
                  B<br/>
                  <span className="text-[10px] font-normal text-slate-300">( b )</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 text-slate-700 bg-white font-mono text-base">
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-3 border border-slate-300 font-bold text-slate-900 bg-slate-50/50">{r.order}</td>
                  <td className="px-3 py-3 border border-slate-300">{r.a.toFixed(4)}</td>
                  <td className="px-3 py-3 border border-slate-300">{r.b.toFixed(4)}</td>
                  <td className="px-3 py-3 border border-slate-300 font-bold text-slate-900">{r.longDist.toFixed(2)}</td>
                  <td className="px-3 py-3 border border-slate-300 font-bold text-slate-900">{r.transDist.toFixed(2)}</td>
                  <td className="px-3 py-3 border border-slate-300 font-bold text-blue-700 bg-blue-50/10">{r.chainage}</td>
                  <td className="px-3 py-3 border border-slate-300 font-bold text-slate-900 bg-slate-50/30">{r.axisDist.toFixed(2)}</td>
                  <td className="px-3 py-3 border border-slate-300">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${r.side === 'Izquierdo' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                      {r.side}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View: Stack of three separate tables */}
      <div className="block md:hidden space-y-6">
        {/* Table 1: Números Aleatorios */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Números Aleatorios</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center text-sm border-collapse border border-slate-200">
              <thead className="bg-[#1e293b] text-white">
                <tr className="border border-slate-200">
                  <th rowSpan={2} className="px-3 py-4 border border-slate-200 font-bold text-xs uppercase text-center">N°</th>
                  <th colSpan={2} className="px-3 py-2 border border-slate-200 font-bold text-xs uppercase text-center">Números Aleatorios</th>
                </tr>
                <tr className="border border-slate-200 bg-[#334155]">
                  <th className="px-3 py-2 border border-slate-200 font-mono font-bold text-xs text-center">A (a)</th>
                  <th className="px-3 py-2 border border-slate-200 font-mono font-bold text-xs text-center">B (b)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-slate-700 bg-white">
                {results.map((r, i) => (
                  <tr key={`mob1-${r.id || i}`} className="hover:bg-slate-50">
                    <td className="px-3 py-3 border border-slate-200 font-bold text-slate-950 bg-slate-50/50">{r.order}</td>
                    <td className="px-3 py-3 border border-slate-200">{r.a.toFixed(4)}</td>
                    <td className="px-3 py-3 border border-slate-200">{r.b.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Distancias Calculadas */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Distancias Calculadas</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center text-sm border-collapse border border-slate-200">
              <thead className="bg-[#1e293b] text-white">
                <tr className="border border-slate-200">
                  <th className="px-3 py-4 border border-slate-200 font-bold text-xs uppercase text-center">N°</th>
                  <th className="px-3 py-4 border border-slate-200 font-bold text-xs uppercase text-center leading-normal">
                    Distancia Longitudinal dL (m)<br/>
                    <span className="text-[10px] text-slate-300 font-normal block mt-0.5">( a × L )</span>
                  </th>
                  <th className="px-3 py-4 border border-slate-200 font-bold text-xs uppercase text-center leading-normal">
                    Distancia Transversal dA (m)<br/>
                    <span className="text-[10px] text-slate-300 font-normal block mt-0.5">( b × A )</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-slate-700 bg-white">
                {results.map((r, i) => (
                  <tr key={`mob2-${r.id || i}`} className="hover:bg-slate-50">
                    <td className="px-3 py-3 border border-slate-200 font-bold text-slate-950 bg-slate-50/50">{r.order}</td>
                    <td className="px-3 py-3 border border-slate-200 font-bold text-slate-950">{r.longDist.toFixed(2)}</td>
                    <td className="px-3 py-3 border border-slate-200 font-bold text-slate-950">{r.transDist.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 3: Puntos de Muestreo y Ubicación */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Resultados / Puntos de Muestreo</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center text-sm border-collapse border border-slate-200">
              <thead className="bg-[#1e293b] text-white">
                <tr className="border border-slate-200">
                  <th className="px-3 py-4 border border-slate-200 font-bold text-xs uppercase text-center">N°</th>
                  <th className="px-3 py-4 border border-slate-200 font-bold text-xs uppercase text-center">Cadenamiento</th>
                  <th className="px-3 py-4 border border-slate-200 font-bold text-xs uppercase text-center leading-normal">
                    Distancia<br/>
                    <span className="text-[10px] text-slate-300 font-normal block mt-0.5">( dA − A/2 )</span>
                  </th>
                  <th className="px-3 py-4 border border-slate-200 font-bold text-xs uppercase text-center">Lado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-slate-700 bg-white">
                {results.map((r, i) => (
                  <tr key={`mob3-${r.id || i}`} className="hover:bg-slate-50">
                    <td className="px-3 py-3 border border-slate-200 font-bold text-slate-950 bg-slate-50/50">{r.order}</td>
                    <td className="px-3 py-3 border border-slate-200 font-bold text-blue-700 bg-blue-50/10">{r.chainage}</td>
                    <td className="px-3 py-3 border border-slate-200 font-bold text-slate-950">{r.axisDist.toFixed(2)}</td>
                    <td className="px-3 py-3 border border-slate-200">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${r.side === 'Izquierdo' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {r.side}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
