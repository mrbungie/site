// Global site constants. Import from anywhere with `import { ... } from '../consts'`.

export const SITE_URL = 'https://www.govieworks.com';
export const SITE_NAME = 'Germán Oviedo';
export const SITE_TITLE = 'Germán Oviedo | Data & AI';
export const SITE_DESCRIPTION =
	'Data & AI executive. Machine learning, GenAI and analytics in banking and fintech, plus deep concepts explained once.';

export const AUTHOR = {
	name: 'Germán Oviedo',
	jobTitle: 'Data & AI executive',
	email: 'german.oviedo.b@gmail.com',
	description: {
		es: 'Ejecutivo de datos e IA con más de diez años en banca y fintech en Chile, y docente universitario de machine learning desde 2016.',
		en: 'Data and AI executive with more than ten years in Chilean banking and fintech, and university machine learning lecturer since 2016.',
	},
	alumniOf: ['Universidad Adolfo Ibáñez', 'MIB Trieste School of Management'],
	knowsAbout: ['Machine learning', 'Generative AI', 'Data engineering', 'MLOps', 'Causal inference', 'Banking analytics'],
	sameAs: ['https://www.linkedin.com/in/goviedb', 'https://github.com/mrbungie'],
} as const;

/** Default social share image, served from /public. */
export const DEFAULT_OG_IMAGE = '/og-default.png';

/** Browser UI colour per scheme (matches --bg tokens in global.css). */
export const THEME_COLOR = { light: '#FCFBF8', dark: '#141412' } as const;

export const THEME_STORAGE_KEY = 'go-theme';
