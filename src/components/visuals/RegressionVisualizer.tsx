import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './RegressionVisualizer.module.css';
import { RefreshCcw, Activity, SlidersHorizontal, MousePointer2, Info } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  id: number;
}

const RegressionVisualizer = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [showSquares, setShowSquares] = useState<'none' | 'ols' | 'mean'>('none');
  const [manualMode, setManualMode] = useState(false);
  const [manualSlope, setManualSlope] = useState(0.5);
  const [manualIntercept, setManualIntercept] = useState(25);

  const stats = useMemo(() => {
    if (points.length < 2) return null;

    const xMean = points.reduce((a, b) => a + b.x, 0) / points.length;
    const yMean = points.reduce((a, b) => a + b.y, 0) / points.length;

    let num = 0;
    let den = 0;
    points.forEach(p => {
      num += (p.x - xMean) * (p.y - yMean);
      den += Math.pow(p.x - xMean, 2);
    });

    const slope = den === 0 ? 0 : num / den;
    const intercept = yMean - slope * xMean;

    let ssTotal = 0;
    let ssRes = 0;
    let ssResManual = 0;

    points.forEach(p => {
      ssTotal += Math.pow(p.y - yMean, 2);
      ssRes += Math.pow(p.y - (intercept + slope * p.x), 2);
      ssResManual += Math.pow(p.y - (manualIntercept + manualSlope * p.x), 2);
    });

    const r2 = ssTotal === 0 ? 0 : 1 - (ssRes / ssTotal);
    const r2Manual = ssTotal === 0 ? 0 : 1 - (ssResManual / ssTotal);

    return { slope, intercept, xMean, yMean, ssTotal, ssRes, ssResManual, r2, r2Manual };
  }, [points, manualSlope, manualIntercept]);

  const addPoint = (e: React.PointerEvent<SVGRectElement>) => {
    if (points.length >= 25) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = 100 - ((e.clientY - rect.top) / rect.height) * 100;
    setPoints([...points, { x, y, id: Date.now() }]);
  };

  const removePoint = (id: number) => {
    setPoints(points.filter(p => p.id !== id));
  };

  const clear = () => {
    setPoints([]);
    setShowSquares('none');
  };

  const currentSlope = manualMode ? manualSlope : stats?.slope ?? 0;
  const currentIntercept = manualMode ? manualIntercept : stats?.intercept ?? 0;
  const currentR2 = manualMode ? stats?.r2Manual ?? 0 : stats?.r2 ?? 0;
  const currentSSRes = manualMode ? stats?.ssResManual ?? 0 : stats?.ssRes ?? 0;

  return (
    <div className="rf-visualizer">
      {/* Header Bar */}
      <div className={`rf-visualizer__header ${styles.header}`}>
        <div className={styles.headerLeft}>
          <h3 className="rf-visualizer__title">
            <Activity className={styles.titleIcon} size={20} />
            Laboratorio de Regresión
          </h3>
          <p className="rf-visualizer__subtitle">Mínimos Cuadrados Ordinarios</p>
        </div>
        
        <div className={styles.toggleIconWrapper}>
          <button 
            type="button"
            onClick={clear}
            className={styles.clearButton}
          >
            <RefreshCcw size={12} /> Limpiar
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Left: The Square Plot */}
        <div className={styles.plotAreaContainer}>
            <div className={styles.plotArea}>
                <div className={styles.equationBadge}>
                    <div className={styles.equationBadgeInner}>
                        <div className={styles.equationDot} />
                        <span className={styles.equationText}>y = {currentSlope.toFixed(2)}x + {currentIntercept.toFixed(1)}</span>
                    </div>
                </div>
                
                <svg 
                    className={styles.svgPlot} 
                    viewBox="0 0 100 100" 
                    role="img"
                    aria-label="Plano cartesiano interactivo de regresión"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Grid */}
                    <rect x="0" y="0" width="100" height="100" fill="transparent" onPointerUp={addPoint} />

                    {Array.from({ length: 11 }, (_, value) => value).map((value) => (
                    <React.Fragment key={value}>
                        <line x1={value * 10} y1="0" x2={value * 10} y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.2" />
                        <line x1="0" y1={value * 10} x2="100" y2={value * 10} stroke="rgba(255,255,255,0.03)" strokeWidth="0.2" />
                    </React.Fragment>
                    ))}

                    {stats && (
                    <>
                        <line x1="0" y1={100 - stats.yMean} x2="100" y2={100 - stats.yMean} stroke="rgba(56,189,248,0.25)" strokeWidth="0.5" strokeDasharray="2" />
                        
                        <AnimatePresence>
                        {points.map((p) => {
                            const targetY = showSquares === 'ols' ? (currentIntercept + currentSlope * p.x) : stats.yMean;
                            const side = Math.abs(p.y - targetY);
                            if (showSquares === 'none' || side < 0.1) return null;

                            return (
                            <motion.rect
                                key={`sq-${p.id}-${showSquares}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.15 }}
                                exit={{ opacity: 0 }}
                                x={p.x}
                                y={100 - Math.max(p.y, targetY)}
                                width={side}
                                height={side}
                                fill={showSquares === 'ols' ? '#14b8a6' : '#38bdf8'}
                            />
                            );
                        })}
                        </AnimatePresence>

                        {points.map(p => (
                        <line 
                            key={`tie-${p.id}`}
                            x1={p.x} y1={100 - p.y} x2={p.x} y2={100 - (currentIntercept + currentSlope * p.x)}
                            stroke="rgba(251,191,36,0.3)" strokeWidth="0.4"
                        />
                        ))}

                        <line 
                        x1="-10" y1={100 - (currentIntercept + currentSlope * -10)} x2="110" y2={100 - (currentIntercept + currentSlope * 110)}
                        stroke={manualMode ? '#f59e0b' : '#14b8a6'} 
                        strokeWidth="0.8"
                        className={styles.regressionLine}
                        />
                    </>
                    )}

                    <AnimatePresence>
                    {points.map((p) => (
                        <motion.g 
                        key={p.id} 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        exit={{ scale: 0 }}
                        onPointerUp={(e) => { e.stopPropagation(); removePoint(p.id); }}
                        className={styles.dataPoint}
                        >
                        <circle cx={p.x} cy={100 - p.y} r="1.2" fill="#fff" className={styles.dataPointCircle} />
                        <circle cx={p.x} cy={100 - p.y} r="3" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth="0.2" className={styles.dataPointHover} />
                        </motion.g>
                    ))}
                    </AnimatePresence>
                </svg>

                {points.length === 0 && (
                    <div className={styles.emptyState}>
                    <MousePointer2 className={styles.emptyStateIcon} />
                    <p className={styles.emptyStateText}>Clica para dibujar datos</p>
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Console */}
        <div className={styles.controlsCol}>
          {/* Controls Card */}
          <div className="rf-panel">
            <span className="rf-panel__header">Controles e Indicadores</span>
            
            <button 
              type="button"
              onClick={() => setManualMode(!manualMode)}
              className={`${styles.toggleBtn} ${manualMode ? styles.toggleBtnActive : styles.toggleBtnInactive}`}
            >
              <div className={styles.toggleIconWrapper}>
                <SlidersHorizontal size={16} />
                {manualMode ? 'Modo Manual' : 'Modelo Automático'}
              </div>
              <div className={manualMode ? styles.toggleDotActive : styles.toggleDotInactive} />
            </button>

            <div className={styles.optionsGroup}>
              <button 
                type="button"
                onClick={() => setShowSquares(showSquares === 'ols' ? 'none' : 'ols')}
                className={`${styles.optionBtn} ${showSquares === 'ols' ? styles.optionBtnActiveTeal : styles.optionBtnInactive}`}
              >
                <div className={showSquares === 'ols' ? styles.optionCheckboxActiveTeal : styles.optionCheckboxInactive}>
                  {showSquares === 'ols' && <div className={styles.optionCheckTeal} />}
                </div>
                Residuales (SSE)
              </button>
              <button 
                type="button"
                onClick={() => setShowSquares(showSquares === 'mean' ? 'none' : 'mean')}
                className={`${styles.optionBtn} ${showSquares === 'mean' ? styles.optionBtnActiveSky : styles.optionBtnInactive}`}
              >
                <div className={showSquares === 'mean' ? styles.optionCheckboxActiveSky : styles.optionCheckboxInactive}>
                  {showSquares === 'mean' && <div className={styles.optionCheckSky} />}
                </div>
                Total (Media)
              </button>
            </div>
            
            {manualMode && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className={styles.manualControls}>
                    <div className={styles.manualInputGroup}>
                        <div className={styles.manualInputHeader}><label htmlFor="manual-slope" className={styles.manualInputLabel}>Slope</label><span className={styles.manualInputValue}>{manualSlope.toFixed(2)}</span></div>
                        <input id="manual-slope" type="range" min="-2" max="2" step="0.01" value={manualSlope} onChange={(e) => setManualSlope(parseFloat(e.target.value))} className={styles.sliderTeal} />
                    </div>
                    <div className={styles.manualInputGroup}>
                        <div className={styles.manualInputHeader}><label htmlFor="manual-intercept" className={styles.manualInputLabel}>Intercept</label><span className={styles.manualInputValue}>{manualIntercept.toFixed(1)}</span></div>
                        <input id="manual-intercept" type="range" min="-50" max="150" step="0.5" value={manualIntercept} onChange={(e) => setManualIntercept(parseFloat(e.target.value))} className={styles.sliderTeal} />
                    </div>
                </motion.div>
            )}
          </div>

          {/* Metrics Card */}
          <div className={styles.metricsContainer}>
            <span className={styles.panelTitle}>Magnitud de la Varianza</span>
            
            <div className={styles.metricsBars}>
              {/* SSE Column */}
              <div className={styles.metricCol}>
                <div className={styles.metricValTeal}>{currentSSRes.toFixed(0)}</div>
                <div className={styles.barTrack}>
                  <motion.div animate={{ height: stats ? `${Math.max(4, (currentSSRes / (stats.ssTotal * 5 || 1)) * 100)}%` : '0%' }} className={styles.barFillTeal} />
                </div>
                <span className={styles.metricNameTeal}>SSE</span>
              </div>

              {/* SSTotal Column */}
              <div className={styles.metricCol}>
                <div className={styles.metricValSky}>{stats?.ssTotal.toFixed(0) ?? 0}</div>
                <div className={styles.barTrack}>
                  <motion.div animate={{ height: stats ? '100%' : '0%' }} className={styles.barFillSky} />
                </div>
                <span className={styles.metricNameSky}>"Media"</span>
              </div>
            </div>

            <div className={styles.r2Card}>
                <div className={styles.r2Content}>
                    <span className={styles.r2Label}>Bondad de Ajuste</span>
                    <div className={styles.r2ValueRow}>
                        <span className={styles.r2Value}>{currentR2.toFixed(3)}</span>
                        <span className={styles.r2Symbol}>R²</span>
                    </div>
                </div>
                <Activity className={styles.r2BgIcon} />
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.footer}>
        <div className={styles.equationBadgeInner}>
            <Info size={14} />
            {points.length < 2 ? "Añade puntos al gráfico cuadrado para ver la regresión." : `${points.length} puntos analizados.`}
        </div>
        <div className={styles.footerScale}>
            Escala: 5.0x SST
        </div>
      </div>
    </div>
  );
};

export default RegressionVisualizer;
