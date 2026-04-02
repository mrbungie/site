import { useMemo, useState } from 'react';
import { Activity, Sparkles, Target } from 'lucide-react';

interface FeatureConfig {
  key: string;
  label: string;
  spam: number;
  ham: number;
}

const FEATURES: FeatureConfig[] = [
  { key: 'gratis', label: 'Contiene “gratis”', spam: 0.76, ham: 0.08 },
  { key: 'urgente', label: 'Tono urgente', spam: 0.69, ham: 0.19 },
  { key: 'enlace', label: 'Enlace acortado', spam: 0.61, ham: 0.11 },
  { key: 'conocido', label: 'Remitente conocido', spam: 0.18, ham: 0.82 },
];

const NaiveBayesVisualizer = () => {
  const [active, setActive] = useState<Record<string, boolean>>({
    gratis: true,
    urgente: true,
    enlace: true,
    conocido: false,
  });

  const posterior = useMemo(() => {
    const priorSpam = 0.42;
    const priorHam = 0.58;

    const spamScore = FEATURES.reduce((score, feature) => {
      const probability = active[feature.key] ? feature.spam : 1 - feature.spam;
      return score * probability;
    }, priorSpam);

    const hamScore = FEATURES.reduce((score, feature) => {
      const probability = active[feature.key] ? feature.ham : 1 - feature.ham;
      return score * probability;
    }, priorHam);

    const total = spamScore + hamScore;

    return {
      spam: spamScore / total,
      ham: hamScore / total,
      decision: spamScore > hamScore ? 'Spam' : 'Legítimo',
    };
  }, [active]);

  return (
    <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-950 shadow-[0_32px_64px_-12px_rgba(15,23,42,0.75)]">
      <div className="border-b border-white/5 bg-slate-900/60 px-8 py-6">
        <h3 className="flex items-center gap-2 text-xl font-black uppercase tracking-tight text-white"><Activity className="text-amber-400" size={20} /> Laboratorio Naive Bayes</h3>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Evidencia probabilística en texto</p>
      </div>

      <div className="grid gap-8 p-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6">
          <div className="mb-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Evidencia observada</div>
          <div className="flex flex-col gap-3">
            {FEATURES.map((feature) => (
              <button
                key={feature.key}
                type="button"
                onClick={() => setActive((current) => ({ ...current, [feature.key]: !current[feature.key] }))}
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition-colors ${active[feature.key] ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-white/5 bg-slate-800 text-slate-300'}`}
              >
                {feature.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6">
            <div className="grid gap-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-300"><span>P(Spam | evidencia)</span><span className="font-mono text-amber-300">{posterior.spam.toFixed(3)}</span></div>
                <div className="h-3 rounded-full bg-slate-800"><div className="h-3 rounded-full bg-amber-400" style={{ width: `${posterior.spam * 100}%` }} /></div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-300"><span>P(Legítimo | evidencia)</span><span className="font-mono text-cyan-300">{posterior.ham.toFixed(3)}</span></div>
                <div className="h-3 rounded-full bg-slate-800"><div className="h-3 rounded-full bg-cyan-400" style={{ width: `${posterior.ham * 100}%` }} /></div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-slate-950 shadow-lg shadow-amber-900/20">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-950/60"><Target size={14} /> Decisión</div>
            <p className="mt-4 text-3xl font-black">{posterior.decision}</p>
            <p className="mt-2 text-sm font-semibold text-slate-950/75">Naive Bayes multiplica evidencia condicional clase por clase y luego normaliza para obtener probabilidades posteriores.</p>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-slate-900 p-6 text-xs leading-relaxed text-slate-300">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500"><Sparkles size={14} /> Qué mirar</div>
            <ul className="flex list-disc flex-col gap-2 pl-4 marker:text-amber-300">
              <li>La independencia condicional simplifica mucho el cálculo.</li>
              <li>Un remitente conocido empuja la decisión hacia “Legítimo”.</li>
              <li>Palabras como “gratis” y “urgente” elevan rápido la probabilidad de spam.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NaiveBayesVisualizer;
