import React, { useMemo, useState } from 'react';
import { Activity, SlidersHorizontal, Sparkles, Target } from 'lucide-react';

interface TreeVote {
  id: number;
  vote: 0 | 1;
  rule: string;
}

const RandomForestVisualizer = () => {
  const [income, setIncome] = useState(58);
  const [debt, setDebt] = useState(26);
  const [score, setScore] = useState(77);
  const [tenure, setTenure] = useState(4);

  const votes = useMemo<TreeVote[]>(() => {
    const trees = [
      { id: 1, vote: income > 52 && debt < 38 ? 1 : 0, rule: 'Ingreso alto + deuda controlada' },
      { id: 2, vote: score > 74 || tenure > 5 ? 1 : 0, rule: 'Buen score o antigüedad' },
      { id: 3, vote: income > 60 || (score > 80 && debt < 32) ? 1 : 0, rule: 'Ingreso muy alto o score fuerte' },
      { id: 4, vote: debt < 24 && tenure > 2 ? 1 : 0, rule: 'Deuda baja + cierta estabilidad' },
      { id: 5, vote: score > 70 && income > 48 && debt < 45 ? 1 : 0, rule: 'Perfil equilibrado' },
    ];

    return trees.map((tree) => ({ ...tree, vote: tree.vote as 0 | 1 }));
  }, [debt, income, score, tenure]);

  const summary = useMemo(() => {
    const positives = votes.filter((tree) => tree.vote === 1).length;
    return {
      positives,
      negatives: votes.length - positives,
      probability: positives / votes.length,
      decision: positives >= 3 ? 'Aprobado' : 'Rechazado',
    };
  }, [votes]);

  return (
    <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-950 shadow-[0_32px_64px_-12px_rgba(15,23,42,0.75)]">
      <div className="border-b border-white/5 bg-slate-900/60 px-8 py-6">
        <h3 className="flex items-center gap-2 text-xl font-black uppercase tracking-tight text-white"><Activity className="text-cyan-400" size={20} /> Laboratorio Random Forest</h3>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Votación de árboles débiles</p>
      </div>

      <div className="grid gap-8 p-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6">
          <div className="mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500"><SlidersHorizontal size={14} /> Caso evaluado</div>
          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-2"><div className="flex items-center justify-between text-xs font-bold text-slate-300"><span>Ingreso</span><span className="font-mono text-cyan-300">{income}</span></div><input type="range" min="20" max="100" step="1" value={income} onChange={(event) => setIncome(parseInt(event.target.value, 10))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400" /></label>
            <label className="flex flex-col gap-2"><div className="flex items-center justify-between text-xs font-bold text-slate-300"><span>Deuda</span><span className="font-mono text-rose-300">{debt}%</span></div><input type="range" min="5" max="80" step="1" value={debt} onChange={(event) => setDebt(parseInt(event.target.value, 10))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-rose-400" /></label>
            <label className="flex flex-col gap-2"><div className="flex items-center justify-between text-xs font-bold text-slate-300"><span>Score</span><span className="font-mono text-amber-300">{score}</span></div><input type="range" min="40" max="100" step="1" value={score} onChange={(event) => setScore(parseInt(event.target.value, 10))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-amber-400" /></label>
            <label className="flex flex-col gap-2"><div className="flex items-center justify-between text-xs font-bold text-slate-300"><span>Antigüedad</span><span className="font-mono text-emerald-300">{tenure} años</span></div><input type="range" min="0" max="10" step="1" value={tenure} onChange={(event) => setTenure(parseInt(event.target.value, 10))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-400" /></label>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {votes.map((tree) => (
              <div key={tree.id} className={`rounded-[1.8rem] border px-5 py-4 ${tree.vote === 1 ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-rose-500/30 bg-rose-500/10'}`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Árbol {tree.id}</p>
                <p className={`mt-2 text-2xl font-black ${tree.vote === 1 ? 'text-emerald-300' : 'text-rose-300'}`}>{tree.vote === 1 ? 'Sí' : 'No'}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">{tree.rule}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-gradient-to-br from-cyan-500 to-sky-500 p-6 text-slate-950 shadow-lg shadow-cyan-900/20">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-950/60"><Target size={14} /> Resultado agregado</div>
            <p className="mt-4 text-3xl font-black">{summary.decision}</p>
            <p className="mt-2 text-sm font-semibold text-slate-950/75">{summary.positives} votos positivos de {votes.length}. Probabilidad por voto: {(summary.probability * 100).toFixed(0)}%.</p>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6 text-xs leading-relaxed text-slate-300">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500"><Sparkles size={14} /> Qué mirar</div>
            <ul className="flex list-disc flex-col gap-2 pl-4 marker:text-cyan-300">
              <li>Cada árbol ve el problema con reglas algo distintas.</li>
              <li>La votación reduce la varianza respecto a un único árbol sensible.</li>
              <li>El bosque gana robustez aunque pierda interpretabilidad global.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomForestVisualizer;
