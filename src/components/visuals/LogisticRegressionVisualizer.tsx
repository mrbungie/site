import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Binary, RefreshCcw, ShieldCheck, SlidersHorizontal, Target } from 'lucide-react';

interface SamplePoint {
  x: number;
  probability: number;
  observedLabel: 0 | 1;
  predictedLabel: 0 | 1;
  id: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const sigmoid = (value: number) => 1 / (1 + Math.exp(-value));

const createSeededRandom = (seed: number) => {
  let value = seed % 2147483647;

  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const LogisticRegressionVisualizer = () => {
  const [slope, setSlope] = useState(1.45);
  const [intercept, setIntercept] = useState(-0.35);
  const [threshold, setThreshold] = useState(0.5);
  const [sampleSize, setSampleSize] = useState(42);
  const [sampleVersion, setSampleVersion] = useState(0);

  const points = useMemo<SamplePoint[]>(() => {
    const random = createSeededRandom(sampleVersion + 11);

    return Array.from({ length: sampleSize }, (_, index) => {
      const x = -6 + (12 * index) / Math.max(1, sampleSize - 1);
      const jitter = (random() - 0.5) * 0.55;
      const effectiveX = clamp(x + jitter, -6, 6);
      const probability = sigmoid(intercept + slope * effectiveX);
      const observedLabel: 0 | 1 = random() < probability ? 1 : 0;
      const predictedLabel: 0 | 1 = probability >= threshold ? 1 : 0;

      return {
        x: effectiveX,
        probability,
        observedLabel,
        predictedLabel,
        id: index,
      };
    });
  }, [intercept, sampleSize, sampleVersion, slope, threshold]);

  const metrics = useMemo(() => {
    let truePositive = 0;
    let trueNegative = 0;
    let falsePositive = 0;
    let falseNegative = 0;
    let logLoss = 0;

    points.forEach((point) => {
      const probability = clamp(point.probability, 0.0001, 0.9999);
      logLoss += -(point.observedLabel * Math.log(probability) + (1 - point.observedLabel) * Math.log(1 - probability));

      if (point.observedLabel === 1 && point.predictedLabel === 1) truePositive += 1;
      if (point.observedLabel === 0 && point.predictedLabel === 0) trueNegative += 1;
      if (point.observedLabel === 0 && point.predictedLabel === 1) falsePositive += 1;
      if (point.observedLabel === 1 && point.predictedLabel === 0) falseNegative += 1;
    });

    const total = points.length || 1;
    const accuracy = (truePositive + trueNegative) / total;
    const precision = truePositive + falsePositive === 0 ? 0 : truePositive / (truePositive + falsePositive);
    const recall = truePositive + falseNegative === 0 ? 0 : truePositive / (truePositive + falseNegative);
    const averageProbability = points.reduce((sum, point) => sum + point.probability, 0) / total;

    return {
      truePositive,
      trueNegative,
      falsePositive,
      falseNegative,
      accuracy,
      precision,
      recall,
      logLoss: logLoss / total,
      averageProbability,
    };
  }, [points]);

  const decisionBoundary = useMemo(() => {
    if (Math.abs(slope) < 0.0001) return null;

    const odds = Math.log(threshold / (1 - threshold));
    return (odds - intercept) / slope;
  }, [intercept, slope, threshold]);

  const curvePath = useMemo(() => {
    const coordinates = Array.from({ length: 97 }, (_, index) => {
      const x = -6 + (12 * index) / 96;
      const probability = sigmoid(intercept + slope * x);
      const svgX = ((x + 6) / 12) * 100;
      const svgY = 90 - probability * 80;
      return `${index === 0 ? 'M' : 'L'} ${svgX.toFixed(2)} ${svgY.toFixed(2)}`;
    });

    return coordinates.join(' ');
  }, [intercept, slope]);

  const thresholdY = 90 - threshold * 80;
  const boundaryX = decisionBoundary === null ? null : clamp(((decisionBoundary + 6) / 12) * 100, 0, 100);

  return (
    <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-950 shadow-[0_32px_64px_-12px_rgba(15,23,42,0.75)]">
      <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/60 px-8 py-6">
        <div className="flex flex-col">
          <h3 className="flex items-center gap-2 text-xl font-extrabold uppercase tracking-tight text-white drop-shadow-sm">
            <Activity className="text-fuchsia-400" strokeWidth={3} size={20} />
            Laboratorio de Regresión Logística
          </h3>
          <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200/90 drop-shadow-sm">
            Clasificación binaria con sigmoide
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSampleVersion((value) => value + 1)}
          className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-300 transition-all hover:bg-fuchsia-500/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <RefreshCcw size={12} strokeWidth={3} /> Regenerar muestra
        </button>
      </div>

      <div className="grid gap-8 p-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900 p-4 shadow-inner">
          <div className="absolute left-8 top-6 z-10 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-2 backdrop-blur-md">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-300">modelo</p>
            <div className="mt-1 flex flex-col gap-1">
              <span className="text-xs font-mono font-bold text-white leading-none whitespace-nowrap">p(y=1|x) = σ({slope.toFixed(2)}x {intercept >= 0 ? '+' : '−'} {Math.abs(intercept).toFixed(2)})</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">umbral = {threshold.toFixed(2)}</span>
            </div>
          </div>

          <svg
            viewBox="0 0 100 100"
            className="h-full w-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Curva logística con observaciones binarias"
          >
            {Array.from({ length: 11 }, (_, value) => value).map((value) => (
              <React.Fragment key={value}>
                <line x1={value * 10} y1="10" x2={value * 10} y2="90" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
                <line x1="0" y1={10 + value * 8} x2="100" y2={10 + value * 8} stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
              </React.Fragment>
            ))}

            <line x1="0" y1={thresholdY} x2="100" y2={thresholdY} stroke="rgba(250,204,21,0.65)" strokeWidth="0.7" strokeDasharray="2.5 2" />

            {boundaryX !== null && (
              <line x1={boundaryX} y1="10" x2={boundaryX} y2="90" stroke="rgba(244,114,182,0.6)" strokeWidth="0.7" strokeDasharray="2.5 2" />
            )}

            <path d={curvePath} fill="none" stroke="#e879f9" strokeWidth="1.2" className="drop-shadow-[0_0_16px_rgba(232,121,249,0.45)]" />

            {points.map((point) => {
              const svgX = ((point.x + 6) / 12) * 100;
              const baseY = point.observedLabel === 1 ? 14 : 86;
              const jitter = ((point.id % 5) - 2) * 1.2;

              return (
                <motion.circle
                  key={`${sampleVersion}-${point.id}`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.18, delay: point.id * 0.008 }}
                  cx={svgX}
                  cy={baseY + jitter}
                  r="1.35"
                  fill={point.predictedLabel === point.observedLabel ? '#67e8f9' : '#fda4af'}
                  className="drop-shadow-[0_0_8px_rgba(103,232,249,0.45)]"
                />
              );
            })}
          </svg>

          <div className="pointer-events-none absolute bottom-6 left-8 right-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>x baja</span>
            <span>p(y=1 | x)</span>
            <span>x alta</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6">
            <div className="mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <SlidersHorizontal size={14} /> Ajustes de la simulación
            </div>

            <div className="flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wide text-slate-200">
                  <span>Pendiente β₁</span>
                  <span className="font-mono text-fuchsia-300">{slope.toFixed(2)}</span>
                </div>
                <input
                  aria-label="Pendiente del modelo"
                  type="range"
                  min="-3"
                  max="3"
                  step="0.05"
                  value={slope}
                  onChange={(event) => setSlope(parseFloat(event.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-fuchsia-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                />
              </label>

              <label className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wide text-slate-200">
                  <span>Intercepto β₀</span>
                  <span className="font-mono text-cyan-300">{intercept.toFixed(2)}</span>
                </div>
                <input
                  aria-label="Intercepto del modelo"
                  type="range"
                  min="-4"
                  max="4"
                  step="0.05"
                  value={intercept}
                  onChange={(event) => setIntercept(parseFloat(event.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                />
              </label>

              <label className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wide text-slate-200">
                  <span>Umbral de decisión</span>
                  <span className="font-mono text-amber-300">{threshold.toFixed(2)}</span>
                </div>
                <input
                  aria-label="Umbral de decisión"
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.01"
                  value={threshold}
                  onChange={(event) => setThreshold(parseFloat(event.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                />
              </label>

              <label className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wide text-slate-200">
                  <span>Tamaño de muestra</span>
                  <span className="font-mono text-emerald-300">{sampleSize}</span>
                </div>
                <input
                  aria-label="Tamaño de muestra"
                  type="range"
                  min="18"
                  max="80"
                  step="2"
                  value={sampleSize}
                  onChange={(event) => setSampleSize(parseInt(event.target.value, 10))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                />
              </label>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-500 p-6 text-slate-950 shadow-lg shadow-fuchsia-900/20">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-950/60">
              <Binary size={14} /> Lectura rápida
            </div>
            <p className="mt-4 text-3xl font-black">{boundaryX === null ? 'Sin frontera útil' : `x* ≈ ${decisionBoundary?.toFixed(2)}`}</p>
            <p className="mt-2 text-sm font-semibold text-slate-950/75">
              La frontera cambia cuando mueves el intercepto o el umbral. Si subes el umbral, la simulación exige más evidencia para predecir la clase positiva.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Accuracy', value: `${(metrics.accuracy * 100).toFixed(1)}%`, accent: 'text-fuchsia-300' },
              { label: 'Precision', value: `${(metrics.precision * 100).toFixed(1)}%`, accent: 'text-cyan-300' },
              { label: 'Recall', value: `${(metrics.recall * 100).toFixed(1)}%`, accent: 'text-emerald-300' },
              { label: 'Log Loss', value: metrics.logLoss.toFixed(3), accent: 'text-amber-300' },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.6rem] border border-white/5 bg-slate-900 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                <p className={`mt-2 text-2xl font-black ${item.accent}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6 text-xs leading-relaxed text-slate-300">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <ShieldCheck size={14} /> Matriz de confusión
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-emerald-500/10 px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">TP</p>
                <p className="mt-1 text-2xl font-black text-white">{metrics.truePositive}</p>
              </div>
              <div className="rounded-2xl bg-rose-500/10 px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-300">FP</p>
                <p className="mt-1 text-2xl font-black text-white">{metrics.falsePositive}</p>
              </div>
              <div className="rounded-2xl bg-rose-500/10 px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-300">FN</p>
                <p className="mt-1 text-2xl font-black text-white">{metrics.falseNegative}</p>
              </div>
              <div className="rounded-2xl bg-emerald-500/10 px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">TN</p>
                <p className="mt-1 text-2xl font-black text-white">{metrics.trueNegative}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Target size={12} /> Qué mirar
              </div>
              <ul className="flex list-disc flex-col gap-2 pl-4 marker:text-fuchsia-300">
                <li>La sigmoide convierte una combinación lineal en una probabilidad entre 0 y 1.</li>
                <li>El umbral no cambia las probabilidades; solo cambia la decisión final.</li>
                <li>Con más pendiente, la transición entre clases se vuelve más brusca.</li>
                <li>Cuando cambias β₀ o β₁, también cambia el proceso que genera la muestra observada.</li>
              </ul>
            </div>

            <p className="mt-4 text-[11px] text-slate-400">
              Probabilidad media positiva: <span className="font-bold text-fuchsia-300">{metrics.averageProbability.toFixed(3)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticRegressionVisualizer;
