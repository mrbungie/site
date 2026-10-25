import { useMemo, useRef, useState } from 'react';
import { buildTree, decisionPath, isLeaf, leaves, predictProbability, type TreeNode } from './shared/cart';
import { creditSample } from './shared/datasets';
import { common, type Lang } from './shared/i18n';
import { fmt, pct } from './shared/math';
import {
  Button, Callout, Legend, Mark, Notes, Panel, Plot, PlotSvg, QueryHandle, Slider, Stat, StatGrid, VizBody, VizFrame, cx, flipY, vizStyles as v,
} from './shared/ui';
import styles from './DecisionTreeVisualizer.module.css';

const T = {
  es: {
    approved: 'Aprobado',
    rejected: 'Rechazado',
    features: ['Ingreso', 'Deuda'],
    leafMeta: (n1: number, n: number, gini: string) => `${n1}/${n} aprobados · gini ${gini}`,
    title: 'Laboratorio de árboles de decisión',
    subtitle: 'Cortes, impureza y hojas (CART)',
    xCaption: 'X: ingreso',
    yCaption: 'Y: deuda / ingreso',
    plotLabel: (depth: number) => `Particiones del árbol de profundidad ${depth} sobre ingreso y deuda`,
    queryLabel: 'Cliente a evaluar',
    hyper: 'Hiperparámetros',
    maxDepth: 'Profundidad máxima',
    depthHint: 'Más profundidad ajusta mejor el entrenamiento, pero puede sobreajustar.',
    minLeaf: 'Mínimo por hoja',
    path: 'Ruta del cliente',
    leafText: (n1: number, n: number, p: string, depth: number) => `Hoja con ${n1} de ${n} aprobados (P = ${p}), a profundidad ${depth}.`,
    accTrain: 'Exactitud train',
    accTest: 'Exactitud prueba',
    leaves: 'Hojas',
    learned: 'Árbol aprendido',
    activePath: 'Ruta activa',
    notes: [
      'Cada corte minimiza la impureza de Gini ponderada de los dos hijos.',
      'Sube la profundidad: la exactitud de entrenamiento sube, la de prueba se estanca o baja.',
      'Mueve al cliente cerca de un umbral y mira cómo cambia la hoja.',
    ],
  },
  en: {
    approved: 'Approved',
    rejected: 'Rejected',
    features: ['Income', 'Debt'],
    leafMeta: (n1: number, n: number, gini: string) => `${n1}/${n} approved · gini ${gini}`,
    title: 'Decision tree lab',
    subtitle: 'Splits, impurity and leaves (CART)',
    xCaption: 'X: income',
    yCaption: 'Y: debt / income',
    plotLabel: (depth: number) => `Partitions of a depth-${depth} tree over income and debt`,
    queryLabel: 'Customer to evaluate',
    hyper: 'Hyperparameters',
    maxDepth: 'Max depth',
    depthHint: 'More depth fits the training data better, but can overfit.',
    minLeaf: 'Min samples per leaf',
    path: 'Customer path',
    leafText: (n1: number, n: number, p: string, depth: number) => `Leaf with ${n1} of ${n} approved (P = ${p}), at depth ${depth}.`,
    accTrain: 'Train accuracy',
    accTest: 'Test accuracy',
    leaves: 'Leaves',
    learned: 'Learned tree',
    activePath: 'Active path',
    notes: [
      'Each split minimizes the weighted Gini impurity of the two children.',
      'Increase depth: training accuracy goes up, test accuracy plateaus or drops.',
      'Move the customer near a threshold and watch how the leaf changes.',
    ],
  },
} as const;

const Outline = ({ node, active, lang }: { node: TreeNode; active: Set<number>; lang: Lang }) => {
  const t = T[lang];
  const on = active.has(node.id);
  if (isLeaf(node)) {
    const positive = node.n1 * 2 >= node.n;
    return (
      <li>
        <span className={cx(styles.node, on && styles.active)} aria-current={on ? 'true' : undefined}>
          <span className={positive ? styles.leafPos : styles.leafNeg}>{node.n1 * 2 >= node.n ? t.approved : t.rejected}</span>
          <span className={styles.meta}>{t.leafMeta(node.n1, node.n, fmt(node.gini, 2))}</span>
        </span>
      </li>
    );
  }
  return (
    <li>
      <span className={cx(styles.node, on && styles.active)} aria-current={on ? 'true' : undefined}>
        <span className={styles.rule}>{t.features[node.feature!]} ≤ {fmt(node.threshold!, 1)}</span>
        <span className={styles.meta}>n={node.n} · gini {fmt(node.gini, 2)}</span>
      </span>
      <ul>
        <Outline node={node.left!} active={active} lang={lang} />
        <Outline node={node.right!} active={active} lang={lang} />
      </ul>
    </li>
  );
};

