// The Process page diagram, as two scenes that are never shown together:
// the Double Diamond (steps 1–2) and the AI-native design process (steps
// 3–7). Geometry is static; every animated value is written imperatively by
// `applyDiagramState` from seven step progresses (0–1), so the picture is a
// pure function of scroll position — scrubbing back up replays it exactly in
// reverse. Motion is opacity, transform and stroke-dashoffset, plus one
// four-point path (the first diamond shrinking into the Bet).
//
// Color carries one meaning each: cool = making (going wide, execution going
// back into a loop), warm = judgment (narrowing down, direction signals,
// decisions, Direction), neutral = noise and structure.
//
// Each scene has two layers: `.pd-ghost` is the whole scene at low contrast,
// always on, so the reader sees the full picture from the start; `.pd-ink`
// is drawn in on top as the story reaches each part. Group dimming
// (data-group / data-active) is React state with a CSS transition.

// ─── Geometry ──────────────────────────────────────────────────────────────
// Scene titles are HTML above the diagram, so the viewBoxes crop to the art.
export const DD_VIEWBOX = '0 50 1000 250';
export const AI_VIEWBOX = '0 328 1000 384';
export const AI_SCENE_FROM_STEP = 2;
// Both scenes are top-aligned at the same width, so a Double Diamond point
// sits at the same place on screen as that point + this offset in the
// AI-native scene (used to hand the first diamond over to the Bet).
const SCENE_Y_OFFSET = 328 - 50;

// The two diamonds meet point to point — no connector, no gate marks.
export const DIAMONDS = [0, 440].map((dx) => ({
  divergeUp:   `M${60 + dx} 150 L${280 + dx} 60`,
  divergeDown: `M${60 + dx} 150 L${280 + dx} 240`,
  convergeUp:   `M${280 + dx} 60 L${500 + dx} 150`,
  convergeDown: `M${280 + dx} 240 L${500 + dx} 150`,
}));
export const DD_LABELS = [
  { x: 170, text: 'Discover' },
  { x: 390, text: 'Define' },
  { x: 610, text: 'Develop' },
  { x: 830, text: 'Deliver' },
];

// The Bet is the first diamond, still there but much shorter.
const FIRST_DIAMOND = [[60, 150], [280, 60], [500, 150], [280, 240]]
  .map(([x, y]) => [x, y + SCENE_Y_OFFSET]);
const BET_DIAMOND = [[60, 380], [95, 350], [130, 380], [95, 410]];
const diamondPath = (pts) => `M${pts.map(([x, y]) => `${x} ${y}`).join(' L')} Z`;
export const BET_PATH = diamondPath(BET_DIAMOND);
export const FIRST_DIAMOND_PATH = diamondPath(FIRST_DIAMOND);

export const LOOP_X = [180, 330, 480, 630, 780];
export const LOOP_SPREAD = [45, 38, 30, 24, 18];
// Going wide is cheap, so the fan is short; narrowing down takes the time,
// so the converge lines are long.
export const FAN_LEN = 30;
export const LOOP_LEN = 130;
export const loopEnd = (i) => LOOP_X[i] + LOOP_LEN;
// Rows are spaced so the routing legend fits between the gates and Direction.
export const ROUTE_Y = 490;
export const GATE_Y = 506;
export const LEGEND_Y = 560;

// Direction: a right triangle across the full width — zero height on the
// left, tallest on the right, its fill deepening smoothly left to right.
// It grows in a few large steps, not one per loop: the Bet lays the thin
// first edge, then only a pattern of matching signals moves it further.
// Loops run fast; direction changes slowly.
export const DIRECTION = { x0: 60, x1: 940, base: 700, top: 590 };
export const DIRECTION_PATH = `M${DIRECTION.x0} ${DIRECTION.base} L${DIRECTION.x1} ${DIRECTION.base} L${DIRECTION.x1} ${DIRECTION.top} Z`;
const BET_EDGE = 180;
const BET_X = 95;
const directionHeight = (x) => ((x - DIRECTION.x0) / (DIRECTION.x1 - DIRECTION.x0)) * (DIRECTION.base - DIRECTION.top);
const intoDirection = (x) => ({ x, y: DIRECTION.base - Math.max(3, directionHeight(x) * 0.4) });

