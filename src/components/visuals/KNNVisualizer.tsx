import { useMemo, useRef, useState } from 'react';
import { linearSample, ringSample, type Label, type Point2D } from './shared/datasets';
import { common, type Lang } from './shared/i18n';
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

const T = {
  es: {
    class1Circles: 'Clase 1 (círculos)',
    class0Squares: 'Clase 0 (cuadrados)',
    title: 'Laboratorio k-NN',
    subtitle: 'Mayoría local entre vecinos',
    dragCaption: 'Arrastra el punto de consulta o usa las flechas',
    radius: 'radio',
    plotLabel: (k: number, decision: string) => `Clasificación k-NN con k igual a ${k}. Predicción: ${decision}`,
    queryLabel: 'Punto de consulta',
    dataset: 'Conjunto de datos',
    ring: 'Anillo',
    linear: 'Lineal',
    kLabel: 'k vecinos',
    kHint: 'Siempre impar para evitar empates.',
    queryX: 'Consulta X',
    queryY: 'Consulta Y',
    regions: 'Regiones de decisión',
    local: 'Predicción local',
    votesFor: (votes: number, total: number) => `${votes} de ${total} vecinos votan por esta clase.`,
    votes1: 'Votos clase 1',
    votes0: 'Votos clase 0',
    usedNeighbor: 'Vecino usado',
    notes: [
      'k = 1 memoriza el ruido: la frontera es muy irregular.',
      'k grande suaviza, pero en el anillo termina borrando el patrón.',
      'Solo los vecinos con anillo influyen en la predicción.',
    ],
  },
  en: {
    class1Circles: 'Class 1 (circles)',
    class0Squares: 'Class 0 (squares)',
    title: 'k-NN lab',
    subtitle: 'Local majority vote among neighbors',
    dragCaption: 'Drag the query point or use the arrow keys',
    radius: 'radius',
    plotLabel: (k: number, decision: string) => `k-NN classification with k equal to ${k}. Prediction: ${decision}`,
    queryLabel: 'Query point',
    dataset: 'Dataset',
    ring: 'Ring',
    linear: 'Linear',
    kLabel: 'k neighbors',
    kHint: 'Always odd to avoid ties.',
    queryX: 'Query X',
    queryY: 'Query Y',
    regions: 'Decision regions',
    local: 'Local prediction',
    votesFor: (votes: number, total: number) => `${votes} of ${total} neighbors vote for this class.`,
    votes1: 'Class 1 votes',
    votes0: 'Class 0 votes',
    usedNeighbor: 'Neighbor used',
    notes: [
      'k = 1 memorizes the noise: the boundary is very irregular.',
      'Large k smooths it out, but on the ring it ends up erasing the pattern.',
      'Only the ringed neighbors influence the prediction.',
    ],
  },
} as const;

const KNNVisualizer = ({ lang = 'es' }: { lang?: Lang }) => {
  const t = T[lang];
  const c = common[lang];
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

  const decisionText = result.label === 1 ? t.class1Circles : t.class0Squares;

  return (
    <VizFrame
      title={t.title}
      subtitle={t.subtitle}
      actions={<Button onClick={() => setVersion((n) => n + 1)}>{c.newSample}</Button>}
    >
      <VizBody
        plot={
          <Plot caption={<><span>{t.dragCaption}</span><span>{t.radius} = {fmt(result.radius, 1)}</span></>}>
            <PlotSvg
              svgRef={svgRef}
              label={t.plotLabel(k, decisionText)}
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
              <QueryHandle x={query.x} y={query.y} svgRef={svgRef} label={t.queryLabel} lang={lang} onMove={(x, y) => setQuery({ x, y })} />
            </PlotSvg>
          </Plot>
        }
        side={
          <>
            <Panel title={c.settings}>
              <Segmented<Dataset>
                label={t.dataset}
                value={dataset}
                onChange={setDataset}
                options={[{ value: 'ring', label: t.ring }, { value: 'linear', label: t.linear }]}
              />
              <Slider label={t.kLabel} value={k} min={1} max={21} step={2} onChange={setK} tone="pos" hint={t.kHint} />
              <Slider label={t.queryX} value={query.x} min={2} max={98} step={1} onChange={(x) => setQuery((q) => ({ ...q, x }))} format={(x) => fmt(x, 0)} tone="c3" />
              <Slider label={t.queryY} value={query.y} min={2} max={98} step={1} onChange={(y) => setQuery((q) => ({ ...q, y }))} format={(y) => fmt(y, 0)} tone="c4" />
              <Button pressed={showRegions} onClick={() => setShowRegions((s) => !s)}>{t.regions}</Button>
            </Panel>
            <Callout eyebrow={t.local} title={decisionText} tone={result.label === 1 ? 'pos' : 'neg'}>
              {t.votesFor(result.label === 1 ? result.positives : result.neighbors.length - result.positives, result.neighbors.length)}
            </Callout>
            <StatGrid>
              <Stat label={t.votes1} value={result.positives} tone="pos" />
              <Stat label={t.votes0} value={result.neighbors.length - result.positives} tone="neg" />
            </StatGrid>
            <Legend items={[{ kind: 'pos', label: c.class1 }, { kind: 'neg', label: c.class0 }, { kind: 'ring', label: t.usedNeighbor }]} lang={lang} />
            <Notes items={[...t.notes]} lang={lang} />
          </>
        }
      />
    </VizFrame>
  );
};

export default KNNVisualizer;
