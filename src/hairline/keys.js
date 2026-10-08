/**
 * Keys: three keycaps in a loop on the desk, each with its own raised shape:
 * a circle, a triangle, a square. Dashed arcs on the ground join them into
 * a loop, in the same dashed style as the keys' footprints. The key under the pointer
 * floats up and its shape takes the bright edge; the others rise a little
 * after it. At rest all three sit on the desk and the circle is lit. The
 * slider is the lift, in world units.
 *
 * The pattern: discrete items on the 700ms tween. The pick is the key whose
 * resting top is nearest the pointer on screen, so any point picks one and
 * a key rising cannot change the pick.
 */
import HL from './kernel';
const {
  Cam, clamp, facing, fit, hull, open, poly, proj, ringAt, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const HALF = 16, TOP = 13.5, T = 9, RELIEF = 2.4;
const KEYS = [ // name, centre, rest lift, the raised shape as points round the centre
  { name: "bet", c: [-24, -24], z0: 0, shape: Array.from({ length: 24 }, (_, k) => [7.5 * Math.cos((k * Math.PI) / 12), 7.5 * Math.sin((k * Math.PI) / 12)]) },
  { name: "loop", c: [26, -10], z0: 0, shape: [[-8, 6], [8.5, 4], [-2, -9]] },
  { name: "settle", c: [-10, 26], z0: 0, shape: [[-6.5, -6.5], [6.5, -6.5], [6.5, 6.5], [-6.5, 6.5]] },
];

/** A closed polygon's corners rounded by r, as points: a light fillet for the raised shapes. */
function round(pts, r) {
  if (pts.length > 8) return pts;
  const out = [];
  pts.forEach((p, i) => {
    const a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length];
    const da = Math.hypot(a[0] - p[0], a[1] - p[1]), db = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const ta = Math.min(r / da, 0.5), tb = Math.min(r / db, 0.5);
    const p0 = [p[0] + (a[0] - p[0]) * ta, p[1] + (a[1] - p[1]) * ta], p1 = [p[0] + (b[0] - p[0]) * tb, p[1] + (b[1] - p[1]) * tb];
    for (let s = 0; s <= 4; s++) {
      const t = s / 4, u = 1 - t;
      out.push([u * u * p0[0] + 2 * u * t * p[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * p[1] + t * t * p1[1]]);
    }
  });
  return out;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 2.75);
  const ext = [];
  for (const k of KEYS) for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    ext.push([k.c[0] + dx * HALF, k.c[1] + dy * HALF, 0], [k.c[0] + dx * HALF, k.c[1] + dy * HALF, 30 + T + RELIEF]);
  }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the loop: a dashed arc on the ground between each key and the next, bowed outwards,
  // running from the edge of one key's footprint to the edge of the next and never inside either
  const mid = [0, 0].map((_, a) => KEYS.reduce((s, k) => s + k.c[a], 0) / KEYS.length);
  const inFoot = (c, x, y) => Math.abs(x - c[0]) < HALF && Math.abs(y - c[1]) < HALF;
  KEYS.forEach((k, i) => {
    const n = KEYS[(i + 1) % KEYS.length].c, arc = [];
    for (let s = 0; s <= 200; s++) {
      const t = s / 200, x = k.c[0] + (n[0] - k.c[0]) * t, y = k.c[1] + (n[1] - k.c[1]) * t;
      const ox = x - mid[0], oy = y - mid[1], l = Math.hypot(ox, oy), bow = 7 * Math.sin(Math.PI * t);
      const wx = x + (ox / l) * bow, wy = y + (oy / l) * bow;
      if (!inFoot(k.c, wx, wy) && !inFoot(n, wx, wy)) arc.push(P(wx, wy, 0));
    }
    mk("path", { d: open(arc), class: "nf dash" }, g);
  });

  // back to front by x + y; each key: a dashed footprint on the ground, then its cap
  const keys = KEYS.slice().sort((a, b) => a.c[0] + a.c[1] - (b.c[0] + b.c[1])).map((k) => {
    const [cx, cy] = k.c;
    const foot = rrect(cx - HALF, cy - HALF, cx + HALF, cy + HALF, 7, 5);
    const top = rrect(cx - TOP, cy - TOP, cx + TOP, cy + TOP, 5.5, 5);
    const inner = rrect(cx - TOP + 1.2, cy - TOP + 1.2, cx + TOP - 1.2, cy + TOP - 1.2, 4.3, 5);
    mk("path", { d: poly(ringAt(P, foot, 0)), class: "nf dash" }, g);
    const grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp);
    const rs = mk("path", { class: "sil" }, grp), rt = mk("path", { class: "nf lo" }, grp);
    const shape = round(k.shape, 2).map((p) => [cx + p[0], cy + p[1]]);
    return { ...k, foot, top, inner, shape, sil, cr, rs, rt, z: tween(k.z0), drawn: NaN };
  });

  function draw(k, z) {
    if (z === k.drawn) return;
    k.drawn = z;
    const z1 = z + T, at = (h) => k.shape.map((p) => P(p[0], p[1], h));
    k.sil.setAttribute("d", poly(hull(ringAt(P, k.foot, z).concat(ringAt(P, k.top, z1)))));
    k.cr.setAttribute("d", open(ringAt(P, run(k.inner, front), z1)));
    k.rs.setAttribute("d", poly(hull(at(z1).concat(at(z1 + RELIEF)))));
    k.rt.setAttribute("d", poly(at(z1 + RELIEF)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of keys) { draw(k, tval(k.z, now)); if (!tdone(k.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = -1;
  const tops = keys.map((k) => P(k.c[0], k.c[1], T));
  /** The key whose resting top is nearest the point. */
  const hit = (p) => tops.reduce((b, t, i) => (Math.hypot(t[0] - p[0], t[1] - p[1]) < Math.hypot(tops[b][0] - p[0], tops[b][1] - p[1]) ? i : b), 0);

  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    keys.forEach((k, i) => {
      const to = a < 0 ? k.z0 : i === a ? lift : clamp(k.z0 + lift * 0.2, 0, lift);
      tset(k.z, to, now, Math.abs(i - from) * 50);
      k.rs.classList.toggle("hi", a < 0 ? k.name === "bet" : i === a);
    });
    read.textContent = a < 0 ? "rest" : keys[a].name;
    B.wake();
  }
  keys.forEach((k) => k.rs.classList.toggle("hi", k.name === "bet"));
  read.textContent = "rest";

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { lift = v; if (act >= 0) { const a = act; act = -1; setActive(a); } },
    destroy: bag.dispose,
  };
}

export default {
  name: "keys",
  means: "Three keys in a loop, circle, triangle, square: the one under the pointer floats up and lights.",
  rules: [1, 2, 5, 9],
  range: [12, 20, 30],
  mount,
};
