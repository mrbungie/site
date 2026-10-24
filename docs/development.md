# Development

Requires Node >= 22.12 and npm.

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # astro check (types for .astro/.mdx/.ts)
npm run build    # output in dist/
```

## Conventions

- **CSS**: shared structural classes (BEM) live in `src/styles/global.css`; component styles go in a co-located `*.module.css` or a scoped `<style>` in `.astro` files. No hardcoded colors or type in JSX; use the CSS variables (`--bg`, `--ink`, `--accent`, ...).
- **Hydration**: use `client:load` or `client:visible` for React islands, never `client:only="react"` (it stops Astro from linking the island's CSS). Guard browser APIs with `useEffect`.
- **i18n**: add UI strings to both locales in `src/i18n/ui.ts`; build links with `routePath()` / `localePath()`.

## Blog

Posts are MDX files in `src/content/blog/` (frontmatter: `title`, `description`, `pubDate`, optional `updatedDate`, `heroImage`, `tags`, `draft`). Posts are Spanish only. They are served at `/blog/<id>/`, and also at `/en/blog/<id>/` so the English sidebar link works; the English index says so. Reading time, prev/next and tags are derived automatically (`src/utils/blog.ts`). Code blocks use Shiki (`github-dark`, set in `astro.config.mjs`). Math written as `$...$` is typeset client-side by MathJax (loaded in `BaseLayout`).

The RSS feed (`/rss.xml`) is a single Spanish feed.

## Config notes

- `astro.config.mjs`: sitemap with `es-CL` / `en-US` hreflang, hover prefetch, `compressHTML`.
- `@types/*` and `@astrojs/check` are dev dependencies.
