import { forwardRef } from 'react';
import {
  AI_VIEWBOX, BET_PATH, DD_LABELS, DD_VIEWBOX, DIAMONDS, DIRECTION,
  DIRECTION_PATH, FAN_LEN, FIRST_DIAMOND_PATH, GATE_Y, LOOP_SPREAD, LOOP_X, PARTICLES,
  LEGEND, LEGEND_Y, ROUTE_Y, isGroupActive, loopEnd,
} from './processDiagramModel';

// SVG markup for the Process page diagram — two scenes, one visible at a
// time; all motion lives in processDiagramModel.js (applyDiagramState).

const PARTICLE_CLASS = { noise: 'pd-fill-noise', execution: 'pd-fill-wide', direction: 'pd-fill-decide' };
// The legend row sits at LEGEND_Y inside the AI-native viewBox (y 328–712).
const LEGEND_TOP = ((LEGEND_Y - 328) / 384) * 100;

function DoubleDiamond({ ghost = false, gs = () => ({}) }) {
  // In the ghost layer nothing is keyed, so the state writer never touches it.
  const k = (key) => (ghost ? undefined : key);
  const draw = ghost ? undefined : '1';
  return (
    <>
      <g data-group="dd-diverge" {...gs('dd-diverge')}>
        {DIAMONDS.map((d, i) => (
          <g key={i}>
            <path data-k={k(`dd-${i}-div`)} pathLength={draw} className="pd-stroke pd-neutral" d={d.divergeUp} />
            <path data-k={k(`dd-${i}-div`)} pathLength={draw} className="pd-stroke pd-neutral" d={d.divergeDown} />
            {!ghost && <path data-k={`dd-${i}-div-wide`} className="pd-stroke pd-wide pd-thin" d={d.divergeUp} />}
            {!ghost && <path data-k={`dd-${i}-div-wide`} className="pd-stroke pd-wide pd-thin" d={d.divergeDown} />}
          </g>
        ))}
      </g>
      <g data-group="dd-converge" {...gs('dd-converge')}>
        {DIAMONDS.map((d, i) => (
          <g key={i}>
            <path data-k={k(`dd-${i}-conv`)} pathLength={draw} className="pd-stroke pd-neutral" d={d.convergeUp} />
            <path data-k={k(`dd-${i}-conv`)} pathLength={draw} className="pd-stroke pd-neutral" d={d.convergeDown} />
            {!ghost && <path data-k={`dd-${i}-conv-hard`} className="pd-stroke pd-decide pd-thick" d={d.convergeUp} />}
            {!ghost && <path data-k={`dd-${i}-conv-hard`} className="pd-stroke pd-decide pd-thick" d={d.convergeDown} />}
          </g>
        ))}
      </g>
      <g data-group="dd-labels" {...gs('dd-labels')}>
        {DD_LABELS.map((l, i) => (
          <text key={l.text} data-k={k(`dd-label-${i}`)} x={l.x} y={282} textAnchor="middle" className="pd-label">{l.text}</text>
        ))}
      </g>
      {!ghost && (
        <g data-group="dd-annot" {...gs('dd-annot')}>
          <text data-k="dd-annot-easy" x={120} y={82} textAnchor="middle" className="pd-label pd-label--wide">easy now</text>
          <text data-k="dd-annot-hard" x={440} y={82} textAnchor="middle" className="pd-label pd-label--decide">still hard</text>
        </g>
      )}
    </>
  );
}

// The Bet in ink: the first diamond, reshaped into the Bet during the
// hand-over. It sits outside the AI-native fade so it can appear first,
// exactly over the Double Diamond's first diamond.
function BetInk({ gs }) {
  return (
    <g data-group="bet" {...gs('bet')}>
      <path data-k="bet-shape" className="pd-stroke pd-ink-stroke" d={FIRST_DIAMOND_PATH} style={{ opacity: 0 }} />
      <text data-k="bet-label" x={95} y={442} textAnchor="middle" className="pd-label" style={{ opacity: 0 }}>Bet</text>
    </g>
  );
}

