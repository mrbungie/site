import { useMemo, useState } from 'react';
import { Activity, SlidersHorizontal, Sparkles, Target } from 'lucide-react';

const StepCard = ({ title, active, detail }: { title: string; active: boolean; detail: string }) => (
  <div className={`rounded-[1.8rem] border px-5 py-4 transition-colors ${active ? 'border-emerald-400 bg-emerald-500/10 text-white' : 'border-white/5 bg-slate-900 text-slate-300'}`}>
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nodo</p>
    <p className="mt-2 text-lg font-black">{title}</p>
    <p className="mt-2 text-xs leading-relaxed text-slate-400">{detail}</p>
  </div>
);

const DecisionTreeVisualizer = () => {
  const [income, setIncome] = useState(62);
  const [debt, setDebt] = useState(28);
  const [score, setScore] = useState(74);

  const analysis = useMemo(() => {
    const path: string[] = [];
    let decision: 'Aprobado' | 'Rechazado';
    let confidence: number;

    if (income > 55) {
      path.push('Ingreso > 55');
      if (debt < 35) {
        path.push('Deuda < 35');
        decision = 'Aprobado';
        confidence = 0.86;
      } else if (score > 72) {
        path.push('Score > 72');
        decision = 'Aprobado';
        confidence = 0.71;
      } else {
        path.push('Score ≤ 72');
        decision = 'Rechazado';
        confidence = 0.74;
      }
    } else {
      path.push('Ingreso ≤ 55');
      if (score > 82 && debt < 25) {
        path.push('Score alto y deuda baja');
        decision = 'Aprobado';
        confidence = 0.64;
      } else {
        path.push('Rama de riesgo');
        decision = 'Rechazado';
        confidence = 0.81;
      }
    }

    return { path, decision, confidence };
  }, [debt, income, score]);

  return (
    <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-950 shadow-[0_32px_64px_-12px_rgba(15,23,42,0.75)]">
      <div className="border-b border-white/5 bg-slate-900/60 px-8 py-6">
        <h3 className="flex items-center gap-2 text-xl font-black uppercase tracking-tight text-white"><Activity className="text-emerald-400" size={20} /> Laboratorio de Árboles</h3>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Ramas, umbrales y hojas</p>
      </div>

      <div className="grid gap-8 p-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6">
          <div className="mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500"><SlidersHorizontal size={14} /> Cliente</div>
          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-2"><div className="flex items-center justify-between text-xs font-bold text-slate-300"><span>Ingreso</span><span className="font-mono text-emerald-300">{income}</span></div><input type="range" min="20" max="100" step="1" value={income} onChange={(event) => setIncome(parseInt(event.target.value, 10))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-400" /></label>
            <label className="flex flex-col gap-2"><div className="flex items-center justify-between text-xs font-bold text-slate-300"><span>Deuda</span><span className="font-mono text-cyan-300">{debt}%</span></div><input type="range" min="5" max="80" step="1" value={debt} onChange={(event) => setDebt(parseInt(event.target.value, 10))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400" /></label>
            <label className="flex flex-col gap-2"><div className="flex items-center justify-between text-xs font-bold text-slate-300"><span>Score</span><span className="font-mono text-amber-300">{score}</span></div><input type="range" min="40" max="100" step="1" value={score} onChange={(event) => setScore(parseInt(event.target.value, 10))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-amber-400" /></label>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-3">
            <StepCard title="Raíz" active={true} detail="¿Ingreso > 55? Primer corte para separar perfiles de menor y mayor capacidad de pago." />
            <StepCard title="Nodo intermedio" active={analysis.path.length > 1} detail={analysis.path[0] === 'Ingreso > 55' ? 'Si el ingreso es alto, el árbol mira deuda o score.' : 'Si el ingreso es bajo, exige score alto y deuda baja.'} />
            <StepCard title="Hoja final" active={true} detail={`La ruta actual termina en ${analysis.decision.toLowerCase()} con confianza ${Math.round(analysis.confidence * 100)}%.`} />
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-gradient-to-br from-emerald-500 to-teal-500 p-6 text-slate-950 shadow-lg shadow-emerald-900/20">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-950/60"><Target size={14} /> Ruta activa</div>
            <p className="mt-4 text-3xl font-black">{analysis.decision}</p>
            <p className="mt-2 text-sm font-semibold text-slate-950/75">{analysis.path.join(' → ')}</p>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6 text-xs leading-relaxed text-slate-300">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500"><Sparkles size={14} /> Qué mirar</div>
            <ul className="flex list-disc flex-col gap-2 pl-4 marker:text-emerald-300">
              <li>Cada nodo aplica una regla simple del tipo “si-entonces”.</li>
              <li>Pequeños cambios cerca del umbral pueden mandar un caso a otra rama.</li>
              <li>El árbol es interpretable porque muestra exactamente por qué decidió.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionTreeVisualizer;
