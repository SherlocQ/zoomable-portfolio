/**
 * Folder: a project folder standing open, four sheets inside it. The sheet
 * under the pointer floats up out of the folder; the others lift a little,
 * staggered outwards from it, and the front cover falls open further. Each
 * sheet carries a picture frame, a dot and two lines, the way a case study
 * does. The slider is the stagger, in ms.
 *
 * The pattern: discrete items, as Riffle. The pick is the pointer's screen x
 * across the folder's resting span, front sheet at the left, back at the
 * right, so any point picks a sheet and nothing moving can change the pick.
 */
import HL from './kernel';
const {
  Cam, clamp, fillet, fit, poly, proj, rad, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, place, pointer, register,
} = HL;

const W = 112, G = 8, LIFT = 30, NUDGE = 5;
const BACK_H = 74, FRONT_H = 40, FRONT_REST = 9, FRONT_OPEN = 22;
const SHEETS = [ // x offset, width, height, rest lift
  [5, 100, 66, 2], [9, 98, 60, 14], [4, 102, 57, 0], [8, 96, 52, 3],
];
const N = SHEETS.length, Y_BACK = 0, Y_FRONT = (N + 1) * G;

/** An upright plate at depth yb, leaning th degrees (positive leans toward the viewer), lifted by z: one outline, no thickness. */
function plane(P, yb, th, z) {
  const s = Math.sin(rad(th)), c = Math.cos(rad(th));
  return {
    w: (u, v) => P(u, yb + v * s, v * c + z),
  };
}

/** The back cover's outline, with its tab. */
const backShape = () => fillet(
  [[0, 0], [W, 0], [W, BACK_H], [44, BACK_H], [38, BACK_H + 9], [8, BACK_H + 9], [3, BACK_H]],
  [2, 2, 4, 3, 3, 3, 3],
);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;

  const C = Cam(45, 0.5, 1.7);
  const reach = FRONT_H * Math.sin(rad(FRONT_OPEN));
  fit(C, [[0, -6, 0], [W, -6, 0], [0, Y_FRONT + reach, 0], [W, Y_FRONT + reach, 0], [0, 0, BACK_H + 9], [W, G, 66 + LIFT]], 200, 166);
  const P = proj(C);

  const g = mk("g", {}, svg);
  // the folder's gusset: the fold between the covers, along the floor
  mk("path", { d: seg(P(0, Y_BACK, 0), P(0, Y_FRONT, 0)) + seg(P(W, Y_BACK, 0), P(W, Y_FRONT, 0)), class: "nf lo" }, g);

  // back cover, leaning back a little: it never moves
  const bs = backShape(), bp = plane(P, Y_BACK, -6, 0);
  mk("path", { d: poly(bs.map((p) => bp.w(p[0], p[1]))), class: "sil" }, g);

  // the sheets, back to front
  const sheets = SHEETS.map(([x0, sw, sh, z0], i) => {
    const shape = fillet([[x0, 0], [x0 + sw, 0], [x0 + sw, sh], [x0, sh]], [1, 1, 3, 3]);
    const grp = mk("g", {}, g);
    const face = mk("path", { class: "sil" }, grp);
    const pic = mk("path", { class: "nf lo" }, grp), lines = mk("path", { class: "nf lo" }, grp);
    const dot = mk("circle", { r: 1.6, class: i === 1 ? "dot" : "dot off" }, grp);
    const yb = Y_BACK + (i + 1) * G;
    return { x0, sw, sh, z0, yb, shape, face, pic, lines, dot, z: tween(z0), a: tween(-4), drawn: "" };
  });

  // front cover, hinged at the floor's near edge
  const fs = fillet([[0, 0], [W, 0], [W, FRONT_H], [0, FRONT_H]], [2, 2, 4, 4]);
  const fFace = mk("path", { class: "sil" }, g);
  const flap = tween(FRONT_REST);

  // the folder's resting span on screen, from the front cover's left foot to the back cover's right
  const xl = P(0, Y_FRONT, 0)[0], xr = P(W, Y_BACK, 0)[0];

  function drawSheet(s, now) {
    const th = tval(s.a, now), z = tval(s.z, now), key = th.toFixed(2) + z.toFixed(2);
    if (key === s.drawn) return;
    s.drawn = key;
    const pl = plane(P, s.yb, th, z), u0 = s.x0 + 7, v1 = s.sh - 7;
    s.face.setAttribute("d", poly(s.shape.map((p) => pl.w(p[0], p[1]))));
    s.pic.setAttribute("d", poly(rrect(u0, v1 - 18, u0 + 30, v1, 2, 3).map((q) => pl.w(q.u, q.v))));
    s.lines.setAttribute("d", seg(pl.w(u0 + 38, v1 - 4), pl.w(s.x0 + s.sw - 8, v1 - 4)) + seg(pl.w(u0 + 38, v1 - 10), pl.w(s.x0 + s.sw - 22, v1 - 10)));
    place(s.dot, pl.w(u0 + 8, v1 - 6));
  }
  function drawFront(now) {
    const pl = plane(P, Y_FRONT, tval(flap, now), 0);
    fFace.setAttribute("d", poly(fs.map((p) => pl.w(p[0], p[1]))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = !tdone(flap, now);
    for (const s of sheets) { drawSheet(s, now); if (!tdone(s.a, now) || !tdone(s.z, now)) moving = true; }
    drawFront(now);
    return moving;
  });
  bag.add(B.unregister);

  let act = -1;
  /** The sheet for a screen x: front at the left, back at the right; the span's ends hold past it. */
  const hit = (p) => N - 1 - Math.floor(clamp((p[0] - xl) / (xr - xl), 0, 0.999) * N);

  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    sheets.forEach((s, i) => {
      const delay = Math.abs(i - from) * stag;
      tset(s.z, a < 0 ? s.z0 : i === a ? LIFT : NUDGE, now, delay);
      tset(s.a, a < 0 ? -4 : i === a ? 0 : i < a ? -7 : 2, now, delay);
      s.face.classList.toggle("hi", i === a);
      s.dot.setAttribute("class", i === a || (a < 0 && i === 1) ? "dot" : "dot off");
    });
    tset(flap, a < 0 ? FRONT_REST : FRONT_OPEN, now, 0);
    read.textContent = a < 0 ? "rest" : "file " + String(a + 1).padStart(2, "0");
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = v; },
    destroy: bag.dispose,
  };
}

export default {
  name: "folder",
  means: "An open project folder: the sheet under the pointer floats up, and the rest stir in turn.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  mount,
};
