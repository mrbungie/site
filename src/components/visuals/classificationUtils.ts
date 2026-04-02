export interface SamplePoint2D {
  x: number;
  y: number;
  label: 0 | 1;
  id: number;
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const createSeededRandom = (seed: number) => {
  let value = seed % 2147483647;

  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

export const distance = (a: Pick<SamplePoint2D, 'x' | 'y'>, b: Pick<SamplePoint2D, 'x' | 'y'>) =>
  Math.hypot(a.x - b.x, a.y - b.y);

export const generateLinearSample = ({
  sampleSize,
  version,
  overlap,
}: {
  sampleSize: number;
  version: number;
  overlap: number;
}): SamplePoint2D[] => {
  const random = createSeededRandom(version + 101);

  return Array.from({ length: sampleSize }, (_, index) => {
    const x = 10 + random() * 80;
    const y = 10 + random() * 80;
    const noise = (random() - 0.5) * overlap * 22;
    const score = (x - 50) * 0.92 - (y - 50) * 0.78 + noise;

    return {
      x,
      y,
      label: score >= 0 ? 1 : 0,
      id: index,
    };
  });
};

export const generateRadialSample = ({
  sampleSize,
  version,
  overlap,
}: {
  sampleSize: number;
  version: number;
  overlap: number;
}): SamplePoint2D[] => {
  const random = createSeededRandom(version + 303);

  return Array.from({ length: sampleSize }, (_, index) => {
    const x = 10 + random() * 80;
    const y = 10 + random() * 80;
    const radius = Math.hypot(x - 50, y - 50);
    const noise = (random() - 0.5) * overlap * 10;

    return {
      x,
      y,
      label: radius + noise >= 22 ? 1 : 0,
      id: index,
    };
  });
};
