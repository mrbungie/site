import { useMemo, useState } from 'react';
import { fmt, pct, sigmoid } from './shared/math';
import { Callout, Notes, Panel, Slider, VizBody, VizFrame } from './shared/ui';
import styles from './NaiveBayesVisualizer.module.css';

interface Feature {
  key: string;
  label: string;
  /** P(feature present | spam) */
  spam: number;
  /** P(feature present | ham) */
  ham: number;
}

const FEATURES: Feature[] = [
  { key: 'gratis', label: 'Contiene “gratis”', spam: 0.76, ham: 0.08 },
  { key: 'urgente', label: 'Tono urgente', spam: 0.69, ham: 0.19 },
  { key: 'enlace', label: 'Enlace acortado', spam: 0.61, ham: 0.11 },
  { key: 'conocido', label: 'Remitente conocido', spam: 0.18, ham: 0.82 },
];

const SCALE = 3.5; // log-odds axis half-width

const NaiveBayesVisualizer = () => {
  const [present, setPresent] = useState<Record<string, boolean>>({ gratis: true, urgente: true, enlace: true, conocido: false });
  const [priorSpam, setPriorSpam] = useState(0.42);

  // Bernoulli naive Bayes in log-odds form:
  //   ln P(spam|e)/P(ham|e) = ln prior odds + Σ ln [P(eᵢ|spam)/P(eᵢ|ham)]
  // where an absent feature contributes ln[(1−pₛ)/(1−pₕ)].
  const model = useMemo(() => {
    const priorLogOdds = Math.log(priorSpam / (1 - priorSpam));
    const contributions = FEATURES.map((feature) => {
      const on = present[feature.key];
      const llr = on ? Math.log(feature.spam / feature.ham) : Math.log((1 - feature.spam) / (1 - feature.ham));
      return { feature, on, llr };
    });
    const logOdds = priorLogOdds + contributions.reduce((sum, c) => sum + c.llr, 0);
    const spam = sigmoid(logOdds);
    return { priorLogOdds, contributions, logOdds, spam, ham: 1 - spam };
  }, [present, priorSpam]);

  const bar = (value: number) => {
    const half = Math.min(1, Math.abs(value) / SCALE) * 50;
    return { '--l': `${value >= 0 ? 50 : 50 - half}%`, '--w': `${half}%` } as React.CSSProperties;
  };

  const isSpam = model.spam > 0.5;

  return (
    <VizFrame title="Laboratorio Naive Bayes" subtitle="Evidencia probabilística en texto">
      <VizBody
        plot={
          <Panel title="Evidencia observada en el correo">
            <div className={styles.toggles}>
              {FEATURES.map((feature) => (
                <button
                  key={feature.key}
                  type="button"
                  className={styles.toggle}
                  aria-pressed={present[feature.key]}
                  onClick={() => setPresent((current) => ({ ...current, [feature.key]: !current[feature.key] }))}
                >
                  <span>{feature.label}</span>
                  <span className={styles.state}>{present[feature.key] ? 'presente' : 'ausente'}</span>
                </button>
              ))}
            </div>
            <Slider label="Prior P(spam)" value={priorSpam} min={0.05} max={0.95} step={0.01} onChange={setPriorSpam} format={(x) => fmt(x, 2)} tone="neg" hint="Qué tan común es el spam antes de ver el correo." />
            <h4 className={styles.subhead}>Aporte de cada evidencia al log-odds (a favor de spam →)</h4>
            <ul className={styles.rows}>
              <li className={styles.row}>
                <span>Prior</span>
                <span className={styles.value}>{fmt(model.priorLogOdds, 2)}</span>
                <span className={styles.track} aria-hidden="true"><span className={styles.zero} /><span className={`${styles.fill} ${model.priorLogOdds >= 0 ? styles.spam : styles.ham}`} style={bar(model.priorLogOdds)} /></span>
              </li>
              {model.contributions.map(({ feature, on, llr }) => (
                <li key={feature.key} className={styles.row}>
                  <span>{feature.label} <span className={styles.state}>({on ? 'sí' : 'no'})</span></span>
                  <span className={styles.value}>{fmt(llr, 2)}</span>
                  <span className={styles.track} aria-hidden="true"><span className={styles.zero} /><span className={`${styles.fill} ${llr >= 0 ? styles.spam : styles.ham}`} style={bar(llr)} /></span>
                </li>
              ))}
            </ul>
          </Panel>
        }
        side={
          <>
            <Callout eyebrow="Decisión (MAP)" title={isSpam ? 'Spam' : 'Legítimo'} tone={isSpam ? 'neg' : 'pos'}>
              log-odds total = {fmt(model.logOdds, 2)}. Se decide spam cuando es mayor que 0.
            </Callout>
            <Panel title="Probabilidad posterior">
              <div className={styles.poster} role="img" aria-label={`P(spam | evidencia) = ${pct(model.spam)}, P(legítimo | evidencia) = ${pct(model.ham)}`}>
                <span className={styles.posterSpam} style={{ width: `${model.spam * 100}%` }}>{model.spam > 0.12 ? pct(model.spam, 1) : ''}</span>
                <span className={styles.posterHam} style={{ width: `${model.ham * 100}%` }}>{model.ham > 0.12 ? pct(model.ham, 1) : ''}</span>
              </div>
              <p className={styles.state}>P(spam | e) = {fmt(model.spam, 3)} · P(legítimo | e) = {fmt(model.ham, 3)}</p>
            </Panel>
            <Notes items={[
              'La independencia condicional convierte el producto de probabilidades en una suma de log-odds.',
              'La ausencia de una pista también es evidencia: “sin gratis” empuja hacia legítimo.',
              'Cambia el prior: con poca evidencia domina; con mucha, casi no importa.',
            ]} />
          </>
        }
      />
    </VizFrame>
  );
};

export default NaiveBayesVisualizer;
