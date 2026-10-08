/**
 * Bricks: eight studded bricks that make one cube, two by two by two. At rest
 * they hang apart, unevenly, the cube still legible in their gaps. Near the
 * pointer they close: each brick takes its spread from its own distance to
 * the pointer, on its own spring, so hovering the middle seats the whole cube
 * and hovering a corner seats that corner first. The slider is the reach.
 *
 * The pattern: a continuous field, as Terrain. Each brick reads the pointer's
 * screen distance to where it sits in the closed cube, which never moves, and
 * never opens wider than its rest; springs per brick.
 */
import HL from './kernel';
const {
  Cam, clamp, facing, fit, prism, proj, rings, rrect, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const U = 26, GAP = 22, SR = 3.6, SH = 2.6, NEAR = 55;
// rest spread per brick, [i, j, k]: uneven, so rest is a composition and not a grid
const REST = { "0,0,0": 0.5, "1,0,0": 0.7, "0,1,0": 0.62, "1,1,0": 0.4, "0,0,1": 0.8, "1,0,1": 0.66, "0,1,1": 0.58, "1,1,1": 1 };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value, over = null;

  const C = Cam(45, 0.5, 2.1);
  const far = U + GAP / 2;
  fit(C, [[-far, -far, 0], [far, far, 0], [far, -far, 0], [-far, far, 0], [-far, -far, 2 * U + GAP + SH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const bricks = [];
  for (const [i, j, k] of Object.keys(REST).map((s) => s.split(",").map(Number))) {
    const s0 = REST[[i, j, k].join(",")];
    bricks.push({ i, j, k, dx: i ? 1 : -1, dy: j ? 1 : -1, sp: spring(s0, { eps: 0.002 }), s0, drawn: NaN });
  }
  // back to front: by column (x + y), then bottom before top
  bricks.sort((a, b) => a.i + a.j - (b.i + b.j) || a.k - b.k || a.i - b.i);
  for (const b of bricks) {
    b.el = solid(g);
    b.studs = b.k ? [0, 1, 2, 3].map(() => solid(g)) : [];
  }
  const rest = bricks.find((b) => b.s0 === 1);
  // where each brick's middle sits on screen in the closed cube
  for (const b of bricks) b.home = P((b.dx * U) / 2, (b.dy * U) / 2, b.k ? 1.5 * U : 0.5 * U);

  function draw(b) {
    const s = b.sp.x;
    if (s === b.drawn) return;
    b.drawn = s;
    const o = (s * GAP) / 2, x0 = b.dx < 0 ? -U - o : o, y0 = b.dy < 0 ? -U - o : o, z0 = b.k ? U + s * GAP : 0;
    const [ring, inner] = rings(x0, y0, x0 + U, y0 + U, 3.4, 1.4);
    put(b.el, prism(P, front, ring, inner, z0, z0 + U));
    b.studs.forEach((st, n) => {
      const cx = x0 + U * (n % 2 ? 0.72 : 0.28), cy = y0 + U * (n < 2 ? 0.28 : 0.72);
      const r0 = rrect(cx - SR, cy - SR, cx + SR, cy + SR, SR, 4), r1 = rrect(cx - SR + 0.7, cy - SR + 0.7, cx + SR - 0.7, cy + SR - 0.7, SR - 0.7, 4);
      put(st, prism(P, front, r0, r1, z0 + U, z0 + U + SH));
    });
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const b of bricks) { if (stepS(b.sp, dt)) m = true; draw(b); }
    return m;
  });
  bag.add(B.unregister);

  function light(on) {
    for (const b of bricks) b.el.sil.classList.toggle("hi", b === on);
  }

  function retarget() {
    if (!over) {
      for (const b of bricks) b.sp.t = b.s0;
      light(rest);
      read.textContent = "rest";
    } else {
      // each brick's distance from the pointer to where it sits in the closed cube
      for (const b of bricks) {
        const d = Math.hypot(over[0] - b.home[0], over[1] - b.home[1]);
        b.sp.t = b.s0 * clamp((d - NEAR) / R, 0, 1);
      }
      // nearest top brick, ties going to the front one, which shows the most of itself
      const tops = bricks.filter((b) => b.k === 1), dist = (b) => Math.hypot(over[0] - b.home[0], over[1] - b.home[1]) - 25 * (b.i + b.j);
      light(tops.reduce((a, b) => (dist(b) < dist(a) ? b : a)));
      const seated = bricks.filter((b) => b.sp.t < 0.05).length;
      read.textContent = `${seated} / 8`;
    }
    B.wake();
  }
  retarget();

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
  name: "bricks",
  means: "Eight bricks hang apart; near the pointer they close, until the cube is whole.",
  rules: [1, 3, 5, 9],
  range: [90, 130, 180],
  mount,
};
