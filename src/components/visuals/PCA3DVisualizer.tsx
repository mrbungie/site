import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Grid, Html, Line, OrbitControls, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useInView, usePrefersReducedMotion, useVizPalette, type Palette } from './shared/hooks';
import { covariance3, eigenSymmetric3, type Vec3 } from './shared/linalg';
import { createRng, fmt, pct } from './shared/math';
import { Button, Callout, Meter, Notes, Panel, Plot, VizBody, VizFrame, vizStyles as v } from './shared/ui';
import styles from './PCA3DVisualizer.module.css';

const SEED = 20260402;
const POINT_COUNT = 150;

interface Basis {
  mean: Vec3;
  pcs: [Vec3, Vec3, Vec3];
  eigenvalues: Vec3;
}

const dot3 = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm3 = (a: Vec3): Vec3 => {
  const l = Math.hypot(...a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const cross3 = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** Synthetic cloud: wide along one oblique axis, medium along a second, thin along the third. */
const makeCloud = (): Vec3[] => {
  const random = createRng(SEED);
  const e1 = norm3([1, 0.55, 0.18]);
  const raw2: Vec3 = [-0.45, 1, 0.12];
  const proj = dot3(raw2, e1);
  const e2 = norm3([raw2[0] - proj * e1[0], raw2[1] - proj * e1[1], raw2[2] - proj * e1[2]]);
  const e3 = norm3(cross3(e1, e2));
  return Array.from({ length: POINT_COUNT }, () => {
    const a = (random() - 0.5) * 6.5;
    const b = (random() - 0.5) * 3.2;
    const c = (random() - 0.5) * 0.8;
    return [0, 1, 2].map((k) => a * e1[k] + b * e2[k] + c * e3[k]) as Vec3;
  });
};

const computeBasis = (points: Vec3[]): Basis => {
  const { mean, cov } = covariance3(points);
  const { values, vectors } = eigenSymmetric3(cov);
  return { mean, pcs: [vectors[0], vectors[1], vectors[2]], eigenvalues: values };
};

/* ── Scene ── */

const damp = (current: number, target: number, rate: number, dt: number) => current + (target - current) * (1 - Math.exp(-rate * dt));

const Scene = ({
  basis, points, projected, rotate, coarse, reduced, palette,
}: {
  basis: Basis;
  points: Vec3[];
  projected: boolean;
  rotate: boolean;
  coarse: boolean;
  reduced: boolean;
  palette: Palette;
}) => {
  const progress = useRef(0);
  const pc3Group = useRef<THREE.Group>(null);
  const attribute = useRef<THREE.BufferAttribute>(null);
  const sceneGroup = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const { original, flat } = useMemo(() => {
    const original = new Float32Array(points.length * 3);
    const flat = new Float32Array(points.length * 3);
    const [p1, p2] = basis.pcs;
    points.forEach((p, i) => {
      const c: Vec3 = [p[0] - basis.mean[0], p[1] - basis.mean[1], p[2] - basis.mean[2]];
      const s1 = dot3(c, p1);
      const s2 = dot3(c, p2);
      for (let k = 0; k < 3; k += 1) {
        original[i * 3 + k] = p[k];
        flat[i * 3 + k] = basis.mean[k] + s1 * p1[k] + s2 * p2[k];
      }
    });
    return { original, flat };
  }, [basis, points]);

  const positions = useMemo(() => new Float32Array(original), [original]);

  const targets = useMemo(() => {
    const [p1, p2, p3] = basis.pcs.map((p) => new THREE.Vector3(...p));
    return {
      free: { pos: p3.clone().multiplyScalar(15.2).addScaledVector(p1, 3.2).addScaledVector(p2, 0.4), up: new THREE.Vector3(0, 1, 0).lerp(p2, 0.4).normalize(), fov: 34 },
      flat: { pos: p3.clone().multiplyScalar(18.5), up: p2.clone(), fov: 26 },
    };
  }, [basis]);
  const scratch = useMemo(() => ({ pos: new THREE.Vector3(), up: new THREE.Vector3() }), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const target = projected ? 1 : 0;
    const settled = Math.abs(progress.current - target) < 0.0005;
    if (settled && progress.current === target) return;
    progress.current = reduced || settled ? target : damp(progress.current, target, 4.5, dt);
    const t = progress.current;

    for (let i = 0; i < positions.length; i += 1) positions[i] = original[i] + (flat[i] - original[i]) * t;
    if (attribute.current) attribute.current.needsUpdate = true;
    if (pc3Group.current) pc3Group.current.visible = t < 0.5;
    if (sceneGroup.current) sceneGroup.current.position.y = (1 - t) * -1;

    // Only steer the camera while a transition is running so OrbitControls stays free afterwards.
    const from = targets.free;
    const to = targets.flat;
    camera.position.copy(scratch.pos.lerpVectors(from.pos, to.pos, t));
    camera.up.copy(scratch.up.lerpVectors(from.up, to.up, t).normalize());
    camera.lookAt(0, 0, 0);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = from.fov + (to.fov - from.fov) * t;
      camera.updateProjectionMatrix();
    }
  });

  const axes: { vector: Vec3; scale: number; color: string; className: string; name: string; dashed?: boolean }[] = [
    { vector: basis.pcs[0], scale: Math.sqrt(basis.eigenvalues[0]) * 2.5, color: palette.c5, className: styles.pc1, name: 'PC1' },
    { vector: basis.pcs[1], scale: Math.sqrt(basis.eigenvalues[1]) * 2.5, color: palette.pos, className: styles.pc2, name: 'PC2' },
  ];
  const pc3 = basis.pcs[2];
  const s3 = Math.sqrt(basis.eigenvalues[2]) * 2.5;

  return (
    <>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={!coarse}
        enableRotate={!projected}
        autoRotate={rotate && !projected && !reduced}
        autoRotateSpeed={0.65}
        minDistance={6}
        maxDistance={30}
      />
      <group ref={sceneGroup} position={[0, -1, 0]}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute ref={attribute} attach="attributes-position" args={[positions, 3]} count={points.length} itemSize={3} />
          </bufferGeometry>
          <PointMaterial transparent color={palette.c3} size={0.2} sizeAttenuation depthWrite={false} opacity={0.9} />
        </points>
        <group position={basis.mean}>
          {axes.map(({ vector, scale, color, className, name }) => (
            <group key={name}>
              <Line points={[[0, 0, 0], [vector[0] * scale, vector[1] * scale, vector[2] * scale]]} color={color} lineWidth={3} />
              <Html position={[vector[0] * scale * 1.12, vector[1] * scale * 1.12, vector[2] * scale * 1.12]} center zIndexRange={[5, 0]}>
                <span className={`${styles.label} ${className}`}>{name}</span>
              </Html>
            </group>
          ))}
          <group ref={pc3Group}>
            <Line points={[[0, 0, 0], [pc3[0] * s3 * 3, pc3[1] * s3 * 3, pc3[2] * s3 * 3]]} color={palette.neg} lineWidth={1.5} dashed dashSize={0.15} gapSize={0.1} />
            <Html position={[pc3[0] * s3 * 3.4, pc3[1] * s3 * 3.4, pc3[2] * s3 * 3.4]} center zIndexRange={[5, 0]}>
              <span className={`${styles.label} ${styles.pc3}`}>PC3</span>
            </Html>
          </group>
        </group>
      </group>
      <Grid position={[0, -2.6, 0]} infiniteGrid fadeDistance={24} cellSize={0.5} sectionSize={2} cellColor={palette.rule} sectionColor={palette.muted} cellThickness={0.6} />
    </>
  );
};

