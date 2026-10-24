import { memo, useId, useRef, type CSSProperties, type KeyboardEvent, type ReactNode, type Ref, type RefObject } from 'react';
import { useSvgPoint } from './hooks';
import { clamp, fmt } from './math';
import type { Label } from './datasets';
import styles from './viz.module.css';

export const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(' ');

export type Tone = 'pos' | 'neg' | 'c3' | 'c4' | 'c5' | 'ink';
const toneClass: Record<Tone, string> = {
  pos: styles.tonePos, neg: styles.toneNeg, c3: styles.toneC3, c4: styles.toneC4, c5: styles.toneC5, ink: styles.toneInk,
};
export const toneOf = (tone?: Tone) => (tone ? toneClass[tone] : undefined);

/* ── Frame ── */

export const VizFrame = ({
  title, subtitle, actions, children, frameRef,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  frameRef?: Ref<HTMLElement>;
}) => {
  const titleId = useId();
  return (
    <section className={styles.frame} aria-labelledby={titleId} ref={frameRef}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h3 className={styles.title} id={titleId}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </header>
      {children}
    </section>
  );
};

/** Two-column body: `plot` on the left, `side` stacked on the right (single column in narrow containers). */
export const VizBody = ({ plot, side }: { plot: ReactNode; side: ReactNode }) => (
  <div className={styles.body}>
    <div className={styles.plotWrap}>{plot}</div>
    <div className={styles.side}>{side}</div>
  </div>
);

export const Plot = ({ children, caption, wide, overlay }: { children: ReactNode; caption?: ReactNode; wide?: boolean; overlay?: ReactNode }) => (
  <>
    <div className={cx(styles.plot, wide && styles.plotWide)}>
      {overlay && <div className={styles.overlay}>{overlay}</div>}
      {children}
    </div>
    {caption && <div className={styles.plotCaption}>{caption}</div>}
  </>
);

export const Panel = ({ title, children }: { title?: string; children: ReactNode }) => (
  <div className={styles.panel}>
    {title && <h4 className={styles.panelTitle}>{title}</h4>}
    <div className={styles.stack}>{children}</div>
  </div>
);

/* ── Controls ── */

export const Slider = ({
  label, value, min, max, step, onChange, format, tone, hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  tone?: Tone;
  hint?: string;
}) => {
  const id = useId();
  const text = format ? format(value) : String(value);
  return (
    <div className={cx(styles.control, toneOf(tone))}>
      <label className={styles.controlMeta} htmlFor={id}>
        <span>{label}</span>
        <output className={styles.controlValue} htmlFor={id}>{text}</output>
      </label>
      <input
        id={id}
        className={styles.slider}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={text}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
      />
      {hint && <p className={styles.hint} id={`${id}-hint`}>{hint}</p>}
    </div>
  );
};

export const Button = ({
  children, onClick, pressed, primary, disabled, label,
}: {
  children: ReactNode;
  onClick: () => void;
  pressed?: boolean;
  primary?: boolean;
  disabled?: boolean;
  label?: string;
}) => (
  <button
    type="button"
    className={cx(styles.button, primary && styles.buttonPrimary)}
    onClick={onClick}
    aria-pressed={pressed}
    aria-label={label}
    disabled={disabled}
  >
    {children}
  </button>
);

