import { useCallback, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { regressionExample } from './shared/datasets';
import { useSvgPoint } from './shared/hooks';
import type { Lang } from './shared/i18n';
import { clamp, clipLine, createRng, fmt, linearStats, sumSquaredResiduals } from './shared/math';
import {
  Button, Callout, Legend, Meter, Notes, Panel, Plot, PlotSvg, Segmented, Slider, Stat, StatGrid, VizBody, VizFrame, cx, flipY, vizStyles as v,
} from './shared/ui';
import styles from './RegressionVisualizer.module.css';

interface DataPoint {
  id: number;
  x: number;
  y: number;
}

type Mode = 'ols' | 'manual';
type Overlay = 'none' | 'residuals' | 'mean';

const MAX_POINTS = 40;
const initialPoints = (): DataPoint[] => regressionExample().map((p, id) => ({ id, ...p }));

const T = {
  es: {
    title: 'Laboratorio de regresión',
    subtitle: 'Mínimos cuadrados ordinarios',
    example: 'Ejemplo',
    clear: 'Limpiar',
    caption: 'Clic en el plano para añadir un punto; clic en un punto para quitarlo',
    needTwo: 'Añade al menos dos puntos con distinto x.',
    plotLabel: (n: number, text: string) => `Plano de regresión con ${n} puntos. ${text}`,
    pointLabel: (x: string, y: string) => `Punto en x ${x}, y ${y}. Enter o Suprimir para quitar.`,
    empty: 'Haz clic en el plano para dibujar datos',
    model: 'Modelo',
    mode: 'Modo',
    auto: 'Automático (OLS)',
    manual: 'Manual',
    slope: 'Pendiente β₁',
    intercept: 'Intercepto β₀',
    squares: 'Cuadrados',
    none: 'Ninguno',
    residuals: 'Residuos',
    vsMean: 'Vs. media',
    addRandom: 'Añadir punto aleatorio',
    goodness: 'Bondad de ajuste',
    excess: (d: string) => `Te sobran ${d} de SSE respecto al óptimo de mínimos cuadrados.`,
    minimizes: 'Esta recta minimiza la suma de residuos al cuadrado.',
    variance: 'Varianza',
    sseRel: 'SSE relativo a SST',
    minSse: 'SSE mínimo',
    olsLine: 'Recta OLS',
    yourLine: 'Tu recta',
    olsRef: 'OLS (referencia)',
    notes: [
      'R² = 1 − SSE/SST: cuánta varianza explica la recta frente a usar solo la media.',
      'Cada cuadrado tiene lado igual al residuo; su área es su aporte al SSE.',
      'En modo manual, intenta igualar el SSE mínimo moviendo ambos deslizadores.',
    ],
  },
  en: {
    title: 'Regression lab',
    subtitle: 'Ordinary least squares',
    example: 'Example',
    clear: 'Clear',
    caption: 'Click the plane to add a point; click a point to remove it',
    needTwo: 'Add at least two points with different x.',
    plotLabel: (n: number, text: string) => `Regression plane with ${n} points. ${text}`,
    pointLabel: (x: string, y: string) => `Point at x ${x}, y ${y}. Press Enter or Delete to remove.`,
    empty: 'Click the plane to draw data',
    model: 'Model',
    mode: 'Mode',
    auto: 'Automatic (OLS)',
    manual: 'Manual',
    slope: 'Slope β₁',
    intercept: 'Intercept β₀',
    squares: 'Squares',
    none: 'None',
    residuals: 'Residuals',
    vsMean: 'Vs. mean',
    addRandom: 'Add random point',
    goodness: 'Goodness of fit',
    excess: (d: string) => `You are ${d} above the least-squares optimum in SSE.`,
    minimizes: 'This line minimizes the sum of squared residuals.',
    variance: 'Variance',
    sseRel: 'SSE relative to SST',
    minSse: 'Minimum SSE',
    olsLine: 'OLS line',
    yourLine: 'Your line',
    olsRef: 'OLS (reference)',
    notes: [
      'R² = 1 − SSE/SST: how much variance the line explains compared with using only the mean.',
      'Each square has a side equal to the residual; its area is its contribution to the SSE.',
      'In manual mode, try to match the minimum SSE by moving both sliders.',
    ],
  },
} as const;

const RegressionVisualizer = ({ lang = 'es' }: { lang?: Lang }) => {
  const t = T[lang];
  const [points, setPoints] = useState<DataPoint[]>(initialPoints);
  const nextId = useRef(100);
  const svgRef = useRef<SVGSVGElement>(null);
  const toSvg = useSvgPoint(svgRef);
  const [mode, setMode] = useState<Mode>('ols');
  const [overlay, setOverlay] = useState<Overlay>('residuals');
  const [slope, setSlope] = useState(0.4);
  const [intercept, setIntercept] = useState(30);

  const fit = useMemo(() => linearStats(points), [points]);
  const line = mode === 'ols' ? { a: fit.intercept, b: fit.slope } : { a: intercept, b: slope };
  const sse = useMemo(() => sumSquaredResiduals(points, line.a, line.b), [line.a, line.b, points]);
  const sseMin = useMemo(() => sumSquaredResiduals(points, fit.intercept, fit.slope), [fit, points]);
  const sst = fit.ssTotal;
  const r2 = sst > 1e-9 ? 1 - sse / sst : null;
  const ready = points.length >= 2 && fit.hasSpread;
  const segment = clipLine(line.b, -1, line.a);

  const add = useCallback((x: number, y: number) => {
    setPoints((current) => (current.length >= MAX_POINTS ? current : [...current, { id: nextId.current++, x: clamp(x, 1, 99), y: clamp(y, 1, 99) }]));
  }, []);

  const onPlotClick = (event: PointerEvent<SVGRectElement>) => {
    const p = toSvg(event);
    if (p) add(p.x, 100 - p.y);
  };

  const remove = (id: number) => setPoints((current) => current.filter((p) => p.id !== id));
  const onPointKey = (event: KeyboardEvent, id: number) => {
    if (event.key === 'Delete' || event.key === 'Backspace' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      remove(id);
    }
  };

  const addRandom = () => {
    const rng = createRng(Math.floor(Math.random() * 1e6) + 1);
    add(5 + rng() * 90, 5 + rng() * 90);
  };

  const eq = `y = ${fmt(line.b, 2)}x ${line.a < 0 ? '−' : '+'} ${fmt(Math.abs(line.a), 1)}`;

  return (
    <VizFrame
      title={t.title}
      subtitle={t.subtitle}
      actions={
        <>
          <Button onClick={() => setPoints(initialPoints())}>{t.example}</Button>
          <Button onClick={() => setPoints([])}>{t.clear}</Button>
        </>
      }
    >
      <VizBody
        plot={
          <Plot
            overlay={<span className={styles.equation}>{eq}</span>}
            caption={<><span>{t.caption}</span><span>{points.length}/{MAX_POINTS}</span></>}
          >
            <PlotSvg svgRef={svgRef} label={t.plotLabel(points.length, ready ? eq : t.needTwo)}>
              <rect className={styles.hit} x={-4} y={-4} width={108} height={108} onPointerUp={onPlotClick} />
              {ready && overlay === 'mean' && <line className={styles.mean} x1={0} y1={flipY(fit.yMean)} x2={100} y2={flipY(fit.yMean)} />}
              {ready && points.map((p) => {
                const target = overlay === 'mean' ? fit.yMean : line.a + line.b * p.x;
                const side = Math.abs(p.y - target);
                return (
                  <g key={`r${p.id}`}>
                    {overlay !== 'none' && side > 0.1 && (
                      <rect className={overlay === 'mean' ? styles.squareMean : styles.squareOls} x={p.x} y={flipY(Math.max(p.y, target))} width={side} height={side} />
                    )}
                    {overlay !== 'mean' && <line className={styles.residual} x1={p.x} y1={flipY(p.y)} x2={p.x} y2={flipY(line.a + line.b * p.x)} />}
                  </g>
                );
              })}
              {ready && mode === 'manual' && (() => {
                const ghost = clipLine(fit.slope, -1, fit.intercept);
                return ghost && <line className={v.lineDashed} x1={ghost[0].x} y1={flipY(ghost[0].y)} x2={ghost[1].x} y2={flipY(ghost[1].y)} />;
              })()}
              {segment && ready && <line className={mode === 'ols' ? v.lineMain : v.lineAccent} x1={segment[0].x} y1={flipY(segment[0].y)} x2={segment[1].x} y2={flipY(segment[1].y)} />}
              {!ready && mode === 'manual' && segment && <line className={v.lineAccent} x1={segment[0].x} y1={flipY(segment[0].y)} x2={segment[1].x} y2={flipY(segment[1].y)} />}
              {points.map((p) => (
                <g
                  key={p.id}
                  className={styles.dataPoint}
                  tabIndex={0}
                  role="button"
                  aria-label={t.pointLabel(fmt(p.x, 0), fmt(p.y, 0))}
                  onPointerUp={(event) => { event.stopPropagation(); remove(p.id); }}
                  onKeyDown={(event) => onPointKey(event, p.id)}
                >
                  <circle className={styles.halo} cx={p.x} cy={flipY(p.y)} r={3.2} />
                  <circle cx={p.x} cy={flipY(p.y)} r={1.5} />
                </g>
              ))}
            </PlotSvg>
            {points.length === 0 && <div className={styles.empty}>{t.empty}</div>}
          </Plot>
        }
        side={
          <>
            <Panel title={t.model}>
              <Segmented<Mode> label={t.mode} value={mode} onChange={setMode} options={[{ value: 'ols', label: t.auto }, { value: 'manual', label: t.manual }]} />
              {mode === 'manual' && (
                <>
                  <Slider label={t.slope} value={slope} min={-2} max={2} step={0.01} onChange={setSlope} format={(x) => fmt(x, 2)} tone="neg" />
                  <Slider label={t.intercept} value={intercept} min={-50} max={150} step={0.5} onChange={setIntercept} format={(x) => fmt(x, 1)} tone="c5" />
                </>
              )}
              <Segmented<Overlay> label={t.squares} value={overlay} onChange={setOverlay} options={[{ value: 'none', label: t.none }, { value: 'residuals', label: t.residuals }, { value: 'mean', label: t.vsMean }]} />
              <Button onClick={addRandom} disabled={points.length >= MAX_POINTS}>{t.addRandom}</Button>
            </Panel>
            <Callout eyebrow={t.goodness} title={r2 === null ? 'R² = —' : `R² = ${fmt(r2, 3)}`} tone={r2 !== null && r2 >= 0.5 ? 'pos' : 'neg'}>
              {!ready
                ? t.needTwo
                : mode === 'manual' && sse > sseMin + 1e-6
                  ? t.excess(fmt(sse - sseMin, 0))
                  : t.minimizes}
            </Callout>
            <Panel title={t.variance}>
              <div className={styles.compare}>
                <div className={styles.compareRow}><span>SSE</span><Meter value={sst > 0 ? Math.min(1, sse / sst) : 0} tone="neg" label={t.sseRel} /><output>{fmt(sse, 0)}</output></div>
                <div className={styles.compareRow}><span>SST</span><Meter value={sst > 0 ? 1 : 0} tone="pos" label="SST" /><output>{fmt(sst, 0)}</output></div>
              </div>
              <StatGrid>
                <Stat label="β₁ (OLS)" value={fmt(fit.slope, 3)} />
                <Stat label="β₀ (OLS)" value={fmt(fit.intercept, 1)} />
                <Stat label={t.minSse} value={fmt(sseMin, 0)} tone="c3" />
              </StatGrid>
            </Panel>
            <Legend items={[{ kind: 'line', label: t.olsLine, tone: 'ink' }, { kind: 'line', label: t.yourLine, tone: 'c5' }, { kind: 'dash', label: t.olsRef }]} lang={lang} />
            <Notes items={[...t.notes]} lang={lang} />
          </>
        }
      />
    </VizFrame>
  );
};

export default RegressionVisualizer;
