import { useState, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import CoordinateVisualizer from './components/CoordinateVisualizer';
import Table from './components/Table';
import { SamplingResult, SamplingParams } from './lib/utils';
import { runSampling } from './lib/samplingLogic';
import { DEFAULT_ALEAT_TABLE } from './data/fallbackTable';
import { Layers, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

export default function App() {
  const visualizerRef = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState<SamplingParams>({
    workName: 'Puente Rizo de Oro',
    startKm: 73,
    startMetros: 200,
    endKm: 73,
    endMetros: 450,
    numSamples: 5,
    stripWidth: 11.0,
  });

  const defaultResults: SamplingResult[] = [
    {
      id: 'default-1',
      order: '01',
      a: 0.3161,
      b: 0.9144,
      longDist: 79.03,
      transDist: 10.06,
      chainage: '73 + 279.03',
      axisDist: 4.56,
      side: 'Izquierdo'
    },
    {
      id: 'default-2',
      order: '02',
      a: 0.7315,
      b: 0.2943,
      longDist: 182.88,
      transDist: 3.24,
      chainage: '73 + 382.88',
      axisDist: -2.26,
      side: 'Derecho'
    },
    {
      id: 'default-3',
      order: '03',
      a: 0.4943,
      b: 0.6482,
      longDist: 123.58,
      transDist: 7.13,
      chainage: '73 + 323.58',
      axisDist: 1.63,
      side: 'Izquierdo'
    },
    {
      id: 'default-4',
      order: '04',
      a: 0.8417,
      b: 0.4701,
      longDist: 210.43,
      transDist: 5.17,
      chainage: '73 + 410.43',
      axisDist: -0.33,
      side: 'Derecho'
    },
    {
      id: 'default-5',
      order: '05',
      a: 0.9730,
      b: 0.2526,
      longDist: 243.25,
      transDist: 2.78,
      chainage: '73 + 443.25',
      axisDist: -2.72,
      side: 'Derecho'
    }
  ];

  const [results, setResults] = useState<SamplingResult[]>(defaultResults);
  const [randomN, setRandomN] = useState<number | null>(3);
  const [referenceTable, setReferenceTable] = useState<string[][]>(DEFAULT_ALEAT_TABLE);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(() => {
    if (!params.workName.trim()) {
      setError("Por favor, ingresa el nombre de la obra.");
      return false;
    }

    const kmIni = params.startKm + params.startMetros / 1000;
    const kmFin = params.endKm + params.endMetros / 1000;

    if (kmFin <= kmIni) {
      setError("El kilómetro final debe ser mayor al kilómetro inicial.");
      return false;
    }

    try {
      setError(null);
      console.log("Generando muestras con params:", params);
      const { results: newResults, n } = runSampling(params, referenceTable);
      console.log(`Muestreo completado con éxito. N aleatorio elegido: ${n}. Cantidad de muestras: ${newResults.length}`);
      
      setResults(newResults);
      setRandomN(n);

      // Smooth scroll to the results section on mobile screens so the user sees the tables update immediately
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section-container');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
      return true;
    } catch (err: any) {
      console.error("Error al generar muestras:", err);
      setError(err?.message || "Ocurrió un error al generar las muestras.");
      return false;
    }
  }, [params, referenceTable]);

  const handleExportPDF = async () => {
    if (results.length === 0) return;

    const doc = new jsPDF('landscape');
    const timestamp = new Date().toLocaleString();

    // Calculations for metadata
    const kmIni = params.startKm + params.startMetros / 1000;
    const kmFin = params.endKm + params.endMetros / 1000;
    const longTramo = (kmFin - kmIni) * 1000;

    // PAGE 1: Portada - Header, Metadata Panel & Graphical visualizer scheme
    
    // Draw top aesthetic bar in deep Slate
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(0, 0, 297, 8, 'F');

    // Title Block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text("Localización de los puntos para el muestreo aleatorio", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("NORMATIVA NIT-SICT", 14, 25);

    // Header divider line
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(14, 28, 283, 28);

    // Section 1: General Data
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("DATOS GENERALES DEL TRAMO DE ESTUDIO", 14, 35);

    // Create an elegant border box for General Data
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(14, 38, 269, 28, 'FD');

    // Inside Box Key-Value fields
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85); // slate-700

    // Left block inside general Box
    doc.setFont("helvetica", "bold"); doc.text("Nombre de la Obra:", 20, 44);
    doc.setFont("helvetica", "normal"); doc.text(`${params.workName}`, 58, 44);

    doc.setFont("helvetica", "bold"); doc.text("Origen:", 20, 50);
    doc.setFont("helvetica", "normal"); doc.text(`Km ${params.startKm} + ${params.startMetros.toFixed(2)}`, 58, 50);

    doc.setFont("helvetica", "bold"); doc.text("Término:", 20, 56);
    doc.setFont("helvetica", "normal"); doc.text(`Km ${params.endKm} + ${params.endMetros.toFixed(2)}`, 58, 56);

    // Right block inside general Box
    doc.setFont("helvetica", "bold"); doc.text("Longitud del Tramo (L):", 155, 44);
    doc.setFont("helvetica", "normal"); doc.text(`${longTramo.toFixed(2)} m`, 200, 44);

    doc.setFont("helvetica", "bold"); doc.text("Ancho de Franja (A):", 155, 50);
    doc.setFont("helvetica", "normal"); doc.text(`${params.stripWidth.toFixed(2)} m`, 200, 50);

    doc.setFont("helvetica", "bold"); doc.text("Inicio Aleatorio (Fila N):", 155, 56);
    doc.setFont("helvetica", "normal"); doc.text(`${randomN ?? 'No especificado'}`, 200, 56);

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 71, 283, 71);

    // Section 2: Visual Scheme title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("REPRESENTACIÓN GRÁFICA: ESQUEMA DE UBICACIÓN (VISTA EN PLANTA)", 14, 77);

    // Render & Add scheme visualization from the high-fidelity hidden print wrapper
    const captureElement = document.getElementById('pdf-visualizer-capture');
    if (captureElement) {
      try {
        const canvas = await html2canvas(captureElement, {
          scale: 2.2, // Crisp high-res capture
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          onclone: (clonedDoc) => {
            // Remove oklch-containing stylesheets to prevent parse errors in html2canvas
            const stylesheets = Array.from(clonedDoc.querySelectorAll('style, link[rel="stylesheet"]'));
            stylesheets.forEach(el => el.remove());
          }
        });

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = doc.internal.pageSize.getWidth();
        const maxImgHeight = 110; // Comfortable fit
        const imgWidth = pdfWidth - 28; // 269mm
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (imgHeight > maxImgHeight) {
          const scale = maxImgHeight / imgHeight;
          imgHeight = maxImgHeight;
          const scaledWidth = imgWidth * scale;
          const xOffset = 14 + (imgWidth - scaledWidth) / 2;
          doc.addImage(imgData, 'PNG', xOffset, 81, scaledWidth, imgHeight);
        } else {
          doc.addImage(imgData, 'PNG', 14, 81, imgWidth, imgHeight);
        }
      } catch (err) {
        console.error('Error capturing visualization:', err);
        // Fallback placeholder in case rendering fails
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(148, 163, 184);
        doc.text("[ No se pudo generar la vista interactiva para el PDF ]", 110, 120);
      }
    }

    // Dynamic clean footer on Page 1
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Reporte generado el ${timestamp}`, 14, 202);
    doc.text("Página 1 de 2", 265, 202);


    // PAGE 2: Tabulación de Resultados
    doc.addPage();

    // Top aesthetic border
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(0, 0, 297, 8, 'F');

    // Page Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text("TABULACIÓN DE RESULTADOS", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Muestras de control calculadas bajo el procedimiento de números aleatorios para la obra: ${params.workName}`, 14, 25);

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 28, 283, 28);

    // Build the high fidelity results table with double-header row
    autoTable(doc, {
      startY: 34,
      head: [
        [
          { content: 'N°', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
          { content: 'Números Aleatorios', colSpan: 2, styles: { halign: 'center' } },
          { content: 'Distancia Longitudinal\ndL (m)\n( a × L )', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
          { content: 'Distancia Transversal\ndA (m)\n( b × A )', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
          { content: 'Cadenamiento del Sitio\nSeleccionado\n( Co + dL )', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
          { content: 'Distancia Transversal\nal Eje dA\' (m)\n( dA − A/2 )', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
          { content: 'Lado', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } }
        ],
        [
          { content: 'A (a)', styles: { halign: 'center' } },
          { content: 'B (b)', styles: { halign: 'center' } }
        ]
      ],
      body: results.map(r => [
        r.order, 
        r.a.toFixed(4), 
        r.b.toFixed(4), 
        r.longDist.toFixed(2), 
        r.transDist.toFixed(2), 
        r.chainage, 
        r.axisDist.toFixed(2), 
        r.side
      ]),
      theme: 'grid',
      headStyles: { 
        fillColor: [30, 41, 59], 
        textColor: [255, 255, 255], 
        fontSize: 8.5,
        fontStyle: 'bold',
        lineColor: [148, 163, 184],
        lineWidth: 0.2
      },
      bodyStyles: { 
        halign: 'center', 
        valign: 'middle',
        fontSize: 9.5,
        textColor: [51, 65, 85],
        lineColor: [203, 213, 225],
        lineWidth: 0.1
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 15 },
        1: { cellWidth: 28 },
        2: { cellWidth: 28 },
        3: { fontStyle: 'bold', cellWidth: 40 },
        4: { fontStyle: 'bold', cellWidth: 40 },
        5: { fontStyle: 'bold', textColor: [29, 78, 216], cellWidth: 45 },
        6: { fontStyle: 'bold', cellWidth: 40 },
        7: { cellWidth: 33 }
      }
    });

    // Signature boxes at the bottom of page 2
    const tableFinalY = (doc as any).lastAutoTable.finalY || 130;
    const boxY = Math.max(tableFinalY + 15, 140);

    if (boxY < 185) {
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      
      // Left signature line (First)
      doc.line(40, boxY, 110, boxY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Por la dependencia nombre y firma", 75, boxY + 4, { align: 'center' });

      // Right signature line (Second)
      doc.line(180, boxY, 250, boxY);
      doc.text("Por el contratista nombre y firma", 215, boxY + 4, { align: 'center' });
    }

    // Page 2 clean footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Reporte generado el ${timestamp}`, 14, 202);
    doc.text("Página 2 de 2", 265, 202);

    doc.save(`muestreo_${params.workName.replace(/\s+/g, '_') || 'reporte'}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Header */}
      <header className="min-h-16 h-auto py-3 lg:h-16 lg:py-0 border-b border-slate-200 bg-white sticky top-0 z-50 shrink-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
                Muestreo Aleatorio SICT
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <button
              onClick={handleExportPDF}
              disabled={results.length === 0}
              className="px-4 py-2 md:px-6 md:py-3 text-sm sm:text-base md:text-lg font-bold bg-blue-600 text-white rounded-lg shadow-md shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide flex items-center gap-2 md:gap-3"
            >
              <FileText className="w-4 h-4 md:w-5 md:h-5" />
              Exportar PDF
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden bg-slate-50">
        {/* Controls */}
        <Sidebar
          params={params}
          setParams={setParams}
          onGenerate={handleGenerate}
          onReferenceUpload={(data) => {
            setReferenceTable(data);
            setError(null);
          }}
        />

        {/* Content Area */}
        <div className="flex-1 lg:overflow-y-auto p-4 lg:p-8 space-y-8">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-2xl flex items-center gap-4 shadow-sm"
              >
                <AlertCircle className="w-6 h-6 shrink-0" />
                <span className="text-lg font-bold">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {randomN && (
            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg w-fit text-lg font-bold">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              Número aleatorio N = {randomN}
            </div>
          )}

          <div id="results-section-container" className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-12 hidden md:block">
              <div className="h-[430px] sm:h-[500px] lg:h-[600px]" ref={visualizerRef}>
                <CoordinateVisualizer 
                  results={results} 
                  stripWidth={params.stripWidth} 
                  startKm={params.startKm}
                  startMetros={params.startMetros}
                  longTramo={(params.endKm + params.endMetros / 1000 - (params.startKm + params.startMetros / 1000)) * 1000}
                />
              </div>
            </div>
            
            <div className="xl:col-span-12">
              <Table results={results} />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-10 shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-1">
             <div className="flex items-center justify-center md:justify-start gap-2">
                <Layers className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-500 text-sm md:text-base">
                  Aplicación desarrollada por: M.en. I. Ing. Martín Olvera Corona
                </span>
             </div>
          </div>
          <p className="text-sm font-bold text-slate-400 italic">
            Generador de Muestreo Aleatorio.
          </p>
        </div>
      </footer>

      {/* Hidden container for PDF capture (fixed layout, high resolution, isolated from oklch stylesheets) */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', overflow: 'hidden', width: '1100px', height: '620px' }}>
        <div id="pdf-visualizer-capture" style={{ width: '1060px', height: '572px', backgroundColor: '#ffffff', padding: '6px', boxSizing: 'border-box' }}>
          <CoordinateVisualizer 
            results={results} 
            stripWidth={params.stripWidth} 
            startKm={params.startKm}
            startMetros={params.startMetros}
            longTramo={(params.endKm + params.endMetros / 1000 - (params.startKm + params.startMetros / 1000)) * 1000}
            isExporting={true}
            width={1000}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}
