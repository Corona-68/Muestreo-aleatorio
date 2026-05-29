import { SamplingResult } from '../lib/utils';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList, Cell, ReferenceArea } from 'recharts';

interface VisualizerProps {
  results: SamplingResult[];
  stripWidth: number;
  startKm: number;
  startMetros: number;
  longTramo: number;
  isExporting?: boolean;
  width?: number;
  height?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 p-4 rounded-lg shadow-xl text-sm space-y-1">
        <p className="font-bold text-blue-600">Muestra #{data.order}</p>
        <p className="text-slate-600 font-bold">Cad: <span className="font-mono">{data.chainage}</span></p>
        <p className="text-slate-600 font-bold">Dist. Eje: <span className="font-mono">{data.axisDist.toFixed(2)} m</span></p>
        <div className="pt-1">
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-widest text-white ${data.side === 'Izquierdo' ? 'bg-blue-600' : 'bg-red-600'}`}>
            {data.side}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function CoordinateVisualizer({ 
  results, 
  stripWidth, 
  startKm, 
  startMetros, 
  longTramo,
  isExporting = false,
  width,
  height
}: VisualizerProps) {
  const totalStartMeters = startKm * 1000 + startMetros;
  
  const formatChainage = (metersFromStart: number) => {
    const totalMetros = Number((totalStartMeters + metersFromStart).toFixed(2));
    const km = Math.floor(totalMetros / 1000);
    const mRaw = Number((totalMetros % 1000).toFixed(2));
    const m = mRaw.toFixed(2);
    return `${km}+${m}`;
  };

  const ticks = [0, ...results.map(r => r.longDist)].sort((a, b) => a - b);
  const xMin = 0;
  const xMax = longTramo;

  const data = results.map(r => ({
    x: r.longDist,
    y: r.axisDist,
    order: parseInt(r.order).toString(),
    side: r.side,
    chainage: r.chainage,
    axisDist: r.axisDist
  }));

  // Path coordinates for connecting line
  const pathData = [...results]
    .sort((a, b) => a.longDist - b.longDist)
    .map(r => ({
      x: r.longDist,
      y: r.axisDist
    }));

  const yLimit = stripWidth / 2;

  const generateYTicks = () => {
    const ticksList = [];
    for (let current = -yLimit; current <= yLimit; current += 1.0) {
      ticksList.push(Number(current.toFixed(2)));
    }
    if (ticksList[ticksList.length - 1] < yLimit - 0.01) {
      ticksList.push(yLimit);
    }
    return ticksList;
  };

  const yTicks = generateYTicks();

  const containerStyle = isExporting 
    ? {
        display: 'flex',
        flexDirection: 'column' as const,
        width: `${width ? width + 48 : 1000}px`,
        height: `${height ? height + 160 : 580}px`,
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #cbd5e1',
        boxSizing: 'border-box' as const,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }
    : undefined;

  const headerStyle = isExporting
    ? {
        display: 'flex',
        flexDirection: 'row' as const,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }
    : undefined;

  const titleGroupStyle = isExporting
    ? {
        display: 'flex',
        flexDirection: 'column' as const
      }
    : undefined;

  const legendGroupStyle = isExporting
    ? {
        display: 'flex',
        flexDirection: 'row' as const,
        gap: '16px'
      }
    : undefined;

  const legendItemStyle = isExporting
    ? {
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'center',
        gap: '8px'
      }
    : undefined;

  const chartContainerStyle = isExporting
    ? {
        width: `${width || 900}px`,
        height: `${height || 400}px`,
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        overflow: 'hidden',
        position: 'relative' as const
      }
    : undefined;

  const footerStyle = isExporting
    ? {
        display: 'flex',
        flexDirection: 'row' as const,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '16px',
        padding: '0 8px'
      }
    : undefined;

  const renderScatterChart = (chartWidth?: number, chartHeight?: number) => (
    <ScatterChart 
      width={chartWidth} 
      height={chartHeight} 
      margin={{ top: 25, right: 60, bottom: 45, left: 35 }}
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="14"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#000000" />
        </marker>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
      
      <XAxis 
        type="number" 
        dataKey="x" 
        name="Cadenamiento" 
        axisLine={false} 
        tickLine={false} 
        domain={[xMin, xMax]}
        ticks={ticks}
        tickFormatter={formatChainage}
        tick={{ fontSize: 13, fontWeight: 700, fill: '#334155', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      />
      <YAxis 
        type="number" 
        dataKey="y" 
        name="Transversal" 
        domain={[-yLimit - 0.2, yLimit + 0.2]} 
        ticks={yTicks}
        axisLine={false} 
        tickLine={false}
        tickFormatter={(val) => val.toFixed(2)}
        tick={{ fontSize: 13, fontWeight: 700, fill: '#334155', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      />
      <ZAxis type="number" range={[180, 180]} />
      <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
      
      <ReferenceLine y={0} stroke="#1e293b" strokeWidth={2.5} strokeDasharray="4 4 1 4" label={{ value: 'EJE CL ℄', position: 'right', fontSize: 14, fontWeight: 'bold', fill: '#1e293b', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }} />
      
      {/* Draw vertical dotted reference lines for each sample */}
      {results.map((r, idx) => (
        <ReferenceLine 
          key={`ref-line-${idx}`}
          x={r.longDist} 
          stroke="#64748b" 
          strokeDasharray="2 2" 
          strokeWidth={1}
        />
      ))}

      {/* Solid enclosure of the road section as a bold black rectangle */}
      <ReferenceArea
        {...({
          x1: 0,
          x2: longTramo,
          y1: -yLimit,
          y2: yLimit,
          stroke: '#000000',
          strokeWidth: 3,
          fill: '#ffffff',
          fillOpacity: 0.01
        } as any)}
      />

      {/* Flow path line with arrowheads */}
      <Scatter 
        data={pathData} 
        line={{ stroke: '#000000', strokeWidth: 1.5, markerEnd: 'url(#arrow)' }}
        shape={() => null}
      />

      {/* Scatter points representing samples */}
      <Scatter data={data} fill="#8884d8">
        {data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={entry.side === 'Izquierdo' ? '#2563EB' : '#DC2626'} 
            stroke="#FFFFFF"
            strokeWidth={2.5}
          />
        ))}
        <LabelList dataKey="order" position="top" style={{ fontSize: '15px', fontWeight: 'bold', fill: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }} offset={12} />
      </Scatter>
    </ScatterChart>
  );

  return (
    <div 
      className={isExporting ? "" : "h-full w-full rounded-2xl overflow-hidden glass-card relative border-none flex flex-col p-6 shadow-xl bg-white"}
      style={containerStyle}
    >
      <div 
        className={isExporting ? "" : "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6"}
        style={headerStyle}
      >
        <div style={titleGroupStyle}>
          <h3 className={isExporting ? "" : "text-lg font-bold text-slate-700 tracking-tight"} style={isExporting ? { fontSize: '18px', fontWeight: 700, color: '#334155', margin: 0 } : undefined}>Esquema de Ubicación (Vista Planta)</h3>
          <p className={isExporting ? "" : "text-xs text-slate-400 font-medium"} style={isExporting ? { fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' } : undefined}>Ubicación de muestras referenciada al eje de la obra (cotas en metros)</p>
        </div>
        <div 
          className={isExporting ? "" : "flex gap-4 shrink-0"}
          style={legendGroupStyle}
        >
          <div 
            className={isExporting ? "" : "flex items-center gap-2"}
            style={legendItemStyle}
          >
            <div 
              className={isExporting ? "" : "w-4 h-4 rounded-full bg-blue-600 ring-2 ring-blue-100"}
              style={isExporting ? { width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#2563EB' } : undefined}
            ></div>
            <span 
              className={isExporting ? "" : "text-xs font-bold text-slate-500 uppercase tracking-tight font-sans"}
              style={isExporting ? { fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' } : undefined}
            >Lado Izquierdo (+)</span>
          </div>
          <div 
            className={isExporting ? "" : "flex items-center gap-2"}
            style={legendItemStyle}
          >
            <div 
              className={isExporting ? "" : "w-4 h-4 rounded-full bg-red-600 ring-2 ring-red-100"}
              style={isExporting ? { width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#DC2626' } : undefined}
            ></div>
            <span 
              className={isExporting ? "" : "text-xs font-bold text-slate-500 uppercase tracking-tight font-sans"}
              style={isExporting ? { fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' } : undefined}
            >Lado Derecho (-)</span>
          </div>
        </div>
      </div>

      <div 
        className={isExporting ? "" : "flex-1 min-h-0 bg-[#f8fafc]/30 rounded-xl relative"} 
        style={chartContainerStyle}
      >
        {isExporting ? (
          renderScatterChart(width, height)
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderScatterChart()}
          </ResponsiveContainer>
        )}
      </div>
      
      <div 
        className={isExporting ? "" : "mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest px-2"}
        style={footerStyle}
      >
        <span style={isExporting ? { color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px' } : undefined}>Km Inicial: {startKm}+{startMetros}</span>
        <span style={isExporting ? { color: '#64748b', textTransform: 'uppercase', fontSize: '11px' } : undefined}>• Vista Esquemática Planta •</span>
        <span style={isExporting ? { color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px' } : undefined}>Ancho de Franja: {stripWidth}m</span>
      </div>
    </div>
  );
}
