import type { APIRoute, GetStaticPaths } from 'astro';
import { getOgCards, renderOgPng, type OgCard } from '../../lib/og';

export const getStaticPaths: GetStaticPaths = async () =>
  (await getOgCards()).map((card) => ({ params: { key: card.key }, props: { card } }));

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgPng((props as { card: OgCard }).card);
  return new Response(png as Uint8Array<ArrayBuffer>, { headers: { 'Content-Type': 'image/png' } });
};
