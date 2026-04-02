import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCcw, SlidersHorizontal, Sparkles, TrendingUp } from 'lucide-react';
import styles from './CorrelationVisualizer.module.css';

interface Point {
  x: number;
  y: number;
  id: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const createSeededRandom = (seed: number) => {
  let value = seed % 2147483647;

  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const boxMuller = (random: () => number) => {
  let u = 0;
  let v = 0;

  while (u === 0) u = random();
  while (v === 0) v = random();

  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const CorrelationVisualizer = () => {
  const [targetCorrelation, setTargetCorrelation] = useState(0.7);
  const [sampleSize, setSampleSize] = useState(36);
  const [sampleVersion, setSampleVersion] = useState(0);

  const points = useMemo<Point[]>(() => {
    const spread = Math.sqrt(Math.max(0, 1 - targetCorrelation ** 2));
    const random = createSeededRandom(sampleVersion + 1);
    const raw = Array.from({ length: sampleSize }, (_, index) => {
      const x = boxMuller(random);
      const independentNoise = boxMuller(random);
      const y = targetCorrelation * x + spread * independentNoise;
      return { x, y, id: index };
    });

    const xValues = raw.map((point) => point.x);
    const yValues = raw.map((point) => point.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const xRange = maxX - minX || 1;
    const yRange = maxY - minY || 1;

    return raw.map((point) => ({
      x: 10 + ((point.x - minX) / xRange) * 80,
      y: 10 + ((point.y - minY) / yRange) * 80,
      id: point.id,
    }));
  }, [sampleSize, sampleVersion, targetCorrelation]);

  const stats = useMemo(() => {
    const xMean = points.reduce((sum, point) => sum + point.x, 0) / points.length;
    const yMean = points.reduce((sum, point) => sum + point.y, 0) / points.length;

    let numerator = 0;
    let xVariance = 0;
    let yVariance = 0;

    points.forEach((point) => {
      const dx = point.x - xMean;
      const dy = point.y - yMean;

      numerator += dx * dy;
      xVariance += dx ** 2;
      yVariance += dy ** 2;
    });

    const denominator = Math.sqrt(xVariance * yVariance);
    const correlation = denominator === 0 ? 0 : numerator / denominator;
    const slope = xVariance === 0 ? 0 : numerator / xVariance;
    const intercept = yMean - slope * xMean;

    return {
      correlation,
      slope,
      intercept,
      strength:
        Math.abs(correlation) > 0.8
          ? 'Muy fuerte'
          : Math.abs(correlation) > 0.55
            ? 'Moderada'
            : Math.abs(correlation) > 0.25
              ? 'Suave'
              : 'Casi nula',
    };
  }, [points]);

  const lineStartY = clamp(100 - (stats.intercept + stats.slope * 0), 0, 100);
  const lineEndY = clamp(100 - (stats.intercept + stats.slope * 100), 0, 100);

  return (
    <div className={`rf-visualizer ${styles.container}`}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>
            <Activity className={styles.titleIcon} size={20} />
            Laboratorio de Correlación
          </h3>
          <p className={styles.subtitle}>
            Pearson en tiempo real
          </p>
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
            <p className={styles.statsLabel}>r observado</p>
            <div className={styles.statsValueContainer}>
              <span className={styles.statsValue}>{stats.correlation.toFixed(3)}</span>
              <span className={styles.statsStrength}>{stats.strength}</span>
            </div>
          </div>

          <svg
            viewBox="0 0 100 100"
            className={styles.svgChart}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Diagrama de dispersión con recta de tendencia"
          >
            {Array.from({ length: 11 }, (_, value) => value).map((value) => (
              <React.Fragment key={value}>
                <line x1={value * 10} y1="0" x2={value * 10} y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
                <line x1="0" y1={value * 10} x2="100" y2={value * 10} stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
              </React.Fragment>
            ))}

            <line
              x1="0"
              y1={lineStartY}
              x2="100"
              y2={lineEndY}
              stroke={stats.correlation >= 0 ? '#2dd4bf' : '#fb7185'}
              strokeWidth="1.1"
              strokeDasharray="2.5 1.5"
            />

            {points.map((point) => (
              <motion.circle
                key={`${sampleVersion}-${point.id}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: point.id * 0.01 }}
                cx={point.x}
                cy={100 - point.y}
                r="1.35"
                fill={stats.correlation >= 0 ? '#67e8f9' : '#fda4af'}
                style={{ filter: "drop-shadow(0 0 8px rgba(103,232,249,0.55))" }}
              />
            ))}
          </svg>

          <div className={styles.chartAxisLabels}>
            <span>X normalizada</span>
            <span>Y normalizada</span>
          </div>
        </div>

        <div className={styles.controlsColumn}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <SlidersHorizontal size={14} /> Ajustes
            </div>

            <div className={styles.controlsList}>
              <label className={styles.controlItem}>
                <div className={styles.controlMeta}>
                  <span>Correlación objetivo</span>
                  <span className={styles.controlValueTeal}>{targetCorrelation.toFixed(2)}</span>
                </div>
                <input
                  aria-label="Correlación objetivo"
                  type="range"
                  min="-0.95"
                  max="0.95"
                  step="0.05"
                  value={targetCorrelation}
                  onChange={(event) => setTargetCorrelation(parseFloat(event.target.value))}
                  className={styles.sliderTeal}
                />
              </label>

              <label className={styles.controlItem}>
                <div className={styles.controlMeta}>
                  <span>Tamaño de muestra</span>
                  <span className={styles.controlValueSky}>{sampleSize}</span>
                </div>
                <input
                  aria-label="Tamaño de muestra"
                  type="range"
                  min="12"
                  max="80"
                  step="2"
                  value={sampleSize}
                  onChange={(event) => setSampleSize(parseInt(event.target.value, 10))}
                  className={styles.sliderSky}
                />
              </label>
            </div>
          </div>

          <div className="model-callout model-callout--teal">
            <div className="model-callout__eyebrow">
              <TrendingUp size={14} /> Lectura rápida
            </div>
            <p className="model-callout__title">{stats.correlation > 0 ? 'Positiva' : stats.correlation < 0 ? 'Negativa' : 'Neutra'}</p>
            <p className="model-callout__body">
              Cuando la nube se inclina hacia arriba, r crece. Cuando cae, r se vuelve negativa. Con muestras pequeñas, el valor observado oscila más.
            </p>
          </div>

          <div className={styles.notesPanel}>
            <div className={styles.notesHeader}>
              <Sparkles size={14} /> Qué mirar
            </div>
            <ul className={styles.notesList}>
              <li>Acerca el deslizador a ±1 para ver una relación lineal casi perfecta.</li>
              <li>Baja el tamaño de muestra para notar el ruido muestral.</li>
              <li>La recta discontinua resume la tendencia lineal de la nube.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationVisualizer;
