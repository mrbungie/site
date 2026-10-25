export type Lang = 'es' | 'en';

/** Strings reused across several visualizers (and by the shared UI primitives). */
export const common = {
  es: {
    settings: 'Ajustes',
    whatToLook: 'Qué mirar',
    newSample: 'Nueva muestra',
    legend: 'Leyenda',
    reading: 'Lectura',
    class0: 'Clase 0',
    class1: 'Clase 1',
    dragHint: 'Arrastra o usa las flechas.',
  },
  en: {
    settings: 'Settings',
    whatToLook: 'What to look for',
    newSample: 'New sample',
    legend: 'Legend',
    reading: 'Reading',
    class0: 'Class 0',
    class1: 'Class 1',
    dragHint: 'Drag or use the arrow keys.',
  },
} as const;
