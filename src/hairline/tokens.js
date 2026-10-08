/**
 * Tokens: two design systems' colour and type tokens on two boards, Seismic
 * at the back left, Arc at the front right. Colour tokens are round chips
 * whose tops are filled dark, light or left open: one colour's shades. Type
 * tokens are upright specimen cards, tallest to smallest, each with an A on
 * its face: the type scale (the glyph is the token's subject, asked for). The
 * mapping is not one to one, and the two scales differ a little. The token
 * nearest the pointer lifts, its match on the other board lifts with it, and
 * a dashed arc joins the pair. At rest nothing is chosen and no arc is drawn
 * (asked for: the arc appears only with the pointer). The slider is the lift.
 *
 * The pattern: discrete items on the 700ms tween, staggered within the pair.
 * The pick is the token whose resting top is nearest the pointer on screen, so
 * any point picks one and nothing moving can change the pick.
 */
import HL from './kernel';
const {
  Cam, fit, open, prism, proj, rings, rrect, tdone, tset, tval, tween, facing,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const BW = 84, BD = 64, BT = 3, GAP = 56, N = 3, STEP = 24, CR = 7.5, CH = 2.6;
const COLOR_Y = 46, TYPE_Y = 16; // type cards stand at the back, so the low colour chips in front never hide behind them
const TONES = [["dot m", "dot off", ""], ["dot m", "dot off", ""]]; // each chip's top: dark, light, open
const SCALE = [[34, 24, 16], [37, 27, 18]]; // specimen card heights: each system's type scale
const MAP = { colour: [0, 2, 2], type: [0, 1, 2] }; // Seismic token i → Arc token

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const ox = [0, BW + GAP]; // each board's x origin: Seismic, then Arc
  const C = Cam(45, 0.5, 1.4);
  fit(C, [[-4, -4, 0], [ox[1] + BW + 4, -4, 0], [-4, BD + 4, 0], [ox[1] + BW + 4, BD + 4, 0], [ox[0] + BW, 10, 34 + 18 + 28]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the boards, back (Seismic) first
  for (const x of ox) {
    const [r, inner] = rings(x - 4, -4, x + BW + 4, BD + 4, 5, 1.6);
    put(solid(g), prism(P, front, r, inner, -BT, 0));
  }

  // the tokens: built back to front (by x + y), each a solid that can lift
  const tokens = [];
  for (const row of ["colour", "type"]) {
    for (let side = 0; side < 2; side++) {
      for (let i = 0; i < N; i++) {
        const x = ox[side] + 16 + i * STEP, y = row === "colour" ? COLOR_Y : TYPE_Y;
        tokens.push({ row, side, i, x, y, z: tween(0), el: null, dots: [], drawn: NaN });
      }
    }
  }
  tokens.sort((a, b) => a.x + a.y - (b.x + b.y));
  for (const t of tokens) {
    t.el = solid(g);
    if (t.row === "colour" && TONES[t.side][t.i]) t.dots.push(flatDot(g, C, CR - 2, TONES[t.side][t.i]));
    if (t.row === "type") t.glyph = mk("path", { class: "nf sil" }, g);
  }
  const link = mk("path", { class: "nf hi dash" }, g);

  const find = (row, side, i) => tokens.find((t) => t.row === row && t.side === side && t.i === i);
  /** A token's match on the other board; an Arc token nothing maps to answers with the nearest that does. */
  const partner = (t) => {
    if (t.side === 0) return find(t.row, 1, MAP[t.row][t.i]);
    const m = MAP[t.row], src = m.reduce((b, v, i) => (Math.abs(v - t.i) < Math.abs(m[b] - t.i) ? i : b), 0);
    return find(t.row, 0, src);
  };

  function drawToken(t, z) {
    if (z === t.drawn) return;
    t.drawn = z;
    if (t.row === "colour") {
      const ring = rrect(t.x - CR, t.y - CR, t.x + CR, t.y + CR, CR, 4), inner = rrect(t.x - CR + 0.8, t.y - CR + 0.8, t.x + CR - 0.8, t.y + CR - 0.8, CR - 0.8, 4);
      put(t.el, prism(P, front, ring, inner, z, z + CH));
      t.dots.forEach((d) => place(d, P(t.x, t.y, z + CH)));
    } else {
      // a specimen card standing in the row, an A drawn on its face, sized with the card
      const h = SCALE[t.side][t.i], w = h * 0.72, [ring, inner] = rings(t.x - w / 2, t.y - 1.2, t.x + w / 2, t.y + 1.2, 1.2, 0.5);
      put(t.el, prism(P, front, ring, inner, z, z + h));
      const f = (u, v) => P(t.x + u * w, t.y + 1.3, z + v * h);
      t.glyph.setAttribute("d", open([f(-0.28, 0.18), f(0, 0.82), f(0.28, 0.18)]) + open([f(-0.15, 0.42), f(0.15, 0.42)]));
    }
  }
  const top = (t, z) => [t.x, t.y, z + (t.row === "colour" ? CH : SCALE[t.side][t.i])];

  let pair = null;
  function drawLink(now) {
    if (!pair) { link.setAttribute("d", ""); return; }
    const a = top(pair[0], tval(pair[0].z, now)), b = top(pair[1], tval(pair[1].z, now)), pts = [];
    const peak = Math.max(a[2], b[2]) + 16;
    for (let s = 0; s <= 24; s++) {
      const u = s / 24, w = 4 * u * (1 - u);
      pts.push(P(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u + w * (peak - Math.max(a[2], b[2]))));
    }
    link.setAttribute("d", open(pts));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const t of tokens) { drawToken(t, tval(t.z, now)); if (!tdone(t.z, now)) moving = true; }
    drawLink(now);
    return moving;
  });
  bag.add(B.unregister);

  const tops = () => tokens.map((t) => P(...top(t, 0)));
  const rest = tops();
  /** The token whose resting top is nearest the point. */
  const hit = (p) => rest.reduce((b, q, i) => (Math.hypot(q[0] - p[0], q[1] - p[1]) < Math.hypot(rest[b][0] - p[0], rest[b][1] - p[1]) ? i : b), 0);

  let act = null;
  /** Lifts token t and its match and joins them; null puts every token down and drops the arc. */
  function choose(t) {
    if (t === act) return;
    act = t;
    const now = performance.now();
    pair = t ? (t.side === 0 ? [t, partner(t)] : [partner(t), t]) : null;
    for (const u of tokens) {
      const on = !!pair && (u === pair[0] || u === pair[1]);
      tset(u.z, on ? lift : 0, now, on && u !== t ? 60 : 0);
      u.el.sil.classList.toggle("hi", on);
    }
    read.textContent = pair ? `${pair[0].row} ${pair[0].i + 1} → ${pair[1].i + 1}` : "rest";
    B.wake();
  }
  read.textContent = "rest";

  bag.add(pointer(stage, {
    move: (p) => choose(tokens[hit(p)]),
    leave: () => choose(null),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { lift = v; const t = act; act = null; choose(t); },
    destroy: bag.dispose,
  };
}

export default {
  name: "tokens",
  means: "Two systems' colour and type tokens: the one under the pointer lifts with its match, joined by a dashed arc.",
  rules: [1, 4, 5, 10],
  range: [8, 14, 20],
  mount,
};
