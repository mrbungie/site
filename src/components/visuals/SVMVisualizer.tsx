import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCcw, SlidersHorizontal, Sparkles, Target } from 'lucide-react';
import { clamp, generateLinearSample, generateRadialSample } from './classificationUtils';
import styles from './SVMVisualizer.module.css';

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
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>
            <Activity className={styles.titleIcon} size={20} /> Laboratorio SVM
          </h3>
          <p className={styles.subtitle}>Margen máximo y vectores de soporte</p>
        </div>

        <button
          type="button"
          onClick={() => setSampleVersion((value) => value + 1)}
          className={styles.regenerateButton}
        >
          <RefreshCcw size={12} /> Regenerar muestra
        </button>
      </div>

      <div className={styles.layout}>
        <div className={styles.chartContainer}>
          <div className={styles.statsOverlay}>
            <p className={styles.statsLabel}>kernel</p>
            <div className={styles.statsValueContainer}>
              <span className={styles.statsValue}>{kernel === 'linear' ? 'Lineal' : 'RBF'}</span>
              <span className={styles.statsAccuracy}>accuracy {(decision.accuracy * 100).toFixed(1)}%</span>
            </div>
          </div>

          <svg viewBox="0 0 100 100" className={styles.svgChart} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Plano cartesiano con frontera SVM">
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

        <div className={styles.controlsColumn}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <SlidersHorizontal size={14} /> Ajustes
            </div>

            <div className={styles.toggleGrid}>
              <button type="button" onClick={() => setKernel('linear')} className={`model-toggle-button ${kernel === 'linear' ? 'model-toggle-button--active-violet' : 'model-toggle-button--inactive'}`}>Lineal</button>
              <button type="button" onClick={() => setKernel('rbf')} className={`model-toggle-button ${kernel === 'rbf' ? 'model-toggle-button--active-violet' : 'model-toggle-button--inactive'}`}>RBF</button>
            </div>

            <label className={styles.controlItem}>
              <div className={styles.controlMeta}><span>Solapamiento</span><span className={styles.controlValueViolet}>{overlap.toFixed(2)}</span></div>
              <input type="range" min="0.1" max="1.2" step="0.05" value={overlap} onChange={(event) => setOverlap(parseFloat(event.target.value))} className={styles.sliderViolet} />
            </label>

            <label className={styles.controlItem}>
              <div className={styles.controlMeta}><span>Ancho del margen</span><span className={styles.controlValueCyan}>{marginWidth.toFixed(2)}</span></div>
              <input type="range" min="0.4" max="1.4" step="0.05" value={marginWidth} onChange={(event) => setMarginWidth(parseFloat(event.target.value))} className={styles.sliderCyan} />
            </label>
          </div>

          <div className="model-callout model-callout--violet">
            <div className="model-callout__eyebrow"><Target size={14} /> Idea central</div>
            <p className="model-callout__title">Margen máximo</p>
            <p className="model-callout__body">SVM no busca solo separar clases: busca hacerlo dejando la franja de seguridad más amplia posible alrededor de la frontera.</p>
          </div>

          <div className={styles.notesPanel}>
            <div className={styles.notesHeader}><Sparkles size={14} /> Qué mirar</div>
            <ul className={styles.notesListVioletMarker}>
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