/** Native radio group styled as a segmented control (arrow keys work out of the box). */
export const Segmented = <T extends string>({
  label, options, value, onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) => {
  const name = useId();
  return (
    <fieldset className={styles.segmented}>
      <legend>{label}</legend>
      {options.map((option) => (
        <label key={option.value} className={styles.segment}>
          <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
};

/* ── Readouts ── */

/** Announces changes politely to assistive tech; keep the content short. */
export const Callout = ({
  eyebrow, title, children, tone = 'pos',
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  tone?: Tone;
}) => (
  <div className={cx(styles.callout, toneOf(tone))} role="status" aria-live="polite">
    <p className={styles.calloutEyebrow}>{eyebrow}</p>
    <p className={styles.calloutTitle}>{title}</p>
    {children && <p className={styles.calloutBody}>{children}</p>}
  </div>
);

export const Stat = ({ label, value, tone }: { label: string; value: ReactNode; tone?: Tone }) => (
  <div className={cx(styles.stat, toneOf(tone))}>
    <p className={styles.statLabel}>{label}</p>
    <p className={styles.statValue}>{value}</p>
  </div>
);

export const StatGrid = ({ children }: { children: ReactNode }) => <div className={styles.statGrid}>{children}</div>;

export const Meter = ({ value, tone = 'pos', label }: { value: number; tone?: Tone; label: string }) => (
  <div
    className={cx(styles.bar, toneOf(tone))}
    role="meter"
    aria-label={label}
    aria-valuemin={0}
    aria-valuemax={1}
    aria-valuenow={Number(value.toFixed(3))}
  >
    <div className={styles.barFill} style={{ '--w': `${Math.max(0, Math.min(1, value)) * 100}%` } as CSSProperties} />
  </div>
);

export type LegendKind = 'pos' | 'neg' | 'ring' | 'dash' | 'line';
export const Legend = ({ items }: { items: { kind: LegendKind; label: string; tone?: Tone }[] }) => (
  <ul className={styles.legend} aria-label="Leyenda">
    {items.map((item) => (
      <li key={item.label}>
        <span
          aria-hidden="true"
          className={cx(
            styles.legendSwatch,
            toneOf(item.kind === 'pos' ? 'pos' : item.kind === 'neg' ? 'neg' : item.tone),
            item.kind === 'pos' && styles.swatchCircle,
            item.kind === 'ring' && styles.swatchRing,
            item.kind === 'dash' && styles.swatchDash,
            item.kind === 'line' && styles.swatchLine,
          )}
        />
        {item.label}
      </li>
    ))}
  </ul>
);

export const Notes = ({ title = 'Qué mirar', items }: { title?: string; items: string[] }) => (
  <Panel title={title}>
    <ul className={styles.notes}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  </Panel>
);

/* ── SVG primitives (plot space 0..100, y already flipped by caller via `flipY`) ── */

export const flipY = (y: number) => 100 - y;

const GRID_LINES = Array.from({ length: 11 }, (_, i) => i * 10);

export const PlotSvg = ({
  label, children, svgRef, onPointerDown, onPointerMove, onPointerUp, pad = 4,
}: {
  label: string;
  children: ReactNode;
  svgRef?: Ref<SVGSVGElement>;
  onPointerDown?: (event: React.PointerEvent<SVGSVGElement>) => void;
  onPointerMove?: (event: React.PointerEvent<SVGSVGElement>) => void;
  onPointerUp?: (event: React.PointerEvent<SVGSVGElement>) => void;
  pad?: number;
}) => (
  <svg
    ref={svgRef}
    className={styles.svg}
    viewBox={`${-pad} ${-pad} ${100 + pad * 2} ${100 + pad * 2}`}
    preserveAspectRatio="xMidYMid meet"
    role="img"
    aria-label={label}
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerUp}
  >
    <Grid />
    {children}
  </svg>
);

export const Grid = memo(() => (
  <g aria-hidden="true">
    {GRID_LINES.map((v) => (
      <g key={v}>
        <line className={styles.gridLine} x1={v} y1={0} x2={v} y2={100} />
        <line className={styles.gridLine} x1={0} y1={v} x2={100} y2={v} />
      </g>
    ))}
    <rect x={0} y={0} width={100} height={100} fill="none" className={styles.axisLine} />
  </g>
));
Grid.displayName = 'Grid';

/** Class 1 = filled circle (blue), class 0 = square (orange). `ring` marks emphasised points, `wrong` outlines errors. */
export const Mark = memo(({
  x, y, label, ring, wrong, delay = 0, size = 1.5,
}: {
  x: number;
  y: number;
  label: Label;
  ring?: boolean;
  wrong?: boolean;
  delay?: number;
  size?: number;
}) => {
  const r = ring ? size * 1.35 : size;
  const style = { animationDelay: `${Math.min(delay, 0.6)}s` } as CSSProperties;
  const common = cx(label === 1 ? styles.markPos : styles.markNeg, wrong && styles.markWrong);
  return (
    <g style={style} className={styles.markIn}>
      {label === 1 ? (
        <circle cx={x} cy={flipY(y)} r={r} className={common} />
      ) : (
        <rect x={x - r} y={flipY(y) - r} width={r * 2} height={r * 2} rx={0.3} className={common} />
      )}
      {ring && <circle cx={x} cy={flipY(y)} r={r + 1} className={styles.markRing} />}
    </g>
  );
});
Mark.displayName = 'Mark';

/** Draggable + keyboard-movable point in plot space (0..100, y up). Arrow keys move by 2 (8 with Shift). */
export const QueryHandle = ({
  x, y, svgRef, onMove, label,
}: {
  x: number;
  y: number;
  svgRef: RefObject<SVGSVGElement | null>;
  onMove: (x: number, y: number) => void;
  label: string;
}) => {
  const toSvg = useSvgPoint(svgRef);
  const dragging = useRef(false);
  const update = (event: { clientX: number; clientY: number }) => {
    const p = toSvg(event);
    if (p) onMove(clamp(p.x, 2, 98), clamp(100 - p.y, 2, 98));
  };
  const onKey = (event: KeyboardEvent) => {
    const step = event.shiftKey ? 8 : 2;
    const delta: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    const d = delta[event.key];
    if (!d) return;
    event.preventDefault();
    onMove(clamp(x + d[0], 2, 98), clamp(y + d[1], 2, 98));
  };
  const cy = flipY(y);
  return (
    <g
      tabIndex={0}
      role="img"
      aria-label={`${label}: x ${fmt(x, 0)}, y ${fmt(y, 0)}. Arrastra o usa las flechas.`}
      className={styles.focusable}
      style={{ touchAction: 'none' }}
      onKeyDown={onKey}
      onPointerDown={(event) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        update(event);
      }}
      onPointerMove={(event) => dragging.current && update(event)}
      onPointerUp={() => { dragging.current = false; }}
      onPointerCancel={() => { dragging.current = false; }}
    >
      <circle cx={x} cy={cy} r={6} fill="transparent" />
      <circle className={styles.handle} cx={x} cy={cy} r={2.4} />
      <path d={`M${x - 1.1} ${cy}h2.2M${x} ${cy - 1.1}v2.2`} stroke="currentColor" strokeWidth={0.45} />
    </g>
  );
};

export { styles as vizStyles };