const DecisionTreeVisualizer = ({ lang = 'es' }: { lang?: Lang }) => {
  const t = T[lang];
  const c = common[lang];
  const [version, setVersion] = useState(0);
  const [depth, setDepth] = useState(3);
  const [minLeaf, setMinLeaf] = useState(3);
  const [query, setQuery] = useState({ x: 60, y: 30 });
  const svgRef = useRef<SVGSVGElement>(null);

  const train = useMemo(() => creditSample(90, 500 + version), [version]);
  const test = useMemo(() => creditSample(400, 9000 + version), [version]);
  const tree = useMemo(() => buildTree(train, { maxDepth: depth, minLeaf }), [depth, minLeaf, train]);
  const regions = useMemo(() => leaves(tree), [tree]);

  const accuracy = useMemo(() => {
    const score = (data: typeof train) =>
      data.filter((p) => (predictProbability(tree, p.x, p.y) >= 0.5 ? 1 : 0) === p.label).length / data.length;
    return { train: score(train), test: score(test) };
  }, [test, train, tree]);

  const path = useMemo(() => decisionPath(tree, query.x, query.y), [query, tree]);
  const active = useMemo(() => new Set(path.map((n) => n.id)), [path]);
  const leaf = path.at(-1)!;
  const approved = leaf.n1 * 2 >= leaf.n;

  return (
    <VizFrame
      title={t.title}
      subtitle={t.subtitle}
      actions={<Button onClick={() => setVersion((n) => n + 1)}>{c.newSample}</Button>}
    >
      <VizBody
        plot={
          <Plot caption={<><span>{t.xCaption}</span><span>{t.yCaption}</span></>}>
            <PlotSvg svgRef={svgRef} label={t.plotLabel(depth)}>
              {regions.map((r) => {
                const p = r.n ? r.n1 / r.n : 0.5;
                const b = r.bounds;
                return (
                  <rect
                    key={r.id}
                    className={p >= 0.5 ? v.markPos : v.markNeg}
                    style={{ opacity: 0.07 + 0.28 * Math.abs(2 * p - 1) }}
                    x={b.x0}
                    y={flipY(b.y1)}
                    width={b.x1 - b.x0}
                    height={b.y1 - b.y0}
                  />
                );
              })}
              {regions.map((r) => (
                <rect key={`b${r.id}`} className={cx(styles.splitLine, active.has(r.id) && styles.activeRect)} fill="none" x={r.bounds.x0} y={flipY(r.bounds.y1)} width={r.bounds.x1 - r.bounds.x0} height={r.bounds.y1 - r.bounds.y0} />
              ))}
              {train.map((p) => (
                <Mark key={`${version}-${p.id}`} x={p.x} y={p.y} label={p.label} size={1.35} delay={p.id * 0.004} />
              ))}
              <QueryHandle x={query.x} y={query.y} svgRef={svgRef} label={t.queryLabel} lang={lang} onMove={(x, y) => setQuery({ x, y })} />
            </PlotSvg>
          </Plot>
        }
        side={
          <>
            <Panel title={t.hyper}>
              <Slider label={t.maxDepth} value={depth} min={1} max={7} step={1} onChange={setDepth} tone="c3" hint={t.depthHint} />
              <Slider label={t.minLeaf} value={minLeaf} min={1} max={12} step={1} onChange={setMinLeaf} tone="c4" />
            </Panel>
            <Callout eyebrow={t.path} title={approved ? t.approved : t.rejected} tone={approved ? 'pos' : 'neg'}>
              {t.leafText(leaf.n1, leaf.n, fmt(leaf.n ? leaf.n1 / leaf.n : 0.5, 2), leaf.depth)}
            </Callout>
            <StatGrid>
              <Stat label={t.accTrain} value={pct(accuracy.train)} tone="c3" />
              <Stat label={t.accTest} value={pct(accuracy.test)} tone="c4" />
              <Stat label={t.leaves} value={regions.length} />
            </StatGrid>
            <Panel title={t.learned}>
              <ul className={styles.outline}>
                <Outline node={tree} active={active} lang={lang} />
              </ul>
            </Panel>
            <Legend items={[{ kind: 'pos', label: t.approved }, { kind: 'neg', label: t.rejected }, { kind: 'line', label: t.activePath, tone: 'ink' }]} lang={lang} />
            <Notes items={[...t.notes]} lang={lang} />
          </>
        }
      />
    </VizFrame>
  );
};

export default DecisionTreeVisualizer;
