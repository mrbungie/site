import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="flex flex-col bg-slate-950 rounded-[2.5rem] border border-slate-800 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-8 py-6 bg-slate-900/50 border-b border-white/5">
        <div className="flex flex-col">
          <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2 uppercase">
            <Activity className="text-teal-400" size={20} />
            Laboratorio de Regresión
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Mínimos Cuadrados Ordinarios</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={clear}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold text-red-400 uppercase tracking-widest hover:bg-red-500/10 rounded-full transition-colors border border-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <RefreshCcw size={12} /> Limpiar
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row p-8 lg:gap-10 items-start justify-center">
        {/* Left: The Square Plot */}
        <div className="flex-1 w-full flex justify-center">
            <div className="aspect-square w-full max-w-[650px] relative bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-inner p-4 group">
                <div className="absolute top-6 left-8 flex items-center gap-4 z-10 bg-slate-950/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                        <span className="text-[10px] font-mono font-bold text-slate-300">y = {currentSlope.toFixed(2)}x + {currentIntercept.toFixed(1)}</span>
                    </div>
                </div>
                
                <svg 
                    className="w-full h-full cursor-crosshair overflow-visible" 
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
                        className="drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]"
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
                        className="cursor-pointer"
                        >
                        <circle cx={p.x} cy={100 - p.y} r="1.2" fill="#fff" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                        <circle cx={p.x} cy={100 - p.y} r="3" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth="0.2" className="hover:stroke-red-500 transition-colors" />
                        </motion.g>
                    ))}
                    </AnimatePresence>
                </svg>

                {points.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                    <MousePointer2 className="w-12 h-12 text-white mb-4 animate-bounce" />
                    <p className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Clica para dibujar datos</p>
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Console */}
        <div className="flex flex-col gap-6 lg:w-[320px] w-full shrink-0">
          {/* Controls Card */}
          <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/5 flex flex-col gap-6">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Controles e Indicadores</span>
            
            <button 
              type="button"
              onClick={() => setManualMode(!manualMode)}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all font-bold text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${manualMode ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/30' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal size={16} />
                {manualMode ? 'Modo Manual' : 'Modelo Automático'}
              </div>
              <div className={`w-2 h-2 rounded-full ${manualMode ? 'bg-white animate-pulse' : 'bg-slate-600'}`} />
            </button>

            <div className="flex flex-col gap-3">
              <button 
                type="button"
                onClick={() => setShowSquares(showSquares === 'ols' ? 'none' : 'ols')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${showSquares === 'ols' ? 'bg-slate-800 text-teal-300 border border-teal-500/30' : 'bg-slate-800/50 text-slate-500 border border-transparent hover:border-white/10'}`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${showSquares === 'ols' ? 'border-teal-300 bg-teal-300/20' : 'border-slate-600'}`}>
                  {showSquares === 'ols' && <div className="w-1.5 h-1.5 bg-teal-300 rounded-sm" />}
                </div>
                Residuales (SSE)
              </button>
              <button 
                type="button"
                onClick={() => setShowSquares(showSquares === 'mean' ? 'none' : 'mean')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${showSquares === 'mean' ? 'bg-slate-800 text-sky-300 border border-sky-500/30' : 'bg-slate-800/50 text-slate-500 border border-transparent hover:border-white/10'}`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${showSquares === 'mean' ? 'border-sky-300 bg-sky-300/20' : 'border-slate-600'}`}>
                  {showSquares === 'mean' && <div className="w-1.5 h-1.5 bg-sky-300 rounded-sm" />}
                </div>
                Total (Media)
              </button>
            </div>
            
            {manualMode && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex flex-col gap-4 p-5 bg-teal-500/5 border border-teal-500/20 rounded-2xl">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center"><label htmlFor="manual-slope" className="text-[9px] font-bold text-teal-300/80 uppercase">Slope</label><span className="text-xs font-mono font-bold text-teal-300">{manualSlope.toFixed(2)}</span></div>
                        <input id="manual-slope" type="range" min="-2" max="2" step="0.01" value={manualSlope} onChange={(e) => setManualSlope(parseFloat(e.target.value))} className="w-full accent-teal-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center"><label htmlFor="manual-intercept" className="text-[9px] font-bold text-teal-300/80 uppercase">Intercept</label><span className="text-xs font-mono font-bold text-teal-300">{manualIntercept.toFixed(1)}</span></div>
                        <input id="manual-intercept" type="range" min="-50" max="150" step="0.5" value={manualIntercept} onChange={(e) => setManualIntercept(parseFloat(e.target.value))} className="w-full accent-teal-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900" />
                    </div>
                </motion.div>
            )}
          </div>

          {/* Metrics Card */}
          <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/5 flex flex-col gap-6 shadow-xl relative overflow-hidden group">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Magnitud de la Varianza</span>
            
            <div className="flex gap-6 justify-center items-end bg-slate-950/40 rounded-[2rem] p-6 border border-white/5 min-h-[220px] relative">
              {/* SSE Column */}
              <div className="flex flex-col items-center gap-2 flex-1 justify-end">
                <div className="text-[10px] font-mono font-black text-teal-300 mb-1">{currentSSRes.toFixed(0)}</div>
                <div className="relative w-8 bg-slate-800 rounded-full flex flex-col justify-end overflow-hidden border border-white/5 h-32 shadow-inner">
                  <motion.div animate={{ height: stats ? `${Math.max(4, (currentSSRes / (stats.ssTotal * 5 || 1)) * 100)}%` : '0%' }} className="w-full bg-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.45)]" />
                </div>
                <span className="text-[9px] font-black text-teal-300/70 uppercase tracking-tighter">SSE</span>
              </div>

              {/* SSTotal Column */}
              <div className="flex flex-col items-center gap-2 flex-1 justify-end">
                <div className="text-[10px] font-mono font-black text-sky-300 mb-1">{stats?.ssTotal.toFixed(0) ?? 0}</div>
                <div className="relative w-8 bg-slate-800 rounded-full flex flex-col justify-end overflow-hidden border border-white/5 h-32 shadow-inner">
                  <motion.div animate={{ height: stats ? '100%' : '0%' }} className="w-full bg-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]" />
                </div>
                <span className="text-[9px] font-black text-sky-300/70 uppercase tracking-tighter whitespace-nowrap">"Media"</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-5 rounded-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase text-white/50 tracking-widest">Bondad de Ajuste</span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-4xl font-black text-white">{currentR2.toFixed(3)}</span>
                        <span className="text-lg font-bold text-white/50 italic leading-none">R²</span>
                    </div>
                </div>
                <Activity className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-8 py-5 bg-teal-950/20 text-teal-200 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-between border-t border-white/5">
        <div className="flex items-center gap-2">
            <Info size={14} />
            {points.length < 2 ? "Añade puntos al gráfico cuadrado para ver la regresión." : `${points.length} puntos analizados.`}
        </div>
        <div className="hidden sm:block text-teal-300/50">
            Escala: 5.0x SST
        </div>
      </div>
    </div>
  );
};

export default RegressionVisualizer;
