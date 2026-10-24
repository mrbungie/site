import { useMemo, useRef, useState } from 'react';
import { linearSample, ringSample, type Label, type Point2D } from './shared/datasets';
import { fmt } from './shared/math';
import {
  Button, Callout, Legend, Mark, Notes, Panel, Plot, PlotSvg, QueryHandle, Segmented, Slider, Stat, StatGrid, VizBody, VizFrame, flipY, vizStyles as v,
} from './shared/ui';

type Dataset = 'linear' | 'ring';
const GRID = 24;

/** Indices of the k nearest training points (ties broken by id so results are deterministic). */
const nearest = (points: Point2D[], x: number, y: number, k: number) =>
  points
    .map((p) => ({ p, d: Math.hypot(p.x - x, p.y - y) }))
    .sort((a, b) => a.d - b.d || a.p.id - b.p.id)
    .slice(0, k);

const vote = (neighbors: { p: Point2D }[]): { label: Label; positives: number } => {
  const positives = neighbors.reduce((s, { p }) => s + p.label, 0);
  // k is odd, so a strict majority always exists.
  return { label: positives * 2 > neighbors.length ? 1 : 0, positives };
};

const KNNVisualizer = () => {
  const [dataset, setDataset] = useState<Dataset>('ring');
  const [version, setVersion] = useState(0);
  const [k, setK] = useState(5);
  const [query, setQuery] = useState({ x: 56, y: 46 });
  const [showRegions, setShowRegions] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  const points = useMemo(
    () => (dataset === 'linear' ? linearSample(60, version, 0.8) : ringSample(60, version, 0.8)),
    [dataset, version],
  );

  const result = useMemo(() => {
    const neighbors = nearest(points, query.x, query.y, k);
    return { neighbors, ...vote(neighbors), radius: neighbors.at(-1)?.d ?? 0, ids: new Set(neighbors.map(({ p }) => p.id)) };
  }, [k, points, query]);

  const regions = useMemo(() => {
    if (!showRegions) return [];
    const cell = 100 / GRID;
    return Array.from({ length: GRID * GRID }, (_, i) => {
      const x = (i % GRID) * cell + cell / 2;
      const y = Math.floor(i / GRID) * cell + cell / 2;
      return { x: x - cell / 2, y: y - cell / 2, label: vote(nearest(points, x, y, k)).label, cell };
    });
  }, [k, points, showRegions]);

  const decisionText = result.label === 1 ? 'Clase 1 (círculos)' : 'Clase 0 (cuadrados)';

  return (
    <VizFrame
      title="Laboratorio k-NN"
      subtitle="Mayoría local entre vecinos"
      actions={<Button onClick={() => setVersion((n) => n + 1)}>Nueva muestra</Button>}
    >
      <VizBody
        plot={
          <Plot caption={<><span>Arrastra el punto de consulta o usa las flechas</span><span>radio = {fmt(result.radius, 1)}</span></>}>
            <PlotSvg
              svgRef={svgRef}
              label={`Clasificación k-NN con k igual a ${k}. Predicción: ${decisionText}`}
            >
              {regions.map((r) => (
                <rect key={`${r.x}-${r.y}`} className={r.label === 1 ? v.regionPos : v.regionNeg} x={r.x} y={flipY(r.y + r.cell)} width={r.cell + 0.05} height={r.cell + 0.05} />
              ))}
              <circle cx={query.x} cy={flipY(query.y)} r={result.radius} className={v.regionPos} style={{ opacity: 0.06 }} />
              <circle cx={query.x} cy={flipY(query.y)} r={result.radius} className={v.lineDashed} />
              {result.neighbors.map(({ p }) => (
                <line key={`l${p.id}`} className={v.gridLine} style={{ strokeWidth: 1 }} x1={query.x} y1={flipY(query.y)} x2={p.x} y2={flipY(p.y)} />
              ))}
              {points.map((p) => (
                <Mark key={`${dataset}-${version}-${p.id}`} x={p.x} y={p.y} label={p.label} ring={result.ids.has(p.id)} delay={p.id * 0.006} />
              ))}
              <QueryHandle x={query.x} y={query.y} svgRef={svgRef} label="Punto de consulta" onMove={(x, y) => setQuery({ x, y })} />
            </PlotSvg>
          </Plot>
        }
        side={
          <>
            <Panel title="Ajustes">
              <Segmented<Dataset>
                label="Conjunto de datos"
                value={dataset}
                onChange={setDataset}
                options={[{ value: 'ring', label: 'Anillo' }, { value: 'linear', label: 'Lineal' }]}
              />
              <Slider label="k vecinos" value={k} min={1} max={21} step={2} onChange={setK} tone="pos" hint="Siempre impar para evitar empates." />
              <Slider label="Consulta X" value={query.x} min={2} max={98} step={1} onChange={(x) => setQuery((q) => ({ ...q, x }))} format={(x) => fmt(x, 0)} tone="c3" />
              <Slider label="Consulta Y" value={query.y} min={2} max={98} step={1} onChange={(y) => setQuery((q) => ({ ...q, y }))} format={(y) => fmt(y, 0)} tone="c4" />
              <Button pressed={showRegions} onClick={() => setShowRegions((s) => !s)}>Regiones de decisión</Button>
            </Panel>
            <Callout eyebrow="Predicción local" title={decisionText} tone={result.label === 1 ? 'pos' : 'neg'}>
              {result.label === 1 ? result.positives : result.neighbors.length - result.positives} de {result.neighbors.length} vecinos votan por esta clase.
            </Callout>
            <StatGrid>
              <Stat label="Votos clase 1" value={result.positives} tone="pos" />
              <Stat label="Votos clase 0" value={result.neighbors.length - result.positives} tone="neg" />
            </StatGrid>
            <Legend items={[{ kind: 'pos', label: 'Clase 1' }, { kind: 'neg', label: 'Clase 0' }, { kind: 'ring', label: 'Vecino usado' }]} />
            <Notes items={[
              'k = 1 memoriza el ruido: la frontera es muy irregular.',
              'k grande suaviza, pero en el anillo termina borrando el patrón.',
              'Solo los vecinos con anillo influyen en la predicción.',
            ]} />
          </>
        }
      />
    </VizFrame>
  );
};

export default KNNVisualizer;
