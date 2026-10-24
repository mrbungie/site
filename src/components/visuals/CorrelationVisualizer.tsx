import { useMemo, useState } from 'react';
import { clamp, clipLine, correlationInterval, createRng, fmt, gaussian, linearStats } from './shared/math';
import { Button, Callout, Legend, Notes, Panel, Plot, PlotSvg, Slider, Stat, StatGrid, VizBody, VizFrame, flipY, vizStyles as v } from './shared/ui';

const strengthOf = (r: number) => {
  const a = Math.abs(r);
  return a > 0.8 ? 'muy fuerte' : a > 0.55 ? 'moderada' : a > 0.25 ? 'débil' : 'casi nula';
};

const CorrelationVisualizer = () => {
  const [rho, setRho] = useState(0.7);
  const [n, setN] = useState(36);
  const [version, setVersion] = useState(0);

  // Draw (x, y) with population correlation rho: y = rho·x + sqrt(1−rho²)·ε, then rescale into the plot box.
  // Min-max scaling is affine on each axis, so Pearson's r is unchanged by it.
  const points = useMemo(() => {
    const random = createRng(version + 1);
    const spread = Math.sqrt(1 - rho * rho);
    const raw = Array.from({ length: n }, (_, id) => {
      const x = gaussian(random);
      return { id, x, y: rho * x + spread * gaussian(random) };
    });
    const xs = raw.map((p) => p.x);
    const ys = raw.map((p) => p.y);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    return raw.map((p) => ({
      id: p.id,
      x: 8 + ((p.x - x0) / (x1 - x0 || 1)) * 84,
      y: 8 + ((p.y - y0) / (y1 - y0 || 1)) * 84,
    }));
  }, [n, rho, version]);

  const stats = useMemo(() => {
    const s = linearStats(points);
    return { ...s, interval: correlationInterval(s.r, s.n) };
  }, [points]);

  const trend = clipLine(-stats.slope, 1, -stats.intercept);
  const tone = stats.r >= 0 ? 'pos' : 'neg';

  return (
    <VizFrame
      title="Laboratorio de correlación"
      subtitle="Pearson en tiempo real"
      actions={<Button onClick={() => setVersion((value) => value + 1)}>Nueva muestra</Button>}
    >
      <VizBody
        plot={
          <Plot
            overlay={<>r = {fmt(stats.r, 3)} · {strengthOf(stats.r)}</>}
            caption={<><span>X (reescalada)</span><span>Y (reescalada)</span></>}
          >
            <PlotSvg label={`Diagrama de dispersión de ${n} puntos con r igual a ${fmt(stats.r, 2)}`}>
              {trend && (
                <line className={v.lineDashed} x1={trend[0].x} y1={flipY(trend[0].y)} x2={trend[1].x} y2={flipY(trend[1].y)} />
              )}
              {points.map((p) => (
                <circle key={`${version}-${p.id}`} className={`${v.markIn} ${stats.r >= 0 ? v.markPos : v.markNeg}`} cx={p.x} cy={flipY(p.y)} r={1.5} style={{ animationDelay: `${Math.min(p.id * 0.008, 0.5)}s` }} />
              ))}
            </PlotSvg>
          </Plot>
        }
        side={
          <>
            <Panel title="Ajustes">
              <Slider label="Correlación poblacional ρ" value={rho} min={-0.95} max={0.95} step={0.05} onChange={setRho} format={(x) => fmt(x, 2)} tone="pos" />
              <Slider label="Tamaño de muestra n" value={n} min={12} max={120} step={2} onChange={setN} tone="c3" hint="Con n pequeño, r fluctúa mucho alrededor de ρ." />
            </Panel>
            <Callout eyebrow="Lectura" title={stats.r > 0.05 ? 'Relación positiva' : stats.r < -0.05 ? 'Relación negativa' : 'Sin relación lineal'} tone={tone}>
              r = {fmt(stats.r, 3)}; r² = {fmt(stats.r ** 2, 3)}, es decir, la recta explica {fmt(stats.r ** 2 * 100, 1)}% de la varianza de Y.
            </Callout>
            <StatGrid>
              <Stat label="r observado" value={fmt(stats.r, 3)} tone={tone} />
              <Stat label="IC 95% (Fisher)" value={`[${fmt(clamp(stats.interval[0], -1, 1), 2)}, ${fmt(clamp(stats.interval[1], -1, 1), 2)}]`} />
              <Stat label="Pendiente" value={fmt(stats.slope, 3)} />
            </StatGrid>
            <Legend items={[{ kind: 'pos', label: 'r ≥ 0' }, { kind: 'neg', label: 'r < 0' }, { kind: 'dash', label: 'Recta de mínimos cuadrados' }]} />
            <Notes items={[
              'Lleva ρ a ±0.95 y la nube se estrecha sobre la recta.',
              'Baja n: el IC se ensancha y r se aleja de ρ.',
              'r mide solo relación lineal; no implica causalidad.',
            ]} />
          </>
        }
      />
    </VizFrame>
  );
};

export default CorrelationVisualizer;
