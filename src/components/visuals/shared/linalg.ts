/** Symmetric 3×3 eigen decomposition via cyclic Jacobi rotations (robust, no start-vector pitfalls). */

export type Mat3 = number[][];
export type Vec3 = [number, number, number];

export const covariance3 = (points: Vec3[]): { mean: Vec3; cov: Mat3 } => {
  const n = points.length || 1;
  const mean: Vec3 = [0, 0, 0];
  for (const p of points) for (let k = 0; k < 3; k += 1) mean[k] += p[k] / n;
  const cov: Mat3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const p of points) {
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) cov[i][j] += ((p[i] - mean[i]) * (p[j] - mean[j])) / n;
    }
  }
  return { mean, cov };
};

/** Returns eigenvalues sorted descending and matching unit eigenvectors (rows of `vectors`). */
export const eigenSymmetric3 = (input: Mat3): { values: Vec3; vectors: Vec3[] } => {
  const a = input.map((row) => [...row]);
  const v: Mat3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

  for (let sweep = 0; sweep < 50; sweep += 1) {
    const off = Math.abs(a[0][1]) + Math.abs(a[0][2]) + Math.abs(a[1][2]);
    if (off < 1e-14) break;
    for (const [p, q] of [[0, 1], [0, 2], [1, 2]] as const) {
      if (Math.abs(a[p][q]) < 1e-300) continue;
      const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
      const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
      const c = 1 / Math.sqrt(t * t + 1);
      const s = t * c;
      for (let k = 0; k < 3; k += 1) {
        const akp = a[k][p];
        const akq = a[k][q];
        a[k][p] = c * akp - s * akq;
        a[k][q] = s * akp + c * akq;
      }
      for (let k = 0; k < 3; k += 1) {
        const apk = a[p][k];
        const aqk = a[q][k];
        a[p][k] = c * apk - s * aqk;
        a[q][k] = s * apk + c * aqk;
      }
      for (let k = 0; k < 3; k += 1) {
        const vkp = v[k][p];
        const vkq = v[k][q];
        v[k][p] = c * vkp - s * vkq;
        v[k][q] = s * vkp + c * vkq;
      }
    }
  }

  const order = [0, 1, 2].sort((i, j) => a[j][j] - a[i][i]);
  return {
    values: order.map((i) => Math.max(0, a[i][i])) as Vec3,
    vectors: order.map((i) => [v[0][i], v[1][i], v[2][i]] as Vec3),
  };
};