// Settle: which direction signals form a pattern. A pair of matching signals
// from consecutive loops falls into Direction together; a lone signal is
// not kept.
export const PATTERNS = [
  { loops: [0, 1], window: [0.12, 0.45], reach: 460 },
  { loops: [3, 4], window: [0.6, 0.95], reach: 940 },
];
const LONE_SIGNAL = { loop: 2, window: [0.46, 0.6] };

// Routing: every loop sends back a shower of mixed feedback — mostly noise,
// a few execution issues (back into the next loop; the last loop has none)
// and two direction signals (the first one is what Settle judges; the second
// merges into it at the gate). Order and landing spots are deterministic
// pseudo-random so the shower looks natural but replays identically.
const hash = (n) => { const s = Math.sin(n * 12.9898) * 43758.5453; return s - Math.floor(s); };
const SHOWER_SPREAD = 54;
export const PARTICLES = LOOP_X.flatMap((_, loop) => {
  const kinds = [
    ...Array(14).fill('noise'),
    ...Array(loop < LOOP_X.length - 1 ? 4 : 0).fill('execution'),
    'direction', 'direction',
  ];
  const order = kinds.map((_, j) => j).sort((a, b) => hash(loop * 97 + a) - hash(loop * 97 + b));
  let primarySeen = false;
  return order.map((j, slot) => {
    const kind = kinds[j];
    const primary = kind === 'direction' && !primarySeen;
    if (primary) primarySeen = true;
    const dx = (hash(loop * 131 + j * 7) * 2 - 1) * SHOWER_SPREAD;
    return { loop, kind, dx, emit: slot / order.length, primary };
  });
});
// Loops route one after another, overlapping; a legend names the three
// kinds while they play and clears once routing is done.
const ROUTE_WINDOWS = [[0.06, 0.56], [0.16, 0.66], [0.26, 0.76], [0.36, 0.86], [0.46, 0.96]];
export const LEGEND = [
  { kind: 'noise', label: 'Noise' },
  { kind: 'execution', label: 'Execution issue' },
  { kind: 'direction', label: 'Direction signal' },
];

// Which groups are highlighted at each step (everything else dims).
const ACTIVE_GROUPS = [
  ['dd-diverge', 'dd-converge', 'dd-labels'],
  ['dd-diverge', 'dd-converge', 'dd-annot'],
  ['bet', 'direction'],
  ['loops'],
  ['route', 'particles'],
  ['gate', 'direction', 'particles'],
  'all',
];
export const isGroupActive = (group, step) => {
  if (group === 'rows') return true;
  const active = ACTIVE_GROUPS[Math.max(0, step)];
  return active === 'all' || active.includes(group);
};

// ─── State mapping ─────────────────────────────────────────────────────────
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (p, a, b) => clamp01((p - a) / (b - a));
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeIn = (t) => t * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const lerp = (a, b, t) => a + (b - a) * t;
const cubic = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};

export function indexDiagram(root) {
  const keyed = new Map();
  root.querySelectorAll('[data-k]').forEach((el) => {
    const key = el.getAttribute('data-k');
    if (!keyed.has(key)) keyed.set(key, []);
    keyed.get(key).push(el);
  });
  const all = (key) => keyed.get(key) || [];
  return { all, particles: [...root.querySelectorAll('[data-particle]')] };
}

// Opacity-gated stroke reveal (pathLength="1"): a zero-length dash with a
// round cap would otherwise leave a dot before the stroke starts.
const draw = (els, t, alpha = 1) => els.forEach((el) => {
  el.style.strokeDashoffset = String(1 - t);
  el.style.opacity = t > 0.001 ? String(alpha) : '0';
});
const fade = (els, o) => els.forEach((el) => { el.style.opacity = String(o); });
const transform = (els, value) => els.forEach((el) => { el.style.transform = value; });
const place = (el, x, y, scale, opacity) => {
  el.setAttribute('transform', `translate(${x} ${y}) scale(${scale})`);
  el.style.opacity = String(opacity);
};

/**
 * @param index  result of indexDiagram
 * @param P      seven step progresses, each 0–1 (past steps 1, future 0)
 * @param unit   viewBox units per screen pixel in the AI scene (dot size)
 * @param handover  0–1 progress of the Double Diamond → AI-native hand-over
 *                (step 3's text scrolling in); scene fades and the first
 *                diamond's shrink into the Bet are tied to it, so they scrub.
 */
