// schema.org helpers for per-page JSON-LD nodes (merged into the @graph in BaseHead).
type Node = Record<string, unknown>;

export const personRef = (site: URL) => ({ '@id': `${site.href}#person` });

export const profilePage = (site: URL, path: string): Node => ({
  '@type': 'ProfilePage',
  url: new URL(path, site).href,
  mainEntity: personRef(site),
});

export const breadcrumbs = (site: URL, items: { name: string; path: string }[]): Node => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: new URL(item.path, site).href,
  })),
});