function AINative({ ghost = false, gs = () => ({}) }) {
  const k = (key) => (ghost ? undefined : key);
  const draw = ghost ? undefined : '1';
  return (
    <>
      {ghost && (
        <g>
          <path className="pd-stroke pd-ink-stroke" d={BET_PATH} />
          <text x={95} y={442} textAnchor="middle" className="pd-label">Bet</text>
        </g>
      )}

      <g data-group="loops" {...gs('loops')}>
        {LOOP_X.map((x0, i) => {
          const spread = LOOP_SPREAD[i];
          const from = i === 0 ? 130 : loopEnd(i - 1);
          return (
            <g key={x0}>
              <path data-k={k(`loop-${i}-conn`)} pathLength={draw} className="pd-stroke pd-neutral pd-thin" d={`M${from} 380 L${x0} 380`} />
              {[-1, -0.5, 0, 0.5, 1].map((f) => (
                <path key={f} data-k={k(`loop-${i}-fan`)} pathLength={draw} className="pd-stroke pd-wide pd-thin" d={`M${x0} 380 L${x0 + FAN_LEN} ${380 + f * spread}`} />
              ))}
              {[-1, 1].map((f) => (
                <path key={f} data-k={k(`loop-${i}-conv`)} pathLength={draw} className="pd-stroke pd-decide pd-thick" d={`M${x0 + FAN_LEN} ${380 + f * spread} L${loopEnd(i)} 380`} />
              ))}
            </g>
          );
        })}
      </g>

      <g data-group="route" {...gs('route')}>
        <path data-k={k('route-line')} className="pd-stroke pd-neutral pd-dashed pd-origin-left" d={`M60 ${ROUTE_Y} L940 ${ROUTE_Y}`} />
        <text data-k={k('route-label')} x={940} y={ROUTE_Y - 12} textAnchor="end" className="pd-label">AI routes feedback</text>
      </g>

      <g data-group="gate" {...gs('gate')}>
        {LOOP_X.map((_, i) => (
          <g key={i}>
            <rect data-k={k(`gate-${i}`)} x={loopEnd(i) - 10} y={GATE_Y} width={20} height={5} rx={1.5} className="pd-fill-neutral" />
            {!ghost && <rect data-k={`gate-${i}-hot`} x={loopEnd(i) - 10} y={GATE_Y} width={20} height={5} rx={1.5} className="pd-fill-decide" />}
            {!ghost && <rect data-k="pulse" x={loopEnd(i) - 10} y={GATE_Y} width={20} height={5} rx={1.5} className="pd-fill-decide pd-pulse" />}
          </g>
        ))}
        <text data-k={k('gate-label')} x={60} y={GATE_Y + 16} className="pd-label">I decide</text>
      </g>

      <g data-group="direction" {...gs('direction')}>
        {!ghost && (
          <g clipPath="url(#pd-direction-clip)">
            <g clipPath="url(#pd-direction-reveal)">
              <rect
                data-k="direction-fill"
                x={DIRECTION.x0}
                y={DIRECTION.top}
                width={DIRECTION.x1 - DIRECTION.x0}
                height={DIRECTION.base - DIRECTION.top}
                className="pd-direction-fill"
                style={{ opacity: 0 }}
              />
            </g>
          </g>
        )}
        <path data-k={k('direction-outline')} className="pd-stroke pd-decide pd-thin" d={DIRECTION_PATH} />
        <text data-k={k('direction-label')} x={60} y={DIRECTION.base - 36} className="pd-label">Direction</text>
      </g>
    </>
  );
}

const ProcessDiagram = forwardRef(function ProcessDiagram({ activeStep, label }, ref) {
  const gs = (group) => ({ 'data-active': isGroupActive(group, activeStep) || undefined });
  return (
    <div className="pd-diagram" role="img" aria-label={label}>
      <div className="pd-titles" aria-hidden="true">
        {/* Both titles and both scenes are faded by scroll (applyDiagramState). */}
        <p className="pd-title" data-k="title-dd">Double Diamond</p>
        <p className="pd-title" data-k="title-ai" style={{ opacity: 0 }}>AI-native design process</p>
      </div>
      <div ref={ref} className="pd-scenes">
        <svg className="pd-svg pd-scene" viewBox={DD_VIEWBOX} preserveAspectRatio="xMidYMin meet" aria-hidden="true">
          <g data-k="scene-dd">
            <g className="pd-ghost"><DoubleDiamond ghost /></g>
            <g className="pd-ink"><DoubleDiamond gs={gs} /></g>
          </g>
        </svg>
        <svg className="pd-svg pd-scene" viewBox={AI_VIEWBOX} preserveAspectRatio="xMidYMin meet" aria-hidden="true">
          <defs>
            <clipPath id="pd-direction-clip" clipPathUnits="userSpaceOnUse">
              <path d={DIRECTION_PATH} />
            </clipPath>
            <clipPath id="pd-direction-reveal" clipPathUnits="userSpaceOnUse">
              <rect data-k="direction-reveal" x={DIRECTION.x0} y={DIRECTION.top - 2} width={DIRECTION.x1 - DIRECTION.x0} height={DIRECTION.base - DIRECTION.top + 4} transform="scale(0 1)" />
            </clipPath>
            {/* Deepens left to right: early evidence is faint, settled direction is solid. */}
            <linearGradient id="pd-direction-gradient" gradientUnits="userSpaceOnUse" x1={DIRECTION.x0} y1={0} x2={DIRECTION.x1} y2={0}>
              <stop offset="0" className="pd-direction-stop" style={{ stopOpacity: 0.12 }} />
              <stop offset="1" className="pd-direction-stop" style={{ stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <g data-k="scene-ai" style={{ opacity: 0 }}>
            <g className="pd-ghost"><AINative ghost /></g>
            <g className="pd-ink">
              <AINative gs={gs} />
              <circle data-k="bet-drop" r={1} className="pd-fill-decide" style={{ opacity: 0 }} />
            <g data-group="particles" {...gs('particles')}>
              {PARTICLES.map((pt, n) => (
                <circle key={n} data-particle={n} r={1} className={PARTICLE_CLASS[pt.kind]} style={{ opacity: 0 }} />
              ))}
              </g>
            </g>
          </g>
          <g className="pd-ink"><BetInk gs={gs} /></g>
        </svg>
        {/* Names the three kinds while they play; cleared once routing is done.
            HTML, so the row lays itself out and each dot centers on its label. */}
        <div className="pd-legend" data-k="route-legend" style={{ top: `${LEGEND_TOP}%`, opacity: 0 }} aria-hidden="true">
          {LEGEND.map((item) => (
            <span key={item.kind} className="pd-legend-item">
              <span className={`pd-legend-dot pd-legend-dot--${item.kind}`} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ProcessDiagram;
