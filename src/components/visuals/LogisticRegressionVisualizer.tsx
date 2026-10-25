import { useEffect, useMemo, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './shared/hooks';
import { clamp, createRng, fmt, pct, sigmoid } from './shared/math';
import { common, type Lang } from './shared/i18n';
import { Button, Callout, Legend, Notes, Panel, Plot, PlotSvg, Slider, Stat, StatGrid, VizBody, VizFrame, flipY } from './shared/ui';
import styles from './LogisticRegressionVisualizer.module.css';

interface Obs {
  id: number;
  x: number;
  y: 0 | 1;
}
interface Params {
  b0: number;
  b1: number;
}

const X_MIN = -6;
const X_MAX = 6;
const B1_RANGE = 4;
const B0_RANGE = 5;
const TRUE_PARAMS: Params = { b0: -0.4, b1: 1.2 };
const toPlotX = (x: number) => ((x - X_MIN) / (X_MAX - X_MIN)) * 100;

/** Mean negative log-likelihood (cross-entropy) computed with log1p-stable terms. */
const logLoss = (data: Obs[], { b0, b1 }: Params) =>
  data.reduce((sum, o) => {
    const z = b0 + b1 * o.x;
    // −[y·log σ(z) + (1−y)·log(1−σ(z))] = softplus(z) − y·z
    return sum + (Math.max(z, 0) + Math.log1p(Math.exp(-Math.abs(z))) - o.y * z);
  }, 0) / data.length;

/** ∇ of mean cross-entropy:  ∂/∂β₀ = mean(p − y),  ∂/∂β₁ = mean((p − y)·x). */
const gradient = (data: Obs[], { b0, b1 }: Params): Params => {
  let g0 = 0;
  let g1 = 0;
  for (const o of data) {
    const r = sigmoid(b0 + b1 * o.x) - o.y;
    g0 += r;
    g1 += r * o.x;
  }
  return { b0: g0 / data.length, b1: g1 / data.length };
};

/** Newton–Raphson (IRLS) with a tiny ridge so perfectly separable samples stay finite. */
const fitNewton = (data: Obs[]): Params => {
  let b0 = 0;
  let b1 = 0;
  const ridge = 1e-3;
  for (let i = 0; i < 40; i += 1) {
    let g0 = ridge * b0;
    let g1 = ridge * b1;
    let h00 = ridge;
    let h01 = 0;
    let h11 = ridge;
    for (const o of data) {
      const p = sigmoid(b0 + b1 * o.x);
      const w = p * (1 - p);
      g0 += (p - o.y) / data.length;
      g1 += ((p - o.y) * o.x) / data.length;
      h00 += w / data.length;
      h01 += (w * o.x) / data.length;
      h11 += (w * o.x * o.x) / data.length;
    }
    const det = h00 * h11 - h01 * h01;
    if (Math.abs(det) < 1e-12) break;
    const d0 = (h11 * g0 - h01 * g1) / det;
    const d1 = (-h01 * g0 + h00 * g1) / det;
    b0 -= d0;
    b1 -= d1;
    if (Math.abs(d0) + Math.abs(d1) < 1e-9) break;
  }
  return { b0: clamp(b0, -B0_RANGE, B0_RANGE), b1: clamp(b1, -B1_RANGE, B1_RANGE) };
};

const T = {
  es: {
    title: 'Laboratorio de regresión logística',
    subtitle: 'Sigmoide, verosimilitud y umbral',
    xCaption: 'x (característica)',
    yCaption: 'y = 0 abajo · y = 1 arriba',
    plotLabel: (n: number, loss: string) => `Curva logística con ${n} observaciones. Pérdida ${loss}`,
    params: 'Parámetros',
    slope: 'Pendiente β₁',
    intercept: 'Intercepto β₀',
    threshold: 'Umbral de decisión',
    thresholdHint: 'Cambia las decisiones, no las probabilidades.',
    sampleSize: 'Tamaño de muestra',
    stop: 'Detener descenso',
    descent: 'Descenso de gradiente',
    newton: 'Ir al óptimo (Newton)',
    likelihood: 'Verosimilitud',
    loss: (l: string) => `Pérdida ${l}`,
    minLoss: (m: string, g: string) => `Mínimo alcanzable: ${m}. |∇| = ${g}`,
    boundary: (x: string) => ` · frontera en x* = ${x}`,
    confusion: 'Matriz de confusión',
    pred1: 'pred. 1',
    pred0: 'pred. 0',
    real1: 'real 1',
    real0: 'real 0',
    tp: 'VP', fn: 'FN', fp: 'FP', tn: 'VN',
    correct: 'Bien clasificado',
    error: 'Error',
    thresholdLegend: 'Umbral',
    notes: [
      'Los datos vienen de un modelo fijo; tú buscas los β que mejor lo recuperan.',
      'El gradiente es cero en el óptimo: ahí la pérdida deja de bajar.',
      'Subir el umbral sacrifica recall para ganar precision.',
    ],
  },
  en: {
    title: 'Logistic regression lab',
    subtitle: 'Sigmoid, likelihood and threshold',
    xCaption: 'x (feature)',
    yCaption: 'y = 0 bottom · y = 1 top',
    plotLabel: (n: number, loss: string) => `Logistic curve with ${n} observations. Loss ${loss}`,
    params: 'Parameters',
    slope: 'Slope β₁',
    intercept: 'Intercept β₀',
    threshold: 'Decision threshold',
    thresholdHint: 'It changes the decisions, not the probabilities.',
    sampleSize: 'Sample size',
    stop: 'Stop descent',
    descent: 'Gradient descent',
    newton: 'Jump to the optimum (Newton)',
    likelihood: 'Likelihood',
    loss: (l: string) => `Loss ${l}`,
    minLoss: (m: string, g: string) => `Attainable minimum: ${m}. |∇| = ${g}`,
    boundary: (x: string) => ` · boundary at x* = ${x}`,
    confusion: 'Confusion matrix',
    pred1: 'pred. 1',
    pred0: 'pred. 0',
    real1: 'actual 1',
    real0: 'actual 0',
    tp: 'TP', fn: 'FN', fp: 'FP', tn: 'TN',
    correct: 'Correctly classified',
    error: 'Error',
    thresholdLegend: 'Threshold',
    notes: [
      'The data come from a fixed model; you look for the β that best recover it.',
      'The gradient is zero at the optimum: that is where the loss stops decreasing.',
      'Raising the threshold sacrifices recall to gain precision.',
    ],
  },
} as const;

const LogisticRegressionVisualizer = ({ lang = 'es' }: { lang?: Lang }) => {
  const t = T[lang];
  const c = common[lang];
  const [params, setParams] = useState<Params>({ b0: 0, b1: 0.4 });
  const [threshold, setThreshold] = useState(0.5);
  const [n, setN] = useState(48);
  const [version, setVersion] = useState(0);
  const [descending, setDescending] = useState(false);
  const reduced = usePrefersReducedMotion();
  const paramsRef = useRef(params);
  paramsRef.current = params;

  // The sample is generated once from a fixed "true" model, independent of the sliders you are tuning.
  const data = useMemo<Obs[]>(() => {
    const random = createRng(version + 11);
    return Array.from({ length: n }, (_, id) => {
      const x = clamp(X_MIN + 0.4 + ((X_MAX - X_MIN - 0.8) * id) / Math.max(1, n - 1) + (random() - 0.5) * 0.5, X_MIN, X_MAX);
      return { id, x, y: random() < sigmoid(TRUE_PARAMS.b0 + TRUE_PARAMS.b1 * x) ? 1 : 0 };
    });
  }, [n, version]);

  const mle = useMemo(() => fitNewton(data), [data]);

  useEffect(() => {
    if (!descending) return;
    if (reduced) {
      setParams(mle);
      setDescending(false);
      return;
    }
    let frame = 0;
    let steps = 0;
    const tick = () => {
      let { b0, b1 } = paramsRef.current;
      for (let i = 0; i < 4; i += 1) {
        const g = gradient(data, { b0, b1 });
        b0 = clamp(b0 - 0.4 * g.b0, -B0_RANGE, B0_RANGE);
        b1 = clamp(b1 - 0.4 * g.b1, -B1_RANGE, B1_RANGE);
        steps += 1;
      }
      const g = gradient(data, { b0, b1 });
      paramsRef.current = { b0, b1 };
      setParams({ b0, b1 });
      if (Math.hypot(g.b0, g.b1) < 2e-3 || steps > 2400) setDescending(false);
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [data, descending, mle, reduced]);

  const metrics = useMemo(() => {
    let tp = 0, tn = 0, fp = 0, fn = 0;
    for (const o of data) {
      const predicted = sigmoid(params.b0 + params.b1 * o.x) >= threshold ? 1 : 0;
      if (predicted && o.y) tp += 1;
      else if (!predicted && !o.y) tn += 1;
      else if (predicted) fp += 1;
      else fn += 1;
    }
    const total = data.length;
    return {
      tp, tn, fp, fn,
      accuracy: (tp + tn) / total,
      precision: tp + fp ? tp / (tp + fp) : null,
      recall: tp + fn ? tp / (tp + fn) : null,
      loss: logLoss(data, params),
      grad: gradient(data, params),
    };
  }, [data, params, threshold]);

  const boundary = Math.abs(params.b1) > 1e-4 ? (Math.log(threshold / (1 - threshold)) - params.b0) / params.b1 : null;
  const curve = useMemo(
    () =>
      Array.from({ length: 121 }, (_, i) => {
        const x = X_MIN + ((X_MAX - X_MIN) * i) / 120;
        return `${i ? 'L' : 'M'}${toPlotX(x).toFixed(2)} ${flipY(sigmoid(params.b0 + params.b1 * x) * 100).toFixed(2)}`;
      }).join(''),
    [params],
  );
  const minLoss = useMemo(() => logLoss(data, mle), [data, mle]);
  const gradNorm = Math.hypot(metrics.grad.b0, metrics.grad.b1);
  const inRange = boundary !== null && boundary >= X_MIN && boundary <= X_MAX;

  return (
    <VizFrame
      title={t.title}
      subtitle={t.subtitle}
      actions={<Button onClick={() => setVersion((value) => value + 1)}>{c.newSample}</Button>}
    >
      <VizBody
        plot={
          <Plot
            wide
            overlay={<>p(y=1|x) = σ({fmt(params.b1, 2)}·x {params.b0 < 0 ? '−' : '+'} {fmt(Math.abs(params.b0), 2)})</>}
            caption={<><span>{t.xCaption}</span><span>{t.yCaption}</span></>}
          >
            <PlotSvg label={t.plotLabel(data.length, fmt(metrics.loss, 3))}>
              <line className={styles.threshold} x1={0} y1={flipY(threshold * 100)} x2={100} y2={flipY(threshold * 100)} />
              {inRange && <line className={styles.boundary} x1={toPlotX(boundary)} y1={0} x2={toPlotX(boundary)} y2={100} />}
              <path className={styles.curve} d={curve} />
              {data.map((o) => {
                const correct = (sigmoid(params.b0 + params.b1 * o.x) >= threshold ? 1 : 0) === o.y;
                const y = (o.y === 1 ? 96 : 4) + (o.y === 1 ? -1 : 1) * (o.id % 4) * 1.8;
                return <circle key={`${version}-${o.id}`} className={`${styles.dot} ${correct ? styles.ok : styles.bad}`} cx={toPlotX(o.x)} cy={flipY(y)} r={1.6} />;
              })}
            </PlotSvg>
          </Plot>
        }
        side={
          <>
            <Panel title={t.params}>
              <Slider label={t.slope} value={params.b1} min={-B1_RANGE} max={B1_RANGE} step={0.05} onChange={(b1) => setParams((p) => ({ ...p, b1 }))} format={(x) => fmt(x, 2)} tone="c4" />
              <Slider label={t.intercept} value={params.b0} min={-B0_RANGE} max={B0_RANGE} step={0.05} onChange={(b0) => setParams((p) => ({ ...p, b0 }))} format={(x) => fmt(x, 2)} tone="pos" />
              <Slider label={t.threshold} value={threshold} min={0.1} max={0.9} step={0.01} onChange={setThreshold} format={(x) => fmt(x, 2)} tone="c5" hint={t.thresholdHint} />
              <Slider label={t.sampleSize} value={n} min={20} max={120} step={2} onChange={setN} tone="c3" />
              <Button pressed={descending} onClick={() => setDescending((d) => !d)}>{descending ? t.stop : t.descent}</Button>
              <Button onClick={() => { setDescending(false); setParams(mle); }}>{t.newton}</Button>
            </Panel>
            <Callout eyebrow={t.likelihood} title={t.loss(fmt(metrics.loss, 3))} tone="c4">
              {t.minLoss(fmt(minLoss, 3), fmt(gradNorm, 3))}{boundary !== null ? t.boundary(fmt(boundary, 2)) : ''}.
            </Callout>
            <StatGrid>
              <Stat label="∂L/∂β₀" value={fmt(metrics.grad.b0, 3)} />
              <Stat label="∂L/∂β₁" value={fmt(metrics.grad.b1, 3)} />
              <Stat label="Accuracy" value={pct(metrics.accuracy)} tone="pos" />
              <Stat label="Precision" value={metrics.precision === null ? '—' : pct(metrics.precision)} tone="c3" />
              <Stat label="Recall" value={metrics.recall === null ? '—' : pct(metrics.recall)} tone="c5" />
            </StatGrid>
            <Panel title={t.confusion}>
              <div className={styles.confusion}>
                <span />
                <span>{t.pred1}</span>
                <span>{t.pred0}</span>
                <span>{t.real1}</span>
                <div className={`${styles.cell} ${styles.good}`}><small>{t.tp}</small>{metrics.tp}</div>
                <div className={`${styles.cell} ${styles.miss}`}><small>{t.fn}</small>{metrics.fn}</div>
                <span>{t.real0}</span>
                <div className={`${styles.cell} ${styles.miss}`}><small>{t.fp}</small>{metrics.fp}</div>
                <div className={`${styles.cell} ${styles.good}`}><small>{t.tn}</small>{metrics.tn}</div>
              </div>
            </Panel>
            <Legend items={[{ kind: 'pos', label: t.correct, tone: 'pos' }, { kind: 'neg', label: t.error }, { kind: 'dash', label: t.thresholdLegend, tone: 'c5' }]} lang={lang} />
            <Notes items={[...t.notes]} lang={lang} />
          </>
        }
      />
    </VizFrame>
  );
};

export default LogisticRegressionVisualizer;
