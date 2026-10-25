// Ordered taxonomy of concept areas. Used by the content schema and the index page.
export const AREAS = [
	'Fundamentos estadísticos',
	'Modelos lineales',
	'Clasificación',
	'Árboles y ensambles',
	'Reducción de dimensión',
] as const;

export type Area = (typeof AREAS)[number];

// The schema stores the Spanish label; English pages translate it for display.
const EN: Record<Area, string> = {
	'Fundamentos estadísticos': 'Statistical foundations',
	'Modelos lineales': 'Linear models',
	'Clasificación': 'Classification',
	'Árboles y ensambles': 'Trees and ensembles',
	'Reducción de dimensión': 'Dimensionality reduction',
};

export const areaLabel = (lang: string, area: string) => (lang === 'en' ? (EN[area as Area] ?? area) : area);
