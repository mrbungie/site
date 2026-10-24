// Global site constants. Import from anywhere with `import { ... } from '../consts'`.

export const SITE_URL = 'https://govieworks.com';
export const SITE_NAME = 'Germán Oviedo';
export const SITE_TITLE = 'Germán Oviedo | Data & AI';
export const SITE_DESCRIPTION =
	'Data & AI executive. Machine learning, GenAI and analytics in banking and fintech, plus deep concepts explained once.';

export const AUTHOR = {
	name: 'Germán Oviedo',
	jobTitle: 'Data & AI executive',
	email: 'german.oviedo.b@gmail.com',
	sameAs: ['https://linkedin.com/in/goviedb', 'https://github.com/mrbungie'],
} as const;

/** Default social share image, served from /public. */
export const DEFAULT_OG_IMAGE = '/og-default.png';

/** Browser UI colour per scheme (matches --bg tokens in global.css). */
export const THEME_COLOR = { light: '#F5F3F0', dark: '#141412' } as const;

export const THEME_STORAGE_KEY = 'go-theme';
