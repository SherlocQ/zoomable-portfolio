/**
 * Plane: a paper dart thrown from left to right: a gentle dip, one small loop
 * that crosses its own path, and a shallow climb out to the right, a dashed
 * trail drawn out behind it. The pointer's x across the whole stage is how
 * far along the flight it is (left edge the throw, right edge the end), on a
 * spring. The dart is seen three-quarter, its centre fold and one wing turned
 * to the viewer, and banks through the loop. At rest it has arrived at the
 * right, the whole trail and its loop behind it. On mount it is thrown: it
 * flies the whole flight once, 2.8s eased in and out, and settles at rest
 * (the site uses only this, with no pointer). The bright line is its
 * centre fold. The slider is the loop's size.
 *
 * The pattern: a continuous input on a spring, read from the pointer's x
 * across the stage, which never moves. The dart's three faces are re-sorted
 * by depth each frame, so near faces cover far ones.
 */
import HL from './kernel';
const {
  Cam, bezier, clamp, fit, open, poly, proj, rad, reducedMotion, seg, spring, stepS, disposer, mk, pointer, register,
} = HL;

const REST = 1, FLIGHT_MS = 2800, THROW_DELAY = 450, NOSE = 46, SPAN = 19, KEEL = 9, LIFT = 5;
/** A point given along the screen's width (u), its height (h) and its depth toward the viewer (d). */
const W = (u, h, d = 0) => [u / 2 + d, -u / 2 + d, h];
const DEPTH = [Math.SQRT1_2, Math.SQRT1_2, 0]; // the d axis: toward the viewer, square to the loop
const VIEW = [1, 1, Math.SQRT2 * 0.5 / Math.sqrt(0.75)]; // toward the camera at the 2:1 view

const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(...a); return a.map((v) => v / l); };
/** A 2D cubic's point at s. */
const bez = (c, s) => { const u = 1 - s, k = [u * u * u, 3 * u * u * s, 3 * u * s * s, s * s * s]; return [0, 1].map((i) => k.reduce((sum, w, j) => sum + w * c[j][i], 0)); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let loft = value, over = null;

  // the flight in (u, h) on the viewer's plane, left to right: three cubics meeting at one crossing
  // point X. It dips in and arrives at X climbing at 50°, turns a teardrop loop above X and comes
  // back through it heading down at -20° (the crossing), then curves up and out to the right.
  const dir = (deg, k) => [k * Math.cos(rad(deg)), k * Math.sin(rad(deg))];
  const plus = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
  let segs = [], lens = [], total = 0;
  function build() {
    const S = [0, 34], X = [95, 0], E = [215, 46], L = loft;
    segs = [
      [S, plus(S, dir(-20, 40)), plus(X, dir(50, 30), -1), X],
      [X, plus(X, dir(50, L)), plus(X, dir(-20, L), -1), X],
      [X, plus(X, dir(-20, 30)), plus(E, dir(25, 45), -1), E],
    ];
    lens = segs.map((c) => { let l = 0, q = bez(c, 0); for (let i = 1; i <= 40; i++) { const r = bez(c, i / 40); l += Math.hypot(r[0] - q[0], r[1] - q[1]); q = r; } return l; });
    total = lens.reduce((x, y) => x + y, 0);
  }
  const track = (t) => {
    let s = clamp(t, 0, 1) * total, i = 0;
    while (i < 2 && s > lens[i]) { s -= lens[i]; i++; }
    return [...bez(segs[i], clamp(s / lens[i], 0, 1)), 0];
  };
  /** The flight at t: its point and its heading. */
  const at = (t) => {
    const p = W(...track(t)), a = W(...track(Math.max(0, t - 0.002))), b = W(...track(Math.min(1, t + 0.002)));
    return [p, unit(add(b, a, -1))];
  };

  // fitted to the flight at its highest loft, with room round it for the dart's span
  const C = Cam(45, 0.5, 1.85), box = [];
  const keep = loft;
  loft = 90;
  build();
  for (let s = 0; s <= 40; s++) { const q = at(s / 40)[0]; box.push(add(q, [26, 26, 24]), add(q, [-26, -26, -20])); }
  loft = keep;
  build();
  fit(C, box, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);

  const trail = mk("path", { class: "nf sil dash" }, g); // the outline colour, so the trail reads
  const faces = [0, 1, 2].map(() => mk("path", { class: "sil" }, g));
  const fold = mk("path", { class: "nf hi" }, g);

  // the throw: on mount the dart flies the whole flight once, from the hand to rest, easing in and
  // out (the lift curve front-loads the travel, which reads as a jolt over a flight this long);
  // a pointer, where there is one, takes over from wherever it is, on a spring
  const t0 = performance.now() + THROW_DELAY, ease = bezier(0.45, 0, 0.25, 1);
  let thrown = false;
  const sp = spring(0, { eps: 0.0005 });
  let drawn = NaN;

  function draw() {
    const t = sp.x;
    if (t === drawn) return;
    drawn = t;
    const [pos, f] = at(t);
    // the dart's frame: forward along the flight, rolled halfway between back-on and side-on, so
    // the viewer sees its centre fold and one wing, three-quarter, and it still banks through the loop
    const n = unit(add(DEPTH, f, -dot(DEPTH, f))), inPlane = cross(f, n);
    const up = unit(add(n, inPlane, 1.1)), side = cross(up, f);
    const w = (a, b, c) => add(add(add(pos, f, a), side, b), up, c); // forward, sideways, up
    const nose = w(NOSE * 0.6, 0, 0), tail = w(-NOSE * 0.4, 0, 0);
    const left = w(-NOSE * 0.4, -SPAN, LIFT), right = w(-NOSE * 0.4, SPAN, LIFT), keel = w(-NOSE * 0.4, 0, -KEEL);
    const tris = [[nose, tail, left], [nose, tail, right], [nose, tail, keel]]; // two wings and the keel
    // far faces first
    const order = tris.map((tr, i) => [dot(add(add(tr[0], tr[1]), tr[2]), VIEW), i]).sort((a, b) => a[0] - b[0]);
    order.forEach(([, i], k) => faces[k].setAttribute("d", poly(tris[i].map((q) => P(...q)))));
    fold.setAttribute("d", seg(P(...nose), P(...tail)));
    const pts = [];
    for (let s = 0; s <= 80; s++) pts.push(P(...at((s / 80) * t)[0]));
    trail.setAttribute("d", t > 0.01 ? open(pts) : "");
    read.textContent = !over ? "rest" : t > 0.97 ? "sent" : `flight ${Math.round(t * 100)}%`;
  }

  const B = register(stage, (dt, now) => {
    if (!thrown && !over) {
      const p = reducedMotion() ? 1 : clamp((now - t0) / FLIGHT_MS, 0, 1);
      sp.x = sp.t = REST * ease(p);
      draw();
      thrown = p >= 1;
      return !thrown;
    }
    const m = stepS(sp, dt); draw(); return m;
  });
  bag.add(B.unregister);

  // the pointer's x across the whole stage: left edge the throw, right edge the far end
  function retarget() {
    thrown = true;
    sp.t = over ? clamp(over[0] / 400, 0, 1) : REST;
    drawn = NaN;
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { over = p; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { loft = v; build(); drawn = NaN; B.wake(); },
    destroy: bag.dispose,
  };
}

export default {
  name: "plane",
  means: "A paper dart thrown left to right: it dips, loops once across its own trail and climbs out.",
  rules: [1, 3, 5, 6],
  range: [60, 75, 90],
  mount,
};
