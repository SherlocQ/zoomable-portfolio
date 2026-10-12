/**
 * Crane: a web page being built like a site. A browser window lies on the desk
 * as a plot, its rows running across it: under the browser chrome, the nav, a
 * left-aligned hero and a row of cards are built; a banner and the footer are
 * still dashed slots, each cut to the beam's footprint. A tower crane stands beside
 * it, a lattice mast with a jib over the page, a counter-jib and its weight,
 * and tie lines from the apex. A steel I-beam hangs from the hook on two
 * slings: the bright mark. The pointer's x across the stage runs the trolley
 * along the jib on a spring (the outer 15% at each side holds the run's ends);
 * when its target sits over an empty section the beam lowers on the 700ms
 * tween and seats there, and the outline turns solid. The slider is the hoist
 * height the beam is carried at.
 *
 * The pattern: a continuous input (the trolley, on a spring) driving a
 * discrete one (which section is being built, read from the spring's target,
 * so the beam cannot bob as the trolley passes a slot's edge).
 */
import HL from './kernel';

const {
  Cam, clamp, facing, fit, lerp, poly, prism, proj, rings, rrect, seg, spring, stepS, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const PL = 150, PW = 100, T = 3, YM = PW / 2;                 // the page: rows run along y, stacked along x; its left edge is y = PW
const CH = 13;                                                  // the browser chrome's depth
const ROWS = [[17, 26], [30, 70], [74, 100], [107, 117], [128, 138]]; // nav, hero, cards, then a banner and the footer
const CARDS = [[8, 34], [37, 63], [66, 92]];                    // the built row of three cards
const SLOTS = [3, 4], Y0 = 12, Y1 = PW - 12, BW = 4;            // which rows are empty; the beam's length and half-width
const FIT = 1;                                                  // an empty slot is the beam's footprint plus this, all round
const MX = 176, MS = 4, JH = 122, XT = 6, XC = 214, APEX = 22;  // mast centre, half-width, jib height, tip, counter-jib end
const XMIN = 20, XMAX = 140, REST = 56;                         // the trolley's run and where it parks
const EDGE = 0.15;                                              // the outer 15% at each side holds the run's ends

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let hoist = value;

  const C = Cam(45, 0.5, 1.42);
  fit(C, [[0, 0, 0], [PL, PW, 0], [XC, YM, JH], [MX, YM, JH + APEX], [XT, YM, JH], [0, PW, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 1.5, b = 0.6) => { const [o, i] = rings(x0, y0, x1, y1, r, b); return prism(P, front, o, i, z0, z1); };
  const flat = (x0, y0, x1, y1, r, z = T) => poly(rrect(x0, y0, x1, y1, r, 3).map((q) => P(q.u, q.v, z)));

  // the plot: the page slab and its browser chrome (window dots at the left, an address bar)
  put(solid(g), box(0, 0, PL, PW, 0, T, 5, 1.8));
  const line = (x, ya, yb) => seg(P(x, ya, T), P(x, yb, T));     // a line of text, from ya (its left) to yb
  mk("path", { d: line(CH, 2, PW - 2), class: "nf lo" }, g);
  [91, 86, 81].forEach((y) => place(flatDot(g, C, 1.1, "dot off"), P(CH / 2, y, T)));
  mk("path", { d: flat(CH / 2 - 2.6, 26, CH / 2 + 2.6, 70, 2.6), class: "nf" }, g);
  // the built rows, left-aligned: a nav (logo, links), a hero (headline, copy, button)
  const [n0, n1] = ROWS[0], [h0] = ROWS[1];
  mk("path", { d: flat(n0 + 1, 80, n1 - 1, 92, 1.5), class: "nf" }, g);
  mk("path", { d: [[40, 32], [28, 20], [16, 8]].map(([a, b]) => line((n0 + n1) / 2, a, b)).join(""), class: "nf lo" }, g);
  mk("path", { d: line(h0 + 6, 88, 22) + line(h0 + 12, 88, 40), class: "nf" }, g);
  mk("path", { d: line(h0 + 20, 88, 30) + line(h0 + 25, 88, 46), class: "nf lo" }, g);
  mk("path", { d: flat(h0 + 31, 64, h0 + 38, 88, 3.5), class: "nf" }, g);
  // the built row of cards, then the two empty sections: dashed slots cut to the beam, so it seats exactly
  CARDS.forEach(([a, b]) => mk("path", { d: flat(ROWS[2][0], a, ROWS[2][1], b, 3), class: "nf" }, g));
  const slots = SLOTS.map((k) => {
    const c = (ROWS[k][0] + ROWS[k][1]) / 2;
    return mk("path", { d: flat(c - BW - FIT, Y0 - FIT, c + BW + FIT, Y1 + FIT, 1.5), class: "nf dash" }, g);
  });

  // the load: an I-beam (bottom flange, web, top flange) on two slings, the hook, the cable, the trolley
  const beam = [solid(g), solid(g), solid(g)];
  beam.forEach((s) => s.sil.classList.add("hi"));
  const slings = mk("path", { class: "nf" }, g), cable = mk("path", { class: "nf" }, g);
  const hook = mk("circle", { r: 1.6, class: "dot m" }, g);
  const trolley = solid(g);

  // the crane: jib and counter-jib (one boom through the mast), its lattice, the weight, the mast and apex, the ties
  put(solid(g), box(XT, YM - 3, XC, YM + 3, JH, JH + 5, 1.2, 0.5));
  let lat = "";
  for (let x = XT + 4, up = true; x < XC - 4; x += 8, up = !up) lat += seg(P(x, YM + 3, up ? JH : JH + 5), P(x + 8, YM + 3, up ? JH + 5 : JH));
  mk("path", { d: lat, class: "nf lo" }, g);
  put(solid(g), box(XC - 16, YM - 6, XC - 2, YM + 6, JH - 14, JH, 2, 0.8));
  put(solid(g), box(MX - MS, YM - MS, MX + MS, YM + MS, 0, JH, 1.2, 0.5));
  let mast = "";
  for (let z = 6, up = true; z < JH - 6; z += 10, up = !up) {
    mast += seg(P(up ? MX - MS : MX + MS, YM + MS, z), P(up ? MX + MS : MX - MS, YM + MS, z + 10));
    mast += seg(P(MX + MS, up ? YM - MS : YM + MS, z), P(MX + MS, up ? YM + MS : YM - MS, z + 10));
  }
  mk("path", { d: mast, class: "nf lo" }, g);
  put(solid(g), box(MX - 2, YM - 2, MX + 2, YM + 2, JH + 5, JH + APEX, 1, 0.4));
  mk("path", { d: seg(P(MX, YM, JH + APEX), P(XT + 40, YM, JH + 5)) + seg(P(MX, YM, JH + APEX), P(XC - 4, YM, JH + 5)), class: "nf lo" }, g);

  // the trolley follows the pointer on a spring; the drop is a choice, on the tween
  const sp = spring(REST, { eps: 0.05 }), drop = tween(0);
  let over = false, target = -1;
  const rowAt = (x) => ROWS.reduce((n, r, i) => (Math.abs((r[0] + r[1]) / 2 - x) < Math.abs((ROWS[n][0] + ROWS[n][1]) / 2 - x) ? i : n), 0);

  let last = "";
  function draw(now) {
    const cx = sp.x, dz = tval(drop, now), z = lerp(T + hoist, T, dz), hz = z + 6 + 28; // slings rise to a hook well above the beam
    const key = `${cx.toFixed(2)}|${z.toFixed(2)}`;
    if (key !== last) {
      last = key;
      put(beam[0], box(cx - BW, Y0, cx + BW, Y1, z, z + 1.2, 0.6, 0.3));
      put(beam[1], box(cx - 0.8, Y0, cx + 0.8, Y1, z + 1.2, z + 4.8, 0.4, 0.2));
      put(beam[2], box(cx - BW, Y0, cx + BW, Y1, z + 4.8, z + 6, 0.6, 0.3));
      slings.setAttribute("d", seg(P(cx, YM, hz), P(cx, Y0 + 8, z + 6)) + seg(P(cx, YM, hz), P(cx, Y1 - 8, z + 6)));
      cable.setAttribute("d", seg(P(cx, YM, JH - 3), P(cx, YM, hz)));
      place(hook, P(cx, YM, hz));
      put(trolley, box(cx - 5, YM - 4, cx + 5, YM + 4, JH - 3, JH, 1, 0.4));
    }
    // an outline turns solid once the beam has seated in it
    slots.forEach((el, i) => el.classList.toggle("dash", !(target === SLOTS[i] && dz > 0.97)));
  }

  const B = register(stage, (dt, now) => {
    const m = stepS(sp, dt);
    draw(now);
    return m || !tdone(drop, now);
  });
  bag.add(B.unregister);

  bag.add(pointer(stage, {
    move: (p) => {
      over = true;
      // the stage's width runs the trolley's whole run, so a sweep crosses every section
      let x = lerp(XMIN, XMAX, clamp((p[0] / 400 - EDGE) / (1 - 2 * EDGE), 0, 1));
      target = SLOTS.includes(rowAt(x)) ? rowAt(x) : -1;     // the nearest row; a slot is narrow, its catch is not
      if (target >= 0) x = (ROWS[target][0] + ROWS[target][1]) / 2;   // over a slot, the trolley lines up on it
      sp.t = x;
      tset(drop, target >= 0 ? 1 : 0, performance.now(), 0);
      read.textContent = `sec ${rowAt(x) + 1}`;
      B.wake();
    },
    leave: () => { over = false; target = -1; sp.t = REST; tset(drop, 0, performance.now(), 0); read.textContent = "rest"; B.wake(); },
  }));
  read.textContent = over ? read.textContent : "rest";
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { hoist = v; last = ""; B.wake(); },
    destroy: bag.dispose,
  };
}

export default {
  name: "crane",
  means: "A tower crane building a web page: the trolley follows the pointer and lowers its beam into an empty section.",
  rules: [1, 5, 6, 8],
  range: [24, 40, 56],
  mount,
};
