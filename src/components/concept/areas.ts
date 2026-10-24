// Ordered taxonomy of concept areas. Used by the content schema and the index page.
export const AREAS = [
	'Fundamentos estadísticos',
	'Modelos lineales',
	'Clasificación',
	'Árboles y ensambles',
	'Reducción de dimensión',
] as const;

export type Area = (typeof AREAS)[number];
