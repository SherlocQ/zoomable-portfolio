/**
 * Layout: a browser window standing on the desk, facing the viewer, being
 * resized. A ruler runs above it with two breakpoint marks; on its face are a
 * bar across the top, an input box, and six cards in a masonry grid. The
 * pointer's x across the stage sets the window's width, on a spring: the
 * outer 15% at each side holds the narrowest / widest, and the middle 70%
 * splits evenly into the one-, two- and three-column ranges; past
 * each breakpoint the cards re-flow (three columns, two, one) on the 700ms
 * tween, staggered card by card. The window keeps its height, like a
 * viewport: cards that flow below it are cut at its edge, as if to scroll.
 * At rest the window is at its widest, the last breakpoint, three columns.
 * The bright edge is the resize handle on the window's right side. The
 * slider is the stagger.
 *
 * The pattern: a continuous input (the width, on a spring) driving a
 * discrete one (the column count, read from the spring's target, never its
 * position, so the layout cannot flicker at a breakpoint).
 */
import HL from './kernel';
const {
  Cam, clamp, facing, fit, lerp, poly, prism, proj, rings, rrect, seg, spring, stepS, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const WMIN = 50, WMAX = 200, REST = 200, BP = [100, 150], PAD = 7, GAP = 5, TOP = 32, PX = 8; // the ends and breakpoints sit on the ruler's long ticks
const CARDS = [24, 15, 19, 17, 22, 13]; // card heights: an uneven masonry
const EDGE = 0.15; // the outer 15% at each side already holds the narrowest / widest width
const T = 3, VIEW = 104; // the window's thickness and its height: a fixed viewport

/** Where each card sits for a column count: its left and right as fractions of the content width, and its top. */
function layout(cols) {
  const bottoms = Array(cols).fill(TOP);
  return CARDS.map((h) => {
    const c = bottoms.indexOf(Math.min(...bottoms)), y = bottoms[c];
    bottoms[c] += h + GAP;
    return { f0: c / cols, f1: (c + 1) / cols, y, h, bottom: Math.max(...bottoms) };
  });
}
const colsFor = (w) => (w >= BP[1] ? 3 : w >= BP[0] ? 2 : 1);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;

  const C = Cam(45, 0.5, 1.45);
  fit(C, [[0, -T, 0], [WMAX + 4, 0, 0], [0, 0, VIEW + 16], [WMAX + 4, 0, VIEW + 16]], 200, 166);
  const P = proj(C), front = facing(C);
  /** A point on the window's face: u across from its left edge, v down from its top. */
  const F = (u, v, lift = 0.6) => P(u, lift, VIEW - v);
  const g = mk("g", {}, svg);

  // the ruler above the window: the baseline and the long ticks in the window's outline colour,
  // the short ticks dim, and a dot at each breakpoint
  let major = seg(P(0, 0, VIEW + 8), P(WMAX, 0, VIEW + 8)), minor = "";
  for (let x = 0; x <= WMAX; x += 10) {
    if (x % 50) minor += seg(P(x, 0, VIEW + 8), P(x, 0, VIEW + 10));
    else major += seg(P(x, 0, VIEW + 8), P(x, 0, VIEW + 12));
  }
  mk("path", { d: minor, class: "nf lo" }, g);
  mk("path", { d: major, class: "nf sil" }, g);
  const marks = BP.map((x) => { const d = flatDot(g, C, 1.3, "dot off"); place(d, P(x, 0, VIEW + 8)); return d; });

  const win = solid(g), bar = mk("path", { class: "nf lo" }, g), field = mk("path", {}, g);
  const handle = mk("path", { class: "hi" }, g);

  // cards start where the rest width puts them
  let cols = colsFor(REST);
  const cards = layout(cols).map((l) => ({ el: mk("path", {}, g), f0: tween(l.f0), f1: tween(l.f1), y: tween(l.y) }));
  marks.forEach((m, i) => m.setAttribute("class", cols > i + 1 ? "dot m" : "dot off"));

  const sp = spring(REST, { eps: 0.05 });

  function reflow(n, now) {
    if (n === cols) return;
    cols = n;
    layout(n).forEach((l, i) => {
      const k = cards[i], d = i * stag;
      tset(k.f0, l.f0, now, d); tset(k.f1, l.f1, now, d); tset(k.y, l.y, now, d);
    });
    marks.forEach((m, i) => m.setAttribute("class", n > i + 1 ? "dot m" : "dot off"));
  }

  const face = (x0, y0, x1, y1, r) => poly(rrect(x0, y0, x1, y1, r, 3).map((q) => F(q.u, q.v)));
  let over = false;
  function draw(now) {
    const w = sp.x, inner = w - 2 * PAD;
    // the window: a thin slab standing on the desk, its face toward the viewer
    const [r, ri] = rings(0, -T, w, 0, 1.4, 0.5);
    put(win, prism(P, front, r, ri, 0, VIEW));
    bar.setAttribute("d", seg(F(2, 10), F(w - 2, 10)));
    const fw = Math.min(inner, 110), fx = (w - fw) / 2;
    field.setAttribute("d", face(fx, 16, fx + fw, 24, 4));
    cards.forEach((k, i) => {
      const f0 = tval(k.f0, now), f1 = tval(k.f1, now), y = tval(k.y, now), bottom = VIEW - 4;
      const x0 = PAD + f0 * inner + (f0 > 0.01 ? GAP / 2 : 0), x1 = PAD + f1 * inner - (f1 < 0.99 ? GAP / 2 : 0);
      // cut at the viewport's bottom edge, as if the page scrolls on
      k.el.setAttribute("d", y >= bottom - 2 ? "" : face(x0, y, x1, Math.min(y + CARDS[i], bottom), 2.5));
    });
    handle.setAttribute("d", face(w - 1.4, VIEW / 2 - 9, w + 0.6, VIEW / 2 + 9, 1));
    read.textContent = over ? `${Math.round(w * PX)} px` : "rest";
  }

  const B = register(stage, (dt, now) => {
    let m = stepS(sp, dt);
    reflow(colsFor(sp.t), now);
    draw(now);
    if (cards.some((k) => !tdone(k.f0, now) || !tdone(k.f1, now) || !tdone(k.y, now))) m = true;
    return m;
  });
  bag.add(B.unregister);

  bag.add(pointer(stage, {
    move: (p) => { over = true; sp.t = lerp(WMIN, WMAX, clamp((p[0] / 400 - EDGE) / (1 - 2 * EDGE), 0, 1)); B.wake(); },
    leave: () => { over = false; sp.t = REST; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = v; },
    destroy: bag.dispose,
  };
}

export default {
  name: "layout",
  means: "A browser window being resized: its cards re-flow from three columns to two to one at each breakpoint.",
  rules: [1, 2, 5, 8],
  range: [0, 50, 100],
  mount,
};
