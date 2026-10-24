import { useMemo, useState } from 'react';
import { linearSample, ringSample } from './shared/datasets';
import { clipLine, contourPath, fmt, pct } from './shared/math';
import { trainSvm, type KernelName } from './shared/svm';
import {
  Button, Callout, Legend, Mark, Notes, Panel, Plot, PlotSvg, Segmented, Slider, Stat, StatGrid, VizBody, VizFrame, flipY, vizStyles as v,
} from './shared/ui';

type Dataset = 'linear' | 'ring';
const SCALE = 25; // training happens on u = (x − 50) / 25 so kernels see O(1) distances
const GRID = 36;

const SVMVisualizer = () => {
  const [dataset, setDataset] = useState<Dataset>('linear');
  const [kernel, setKernel] = useState<KernelName>('linear');
  const [overlap, setOverlap] = useState(0.5);
  const [logC, setLogC] = useState(0);
  const [gamma, setGamma] = useState(1);
  const [version, setVersion] = useState(0);

  const C = 10 ** logC;
  const points = useMemo(() => (dataset === 'linear' ? linearSample(46, version, overlap) : ringSample(46, version, overlap)), [dataset, overlap, version]);

  const model = useMemo(() => {
    const inputs = points.map((p) => [(p.x - 50) / SCALE, (p.y - 50) / SCALE]);
    const targets = points.map((p) => (p.label === 1 ? 1 : -1)) as (1 | -1)[];
    const svm = trainSvm(inputs, targets, { C, kernel, gamma, seed: version + 3 });
    const correct = points.filter((p, i) => (svm.decision(inputs[i][0], inputs[i][1]) >= 0 ? 1 : -1) === targets[i]).length;
    return { svm, accuracy: correct / points.length, support: new Set(svm.supportIndices) };
  }, [C, gamma, kernel, points, version]);

  // Linear: f(x, y) = w·u + b = 0 is a line; margins are f = ±1. Mapped back to plot units.
  const lines = useMemo(() => {
    const w = model.svm.weights;
    if (!w) return null;
    const at = (level: number) => clipLine(w[0] / SCALE, w[1] / SCALE, model.svm.bias - 2 * (w[0] + w[1]) - level);
    return { boundary: at(0), plus: at(1), minus: at(-1), width: (2 * SCALE) / Math.hypot(w[0], w[1]) };
  }, [model]);

  // RBF: sample f on a grid, shade by sign, trace f = 0 and f = ±1 with marching squares.
  const field = useMemo(() => {
    if (kernel !== 'rbf') return null;
    const values = Array.from({ length: GRID }, (_, r) =>
      Array.from({ length: GRID }, (_, c) => model.svm.decision(((c / (GRID - 1)) * 100 - 50) / SCALE, ((r / (GRID - 1)) * 100 - 50) / SCALE)),
    );
    // Row index runs top→bottom in SVG space, so rows were sampled with y_data = 100·r/(GRID−1); flip when drawing.
    return { values, zero: contourPath(values, 0), plus: contourPath(values, 1), minus: contourPath(values, -1) };
  }, [kernel, model]);

  const cell = 100 / (GRID - 1);

  return (
    <VizFrame
      title="Laboratorio SVM"
      subtitle="Margen máximo y vectores de soporte (SMO)"
      actions={<Button onClick={() => setVersion((n) => n + 1)}>Nueva muestra</Button>}
    >
      <VizBody
        plot={
          <Plot
            overlay={<>accuracy {pct(model.accuracy)} · {model.svm.supportIndices.length} vectores de soporte</>}
            caption={<><span>Kernel {kernel === 'linear' ? 'lineal' : 'RBF'}</span><span>C = {fmt(C, 2)}{kernel === 'rbf' ? ` · γ = ${fmt(gamma, 2)}` : ''}</span></>}
          >
            <PlotSvg label={`Frontera SVM con kernel ${kernel}, exactitud ${pct(model.accuracy)}`}>
              {field && (
                <g>
                  {field.values.flatMap((row, r) =>
                    row.map((value, c) => (
                      <rect key={`${r}-${c}`} className={value >= 0 ? v.regionPos : v.regionNeg} x={c * cell - cell / 2} y={flipY(r * cell + cell / 2)} width={cell + 0.05} height={cell + 0.05} />
                    )),
                  )}
                  {/* contours were computed with row 0 at y = 0 (data space); mirror into SVG space */}
                  <g transform="translate(0 100) scale(1 -1)">
                    <path d={field.plus} className={v.lineDashed} />
                    <path d={field.minus} className={v.lineDashed} />
                    <path d={field.zero} className={v.lineMain} />
                  </g>
                </g>
              )}
              {lines && (
                <g>
                  {([lines.plus, lines.minus] as const).map((l, i) => l && <line key={i} className={v.lineDashed} x1={l[0].x} y1={flipY(l[0].y)} x2={l[1].x} y2={flipY(l[1].y)} />)}
                  {lines.boundary && <line className={v.lineMain} x1={lines.boundary[0].x} y1={flipY(lines.boundary[0].y)} x2={lines.boundary[1].x} y2={flipY(lines.boundary[1].y)} />}
                </g>
              )}
              {points.map((p, i) => (
                <Mark key={`${dataset}-${version}-${p.id}`} x={p.x} y={p.y} label={p.label} ring={model.support.has(i)} delay={p.id * 0.006} />
              ))}
            </PlotSvg>
          </Plot>
        }
        side={
          <>
            <Panel title="Ajustes">
              <Segmented<Dataset> label="Conjunto de datos" value={dataset} onChange={setDataset} options={[{ value: 'linear', label: 'Separable' }, { value: 'ring', label: 'Anillo' }]} />
              <Segmented<KernelName> label="Kernel" value={kernel} onChange={setKernel} options={[{ value: 'linear', label: 'Lineal' }, { value: 'rbf', label: 'RBF' }]} />
              <Slider label="Solapamiento (ruido)" value={overlap} min={0.1} max={1.2} step={0.05} onChange={setOverlap} format={(x) => fmt(x, 2)} tone="c5" />
              <Slider label="Penalización C" value={logC} min={-1.5} max={2} step={0.1} onChange={setLogC} format={() => fmt(C, 2)} tone="c4" hint="C pequeño = margen ancho y tolerante; C grande = menos errores permitidos." />
              {kernel === 'rbf' && <Slider label="Ancho γ" value={gamma} min={0.1} max={6} step={0.1} onChange={setGamma} format={(x) => fmt(x, 1)} tone="c3" hint="γ grande = frontera local y sinuosa." />}
            </Panel>
            <Callout eyebrow="Idea central" title="Margen máximo" tone="c4">
              {lines
                ? `Ancho del margen ≈ ${fmt(lines.width, 1)} unidades; solo los ${model.svm.supportIndices.length} vectores de soporte lo determinan.`
                : `Con RBF el margen vive en un espacio de características implícito; ${model.svm.supportIndices.length} vectores de soporte definen la frontera.`}
            </Callout>
            <StatGrid>
              <Stat label="Accuracy" value={pct(model.accuracy)} tone="pos" />
              <Stat label="Soporte" value={model.svm.supportIndices.length} tone="c4" />
            </StatGrid>
            <Legend items={[{ kind: 'pos', label: 'Clase 1' }, { kind: 'neg', label: 'Clase 0' }, { kind: 'ring', label: 'Vector de soporte' }, { kind: 'line', label: 'Frontera f = 0', tone: 'ink' }, { kind: 'dash', label: 'Margen f = ±1' }]} />
            <Notes items={[
              'Los vectores de soporte (αᵢ > 0) son los únicos puntos que mueven la frontera.',
              'En “Anillo”, el kernel lineal falla; RBF envuelve la región.',
              'Sube C o γ y la frontera se ajusta al ruido: sobreajuste.',
            ]} />
          </>
        }
      />
    </VizFrame>
  );
};

export default SVMVisualizer;
