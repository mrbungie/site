import { useMemo, useState } from 'react';
import { clamp, clipLine, correlationInterval, createRng, fmt, gaussian, linearStats } from './shared/math';
import { common, type Lang } from './shared/i18n';
import { Button, Callout, Legend, Notes, Panel, Plot, PlotSvg, Slider, Stat, StatGrid, VizBody, VizFrame, flipY, vizStyles as v } from './shared/ui';

const T = {
  es: {
    strengths: ['muy fuerte', 'moderada', 'débil', 'casi nula'],
    title: 'Laboratorio de correlación',
    subtitle: 'Pearson en tiempo real',
    xCaption: 'X (reescalada)',
    yCaption: 'Y (reescalada)',
    plotLabel: (n: number, r: string) => `Diagrama de dispersión de ${n} puntos con r igual a ${r}`,
    rho: 'Correlación poblacional ρ',
    sampleSize: 'Tamaño de muestra n',
    sampleHint: 'Con n pequeño, r fluctúa mucho alrededor de ρ.',
    positive: 'Relación positiva',
    negative: 'Relación negativa',
    none: 'Sin relación lineal',
    explained: (r2: string, pct: string) => `r² = ${r2}, es decir, la recta explica ${pct}% de la varianza de Y.`,
    observed: 'r observado',
    ci: 'IC 95% (Fisher)',
    slope: 'Pendiente',
    ols: 'Recta de mínimos cuadrados',
    notes: [
      'Lleva ρ a ±0.95 y la nube se estrecha sobre la recta.',
      'Baja n: el IC se ensancha y r se aleja de ρ.',
      'r mide solo relación lineal; no implica causalidad.',
    ],
  },
  en: {
    strengths: ['very strong', 'moderate', 'weak', 'almost none'],
    title: 'Correlation lab',
    subtitle: 'Pearson in real time',
    xCaption: 'X (rescaled)',
    yCaption: 'Y (rescaled)',
    plotLabel: (n: number, r: string) => `Scatter plot of ${n} points with r equal to ${r}`,
    rho: 'Population correlation ρ',
    sampleSize: 'Sample size n',
    sampleHint: 'With small n, r fluctuates a lot around ρ.',
    positive: 'Positive relationship',
    negative: 'Negative relationship',
    none: 'No linear relationship',
    explained: (r2: string, pct: string) => `r² = ${r2}, i.e. the line explains ${pct}% of the variance of Y.`,
    observed: 'Observed r',
    ci: '95% CI (Fisher)',
    slope: 'Slope',
    ols: 'Least-squares line',
    notes: [
      'Push ρ to ±0.95 and the cloud tightens around the line.',
      'Lower n: the CI widens and r drifts away from ρ.',
      'r only measures linear association; it does not imply causation.',
    ],
  },
} as const;

const strengthOf = (r: number, words: readonly string[]) => {
  const a = Math.abs(r);
  return a > 0.8 ? words[0] : a > 0.55 ? words[1] : a > 0.25 ? words[2] : words[3];
};

const CorrelationVisualizer = ({ lang = 'es' }: { lang?: Lang }) => {
  const t = T[lang];
  const c = common[lang];
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
      title={t.title}
      subtitle={t.subtitle}
      actions={<Button onClick={() => setVersion((value) => value + 1)}>{c.newSample}</Button>}
    >
      <VizBody
        plot={
          <Plot
            overlay={<>r = {fmt(stats.r, 3)} · {strengthOf(stats.r, t.strengths)}</>}
            caption={<><span>{t.xCaption}</span><span>{t.yCaption}</span></>}
          >
            <PlotSvg label={t.plotLabel(n, fmt(stats.r, 2))}>
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
            <Panel title={c.settings}>
              <Slider label={t.rho} value={rho} min={-0.95} max={0.95} step={0.05} onChange={setRho} format={(x) => fmt(x, 2)} tone="pos" />
              <Slider label={t.sampleSize} value={n} min={12} max={120} step={2} onChange={setN} tone="c3" hint={t.sampleHint} />
            </Panel>
            <Callout eyebrow={c.reading} title={stats.r > 0.05 ? t.positive : stats.r < -0.05 ? t.negative : t.none} tone={tone}>
              r = {fmt(stats.r, 3)}; {t.explained(fmt(stats.r ** 2, 3), fmt(stats.r ** 2 * 100, 1))}
            </Callout>
            <StatGrid>
              <Stat label={t.observed} value={fmt(stats.r, 3)} tone={tone} />
              <Stat label={t.ci} value={`[${fmt(clamp(stats.interval[0], -1, 1), 2)}, ${fmt(clamp(stats.interval[1], -1, 1), 2)}]`} />
              <Stat label={t.slope} value={fmt(stats.slope, 3)} />
            </StatGrid>
            <Legend items={[{ kind: 'pos', label: 'r ≥ 0' }, { kind: 'neg', label: 'r < 0' }, { kind: 'dash', label: t.ols }]} lang={lang} />
            <Notes items={[...t.notes]} lang={lang} />
          </>
        }
      />
    </VizFrame>
  );
};

export default CorrelationVisualizer;
