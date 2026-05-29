import { SamplingResult, SamplingParams } from './utils';

export function runSampling(
  params: SamplingParams,
  referenceTable: string[][]
): { results: SamplingResult[]; n: number } {
  const { startKm, startMetros, endKm, endMetros, numSamples, stripWidth } = params;
  
  const kmIni = startKm + startMetros / 1000;
  const kmFin = endKm + endMetros / 1000;
  const longTramo = (kmFin - kmIni) * 1000;

  // N between 1 and 28
  const N = Math.floor(Math.random() * 28) + 1;
  const colInicial = (N - 1) * 3;
  
  const results: SamplingResult[] = [];
  const columnasVisitadas: number[] = [colInicial];
  let col = colInicial;

  // Emulate Streamlit while loop
  while (results.length < numSamples) {
    for (let fila = 0; fila < referenceTable.length; fila++) {
      const row = referenceTable[fila];
      if (!row || row.length <= col) continue;

      const valorStr = row[col];
      if (!valorStr) continue;

      const valor = parseInt(valorStr);
      const valoresExistentes = results.map(r => parseInt(r.order));

      if (valor <= numSamples && !valoresExistentes.includes(valor)) {
        const a = parseFloat(row[col + 1]);
        const b = parseFloat(row[col + 2]);

        const d1 = Number((a * longTramo).toFixed(2));
        const d4 = Number((b * stripWidth).toFixed(2));
        const kmSelec = kmIni + d1 / 1000;
        const d4_p = Number((d4 - stripWidth / 2).toFixed(2));
        const lado = d4_p >= 0 ? "Izquierdo" : "Derecho";

        // Chainage formatting: 73 + 279.03
        const kmPart = Math.floor(kmSelec);
        const mPart = Number(((kmSelec - kmPart) * 1000).toFixed(2));
        const mPartStr = mPart.toFixed(2);
        const chainage = `${kmPart} + ${mPartStr}`;

        results.push({
          id: crypto.randomUUID(),
          order: valor.toString().padStart(2, '0'),
          a,
          b,
          longDist: d1,
          transDist: d4,
          chainage,
          axisDist: d4_p,
          side: lado as 'Izquierdo' | 'Derecho'
        });

        if (results.length === numSamples) break;
      }
    }

    if (results.length < numSamples) {
      col += 3;
      if (col >= referenceTable[0].length) col = 0;
      if (columnasVisitadas.includes(col)) break;
      columnasVisitadas.push(col);
    }
  }

  // Sort by order
  results.sort((a, b) => parseInt(a.order) - parseInt(b.order));

  return { results, n: N };
}
