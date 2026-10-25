import { useMemo, useState } from 'react';
import type { Lang } from './shared/i18n';
import { fmt, pct, sigmoid } from './shared/math';
import { Callout, Notes, Panel, Slider, VizBody, VizFrame } from './shared/ui';
import styles from './NaiveBayesVisualizer.module.css';

interface Feature {
  key: string;
  /** P(feature present | spam) */
  spam: number;
  /** P(feature present | ham) */
  ham: number;
}

const FEATURES: Feature[] = [
  { key: 'gratis', spam: 0.76, ham: 0.08 },
  { key: 'urgente', spam: 0.69, ham: 0.19 },
  { key: 'enlace', spam: 0.61, ham: 0.11 },
  { key: 'conocido', spam: 0.18, ham: 0.82 },
];

const T = {
  es: {
    labels: { gratis: 'Contiene “gratis”', urgente: 'Tono urgente', enlace: 'Enlace acortado', conocido: 'Remitente conocido' } as Record<string, string>,
    title: 'Laboratorio Naive Bayes',
    subtitle: 'Evidencia probabilística en texto',
    evidence: 'Evidencia observada en el correo',
    present: 'presente',
    absent: 'ausente',
    priorHint: 'Qué tan común es el spam antes de ver el correo.',
    contribution: 'Aporte de cada evidencia al log-odds (a favor de spam →)',
    yes: 'sí',
    no: 'no',
    decision: 'Decisión (MAP)',
    spam: 'Spam',
    legit: 'Legítimo',
    total: (l: string) => `log-odds total = ${l}. Se decide spam cuando es mayor que 0.`,
    posterior: 'Probabilidad posterior',
    legitShort: 'legítimo',
    evidenceShort: 'evidencia',
    notes: [
      'La independencia condicional convierte el producto de probabilidades en una suma de log-odds.',
      'La ausencia de una pista también es evidencia: “sin gratis” empuja hacia legítimo.',
      'Cambia el prior: con poca evidencia domina; con mucha, casi no importa.',
    ],
  },
  en: {
    labels: { gratis: 'Contains “free”', urgente: 'Urgent tone', enlace: 'Shortened link', conocido: 'Known sender' } as Record<string, string>,
    title: 'Naive Bayes lab',
    subtitle: 'Probabilistic evidence in text',
    evidence: 'Evidence observed in the email',
    present: 'present',
    absent: 'absent',
    priorHint: 'How common spam is before seeing the email.',
    contribution: 'Contribution of each piece of evidence to the log-odds (in favor of spam →)',
    yes: 'yes',
    no: 'no',
    decision: 'Decision (MAP)',
    spam: 'Spam',
    legit: 'Legitimate',
    total: (l: string) => `total log-odds = ${l}. Spam is predicted when it is greater than 0.`,
    posterior: 'Posterior probability',
    legitShort: 'legitimate',
    evidenceShort: 'evidence',
    notes: [
      'Conditional independence turns the product of probabilities into a sum of log-odds.',
      'The absence of a cue is also evidence: “no free” pushes toward legitimate.',
      'Change the prior: with little evidence it dominates; with a lot, it hardly matters.',
    ],
  },
} as const;

const SCALE = 3.5; // log-odds axis half-width

const NaiveBayesVisualizer = ({ lang = 'es' }: { lang?: Lang }) => {
  const t = T[lang];
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
    <VizFrame title={t.title} subtitle={t.subtitle}>
      <VizBody
        plot={
          <Panel title={t.evidence}>
            <div className={styles.toggles}>
              {FEATURES.map((feature) => (
                <button
                  key={feature.key}
                  type="button"
                  className={styles.toggle}
                  aria-pressed={present[feature.key]}
                  onClick={() => setPresent((current) => ({ ...current, [feature.key]: !current[feature.key] }))}
                >
                  <span>{t.labels[feature.key]}</span>
                  <span className={styles.state}>{present[feature.key] ? t.present : t.absent}</span>
                </button>
              ))}
            </div>
            <Slider label="Prior P(spam)" value={priorSpam} min={0.05} max={0.95} step={0.01} onChange={setPriorSpam} format={(x) => fmt(x, 2)} tone="neg" hint={t.priorHint} />
            <h4 className={styles.subhead}>{t.contribution}</h4>
            <ul className={styles.rows}>
              <li className={styles.row}>
                <span>Prior</span>
                <span className={styles.value}>{fmt(model.priorLogOdds, 2)}</span>
                <span className={styles.track} aria-hidden="true"><span className={styles.zero} /><span className={`${styles.fill} ${model.priorLogOdds >= 0 ? styles.spam : styles.ham}`} style={bar(model.priorLogOdds)} /></span>
              </li>
              {model.contributions.map(({ feature, on, llr }) => (
                <li key={feature.key} className={styles.row}>
                  <span>{t.labels[feature.key]} <span className={styles.state}>({on ? t.yes : t.no})</span></span>
                  <span className={styles.value}>{fmt(llr, 2)}</span>
                  <span className={styles.track} aria-hidden="true"><span className={styles.zero} /><span className={`${styles.fill} ${llr >= 0 ? styles.spam : styles.ham}`} style={bar(llr)} /></span>
                </li>
              ))}
            </ul>
          </Panel>
        }
        side={
          <>
            <Callout eyebrow={t.decision} title={isSpam ? t.spam : t.legit} tone={isSpam ? 'neg' : 'pos'}>
              {t.total(fmt(model.logOdds, 2))}
            </Callout>
            <Panel title={t.posterior}>
              <div className={styles.poster} role="img" aria-label={`P(spam | ${t.evidenceShort}) = ${pct(model.spam)}, P(${t.legitShort} | ${t.evidenceShort}) = ${pct(model.ham)}`}>
                <span className={styles.posterSpam} style={{ width: `${model.spam * 100}%` }}>{model.spam > 0.12 ? pct(model.spam, 1) : ''}</span>
                <span className={styles.posterHam} style={{ width: `${model.ham * 100}%` }}>{model.ham > 0.12 ? pct(model.ham, 1) : ''}</span>
              </div>
              <p className={styles.state}>P(spam | e) = {fmt(model.spam, 3)} · P({t.legitShort} | e) = {fmt(model.ham, 3)}</p>
            </Panel>
            <Notes items={[...t.notes]} lang={lang} />
          </>
        }
      />
    </VizFrame>
  );
};

export default NaiveBayesVisualizer;
