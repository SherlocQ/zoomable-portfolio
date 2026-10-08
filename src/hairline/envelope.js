/**
 * Envelope: an envelope lying on the desk, its flap standing open and a
 * letter half out of it. The nearer the pointer, the more it closes: the
 * letter slides in first, then the flap folds down, on one spring, until the
 * wax seal at the flap's tip lies on the envelope. The bright edge is the
 * letter while the flap stands open, and the seal once it tips forward. The envelope's folds are
 * the two creases that meet under the flap. The slider is the reach.
 *
 * The pattern: one continuous value on a spring, from the pointer's screen
 * distance to the envelope's resting middle, which never moves. The flap is moved in the paint
 * order, not redrawn, when it passes upright (rule 06).
 */
import HL from './kernel';
const {
  Cam, clamp, fit, lerp, open, poly, prism, proj, rad, rings, rrect, seg,
  spring, stepS, disposer, mk, pointer, put, register, solid, facing,
} = HL;

const W = 110, H = 72, TH = 3, FH = 44, OPEN = 128, LET = 34, NEAR = 30;
const LX0 = 31, LX1 = W - 31; // narrow enough to stand inside the open flap

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value, over = null;

  const C = Cam(45, 0.5, 1.9);
  const oa = rad(OPEN);
  fit(C, [[0, FH * Math.cos(oa), 0], [W, 0, 0], [0, H, 0], [W, H, 0], [W / 2, FH * Math.cos(oa), TH + FH * Math.sin(oa)], [LX0, 6, TH + LET]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the flap, painted first while it stands open behind the letter
  const flap = mk("g", {}, g);
  const fsil = mk("path", { class: "sil" }, flap), fcr = mk("path", { class: "nf lo" }, flap);
  // the letter, half out of the opening
  const letter = mk("g", {}, g);
  const lface = mk("path", { class: "sil" }, letter), llines = mk("path", { class: "nf lo" }, letter);
  // the envelope's body: a thin plate, and the folds that meet under the flap
  const body = solid(g);
  const [br, bi] = rings(0, 0, W, H, 4, 1.2);
  put(body, prism(P, front, br, bi, 0, TH));
  mk("path", { d: open([P(1.5, H - 1.5, TH), P(W / 2, H * 0.48, TH), P(W - 1.5, H - 1.5, TH)]), class: "nf lo" }, g);
  const seal = mk("path", { class: "hi" }, flap);
  const sealIn = mk("path", { class: "nf lo" }, flap);

  // flap points, in its own plane: u along the hinge, v out from it; a is its angle off the body
  const tri = [[1, 0], [W - 1, 0], [W / 2 + 7, FH - 5], [W / 2, FH], [W / 2 - 7, FH - 5]];
  const sp = spring(0, { eps: 0.002 });
  let drawn = NaN, behind = true;

  function draw() {
    const c = sp.x;
    if (c === drawn) return;
    drawn = c;
    // the letter is all the way in before the flap passes upright, so the flap never closes over it
    const deg = lerp(OPEN, 0, c), a = rad(deg), lift = LET * clamp((deg - 90) / (OPEN - 90), 0, 1);
    const F = (u, v, dz = 0) => P(u, v * Math.cos(a) - dz * Math.sin(a), TH + v * Math.sin(a) + dz * Math.cos(a));
    fsil.setAttribute("d", poly(tri.map(([u, v]) => F(u, v))));
    fcr.setAttribute("d", open([F(5, 1.5), F(W - 5, 1.5)]));
    const up = lerp(OPEN, 0, c) <= 90; // the seal is on the flap's outer face, seen only once it tips forward
    seal.setAttribute("d", up ? poly(rrect(W / 2 - 6, FH - 13, W / 2 + 6, FH - 1, 6, 4).map((q) => F(q.u, q.v, 0.8))) : "");
    sealIn.setAttribute("d", up ? poly(rrect(W / 2 - 3.5, FH - 10.5, W / 2 + 3.5, FH - 3.5, 3.5, 4).map((q) => F(q.u, q.v, 0.8))) : "");
    lface.classList.toggle("hi", !up);
    // the letter, leaning back a little; only what is out of the envelope is drawn
    const L = (u, v) => P(u, 6 - v * 0.17, TH + v);
    if (lift < 0.5) { lface.setAttribute("d", ""); llines.setAttribute("d", ""); }
    else {
      lface.setAttribute("d", poly([L(LX0, 0), L(LX1, 0), L(LX1, lift), L(LX0, lift)]));
      let d = "";
      for (const v of [7, 12, 17]) if (lift - v > 1) d += seg(L(LX0 + 6, lift - v), L(LX1 - (v === 17 ? 18 : 6), lift - v));
      llines.setAttribute("d", d);
    }
    // past upright the flap comes forward over the body; before it, it stays behind the letter
    const back = lerp(OPEN, 0, c) > 90;
    if (back !== behind) { behind = back; if (back) g.prepend(flap); else g.append(flap); }
    read.textContent = !over ? "rest" : c > 0.97 ? "sealed" : `flap ${Math.round(lerp(OPEN, 0, c))}°`;
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const mid = P(W / 2, H / 2, TH);
  function retarget() {
    sp.t = over ? 1 - clamp((Math.hypot(over[0] - mid[0], over[1] - mid[1]) - NEAR) / R, 0, 1) : 0;
    drawn = NaN;
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { over = p; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v; if (over) retarget(); },
    destroy: bag.dispose,
  };
}

export default {
  name: "envelope",
  means: "An open envelope: the nearer the pointer, the further the letter slides in and the flap folds shut.",
  rules: [1, 3, 5, 6],
  range: [100, 150, 210],
  mount,
};
