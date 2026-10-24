import { useMemo, useRef, useState } from 'react';
import { FEATURE_NAMES, buildTree, decisionPath, isLeaf, leaves, predictProbability, type TreeNode } from './shared/cart';
import { creditSample } from './shared/datasets';
import { fmt, pct } from './shared/math';
import {
  Button, Callout, Legend, Mark, Notes, Panel, Plot, PlotSvg, QueryHandle, Slider, Stat, StatGrid, VizBody, VizFrame, cx, flipY, vizStyles as v,
} from './shared/ui';
import styles from './DecisionTreeVisualizer.module.css';

const label = (node: TreeNode) => (node.n1 * 2 >= node.n ? 'Aprobado' : 'Rechazado');

const Outline = ({ node, active }: { node: TreeNode; active: Set<number> }) => {
  const on = active.has(node.id);
  if (isLeaf(node)) {
    const positive = node.n1 * 2 >= node.n;
    return (
      <li>
        <span className={cx(styles.node, on && styles.active)} aria-current={on ? 'true' : undefined}>
          <span className={positive ? styles.leafPos : styles.leafNeg}>{label(node)}</span>
          <span className={styles.meta}>{node.n1}/{node.n} aprobados · gini {fmt(node.gini, 2)}</span>
        </span>
      </li>
    );
  }
  return (
    <li>
      <span className={cx(styles.node, on && styles.active)} aria-current={on ? 'true' : undefined}>
        <span className={styles.rule}>{FEATURE_NAMES[node.feature!]} ≤ {fmt(node.threshold!, 1)}</span>
        <span className={styles.meta}>n={node.n} · gini {fmt(node.gini, 2)}</span>
      </span>
      <ul>
        <Outline node={node.left!} active={active} />
        <Outline node={node.right!} active={active} />
      </ul>
    </li>
  );
};

const DecisionTreeVisualizer = () => {
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
      title="Laboratorio de árboles de decisión"
      subtitle="Cortes, impureza y hojas (CART)"
      actions={<Button onClick={() => setVersion((n) => n + 1)}>Nueva muestra</Button>}
    >
      <VizBody
        plot={
          <Plot caption={<><span>X: ingreso</span><span>Y: deuda / ingreso</span></>}>
            <PlotSvg svgRef={svgRef} label={`Particiones del árbol de profundidad ${depth} sobre ingreso y deuda`}>
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
              <QueryHandle x={query.x} y={query.y} svgRef={svgRef} label="Cliente a evaluar" onMove={(x, y) => setQuery({ x, y })} />
            </PlotSvg>
          </Plot>
        }
        side={
          <>
            <Panel title="Hiperparámetros">
              <Slider label="Profundidad máxima" value={depth} min={1} max={7} step={1} onChange={setDepth} tone="c3" hint="Más profundidad ajusta mejor el entrenamiento, pero puede sobreajustar." />
              <Slider label="Mínimo por hoja" value={minLeaf} min={1} max={12} step={1} onChange={setMinLeaf} tone="c4" />
            </Panel>
            <Callout eyebrow="Ruta del cliente" title={approved ? 'Aprobado' : 'Rechazado'} tone={approved ? 'pos' : 'neg'}>
              Hoja con {leaf.n1} de {leaf.n} aprobados (P = {fmt(leaf.n ? leaf.n1 / leaf.n : 0.5, 2)}), a profundidad {leaf.depth}.
            </Callout>
            <StatGrid>
              <Stat label="Exactitud train" value={pct(accuracy.train)} tone="c3" />
              <Stat label="Exactitud prueba" value={pct(accuracy.test)} tone="c4" />
              <Stat label="Hojas" value={regions.length} />
            </StatGrid>
            <Panel title="Árbol aprendido">
              <ul className={styles.outline}>
                <Outline node={tree} active={active} />
              </ul>
            </Panel>
            <Legend items={[{ kind: 'pos', label: 'Aprobado' }, { kind: 'neg', label: 'Rechazado' }, { kind: 'line', label: 'Ruta activa', tone: 'ink' }]} />
            <Notes items={[
              'Cada corte minimiza la impureza de Gini ponderada de los dos hijos.',
              'Sube la profundidad: la exactitud de entrenamiento sube, la de prueba se estanca o baja.',
              'Mueve al cliente cerca de un umbral y mira cómo cambia la hoja.',
            ]} />
          </>
        }
      />
    </VizFrame>
  );
};

export default DecisionTreeVisualizer;
