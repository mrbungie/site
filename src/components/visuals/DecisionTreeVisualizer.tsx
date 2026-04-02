import { useMemo, useState } from 'react';
import { Activity, SlidersHorizontal, Sparkles, Target } from 'lucide-react';
import styles from './DecisionTreeVisualizer.module.css';

const StepCard = ({ title, active, detail }: { title: string; active: boolean; detail: string }) => (
  <div className={active ? styles.stepCardActive : styles.stepCardInactive}>
    <p className={styles.stepCardEyebrow}>Nodo</p>
    <p className={styles.stepCardTitle}>{title}</p>
    <p className={styles.stepCardDetail}>{detail}</p>
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}><Activity className={styles.titleIcon} size={20} /> Laboratorio de Árboles</h3>
        <p className={styles.subtitle}>Ramas, umbrales y hojas</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.controlsPanel}>
          <div className={styles.panelHeader}><SlidersHorizontal size={14} /> Cliente</div>
          <div className={styles.controlsList}>
            <label className={styles.controlItem}><div className={styles.controlMeta}><span>Ingreso</span><span className={styles.controlValueEmerald}>{income}</span></div><input type="range" min="20" max="100" step="1" value={income} onChange={(event) => setIncome(parseInt(event.target.value, 10))} className={styles.sliderEmerald} /></label>
            <label className={styles.controlItem}><div className={styles.controlMeta}><span>Deuda</span><span className={styles.controlValueCyan}>{debt}%</span></div><input type="range" min="5" max="80" step="1" value={debt} onChange={(event) => setDebt(parseInt(event.target.value, 10))} className={styles.sliderCyan} /></label>
            <label className={styles.controlItem}><div className={styles.controlMeta}><span>Score</span><span className={styles.controlValueAmber}>{score}</span></div><input type="range" min="40" max="100" step="1" value={score} onChange={(event) => setScore(parseInt(event.target.value, 10))} className={styles.sliderAmber} /></label>
          </div>
        </div>

        <div className={styles.mainColumn}>
          <div className={styles.stepCardsGrid}>
            <StepCard title="Raíz" active={true} detail="¿Ingreso > 55? Primer corte para separar perfiles de menor y mayor capacidad de pago." />
            <StepCard title="Nodo intermedio" active={analysis.path.length > 1} detail={analysis.path[0] === 'Ingreso > 55' ? 'Si el ingreso es alto, el árbol mira deuda o score.' : 'Si el ingreso es bajo, exige score alto y deuda baja.'} />
            <StepCard title="Hoja final" active={true} detail={`La ruta actual termina en ${analysis.decision.toLowerCase()} con confianza ${Math.round(analysis.confidence * 100)}%.`} />
          </div>

          <div className="model-callout model-callout--forest">
            <div className="model-callout__eyebrow"><Target size={14} /> Ruta activa</div>
            <p className="model-callout__title">{analysis.decision}</p>
            <p className="model-callout__body">{analysis.path.join(' → ')}</p>
          </div>

          <div className={styles.notesPanel}>
            <div className={styles.notesHeader}><Sparkles size={14} /> Qué mirar</div>
            <ul className={styles.notesList}>
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
