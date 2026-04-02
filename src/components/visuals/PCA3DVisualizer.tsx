import { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Grid, Line, OrbitControls, PointMaterial, Text } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, Layers, Play, Repeat, Rotate3d } from 'lucide-react';
import * as THREE from 'three';
import styles from './PCA3DVisualizer.module.css';

const CANVAS_HEIGHT = 'clamp(360px, 62vh, 580px)';
const PCA_SAMPLE_SEED = 20260402;
const MOBILE_BREAKPOINT = 640;

type Basis = {
  pc1: THREE.Vector3;
  pc2: THREE.Vector3;
  pc3: THREE.Vector3;
  eigenvalues: [number, number, number];
  mean: THREE.Vector3;
};

const dot = (a: THREE.Vector3, b: THREE.Vector3) => a.x * b.x + a.y * b.y + a.z * b.z;

const createSeededRandom = (seed: number) => {
  let value = seed % 2147483647;

  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const multiplyMatrixVector = (matrix: number[][], vector: THREE.Vector3) =>
  new THREE.Vector3(
    matrix[0][0] * vector.x + matrix[0][1] * vector.y + matrix[0][2] * vector.z,
    matrix[1][0] * vector.x + matrix[1][1] * vector.y + matrix[1][2] * vector.z,
    matrix[2][0] * vector.x + matrix[2][1] * vector.y + matrix[2][2] * vector.z,
  );

const powerIteration = (matrix: number[][], initial: THREE.Vector3, iterations = 60) => {
  let vector = initial.clone().normalize();

  for (let index = 0; index < iterations; index += 1) {
    const next = multiplyMatrixVector(matrix, vector);

    if (next.lengthSq() < 1e-12) {
      break;
    }

    const normalized = next.normalize();
    if (vector.distanceTo(normalized) < 1e-10 || vector.distanceTo(normalized.clone().negate()) < 1e-10) {
      vector = normalized;
      break;
    }
    vector = normalized;
  }

  const projection = multiplyMatrixVector(matrix, vector);
  const eigenvalue = dot(vector, projection);

  return { vector, eigenvalue };
};

const deflateMatrix = (matrix: number[][], eigenvalue: number, vector: THREE.Vector3) => {
  const components = [vector.x, vector.y, vector.z];
  return matrix.map((row, rowIndex) =>
    row.map((value, columnIndex) => value - eigenvalue * components[rowIndex] * components[columnIndex]),
  );
};

const computeBasis = (points: THREE.Vector3[]): Basis => {
  const mean = points
    .reduce((accumulator, point) => accumulator.add(point), new THREE.Vector3())
    .multiplyScalar(1 / points.length);

  const centered = points.map((point) => point.clone().sub(mean));
  const covariance = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  centered.forEach((point) => {
    covariance[0][0] += point.x * point.x;
    covariance[0][1] += point.x * point.y;
    covariance[0][2] += point.x * point.z;
    covariance[1][0] += point.y * point.x;
    covariance[1][1] += point.y * point.y;
    covariance[1][2] += point.y * point.z;
    covariance[2][0] += point.z * point.x;
    covariance[2][1] += point.z * point.y;
    covariance[2][2] += point.z * point.z;
  });

  const scaledCovariance = covariance.map((row) => row.map((value) => value / points.length));
  const first = powerIteration(scaledCovariance, new THREE.Vector3(1, 0.7, 0.3));
  const deflated = deflateMatrix(scaledCovariance, first.eigenvalue, first.vector);
  const second = powerIteration(deflated, new THREE.Vector3(-0.4, 1, 0.2));
  const pc3 = new THREE.Vector3().crossVectors(first.vector, second.vector).normalize();
  const thirdEigenvalue = Math.max(0, dot(pc3, multiplyMatrixVector(scaledCovariance, pc3)));

  return {
    pc1: first.vector,
    pc2: second.vector,
    pc3,
    eigenvalues: [first.eigenvalue, second.eigenvalue, thirdEigenvalue],
    mean,
  };
};

const CameraRig = ({ basis, projected, progress }: { basis: Basis; projected: boolean; progress: number }) => {
  const { camera } = useThree();

  useFrame(() => {
    const target = projected ? 1 : 0;
    const isTransitioning = Math.abs(progress - target) > 0.001;

    // Only force the camera if we are in the middle of a transition.
    // Once settled, users can interact freely via OrbitControls.
    if (!isTransitioning) return;

    const targetLookAt = projected ? new THREE.Vector3(0, 0, 0) : basis.pc2.clone().multiplyScalar(-0.35);
    const targetPosition = projected
      ? basis.pc3.clone().multiplyScalar(18.5)
      : basis.pc3.clone().multiplyScalar(15.2).add(basis.pc1.clone().multiplyScalar(3.2)).add(basis.pc2.clone().multiplyScalar(0.4));
    const targetUp = projected ? basis.pc2.clone() : new THREE.Vector3(0, 1, 0).lerp(basis.pc2, 0.4).normalize();
    const targetFov = projected ? 26 : 34;

    camera.position.lerp(targetPosition, 0.1);
    camera.up.lerp(targetUp, 0.1);
    camera.lookAt(targetLookAt);

    if ('fov' in camera) {
      camera.fov += (targetFov - camera.fov) * 0.1;
      camera.updateProjectionMatrix();
    }
  });

  return null;
};

const PointCloud = ({
  basis,
  points,
  projectionProgress,
  projected: isProjected,
}: {
  basis: Basis;
  points: THREE.Vector3[];
  projectionProgress: number;
  projected: boolean;
}) => {
  const animatedPoints = useMemo(() => {
    const data = new Float32Array(points.length * 3);

    points.forEach((point, index) => {
      const centered = point.clone().sub(basis.mean);
      const p1 = centered.dot(basis.pc1);
      const p2 = centered.dot(basis.pc2);

      const projectedPoint = new THREE.Vector3()
        .addScaledVector(basis.pc1, p1)
        .addScaledVector(basis.pc2, p2)
        .add(basis.mean);

      const position = new THREE.Vector3().lerpVectors(point, projectedPoint, projectionProgress);

      data[index * 3] = position.x;
      data[index * 3 + 1] = position.y;
      data[index * 3 + 2] = position.z;
    });

    return data;
  }, [basis, points, projectionProgress]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={points.length} args={[animatedPoints, 3]} />
      </bufferGeometry>
      <PointMaterial transparent color="#5eead4" size={isProjected ? 0.22 : 0.2} sizeAttenuation depthWrite={false} opacity={0.85} />
    </points>
  );
};

const PCAAxes = ({ basis, projected }: { basis: Basis; projected: boolean }) => {
  const s1 = Math.sqrt(basis.eigenvalues[0]) * 2.5;
  const s2 = Math.sqrt(basis.eigenvalues[1]) * 2.5;
  const s3 = Math.sqrt(basis.eigenvalues[2]) * 2.5;

  const pc1 = basis.pc1.clone().multiplyScalar(projected ? s1 * 1.2 : s1);
  const pc2 = basis.pc2.clone().multiplyScalar(projected ? s2 * 1.2 : s2);
  const pc3 = basis.pc3.clone().multiplyScalar(s3);

  return (
    <group position={[basis.mean.x, basis.mean.y, basis.mean.z]}>
      <Line points={[[0, 0, 0], [pc1.x, pc1.y, pc1.z]]} color="#f59e0b" lineWidth={4} />
      <Text position={[pc1.x * 1.15, pc1.y * 1.15, pc1.z * 1.15]} fontSize={0.28} color="#f59e0b" fontStyle="italic" fontWeight="bold">
        PC1
      </Text>

      <Line points={[[0, 0, 0], [pc2.x, pc2.y, pc2.z]]} color="#38bdf8" lineWidth={3} />
      <Text position={[pc2.x * 1.15, pc2.y * 1.15, pc2.z * 1.15]} fontSize={0.28} color="#38bdf8" fontStyle="italic" fontWeight="bold">
        PC2
      </Text>

      {!projected && (
        <>
          <Line points={[[0, 0, 0], [pc3.x, pc3.y, pc3.z]]} color="#fb7185" lineWidth={1} dashed />
          <Text position={[pc3.x * 1.15, pc3.y * 1.15, pc3.z * 1.15]} fontSize={0.22} color="#fb7185" fontStyle="italic">
            PC3
          </Text>
        </>
      )}
    </group>
  );
};

/* ── Main component ─────────────────────────────────────────────── */

const PCA3DVisualizer = () => {
  const [projected, setProjected] = useState(false);
  const [rotationEnabled, setRotationEnabled] = useState(true);
  const [springProgress, setSpringProgress] = useState(0);
  const [compactLayout, setCompactLayout] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const compactLayoutQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    const updateMediaState = () => {
      setCompactLayout(compactLayoutQuery.matches);
      setCoarsePointer(coarsePointerQuery.matches);
    };

    updateMediaState();

    if (compactLayoutQuery.addEventListener && coarsePointerQuery.addEventListener) {
      compactLayoutQuery.addEventListener('change', updateMediaState);
      coarsePointerQuery.addEventListener('change', updateMediaState);

      return () => {
        compactLayoutQuery.removeEventListener('change', updateMediaState);
        coarsePointerQuery.removeEventListener('change', updateMediaState);
      };
    }

    compactLayoutQuery.addListener(updateMediaState);
    coarsePointerQuery.addListener(updateMediaState);

    return () => {
      compactLayoutQuery.removeListener(updateMediaState);
      coarsePointerQuery.removeListener(updateMediaState);
    };
  }, []);

  const points = useMemo(() => {
    const random = createSeededRandom(PCA_SAMPLE_SEED);
    const seedPc1 = new THREE.Vector3(1, 0.55, 0.18).normalize();
    const seedPc2Raw = new THREE.Vector3(-0.45, 1, 0.12);
    const seedPc2 = seedPc2Raw
      .clone()
      .sub(seedPc1.clone().multiplyScalar(seedPc2Raw.dot(seedPc1)))
      .normalize();
    const seedPc3 = new THREE.Vector3().crossVectors(seedPc1, seedPc2).normalize();

    const rawPoints = Array.from({ length: 150 }, () => {
      const v1 = (random() - 0.5) * 6.5;
      const v2 = (random() - 0.5) * 3.2;
      const v3 = (random() - 0.5) * 0.8;

      return new THREE.Vector3()
        .addScaledVector(seedPc1, v1)
        .addScaledVector(seedPc2, v2)
        .addScaledVector(seedPc3, v3);
    });

    const centroid = rawPoints
      .reduce((accumulator, point) => accumulator.add(point), new THREE.Vector3())
      .multiplyScalar(1 / rawPoints.length);

    return rawPoints.map((point) => point.sub(centroid));
  }, []);

  const basis = useMemo(() => computeBasis(points), [points]);

  const varianceStats = useMemo(() => {
    const [variance1, variance2, variance3] = basis.eigenvalues.map((value) => Math.max(0, value));
    const totalVariance = variance1 + variance2 + variance3;
    const retainedVariance = variance1 + variance2;

    return {
      retained: totalVariance === 0 ? 0 : (retainedVariance / totalVariance) * 100,
      discarded: totalVariance === 0 ? 0 : (variance3 / totalVariance) * 100,
    };
  }, [basis]);

  const sceneYOffset = compactLayout ? (1 - springProgress) * -0.9 : (1 - springProgress) * -1.25;

  useEffect(() => {
    const target = projected ? 1 : 0;
    const diff = target - springProgress;

    if (Math.abs(diff) < 0.005) {
      if (springProgress !== target) {
        setSpringProgress(target);
      }
      return;
    }

    const animationFrame = requestAnimationFrame(() => {
      setSpringProgress((previous) => previous + (target - previous) * 0.08);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [projected, springProgress]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>
            <Layers className={styles.titleIcon} size={compactLayout ? 20 : 24} />
            VISUALIZADOR <span className={styles.titleAccent}>PCA</span>
          </h3>
          <p className={styles.subtitle}>Concepto tridimensional</p>
        </div>
      </div>

      {/* 3D Canvas – fixed pixel height, no flex, no percentages */}
      <div className={styles.canvasContainer} style={{ height: CANVAS_HEIGHT, touchAction: coarsePointer ? 'pan-y' : 'none' }}>
        <div style={{ width: '100%', height: CANVAS_HEIGHT }}>
          <Canvas camera={{ position: [5.5, 3.8, 5.5], fov: 32 }} dpr={[1, 2]} style={{ touchAction: coarsePointer ? 'pan-y' : 'none' }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
            <CameraRig basis={basis} projected={projected} progress={springProgress} />
            <OrbitControls
              enableRotate={rotationEnabled && !projected && !coarsePointer}
              enablePan={false}
              enableZoom={!projected && !coarsePointer}
              autoRotate={rotationEnabled && !projected}
              autoRotateSpeed={0.65}
              makeDefault
            />
            <group position={[0, sceneYOffset, 0]}>
              <PointCloud basis={basis} points={points} projectionProgress={springProgress} projected={projected} />
              <PCAAxes basis={basis} projected={projected} />
            </group>
            {!projected && <Grid infiniteGrid fadeDistance={26} sectionSize={1} cellSize={0.5} cellColor="#1e293b" sectionColor="#334155" />}
            {!projected && <ContactShadows resolution={512} scale={13} blur={2} opacity={0.14} far={9} color="#000000" />}
          </Canvas>
        </div>

        <AnimatePresence>
          {!projected && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={styles.infoOverlay}>
              <div className={styles.infoCard}>
                <span className={styles.infoEyebrow}>Dimensión completa</span>
                <p className={styles.infoText}>
                  Los componentes se calculan desde la nube actual. PC1 y PC2 se alinean con la máxima varianza, mientras PC3 recoge la dimensión residual.
                </p>
              </div>
            </motion.div>
          )}

          {projected && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={styles.successOverlay}>
              <span className={styles.successEyebrow}>Éxito en reducción</span>
              <p className={styles.successTitle}>{varianceStats.retained.toFixed(1)}% de varianza preservada</p>
              <p className={styles.successText}>
                Al descartar <span className={styles.successTextHighlight}>PC3</span>, solo perdemos {varianceStats.discarded.toFixed(1)}% de la variación total de la muestra.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerActions}>
          <button
            type="button"
            onClick={() => setProjected(!projected)}
            className={`${styles.primaryButton} ${projected ? styles.primaryButtonActive : styles.primaryButtonInactive}`}
          >
            {projected ? <Repeat size={18} /> : <Play size={18} fill="currentColor" />}
            {projected ? 'Restaurar Vista 3D' : 'Proyectar a 2D'}
          </button>

          <button
            type="button"
            onClick={() => setRotationEnabled(!rotationEnabled)}
            aria-label={rotationEnabled ? 'Desactivar giro automático' : 'Activar giro automático'}
            className={`${styles.iconButton} ${rotationEnabled ? styles.iconButtonActive : styles.iconButtonInactive}`}
            title="Giro automático"
          >
            <Rotate3d size={22} />
          </button>
        </div>

        <div className={styles.statsContainer}>
          <span className={styles.statsLabel}>
            <Info size={12} className={styles.statsIcon} /> Varianza retenida
          </span>
          <div className={styles.statsBadge}>
             <code className={styles.statsCode}>
               PC1 + PC2 = {varianceStats.retained.toFixed(1)}%
             </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCA3DVisualizer;
