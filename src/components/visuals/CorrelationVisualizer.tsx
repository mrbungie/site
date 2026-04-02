import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCcw, SlidersHorizontal, Sparkles, TrendingUp } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  id: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const createSeededRandom = (seed: number) => {
  let value = seed % 2147483647;

  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const boxMuller = (random: () => number) => {
  let u = 0;
  let v = 0;

  while (u === 0) u = random();
  while (v === 0) v = random();

  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const CorrelationVisualizer = () => {
  const [targetCorrelation, setTargetCorrelation] = useState(0.7);
  const [sampleSize, setSampleSize] = useState(36);
  const [sampleVersion, setSampleVersion] = useState(0);

  const points = useMemo<Point[]>(() => {
    const spread = Math.sqrt(Math.max(0, 1 - targetCorrelation ** 2));
    const random = createSeededRandom(sampleVersion + 1);
    const raw = Array.from({ length: sampleSize }, (_, index) => {
      const x = boxMuller(random);
      const independentNoise = boxMuller(random);
      const y = targetCorrelation * x + spread * independentNoise;
      return { x, y, id: index };
    });

    const xValues = raw.map((point) => point.x);
    const yValues = raw.map((point) => point.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const xRange = maxX - minX || 1;
    const yRange = maxY - minY || 1;

    return raw.map((point) => ({
      x: 10 + ((point.x - minX) / xRange) * 80,
      y: 10 + ((point.y - minY) / yRange) * 80,
      id: point.id,
    }));
  }, [sampleSize, sampleVersion, targetCorrelation]);

  const stats = useMemo(() => {
    const xMean = points.reduce((sum, point) => sum + point.x, 0) / points.length;
    const yMean = points.reduce((sum, point) => sum + point.y, 0) / points.length;

    let numerator = 0;
    let xVariance = 0;
    let yVariance = 0;

    points.forEach((point) => {
      const dx = point.x - xMean;
      const dy = point.y - yMean;

      numerator += dx * dy;
      xVariance += dx ** 2;
      yVariance += dy ** 2;
    });

    const denominator = Math.sqrt(xVariance * yVariance);
    const correlation = denominator === 0 ? 0 : numerator / denominator;
    const slope = xVariance === 0 ? 0 : numerator / xVariance;
    const intercept = yMean - slope * xMean;

    return {
      correlation,
      slope,
      intercept,
      strength:
        Math.abs(correlation) > 0.8
          ? 'Muy fuerte'
          : Math.abs(correlation) > 0.55
            ? 'Moderada'
            : Math.abs(correlation) > 0.25
              ? 'Suave'
              : 'Casi nula',
    };
  }, [points]);

  const lineStartY = clamp(100 - (stats.intercept + stats.slope * 0), 0, 100);
  const lineEndY = clamp(100 - (stats.intercept + stats.slope * 100), 0, 100);

  return (
    <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-950 shadow-[0_32px_64px_-12px_rgba(15,23,42,0.75)]">
      <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/60 px-8 py-6">
        <div className="flex flex-col">
          <h3 className="flex items-center gap-2 text-xl font-black uppercase tracking-tight text-white">
            <Activity className="text-teal-400" size={20} />
            Laboratorio de Correlación
          </h3>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Pearson en tiempo real
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSampleVersion((value) => value + 1)}
          className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-teal-300 transition-colors hover:bg-teal-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <RefreshCcw size={12} /> Regenerar muestra
        </button>
      </div>

      <div className="grid gap-8 p-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900 p-4 shadow-inner">
          <div className="absolute left-8 top-6 z-10 rounded-2xl border border-white/5 bg-slate-950/70 px-4 py-2 backdrop-blur-md">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-300">r observado</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{stats.correlation.toFixed(3)}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{stats.strength}</span>
            </div>
          </div>

          <svg
            viewBox="0 0 100 100"
            className="h-full w-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Diagrama de dispersión con recta de tendencia"
          >
            {Array.from({ length: 11 }, (_, value) => value).map((value) => (
              <React.Fragment key={value}>
                <line x1={value * 10} y1="0" x2={value * 10} y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
                <line x1="0" y1={value * 10} x2="100" y2={value * 10} stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
              </React.Fragment>
            ))}

            <line
              x1="0"
              y1={lineStartY}
              x2="100"
              y2={lineEndY}
              stroke={stats.correlation >= 0 ? '#2dd4bf' : '#fb7185'}
              strokeWidth="1.1"
              strokeDasharray="2.5 1.5"
            />

            {points.map((point) => (
              <motion.circle
                key={`${sampleVersion}-${point.id}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: point.id * 0.01 }}
                cx={point.x}
                cy={100 - point.y}
                r="1.35"
                fill={stats.correlation >= 0 ? '#67e8f9' : '#fda4af'}
                className="drop-shadow-[0_0_8px_rgba(103,232,249,0.55)]"
              />
            ))}
          </svg>

          <div className="pointer-events-none absolute bottom-6 left-8 right-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>X normalizada</span>
            <span>Y normalizada</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6">
            <div className="mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <SlidersHorizontal size={14} /> Ajustes
            </div>

            <div className="flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Correlación objetivo</span>
                  <span className="font-mono text-teal-300">{targetCorrelation.toFixed(2)}</span>
                </div>
                <input
                  aria-label="Correlación objetivo"
                  type="range"
                  min="-0.95"
                  max="0.95"
                  step="0.05"
                  value={targetCorrelation}
                  onChange={(event) => setTargetCorrelation(parseFloat(event.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                />
              </label>

              <label className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Tamaño de muestra</span>
                  <span className="font-mono text-sky-300">{sampleSize}</span>
                </div>
                <input
                  aria-label="Tamaño de muestra"
                  type="range"
                  min="12"
                  max="80"
                  step="2"
                  value={sampleSize}
                  onChange={(event) => setSampleSize(parseInt(event.target.value, 10))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                />
              </label>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-gradient-to-br from-teal-500 to-cyan-500 p-6 text-slate-950 shadow-lg shadow-cyan-900/20">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-950/60">
              <TrendingUp size={14} /> Lectura rápida
            </div>
            <p className="mt-4 text-3xl font-black">{stats.correlation > 0 ? 'Positiva' : stats.correlation < 0 ? 'Negativa' : 'Neutra'}</p>
            <p className="mt-2 text-sm font-semibold text-slate-950/75">
              Cuando la nube se inclina hacia arriba, r crece. Cuando cae, r se vuelve negativa. Con muestras pequeñas, el valor observado oscila más.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6 text-xs leading-relaxed text-slate-300">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Sparkles size={14} /> Qué mirar
            </div>
            <ul className="flex list-disc flex-col gap-2 pl-4 marker:text-teal-300">
              <li>Acerca el deslizador a ±1 para ver una relación lineal casi perfecta.</li>
              <li>Baja el tamaño de muestra para notar el ruido muestral.</li>
              <li>La recta discontinua resume la tendencia lineal de la nube.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationVisualizer;
