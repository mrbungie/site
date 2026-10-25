import { useMemo, useRef, useState } from 'react';
import { bootstrap, buildTree, predictProbability, type TreeNode } from './shared/cart';
import { creditSample } from './shared/datasets';
import { common, type Lang } from './shared/i18n';
import { createRng, pct } from './shared/math';
import {
  Button, Callout, Legend, Mark, Meter, Notes, Panel, Plot, PlotSvg, QueryHandle, Slider, Stat, StatGrid, VizBody, VizFrame, flipY, vizStyles as v,
} from './shared/ui';
import styles from './RandomForestVisualizer.module.css';

const GRID = 28;
const forestProbability = (forest: TreeNode[], x: number, y: number) =>
  forest.reduce((sum, tree) => sum + (predictProbability(tree, x, y) >= 0.5 ? 1 : 0), 0) / forest.length;

const T = {
  es: {
    title: 'Laboratorio Random Forest',
    subtitle: 'Bagging y votación de árboles',
    xCaption: 'X: ingreso',
    yCaption: 'Y: deuda / ingreso',
    plotLabel: (n: number) => `Probabilidad de aprobación del bosque de ${n} árboles`,
    queryLabel: 'Cliente a evaluar',
    ensemble: 'Ensamble',
    treeCount: 'Número de árboles',
    maxDepth: 'Profundidad máxima',
    voting: 'Votación',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    votesText: (pos: number, total: number, share: string) => `${pos} de ${total} árboles votan “aprobado” (${share}).`,
    eachVote: 'Voto de cada árbol',
    individual: 'Votos individuales',
    treeTitle: (i: number, vote: boolean) => `Árbol ${i}: ${vote ? 'aprobado' : 'rechazado'}`,
    shareLabel: 'Proporción de votos a favor',
    single: 'Árbol único (prueba)',
    forest: (n: number) => `Bosque (${n})`,
    notes: [
      'Cada árbol entrena con una muestra bootstrap y un solo atributo candidato por corte.',
      'Un árbol único tiene una frontera escalonada; promediar muchos árboles la suaviza y reduce la varianza.',
      'La exactitud se mide en 400 casos nuevos que ningún árbol vio.',
    ],
  },
  en: {
    title: 'Random forest lab',
    subtitle: 'Bagging and tree voting',
    xCaption: 'X: income',
    yCaption: 'Y: debt / income',
    plotLabel: (n: number) => `Approval probability of the ${n}-tree forest`,
    queryLabel: 'Customer to evaluate',
    ensemble: 'Ensemble',
    treeCount: 'Number of trees',
    maxDepth: 'Max depth',
    voting: 'Voting',
    approved: 'Approved',
    rejected: 'Rejected',
    votesText: (pos: number, total: number, share: string) => `${pos} of ${total} trees vote “approved” (${share}).`,
    eachVote: 'Each tree’s vote',
    individual: 'Individual votes',
    treeTitle: (i: number, vote: boolean) => `Tree ${i}: ${vote ? 'approved' : 'rejected'}`,
    shareLabel: 'Share of votes in favor',
    single: 'Single tree (test)',
    forest: (n: number) => `Forest (${n})`,
    notes: [
      'Each tree trains on a bootstrap sample and a single candidate feature per split.',
      'A single tree has a staircase boundary; averaging many trees smooths it and reduces variance.',
      'Accuracy is measured on 400 new cases that no tree has seen.',
    ],
  },
} as const;

const RandomForestVisualizer = ({ lang = 'es' }: { lang?: Lang }) => {
  const t = T[lang];
  const c = common[lang];
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
      title={t.title}
      subtitle={t.subtitle}
      actions={<Button onClick={() => setVersion((n) => n + 1)}>{c.newSample}</Button>}
    >
      <VizBody
        plot={
          <Plot caption={<><span>{t.xCaption}</span><span>{t.yCaption}</span></>}>
            <PlotSvg svgRef={svgRef} label={t.plotLabel(treeCount)}>
              {cells.map((c) => (
                <rect key={`${c.x}-${c.y}`} className={c.p >= 0.5 ? v.markPos : v.markNeg} style={{ opacity: 0.06 + 0.3 * Math.abs(2 * c.p - 1) }} x={c.x} y={flipY(c.y + c.size)} width={c.size + 0.05} height={c.size + 0.05} />
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
            <Panel title={t.ensemble}>
              <Slider label={t.treeCount} value={treeCount} min={1} max={40} step={1} onChange={setTreeCount} tone="pos" />
              <Slider label={t.maxDepth} value={depth} min={1} max={7} step={1} onChange={setDepth} tone="c3" />
            </Panel>
            <Callout eyebrow={t.voting} title={approved ? t.approved : t.rejected} tone={approved ? 'pos' : 'neg'}>
              {t.votesText(positives, votes.length, pct(share, 0))}
            </Callout>
            <Panel title={t.eachVote}>
              <ul className={styles.votes} aria-label={t.individual}>
                {votes.map((vote, i) => (
                  <li key={i} className={`${styles.vote} ${vote ? styles.votePos : styles.voteNeg}`} title={t.treeTitle(i + 1, vote === 1)}>{vote ? '+' : '−'}</li>
                ))}
              </ul>
              <Meter value={share} tone="pos" label={t.shareLabel} />
            </Panel>
            <StatGrid>
              <Stat label={t.single} value={pct(accuracy.single)} tone="neg" />
              <Stat label={t.forest(treeCount)} value={pct(accuracy.forest)} tone="pos" />
            </StatGrid>
            <Legend items={[{ kind: 'pos', label: t.approved }, { kind: 'neg', label: t.rejected }]} lang={lang} />
            <Notes items={[...t.notes]} lang={lang} />
          </>
        }
      />
    </VizFrame>
  );
};

export default RandomForestVisualizer;
