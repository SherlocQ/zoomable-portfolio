/*
 * Survey rungs — a paired grouped-bar chart where one rung = one percent.
 *
 * Ported from Lieflat Charts' "C2 · paired rungs" (F6 Paired Rungs,
 * templates/basics-gallery.html) and its `rnd` helper (mono-tokens.js),
 * https://github.com/larashero3-dotcom/lieflat-charts — licensed under the
 * PolyForm Noncommercial License 1.0.0,
 * https://polyformproject.org/licenses/noncommercial/1.0.0
 *
 * Changes from the template: React/JSX instead of imperative DOM, geometry
 * measured from the container width (labels stay at real pixel sizes),
 * colors from the site's --viz-series tokens instead of the Mono palette,
 * two peer series instead of this-year / last-year,
 * a per-column hover readout, and a screen-reader table.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// Deterministic jitter, so a reload draws the same rungs (template `rnd`).
const rnd = (i, k) => Math.abs(((i * 73856093) ^ (k * 19349663)) % 1000) / 1000;

const STEP = 3;      // px per rung (= 1%), shared by every chart so scales match
const LABEL = 26;    // room for a value label above its bar
const TIP_H = 68;    // hover readout height; reserved above the tallest bar
const TOP = LABEL + TIP_H; // the accordion panel clips overflow, so the readout must fit inside
const PAD_X = 4;

export default function SurveyRungs({ chart, active = true }) {
  const wrapRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(null);
  const { series, values, low, high, caption } = chart;

  // clientWidth, not getBoundingClientRect: pages open under a Framer scale.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Plays when the chart is both open and on screen; closing resets it so the
  // next open replays. A closed accordion panel clips it to zero, so it never
  // counts as visible while hidden.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const playing = active && (inView || reduceMotion);

  const max = Math.max(...values.flat());
  const base = TOP + Math.max(max - 1, 0) * STEP;
  const height = base + 46;

  const geo = useMemo(() => {
    if (!width) return null;
    const colW = (width - PAD_X * 2) / values.length;
    const off = Math.min(colW * 0.2, 22);
    const hw = Math.min(colW * 0.15, 16);
    return { colW, off, hw, x0: (i) => PAD_X + colW * (i + 0.5) };
  }, [width, values.length]);

  const columns = useMemo(() => {
    if (!geo) return null;
    const { off, hw, x0 } = geo;
    return values.map((pair, i) => {
      const bars = pair.map((v, s) => {
        const x = x0(i) + (s === 0 ? -off : off);
        const rungs = [];
        for (let k = 0; k < v; k++) {
          const y = base - k * STEP;
          const w = hw - 1.2 + rnd(k + 1, i + 2 + s * 5) * 2.4;
          rungs.push(
            <line
              key={k}
              className={`sr-rung sr-rung--${s} sr-fade`}
              x1={x - w} y1={y} x2={x + w} y2={y}
              opacity={0.75 + rnd(k + 2, i + 3 + s * 5) * 0.25}
              style={{ animationDelay: `${s * 0.15 + i * 0.08 + k * 0.01}s` }}
            />,
          );
        }
        const top = v > 0 ? base - (v - 1) * STEP : base;
        return (
          <g key={s}>
            {rungs}
            <text
              className={`sr-value sr-value--${s} sr-fade`}
              x={x} y={top - 9}
              style={{ animationDelay: `${0.5 + i * 0.08}s` }}
            >
              {v}
            </text>
          </g>
        );
      });
      return { i, bars };
    });
  }, [geo, values, base]);

  const label = `${caption}. ${values.map((p, i) => `${i + 1}: ${series[0]} ${p[0]}%, ${series[1]} ${p[1]}%`).join('; ')}.`;

  return (
    <figure className={`survey-rungs${playing ? ' is-in' : ''}`}>
      <div className="survey-rungs-plot" ref={wrapRef} style={{ height }}>
        {geo && (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
            {columns.map(({ i, bars }) => (
              <g key={i} className={hovered !== null && hovered !== i ? 'sr-col is-dim' : 'sr-col'}>
                {bars}
                <text className="sr-cat sr-fade" x={geo.x0(i)} y={base + 22} style={{ animationDelay: `${i * 0.08}s` }}>
                  {i + 1}
                </text>
              </g>
            ))}
            <line className="sr-axis sr-fade" x1={PAD_X} x2={width - PAD_X} y1={base + 4} y2={base + 4} />
            <text className="sr-end sr-fade" x={PAD_X} y={base + 42} textAnchor="start" style={{ animationDelay: '1s' }}>{low}</text>
            <text className="sr-end sr-fade" x={width - PAD_X} y={base + 42} textAnchor="end" style={{ animationDelay: '1s' }}>{high}</text>
            {values.map((_, i) => (
              <rect
                key={i}
                className="sr-hit"
                x={PAD_X + geo.colW * i} y={0} width={geo.colW} height={base + 28}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered(null)}
              />
            ))}
          </svg>
        )}
        {geo && hovered !== null && (
          <div
            className="survey-rungs-tip"
            // Above the column's value labels. Edge columns align to their outer
            // edge (first left, last right) so the readout never leaves the plot.
            style={{
              top: Math.min(...values[hovered].map((v) => (v > 0 ? base - (v - 1) * STEP : base))) - LABEL,
              left: hovered === 0 ? PAD_X : hovered === values.length - 1 ? width - PAD_X : geo.x0(hovered),
              transform: `translate(${hovered === 0 ? '0' : hovered === values.length - 1 ? '-100%' : '-50%'}, -100%)`,
            }}
            aria-hidden="true"
          >
            <span className="survey-rungs-tip-title">{hovered + 1}{hovered === 0 ? ` · ${low}` : hovered === values.length - 1 ? ` · ${high}` : ''}</span>
            {series.map((name, s) => (
              <span key={name} className="survey-rungs-tip-row">
                <i className={`survey-rungs-swatch survey-rungs-swatch--${s}`} />
                {name.replace(' Essentials', '')}
                <b>{values[hovered][s]}%</b>
              </span>
            ))}
          </div>
        )}
      </div>
      <figcaption className="survey-rungs-legend">
        {series.map((name, s) => (
          <span key={name} className="survey-rungs-key">
            <i className={`survey-rungs-swatch survey-rungs-swatch--${s}`} />
            {name}
          </span>
        ))}
      </figcaption>
      <table className="sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr><th scope="col">Rating</th>{series.map((n) => <th scope="col" key={n}>{n}</th>)}</tr>
        </thead>
        <tbody>
          {values.map((p, i) => (
            <tr key={i}>
              <th scope="row">{i + 1}{i === 0 ? ` (${low})` : i === values.length - 1 ? ` (${high})` : ''}</th>
              <td>{p[0]}%</td><td>{p[1]}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
