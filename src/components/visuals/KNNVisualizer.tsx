import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCcw, SlidersHorizontal, Sparkles, Target } from 'lucide-react';
import { distance, generateLinearSample } from './classificationUtils';

const KNNVisualizer = () => {
  const [sampleVersion, setSampleVersion] = useState(0);
  const [k, setK] = useState(5);
  const [queryX, setQueryX] = useState(56);
  const [queryY, setQueryY] = useState(46);

  const points = useMemo(() => generateLinearSample({ sampleSize: 42, version: sampleVersion, overlap: 0.8 }), [sampleVersion]);

  const neighborhood = useMemo(() => {
    const query = { x: queryX, y: queryY };
    const ranked = points
      .map((point) => ({ ...point, distance: distance(point, query) }))
      .sort((a, b) => a.distance - b.distance);
    const nearest = ranked.slice(0, k);
    const positives = nearest.filter((point) => point.label === 1).length;

    return {
      nearest,
      positives,
      negatives: nearest.length - positives,
      decision: positives >= nearest.length / 2 ? 1 : 0,
      radius: nearest[nearest.length - 1]?.distance ?? 0,
    };
  }, [k, points, queryX, queryY]);

  return (
    <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-950 shadow-[0_32px_64px_-12px_rgba(15,23,42,0.75)]">
      <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/60 px-8 py-6">
        <div className="flex flex-col">
          <h3 className="flex items-center gap-2 text-xl font-black uppercase tracking-tight text-white"><Activity className="text-sky-400" size={20} /> Laboratorio k-NN</h3>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Mayoría local entre vecinos</p>
        </div>
        <button type="button" onClick={() => setSampleVersion((value) => value + 1)} className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-sky-300 transition-colors hover:bg-sky-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"><RefreshCcw size={12} /> Regenerar muestra</button>
      </div>

      <div className="grid gap-8 p-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900 p-4 shadow-inner">
          <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Puntos clasificados por k vecinos cercanos">
            {Array.from({ length: 11 }, (_, value) => value).map((value) => (
              <React.Fragment key={value}>
                <line x1={value * 10} y1="0" x2={value * 10} y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
                <line x1="0" y1={value * 10} x2="100" y2={value * 10} stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
              </React.Fragment>
            ))}

            <circle cx={queryX} cy={100 - queryY} r={neighborhood.radius} fill="rgba(56,189,248,0.06)" stroke="rgba(56,189,248,0.35)" strokeWidth="0.5" strokeDasharray="2 2" />

            {points.map((point) => {
              const isNeighbor = neighborhood.nearest.some((neighbor) => neighbor.id === point.id);
              return (
                <motion.circle
                  key={`${sampleVersion}-${point.id}`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.18, delay: point.id * 0.008 }}
                  cx={point.x}
                  cy={100 - point.y}
                  r={isNeighbor ? 2 : 1.35}
                  fill={point.label === 1 ? '#67e8f9' : '#fda4af'}
                  stroke={isNeighbor ? '#f8fafc' : 'transparent'}
                  strokeWidth="0.4"
                />
              );
            })}

            <circle cx={queryX} cy={100 - queryY} r="1.8" fill={neighborhood.decision === 1 ? '#0f172a' : '#ffffff'} stroke={neighborhood.decision === 1 ? '#67e8f9' : '#fda4af'} strokeWidth="0.8" />
          </svg>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6">
            <div className="mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500"><SlidersHorizontal size={14} /> Ajustes</div>
            <label className="flex flex-col gap-2"><div className="flex items-center justify-between text-xs font-bold text-slate-300"><span>k vecinos</span><span className="font-mono text-sky-300">{k}</span></div><input type="range" min="1" max="11" step="2" value={k} onChange={(event) => setK(parseInt(event.target.value, 10))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-sky-400" /></label>
            <label className="mt-5 flex flex-col gap-2"><div className="flex items-center justify-between text-xs font-bold text-slate-300"><span>Consulta X</span><span className="font-mono text-cyan-300">{queryX.toFixed(0)}</span></div><input type="range" min="10" max="90" step="1" value={queryX} onChange={(event) => setQueryX(parseFloat(event.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400" /></label>
            <label className="mt-5 flex flex-col gap-2"><div className="flex items-center justify-between text-xs font-bold text-slate-300"><span>Consulta Y</span><span className="font-mono text-rose-300">{queryY.toFixed(0)}</span></div><input type="range" min="10" max="90" step="1" value={queryY} onChange={(event) => setQueryY(parseFloat(event.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-rose-400" /></label>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-gradient-to-br from-sky-500 to-cyan-500 p-6 text-slate-950 shadow-lg shadow-sky-900/20">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-950/60"><Target size={14} /> Predicción local</div>
            <p className="mt-4 text-3xl font-black">{neighborhood.decision === 1 ? 'Clase positiva' : 'Clase negativa'}</p>
            <p className="mt-2 text-sm font-semibold text-slate-950/75">{neighborhood.positives} de {neighborhood.nearest.length} vecinos cercanos apoyan esta clase.</p>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6 text-xs leading-relaxed text-slate-300">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500"><Sparkles size={14} /> Qué mirar</div>
            <ul className="flex list-disc flex-col gap-2 pl-4 marker:text-sky-300">
              <li>k pequeño hace el modelo más sensible al ruido.</li>
              <li>k grande suaviza la decisión pero puede borrar patrones locales.</li>
              <li>Los vecinos resaltados son la única evidencia usada para clasificar.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KNNVisualizer;
