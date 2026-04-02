import { useMemo, useState } from 'react';
import { Activity, Sparkles, Target } from 'lucide-react';
import styles from './NaiveBayesVisualizer.module.css';

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}><Activity className={styles.titleIcon} size={20} /> Laboratorio Naive Bayes</h3>
        <p className={styles.subtitle}>Evidencia probabilística en texto</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.leftPanel}>
          <div className={styles.panelHeader}>Evidencia observada</div>
          <div className={styles.featureButtonsGroup}>
            {FEATURES.map((feature) => (
              <button
                key={feature.key}
                type="button"
                onClick={() => setActive((current) => ({ ...current, [feature.key]: !current[feature.key] }))}
                className={active[feature.key] ? styles.featureBtnActive : styles.featureBtnInactive}
              >
                {feature.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.probabilityPanel}>
            <div className={styles.probGrid}>
              <div>
                <div className={styles.probLabelRow}><span>P(Spam | evidencia)</span><span className={styles.probValueAmber}>{posterior.spam.toFixed(3)}</span></div>
                <div className={styles.barTrack}><div className={styles.barFillAmber} style={{ width: `${posterior.spam * 100}%` }} /></div>
              </div>
              <div>
                <div className={styles.probLabelRow}><span>P(Legítimo | evidencia)</span><span className={styles.probValueCyan}>{posterior.ham.toFixed(3)}</span></div>
                <div className={styles.barTrack}><div className={styles.barFillCyan} style={{ width: `${posterior.ham * 100}%` }} /></div>
              </div>
            </div>
          </div>

          <div className="model-callout model-callout--amber">
            <div className="model-callout__eyebrow"><Target size={14} /> Decisión</div>
            <p className="model-callout__title">{posterior.decision}</p>
            <p className="model-callout__body">Naive Bayes multiplica evidencia condicional clase por clase y luego normaliza para obtener probabilidades posteriores.</p>
          </div>

          <div className={styles.notesPanel}>
            <div className={styles.notesHeader}><Sparkles size={14} /> Qué mirar</div>
            <ul className={styles.notesListAmberMarker}>
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
