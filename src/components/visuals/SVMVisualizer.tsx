import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCcw, SlidersHorizontal, Sparkles, Target } from 'lucide-react';
import { clamp, generateLinearSample, generateRadialSample } from './classificationUtils';

type Kernel = 'linear' | 'rbf';

const SVMVisualizer = () => {
  const [kernel, setKernel] = useState<Kernel>('linear');
  const [overlap, setOverlap] = useState(0.55);
  const [marginWidth, setMarginWidth] = useState(0.85);
  const [sampleVersion, setSampleVersion] = useState(0);

  const points = useMemo(
    () =>
      kernel === 'linear'
        ? generateLinearSample({ sampleSize: 46, version: sampleVersion, overlap })
        : generateRadialSample({ sampleSize: 46, version: sampleVersion, overlap }),
    [kernel, overlap, sampleVersion],
  );

  const decision = useMemo(() => {
    const marginBand = marginWidth * (kernel === 'linear' ? 11 : 5.5);

    const scoreFor = (x: number, y: number) => {
      if (kernel === 'linear') {
        return (x - 50) * 0.92 - (y - 50) * 0.78;
      }

      return Math.hypot(x - 50, y - 50) - 22;
    };

    const supportVectors = [...points]
      .map((point) => ({ ...point, score: Math.abs(scoreFor(point.x, point.y)) }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 8);

    const correct = points.filter((point) => {
      const predicted = scoreFor(point.x, point.y) >= 0 ? 1 : 0;
      return predicted === point.label;
    }).length;

    return {
      scoreFor,
      supportVectors,
      accuracy: correct / points.length,
      marginBand,
    };
  }, [kernel, marginWidth, points]);

  const lineY = (x: number, offset: number) => {
    const numerator = 0.92 * (x - 50) - offset;
    return clamp(50 + numerator / 0.78, 0, 100);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-950 shadow-[0_32px_64px_-12px_rgba(15,23,42,0.75)]">
      <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/60 px-8 py-6">
        <div className="flex flex-col">
          <h3 className="flex items-center gap-2 text-xl font-black uppercase tracking-tight text-white">
            <Activity className="text-violet-400" size={20} /> Laboratorio SVM
          </h3>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Margen máximo y vectores de soporte</p>
        </div>

        <button
          type="button"
          onClick={() => setSampleVersion((value) => value + 1)}
          className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-violet-300 transition-colors hover:bg-violet-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <RefreshCcw size={12} /> Regenerar muestra
        </button>
      </div>

      <div className="grid gap-8 p-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900 p-4 shadow-inner">
          <div className="absolute left-8 top-6 z-10 rounded-2xl border border-white/5 bg-slate-950/70 px-4 py-2 backdrop-blur-md">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">kernel</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{kernel === 'linear' ? 'Lineal' : 'RBF'}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">accuracy {(decision.accuracy * 100).toFixed(1)}%</span>
            </div>
          </div>

          <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Plano cartesiano con frontera SVM">
            {Array.from({ length: 11 }, (_, value) => value).map((value) => (
              <React.Fragment key={value}>
                <line x1={value * 10} y1="0" x2={value * 10} y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
                <line x1="0" y1={value * 10} x2="100" y2={value * 10} stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
              </React.Fragment>
            ))}

            {kernel === 'linear' ? (
              <>
                <line x1="0" y1={100 - lineY(0, 0)} x2="100" y2={100 - lineY(100, 0)} stroke="#c084fc" strokeWidth="1.15" />
                <line x1="0" y1={100 - lineY(0, decision.marginBand)} x2="100" y2={100 - lineY(100, decision.marginBand)} stroke="rgba(192,132,252,0.45)" strokeWidth="0.75" strokeDasharray="2.5 2" />
                <line x1="0" y1={100 - lineY(0, -decision.marginBand)} x2="100" y2={100 - lineY(100, -decision.marginBand)} stroke="rgba(192,132,252,0.45)" strokeWidth="0.75" strokeDasharray="2.5 2" />
              </>
            ) : (
              <>
                <circle cx="50" cy="50" r="22" fill="none" stroke="#c084fc" strokeWidth="1.15" />
                <circle cx="50" cy="50" r={22 + decision.marginBand} fill="none" stroke="rgba(192,132,252,0.4)" strokeWidth="0.75" strokeDasharray="2.5 2" />
                <circle cx="50" cy="50" r={Math.max(4, 22 - decision.marginBand)} fill="none" stroke="rgba(192,132,252,0.4)" strokeWidth="0.75" strokeDasharray="2.5 2" />
              </>
            )}

            {points.map((point) => {
              const isSupport = decision.supportVectors.some((vector) => vector.id === point.id);
              return (
                <motion.circle
                  key={`${kernel}-${sampleVersion}-${point.id}`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: point.id * 0.01 }}
                  cx={point.x}
                  cy={100 - point.y}
                  r={isSupport ? 2.1 : 1.45}
                  fill={point.label === 1 ? '#67e8f9' : '#fda4af'}
                  stroke={isSupport ? '#f8fafc' : 'transparent'}
                  strokeWidth="0.45"
                />
              );
            })}
          </svg>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6">
            <div className="mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <SlidersHorizontal size={14} /> Ajustes
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <button type="button" onClick={() => setKernel('linear')} className={`rounded-2xl px-4 py-3 ${kernel === 'linear' ? 'bg-violet-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Lineal</button>
              <button type="button" onClick={() => setKernel('rbf')} className={`rounded-2xl px-4 py-3 ${kernel === 'rbf' ? 'bg-violet-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>RBF</button>
            </div>

            <label className="mt-5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300"><span>Solapamiento</span><span className="font-mono text-violet-300">{overlap.toFixed(2)}</span></div>
              <input type="range" min="0.1" max="1.2" step="0.05" value={overlap} onChange={(event) => setOverlap(parseFloat(event.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-violet-400" />
            </label>

            <label className="mt-5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300"><span>Ancho del margen</span><span className="font-mono text-cyan-300">{marginWidth.toFixed(2)}</span></div>
              <input type="range" min="0.4" max="1.4" step="0.05" value={marginWidth} onChange={(event) => setMarginWidth(parseFloat(event.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400" />
            </label>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-gradient-to-br from-violet-500 to-fuchsia-500 p-6 text-slate-950 shadow-lg shadow-violet-900/20">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-950/60"><Target size={14} /> Idea central</div>
            <p className="mt-4 text-3xl font-black">Margen máximo</p>
            <p className="mt-2 text-sm font-semibold text-slate-950/75">SVM no busca solo separar clases: busca hacerlo dejando la franja de seguridad más amplia posible alrededor de la frontera.</p>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6 text-xs leading-relaxed text-slate-300">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500"><Sparkles size={14} /> Qué mirar</div>
            <ul className="flex list-disc flex-col gap-2 pl-4 marker:text-violet-300">
              <li>Los puntos con borde blanco son los más cercanos a la frontera: vectores de soporte.</li>
              <li>Con kernel RBF, la frontera deja de ser recta y puede envolver regiones.</li>
              <li>Más solapamiento hace más difícil sostener un margen limpio.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SVMVisualizer;
