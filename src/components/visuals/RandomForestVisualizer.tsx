import { useMemo, useState } from 'react';
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
    <div className="rf-visualizer">
      <div className="rf-visualizer__header">
        <h3 className="rf-visualizer__title"><Activity className="rf-visualizer__title-icon" size={20} /> Laboratorio Random Forest</h3>
        <p className="rf-visualizer__subtitle">Votación de árboles del ensamble</p>
      </div>

      <div className="rf-visualizer__layout">
        <div className="rf-panel">
          <div className="rf-panel__header"><SlidersHorizontal size={14} className="rf-panel__header-icon" /> Caso evaluado</div>
          <div className="rf-controls">
            <label className="rf-control"><div className="rf-control__meta"><span>Ingreso</span><span className="rf-control__value--income">{income}</span></div><input type="range" min="20" max="100" step="1" value={income} onChange={(event) => setIncome(parseInt(event.target.value, 10))} className="rf-control__slider rf-control__slider--income" /></label>
            <label className="rf-control"><div className="rf-control__meta"><span>Deuda</span><span className="rf-control__value--debt">{debt}%</span></div><input type="range" min="5" max="80" step="1" value={debt} onChange={(event) => setDebt(parseInt(event.target.value, 10))} className="rf-control__slider rf-control__slider--debt" /></label>
            <label className="rf-control"><div className="rf-control__meta"><span>Score</span><span className="rf-control__value--score">{score}</span></div><input type="range" min="40" max="100" step="1" value={score} onChange={(event) => setScore(parseInt(event.target.value, 10))} className="rf-control__slider rf-control__slider--score" /></label>
            <label className="rf-control"><div className="rf-control__meta"><span>Antigüedad</span><span className="rf-control__value--tenure">{tenure} años</span></div><input type="range" min="0" max="10" step="1" value={tenure} onChange={(event) => setTenure(parseInt(event.target.value, 10))} className="rf-control__slider rf-control__slider--tenure" /></label>
          </div>
        </div>

        <div className="rf-results">
          <div className="rf-tree-grid">
            {votes.map((tree) => (
              <div key={tree.id} className={`rf-tree-card ${tree.vote === 1 ? 'rf-tree-card--positive' : 'rf-tree-card--negative'}`}>
                <p className="rf-tree-card__eyebrow">Árbol {tree.id}</p>
                <p className={`rf-tree-card__vote ${tree.vote === 1 ? 'rf-tree-card__vote--positive' : 'rf-tree-card__vote--negative'}`}>{tree.vote === 1 ? 'Sí' : 'No'}</p>
                <p className="rf-tree-card__rule">{tree.rule}</p>
              </div>
            ))}
          </div>

          <div className="rf-summary">
            <div className="rf-summary__eyebrow"><Target size={14} /> Resultado agregado</div>
            <p className="rf-summary__title">{summary.decision}</p>
            <p className="rf-summary__body">{summary.positives} votos positivos de {votes.length}. Probabilidad por voto: {(summary.probability * 100).toFixed(0)}%.</p>
            <div className="rf-summary__meter">
              <div className="rf-summary__meter-bar" style={{ width: `${summary.probability * 100}%` }} />
            </div>
          </div>

          <div className="rf-notes">
            <div className="rf-notes__eyebrow"><Sparkles size={14} className="rf-panel__header-icon" /> Qué mirar</div>
            <ul className="rf-notes__list">
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
