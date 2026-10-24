# govieworks.com

Personal site of Germán Oviedo: Astro 6, Tailwind v4, React islands, MDX. Bilingual: Spanish (default, no prefix) and English under `/en`. Deployed to Cloudflare Pages at https://govieworks.com.

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies (Node >= 22.12) |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run check` | Type-check Astro, MDX and TS (`astro check`) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the build locally |

## Layout

- `src/pages/`: routes. Spanish at the root (`/conceptos`, `/acerca`, `/blog`), English mirrors under `src/pages/en/`.
- `src/content/concepts/`: interactive concept lessons (MDX). `src/content/blog/`: blog posts (MDX, Spanish only).
- `src/components/`: Astro components by area (`home`, `about`, `blog`, `concept`, `ui`) and React visualizers in `visuals/`.
- `src/i18n/`: UI strings (`ui.ts`), localized route segments (`routes.ts`), helpers (`utils.ts`).
- `src/data/`: profile and project data. `src/styles/global.css`: tokens and shared classes.

More detail in [`docs/development.md`](docs/development.md) and [`docs/deployment.md`](docs/deployment.md).