/* ── Component ── */

const PCA3DVisualizer = () => {
  const [projected, setProjected] = useState(false);
  const [rotate, setRotate] = useState(true);
  const [coarse, setCoarse] = useState(false);
  const frameRef = useRef<HTMLElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const palette = useVizPalette(frameRef);
  const reduced = usePrefersReducedMotion();
  const visible = useInView(canvasHost);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const query = window.matchMedia('(pointer: coarse)');
    const update = () => setCoarse(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const points = useMemo(makeCloud, []);
  const basis = useMemo(() => computeBasis(points), [points]);
  const total = basis.eigenvalues.reduce((a, b) => a + b, 0) || 1;
  const ratios = basis.eigenvalues.map((value) => value / total);
  const retained = ratios[0] + ratios[1];

  return (
    <VizFrame
      title="Visualizador PCA"
      subtitle="De tres dimensiones a dos"
      frameRef={frameRef}
      actions={
        <>
          <Button primary onClick={() => setProjected((p) => !p)}>{projected ? 'Restaurar vista 3D' : 'Proyectar a 2D'}</Button>
          <Button pressed={rotate} onClick={() => setRotate((r) => !r)} disabled={projected}>Giro automático</Button>
        </>
      }
    >
      <VizBody
        plot={
          <Plot wide caption={<><span>{coarse ? 'Desliza horizontalmente para girar' : 'Arrastra para girar, rueda para acercar'}</span><span>150 puntos</span></>}>
            <div
              ref={canvasHost}
              className={styles.canvasFill}
              style={{ touchAction: coarse ? 'pan-y' : 'none' }}
              role="img"
              aria-label={`Nube de 150 puntos en 3D con sus tres componentes principales. PC1 y PC2 conservan ${pct(retained)} de la varianza.`}
            >
              {mounted && visible ? (
                <Canvas dpr={[1, 2]} frameloop="always" camera={{ position: [5.5, 3.8, 5.5], fov: 34 }} gl={{ antialias: true, alpha: true }} style={{ touchAction: 'inherit' }}>
                  <Scene basis={basis} points={points} projected={projected} rotate={rotate} coarse={coarse} reduced={reduced} palette={palette} />
                </Canvas>
              ) : (
                <div className={styles.placeholder}>Cargando escena 3D…</div>
              )}
            </div>
          </Plot>
        }
        side={
          <>
            <Callout eyebrow={projected ? 'Vista proyectada' : 'Vista completa'} title={`${pct(retained)} de varianza`} tone="c3">
              {projected
                ? `Al descartar PC3 solo se pierde ${pct(ratios[2])} de la variación total.`
                : 'PC1 y PC2 capturan casi toda la variación; PC3 es la dirección residual.'}
            </Callout>
            <Panel title="Varianza explicada">
              {['PC1', 'PC2', 'PC3'].map((name, i) => (
                <div key={name} className={styles.scree}>
                  <span>{name}</span>
                  <Meter value={ratios[i]} tone={i === 0 ? 'c5' : i === 1 ? 'pos' : 'neg'} label={`Varianza explicada por ${name}`} />
                  <output>{pct(ratios[i])}</output>
                </div>
              ))}
              <p className={v.hint}>Autovalores de la covarianza: {basis.eigenvalues.map((e) => fmt(e, 2)).join(' · ')}</p>
            </Panel>
            <Notes items={[
              'Los componentes son los autovectores de la matriz de covarianza, ordenados por autovalor.',
              'Proyectar es quedarse con las coordenadas sobre PC1 y PC2 y olvidar PC3.',
              'Si el último autovalor es pequeño, se pierde poca información.',
            ]} />
          </>
        }
      />
    </VizFrame>
  );
};

export default PCA3DVisualizer;