export function applyDiagramState(index, P, unit, handover = 0) {
  const { all } = index;
  const [p1, p2, p3, p4, p5, p6, p7] = P;
  const dot = unit * 3.2;

  // 1 · The classic way — diamonds draw left to right, each label follows its half.
  const recolor = easeInOut(seg(p2, 0, 0.7));
  const windows = [[0, 0.22], [0.22, 0.45], [0.5, 0.72], [0.72, 0.95]];
  DIAMONDS.forEach((_, d) => {
    const div = easeOut(seg(p1, ...windows[d * 2]));
    const conv = easeOut(seg(p1, ...windows[d * 2 + 1]));
    draw(all(`dd-${d}-div`), div, 1 - recolor);
    draw(all(`dd-${d}-conv`), conv, 1 - recolor);
    // 2 · What changed — diverge crossfades to thin cool, converge to thick warm.
    fade(all(`dd-${d}-div-wide`), div >= 1 ? recolor : 0);
    fade(all(`dd-${d}-conv-hard`), conv >= 1 ? recolor : 0);
  });
  [[0.2, 0.28], [0.43, 0.51], [0.7, 0.78], [0.93, 1]].forEach(([a, b], i) => {
    fade(all(`dd-label-${i}`), seg(p1, a, b));
  });
  fade(all('dd-annot-easy'), seg(p2, 0.45, 0.8));
  fade(all('dd-annot-hard'), seg(p2, 0.55, 0.9));

  // Hand-over — as step 3's text scrolls in, a copy of the first diamond
  // appears exactly over the Double Diamond's, that scene fades out, and the
  // copy shrinks into the Bet while the AI-native scene fades in around it.
  const h = handover;
  fade(all('scene-dd'), 1 - seg(h, 0, 0.35));
  fade(all('scene-ai'), seg(h, 0.3, 1));
  fade(all('title-dd'), 1 - seg(h, 0, 0.4));
  fade(all('title-ai'), seg(h, 0.4, 1));

  // 3 · Bet — the first diamond shrinks into the Bet, then drops its first
  // thin edge into Direction.
  const shrink = easeInOut(seg(h, 0.15, 1));
  const bet = FIRST_DIAMOND.map(([x, y], i) => [lerp(x, BET_DIAMOND[i][0], shrink), lerp(y, BET_DIAMOND[i][1], shrink)]);
  all('bet-shape').forEach((el) => {
    el.setAttribute('d', diamondPath(bet));
    el.style.opacity = String(seg(h, 0, 0.25));
  });
  fade(all('bet-label'), seg(p3, 0, 0.2));
  const drop = easeInOut(seg(p3, 0.15, 0.6));
  // Falls straight down from the Bet into Direction's thin first edge.
  const betTarget = intoDirection(BET_X);
  all('bet-drop').forEach((el) => place(
    el,
    BET_X,
    lerp(412, betTarget.y, easeIn(drop)),
    dot,
    drop > 0 && drop < 1 ? 1 : 0,
  ));
  const betLaid = easeOut(seg(p3, 0.55, 0.85));

  // 4 · Loop — one by one: the short fan snaps open, the long converge is slow.
  LOOP_X.forEach((_, i) => {
    const lp = seg(p4, i * 0.2, i * 0.2 + 0.2);
    draw(all(`loop-${i}-conn`), easeOut(seg(lp, 0, 0.1)));
    draw(all(`loop-${i}-fan`), easeOut(seg(lp, 0.08, 0.2)));
    draw(all(`loop-${i}-conv`), easeInOut(seg(lp, 0.22, 1)));
  });

  // 5 · Route — AI routes each loop's feedback three ways. A legend names the
  // kinds while the particles play and clears once routing is done.
  const route = easeOut(seg(p5, 0, 0.12));
  transform(all('route-line'), `scaleX(${route})`);
  fade(all('route-line'), route > 0.001 ? 1 : 0);
  fade(all('route-label'), seg(p5, 0.05, 0.15));
  LOOP_X.forEach((_, i) => fade(all(`gate-${i}`), seg(p5, 0.05, 0.15)));
  fade(all('gate-label'), seg(p5, 0.05, 0.15));
  fade(all('route-legend'), seg(p5, 0.04, 0.12) * (1 - seg(p5, 0.94, 1)));

  // 6 · Settle — gates warm; waiting signals dim. A matching pair across loops
  // falls into Direction together and moves it in one large step; the lone
  // signal is not kept.
  const warm = easeOut(seg(p6, 0, 0.1));
  LOOP_X.forEach((_, i) => fade(all(`gate-${i}-hot`), warm));
  let reach = DIRECTION.x0 + (BET_EDGE - DIRECTION.x0) * betLaid;
  PATTERNS.forEach((pattern) => {
    const w = seg(p6, ...pattern.window);
    reach = lerp(reach, pattern.reach, easeOut(seg(w, 0.45, 1)));
  });
  const reveal = (reach - DIRECTION.x0) / (DIRECTION.x1 - DIRECTION.x0);
  all('direction-reveal').forEach((el) => el.setAttribute('transform', `translate(${DIRECTION.x0} 0) scale(${reveal} 1) translate(${-DIRECTION.x0} 0)`));
  fade(all('direction-fill'), reach > DIRECTION.x0 + 1 ? 1 : 0);
  fade(all('direction-label'), seg(p3, 0.7, 0.9));
  const grown = (reach - DIRECTION.x0) / (DIRECTION.x1 - DIRECTION.x0);
  fade(all('direction-outline'), betLaid > 0 ? 0.25 + 0.75 * grown : 0);

  index.particles.forEach((el, n) => {
    const { loop, kind, dx, emit, primary } = PARTICLES[n];
    const xe = loopEnd(loop);
    const lp = seg(p5, ...ROUTE_WINDOWS[loop]);
    // Each particle leaves the loop's tip in turn (a shower, not a clump),
    // falls onto the routing line, and only there is sent on its way.
    const start = emit * 0.5;
    const fall = seg(lp, start, start + 0.25);
    const route = seg(lp, start + 0.25, start + 0.5);
    const landX = xe + dx;
    let x = lerp(xe, landX, easeOut(fall));
    let y = lerp(380, ROUTE_Y, easeIn(fall));
    let opacity = fall > 0 ? 1 : 0;
    let scale = 1;

    if (kind === 'noise') {
      // Goes nowhere: rests on the line a moment, then dissolves.
      const gone = seg(route, 0.4, 1);
      opacity *= 1 - gone;
      scale = 1 - 0.7 * gone;
    } else if (kind === 'execution') {
      // Back up into making: arcs into the next loop's fan.
      const t = easeInOut(route);
      const nx = LOOP_X[loop + 1];
      x = cubic(landX, landX + 20, nx - 10, nx, t);
      y = cubic(ROUTE_Y, ROUTE_Y - 60, 350, 380, t);
      opacity *= 1 - seg(route, 0.85, 1);
    } else {
      // Down to me: gathers at the loop's gate and waits for judgment.
      const t = easeOut(route);
      x = lerp(landX, xe, t);
      y = lerp(ROUTE_Y, GATE_Y - 7, t);
      if (!primary) {
        // The second signal merges into the first at the gate.
        opacity *= 1 - seg(route, 0.8, 1);
      } else {
        opacity *= 1 - 0.4 * warm; // waiting, not yet kept
        const pattern = PATTERNS.find((pt) => pt.loops.includes(loop));
        if (pattern) {
          const w = seg(p6, ...pattern.window);
          // Settles straight down from its own gate into Direction.
          const pass = easeIn(seg(w, 0, 0.6));
          y = lerp(y, intoDirection(xe).y, pass);
          if (w > 0) opacity = (fall > 0 ? 1 : 0) * (1 - seg(w, 0.55, 0.7));
        } else if (loop === LONE_SIGNAL.loop) {
          // A lone signal is not kept: it fades at the gate.
          const gone = seg(p6, ...LONE_SIGNAL.window);
          opacity *= 1 - gone;
          scale = 1 - 0.6 * gone;
        }
      }
    }
    place(el, x, y, dot * scale, opacity);
  });

  // 7 · The difference — a decision point under every loop pulses together.
  const beat = Math.sin(Math.PI * seg(p7, 0.15, 0.6));
  transform(all('pulse'), `scale(${1 + 0.45 * beat})`);
  fade(all('pulse'), beat);
}
