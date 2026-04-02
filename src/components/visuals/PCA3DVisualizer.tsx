import { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Grid, Line, OrbitControls, PointMaterial, Text } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, Layers, Play, Repeat, Rotate3d } from 'lucide-react';
import * as THREE from 'three';

/* ── Height of the 3D canvas area in pixels ─────────────────────── */
const CANVAS_HEIGHT = 580;

type Basis = {
  pc1: THREE.Vector3;
  pc2: THREE.Vector3;
  pc3: THREE.Vector3;
  eigenvalues: [number, number, number];
  mean: THREE.Vector3;
};

const dot = (a: THREE.Vector3, b: THREE.Vector3) => a.x * b.x + a.y * b.y + a.z * b.z;

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

const CameraRig = ({ basis, projected }: { basis: Basis; projected: boolean }) => {
  const { camera } = useThree();

  useFrame(() => {
    const targetLookAt = projected ? new THREE.Vector3(0, 0, 0) : basis.pc2.clone().multiplyScalar(-0.45);
    const targetPosition = projected
      ? basis.pc3.clone().multiplyScalar(5.2)
      : basis.pc3.clone().multiplyScalar(7.1).add(basis.pc1.clone().multiplyScalar(2.5)).add(basis.pc2.clone().multiplyScalar(0.35));
    const targetUp = projected ? basis.pc2.clone() : new THREE.Vector3(0, 1, 0).lerp(basis.pc2, 0.35).normalize();
    const targetFov = projected ? 20 : 26;

    camera.position.lerp(targetPosition, 0.08);
    camera.up.lerp(targetUp, 0.08);
    camera.lookAt(targetLookAt);

    if ('fov' in camera) {
      camera.fov += (targetFov - camera.fov) * 0.08;
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
      <PointMaterial transparent color="#5eead4" size={isProjected ? 0.18 : 0.17} sizeAttenuation depthWrite={false} opacity={0.85} />
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

  const points = useMemo(() => {
    const seedPc1 = new THREE.Vector3(1, 0.55, 0.18).normalize();
    const seedPc2Raw = new THREE.Vector3(-0.45, 1, 0.12);
    const seedPc2 = seedPc2Raw
      .clone()
      .sub(seedPc1.clone().multiplyScalar(seedPc2Raw.dot(seedPc1)))
      .normalize();
    const seedPc3 = new THREE.Vector3().crossVectors(seedPc1, seedPc2).normalize();

    return Array.from({ length: 150 }, () => {
      const v1 = (Math.random() - 0.5) * 6.5;
      const v2 = (Math.random() - 0.5) * 3.2;
      const v3 = (Math.random() - 0.5) * 0.8;

      return new THREE.Vector3()
        .addScaledVector(seedPc1, v1)
        .addScaledVector(seedPc2, v2)
        .addScaledVector(seedPc3, v3);
    });
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

  const sceneYOffset = projected ? 0 : -1.75;

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
    <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-950 p-1 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/40 px-8 py-7">
        <div className="flex flex-col">
          <h3 className="flex items-center gap-3 text-2xl font-black tracking-tight text-white">
            <Layers className="text-teal-400" size={24} />
            VISUALIZADOR <span className="text-teal-400">PCA</span>
          </h3>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Concepto tridimensional</p>
        </div>
      </div>

      {/* 3D Canvas – fixed pixel height, no flex, no percentages */}
      <div className="relative bg-slate-950" style={{ height: CANVAS_HEIGHT }}>
        <div style={{ width: '100%', height: CANVAS_HEIGHT }}>
          <Canvas camera={{ position: [5.5, 3.8, 5.5], fov: 32 }} dpr={[1, 2]}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
            <CameraRig basis={basis} projected={projected} />
            <OrbitControls enableRotate={rotationEnabled && !projected} enablePan={false} enableZoom={!projected} autoRotate={rotationEnabled && !projected} autoRotateSpeed={0.65} makeDefault />
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
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-5 left-5 z-10 flex max-w-[220px] flex-col gap-4">
              <div className="rounded-2xl border border-white/8 bg-slate-900/62 p-4 shadow-lg backdrop-blur-md">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-teal-300/90">Dimensión completa</span>
                <p className="text-[11px] leading-relaxed text-slate-300/90">
                  Los componentes se calculan desde la nube actual. PC1 y PC2 se alinean con la máxima varianza, mientras PC3 recoge la dimensión residual.
                </p>
              </div>
            </motion.div>
          )}

          {projected && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-6 left-1/2 z-10 w-[min(540px,calc(100%-3rem))] -translate-x-1/2 rounded-3xl border border-teal-300/40 bg-teal-500/90 p-5 shadow-xl backdrop-blur-xl">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-white/80">Éxito en reducción</span>
              <p className="mb-1 text-sm font-bold text-white">{varianceStats.retained.toFixed(1)}% de varianza preservada</p>
              <p className="text-xs font-medium leading-relaxed text-white/80">
                Al descartar <span className="text-white">PC3</span>, solo perdemos {varianceStats.discarded.toFixed(1)}% de la variación total de la muestra.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/5 bg-slate-900/40 px-8 py-7 shadow-inner">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setProjected(!projected)}
            className={`flex items-center gap-3 rounded-2xl px-10 py-4.5 text-sm font-black tracking-tight transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${projected ? 'bg-teal-500 text-slate-950 shadow-xl shadow-teal-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
          >
            {projected ? <Repeat size={18} /> : <Play size={18} fill="currentColor" />}
            {projected ? 'Restaurar Vista 3D' : 'Proyectar a 2D'}
          </button>

          <button
            type="button"
            onClick={() => setRotationEnabled(!rotationEnabled)}
            aria-label={rotationEnabled ? 'Desactivar giro automático' : 'Activar giro automático'}
            className={`rounded-2xl p-4.5 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${rotationEnabled ? 'bg-slate-800 text-teal-400 shadow-lg shadow-teal-500/10' : 'bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/20'}`}
            title="Giro automático"
          >
            <Rotate3d size={22} />
          </button>
        </div>

        <div className="hidden flex-col items-end gap-1 md:flex">
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500/80">
            <Info size={12} className="text-slate-600" /> Varianza retenida
          </span>
          <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-2xl ring-1 ring-slate-200">
             <code className="text-[13px] font-black tracking-tight text-teal-600">
               PC1 + PC2 = {varianceStats.retained.toFixed(1)}%
             </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCA3DVisualizer;
