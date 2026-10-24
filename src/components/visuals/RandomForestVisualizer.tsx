import { useMemo, useRef, useState } from 'react';
import { bootstrap, buildTree, predictProbability, type TreeNode } from './shared/cart';
import { creditSample } from './shared/datasets';
import { createRng, pct } from './shared/math';
import {
  Button, Callout, Legend, Mark, Meter, Notes, Panel, Plot, PlotSvg, QueryHandle, Slider, Stat, StatGrid, VizBody, VizFrame, flipY, vizStyles as v,
} from './shared/ui';
import styles from './RandomForestVisualizer.module.css';

const GRID = 28;
const forestProbability = (forest: TreeNode[], x: number, y: number) =>
  forest.reduce((sum, tree) => sum + (predictProbability(tree, x, y) >= 0.5 ? 1 : 0), 0) / forest.length;

const RandomForestVisualizer = () => {
  const [version, setVersion] = useState(0);
  const [treeCount, setTreeCount] = useState(15);
  const [depth, setDepth] = useState(4);
  const [query, setQuery] = useState({ x: 55, y: 40 });
  const svgRef = useRef<SVGSVGElement>(null);

  const train = useMemo(() => creditSample(90, 500 + version), [version]);
  const test = useMemo(() => creditSample(400, 9000 + version), [version]);

  // Bagging: every tree sees a bootstrap resample and one random feature candidate per split (mtry = 1).
  // Built once at the maximum size so the slider just takes a prefix (stable, comparable forests).
  const allTrees = useMemo(() => {
    const rng = createRng(77 + version);
    return Array.from({ length: 40 }, () => buildTree(bootstrap(train, rng), { maxDepth: depth, minLeaf: 2, maxFeatures: 1, rng }));
  }, [depth, train, version]);
  const forest = useMemo(() => allTrees.slice(0, treeCount), [allTrees, treeCount]);
  const single = useMemo(() => buildTree(train, { maxDepth: depth, minLeaf: 2 }), [depth, train]);

  const accuracy = useMemo(() => {
    const score = (predict: (x: number, y: number) => number) =>
      test.filter((p) => (predict(p.x, p.y) >= 0.5 ? 1 : 0) === p.label).length / test.length;
    return {
      single: score((x, y) => predictProbability(single, x, y)),
      forest: score((x, y) => forestProbability(forest, x, y)),
    };
  }, [forest, single, test]);

  const cells = useMemo(() => {
    const size = 100 / GRID;
    return Array.from({ length: GRID * GRID }, (_, i) => {
      const x = (i % GRID) * size;
      const y = Math.floor(i / GRID) * size;
      return { x, y, size, p: forestProbability(forest, x + size / 2, y + size / 2) };
    });
  }, [forest]);

  const votes = useMemo(() => forest.map((tree) => (predictProbability(tree, query.x, query.y) >= 0.5 ? 1 : 0)), [forest, query]);
  const positives = votes.reduce<number>((a, b) => a + b, 0);
  const share = positives / votes.length;
  const approved = share >= 0.5;

  return (
    <VizFrame
      title="Laboratorio Random Forest"
      subtitle="Bagging y votación de árboles"
      actions={<Button onClick={() => setVersion((n) => n + 1)}>Nueva muestra</Button>}
    >
      <VizBody
        plot={
          <Plot caption={<><span>X: ingreso</span><span>Y: deuda / ingreso</span></>}>
            <PlotSvg svgRef={svgRef} label={`Probabilidad de aprobación del bosque de ${treeCount} árboles`}>
              {cells.map((c) => (
                <rect key={`${c.x}-${c.y}`} className={c.p >= 0.5 ? v.markPos : v.markNeg} style={{ opacity: 0.06 + 0.3 * Math.abs(2 * c.p - 1) }} x={c.x} y={flipY(c.y + c.size)} width={c.size + 0.05} height={c.size + 0.05} />
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
            <Panel title="Ensamble">
              <Slider label="Número de árboles" value={treeCount} min={1} max={40} step={1} onChange={setTreeCount} tone="pos" />
              <Slider label="Profundidad máxima" value={depth} min={1} max={7} step={1} onChange={setDepth} tone="c3" />
            </Panel>
            <Callout eyebrow="Votación" title={approved ? 'Aprobado' : 'Rechazado'} tone={approved ? 'pos' : 'neg'}>
              {positives} de {votes.length} árboles votan “aprobado” ({pct(share, 0)}).
            </Callout>
            <Panel title="Voto de cada árbol">
              <ul className={styles.votes} aria-label="Votos individuales">
                {votes.map((vote, i) => (
                  <li key={i} className={`${styles.vote} ${vote ? styles.votePos : styles.voteNeg}`} title={`Árbol ${i + 1}: ${vote ? 'aprobado' : 'rechazado'}`}>{vote ? '+' : '−'}</li>
                ))}
              </ul>
              <Meter value={share} tone="pos" label="Proporción de votos a favor" />
            </Panel>
            <StatGrid>
              <Stat label="Árbol único (prueba)" value={pct(accuracy.single)} tone="neg" />
              <Stat label={`Bosque (${treeCount})`} value={pct(accuracy.forest)} tone="pos" />
            </StatGrid>
            <Legend items={[{ kind: 'pos', label: 'Aprobado' }, { kind: 'neg', label: 'Rechazado' }]} />
            <Notes items={[
              'Cada árbol entrena con una muestra bootstrap y un solo atributo candidato por corte.',
              'Un árbol único tiene una frontera escalonada; promediar muchos árboles la suaviza y reduce la varianza.',
              'La exactitud se mide en 400 casos nuevos que ningún árbol vio.',
            ]} />
          </>
        }
      />
    </VizFrame>
  );
};

export default RandomForestVisualizer;
