import { useCallback, useEffect, useState, type RefObject } from 'react';

/** True when the user asks the OS/browser to minimise motion. Starts false for SSR parity. */
export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
};

/** True once the element has come within `margin` of the viewport; toggles back when far away. */
export const useInView = (ref: RefObject<Element | null>, margin = '200px') => {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: margin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin]);
  return inView;
};

export interface Palette {
  ink: string;
  muted: string;
  rule: string;
  grid: string;
  pos: string;
  neg: string;
  c3: string;
  c4: string;
  c5: string;
}

export const LIGHT_PALETTE: Palette = {
  ink: '#1a1a18', muted: '#5f5c55', rule: '#d8d5ce', grid: '#c9c6bf',
  pos: '#1d5fd1', neg: '#c2410c', c3: '#15803d', c4: '#7c3aed', c5: '#a16207',
};

/** Reads the themed CSS custom properties (for canvas/WebGL, which can't use var()). Re-reads on theme change. */
export const useVizPalette = (ref: RefObject<HTMLElement | null>): Palette => {
  const [palette, setPalette] = useState<Palette>(LIGHT_PALETTE);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const style = getComputedStyle(el);
      const get = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
      setPalette({
        ink: get('--v-ink', LIGHT_PALETTE.ink),
        muted: get('--v-muted', LIGHT_PALETTE.muted),
        rule: get('--v-rule', LIGHT_PALETTE.rule),
        grid: get('--v-rule', LIGHT_PALETTE.grid),
        pos: get('--v-pos', LIGHT_PALETTE.pos),
        neg: get('--v-neg', LIGHT_PALETTE.neg),
        c3: get('--v-c3', LIGHT_PALETTE.c3),
        c4: get('--v-c4', LIGHT_PALETTE.c4),
        c5: get('--v-c5', LIGHT_PALETTE.c5),
      });
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => observer.disconnect();
  }, [ref]);
  return palette;
};

/**
 * Converts pointer events to the SVG user space (viewBox coordinates).
 * Works for any viewBox / preserveAspectRatio because it uses the screen CTM.
 */
export const useSvgPoint = (svgRef: RefObject<SVGSVGElement | null>) =>
  useCallback(
    (event: { clientX: number; clientY: number }) => {
      const svg = svgRef.current;
      const matrix = svg?.getScreenCTM();
      if (!svg || !matrix) return null;
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
      return { x: point.x, y: point.y };
    },
    [svgRef],
  );
