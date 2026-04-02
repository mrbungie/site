import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCcw, SlidersHorizontal, Sparkles, Target } from 'lucide-react';
import { distance, generateLinearSample } from './classificationUtils';
import styles from './KNNVisualizer.module.css';

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
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}><Activity className={styles.titleIcon} size={20} /> Laboratorio k-NN</h3>
          <p className={styles.subtitle}>Mayoría local entre vecinos</p>
        </div>
        <button type="button" onClick={() => setSampleVersion((value) => value + 1)} className={styles.regenerateButton}><RefreshCcw size={12} /> Regenerar muestra</button>
      </div>

      <div className={styles.layout}>
        <div className={styles.chartContainer}>
          <svg viewBox="0 0 100 100" className={styles.svgChart} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Puntos clasificados por k vecinos cercanos">
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

        <div className={styles.controlsColumn}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}><SlidersHorizontal size={14} /> Ajustes</div>
            <label className={styles.controlItem}><div className={styles.controlMeta}><span>k vecinos</span><span className={styles.controlValueSky}>{k}</span></div><input type="range" min="1" max="11" step="2" value={k} onChange={(event) => setK(parseInt(event.target.value, 10))} className={styles.sliderSky} /></label>
            <label className={styles.controlItemWithMargin}><div className={styles.controlMeta}><span>Consulta X</span><span className={styles.controlValueCyan}>{queryX.toFixed(0)}</span></div><input type="range" min="10" max="90" step="1" value={queryX} onChange={(event) => setQueryX(parseFloat(event.target.value))} className={styles.sliderCyan} /></label>
            <label className={styles.controlItemWithMargin}><div className={styles.controlMeta}><span>Consulta Y</span><span className={styles.controlValueRose}>{queryY.toFixed(0)}</span></div><input type="range" min="10" max="90" step="1" value={queryY} onChange={(event) => setQueryY(parseFloat(event.target.value))} className={styles.sliderRose} /></label>
          </div>

          <div className="model-callout model-callout--sky">
            <div className="model-callout__eyebrow"><Target size={14} /> Predicción local</div>
            <p className="model-callout__title">{neighborhood.decision === 1 ? 'Clase positiva' : 'Clase negativa'}</p>
            <p className="model-callout__body">{neighborhood.positives} de {neighborhood.nearest.length} vecinos cercanos apoyan esta clase.</p>
          </div>

          <div className={styles.notesPanel}>
            <div className={styles.notesHeader}><Sparkles size={14} /> Qué mirar</div>
            <ul className={styles.notesList}>
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
