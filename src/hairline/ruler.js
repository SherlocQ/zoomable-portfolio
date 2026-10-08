/**
 * Ruler: a ruler lying on a sheet, a pencil standing against its edge. The
 * pointer's place along the ruler sets where the pencil is, on a spring, and
 * the ruled line runs from the zero mark to the pencil's tip. The pencil is
 * a hexagon turned along its leaning axis: a sharpened cone, a body, a
 * ferrule, an eraser. At rest
 * it stands a little past the middle, a line already drawn. The slider is the
 * step the pencil settles on, in tenths of a centimetre.
 *
 * The pattern: a continuous input on a spring. The pointer's screen x is
 * read across the ruler's resting span, which never moves; past its ends
 * the pencil holds at the end.
 */
import HL from './kernel';
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, rrect, seg,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const L = 150, RW = 24, RT = 3, X0 = 8, X1 = 142, LY = RW + 2.4, REST = 92;
const LEAN = [-0.55, 0.06], HEX = 4.8, TIP = 12, BODY = 62, FER = 70, END = 78;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let step = value, over = null;

  const C = Cam(45, 0.5, 1.6);
  // the pencil's axis, and two directions square to it: its hexagon turns with it, so the ends stay square to the body
  const n = Math.hypot(LEAN[0], LEAN[1], 1), AX = [LEAN[0] / n, LEAN[1] / n, 1 / n];
  const m = Math.hypot(AX[0], AX[1]), E1 = [AX[1] / m, -AX[0] / m, 0];
  const E2 = [AX[1] * E1[2] - AX[2] * E1[1], AX[2] * E1[0] - AX[0] * E1[2], AX[0] * E1[1] - AX[1] * E1[0]];
  const top = (x) => [x + AX[0] * END, LY + AX[1] * END, AX[2] * END + HEX];
  fit(C, [[-12, -16, 0], [L + 12, -16, 0], [-12, LY + 18, 0], [L + 12, LY + 18, 0], top(X0), top(X1)], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the sheet the ruler lies on
  mk("path", { d: poly(rrect(-12, -16, L + 12, LY + 18, 3, 4).map((q) => P(q.u, q.v, 0))), class: "nf lo" }, g);
  const line = mk("path", { class: "nf hi" }, g);

  // the ruler: a plate, its ticks along the near edge, a hanging hole at one end
  const [rr, ri] = rings(0, 0, L, RW, 3, 1.2);
  put(solid(g), prism(P, front, rr, ri, 0, RT));
  let ticks = "";
  for (let x = X0, n = 0; x <= X1 + 0.1; x += 5, n++) {
    const len = n % 2 ? 3.5 : n % 10 ? 6 : 9;
    ticks += seg(P(x, RW - 1.6, RT), P(x, RW - 1.6 - len, RT));
  }
  mk("path", { d: ticks, class: "nf lo" }, g);
  mk("path", { d: poly(rrect(L - 11, RW / 2 - 6.5, L - 2, RW / 2 + 2.5, 4.5, 4).map((q) => P(q.u, q.v - 1, RT))), class: "nf lo" }, g);

  // the pencil, bottom to top: each part paints over the joint below it
  const hex = Array.from({ length: 6 }, (_, k) => {
    const c = HEX * Math.cos((k * Math.PI) / 3 + 0.3), s = HEX * Math.sin((k * Math.PI) / 3 + 0.3);
    return [0, 1, 2].map((i) => c * E1[i] + s * E2[i]);
  });
  // the three corners that face the camera (it looks from +x, +y, above), in order round the hexagon
  const toCam = [1, 1, Math.SQRT2 * 0.5 / Math.sqrt(0.75)];
  const faces = hex.map((h) => h[0] * toCam[0] + h[1] * toCam[1] + h[2] * toCam[2] > 0);
  const k0 = faces.findIndex((f, k) => f && !faces[(k + 5) % 6]);
  const nearIdx = [0, 1, 2].map((i) => (k0 + i) % 6);
  const parts = ["sil", "sil", "sil", "sil"].map((cls) => mk("path", { class: cls }, g));
  const marks = mk("path", { class: "nf lo" }, g);

  const sp = spring(REST, { eps: 0.05 });
  let drawn = NaN;
  function draw() {
    const x = sp.x;
    if (x === drawn) return;
    drawn = x;
    const at = (t, r = 1) => hex.map((h) => P(x + AX[0] * t + h[0] * r, LY + AX[1] * t + h[1] * r, AX[2] * t + h[2] * r));
    const tip = P(x, LY, 0);
    parts[0].setAttribute("d", poly(hull([tip, ...at(TIP)])));
    parts[1].setAttribute("d", poly(hull(at(TIP).concat(at(BODY)))));
    parts[2].setAttribute("d", poly(hull(at(BODY).concat(at(FER)))));
    parts[3].setAttribute("d", poly(hull(at(FER, 0.92).concat(at(END, 0.92)))));
    // the graphite's edge, the hexagon's near edges, the ferrule's crimp, the eraser's face:
    // dim lines only inside the outline, never along it, so the outline stays the ruler's
    const near = (t, r) => { const ring = at(t, r); return nearIdx.map((k) => ring[k]); };
    const outline = hull([tip, ...at(TIP), ...at(BODY), ...at(FER), ...at(END, 0.92)]);
    const onOutline = (q) => outline.some((o) => Math.abs(o[0] - q[0]) < 0.01 && Math.abs(o[1] - q[1]) < 0.01);
    const body = hull(at(TIP).concat(at(BODY))), onBody = (q) => body.some((o) => Math.abs(o[0] - q[0]) < 0.01 && Math.abs(o[1] - q[1]) < 0.01);
    let d = open(near(3.2, 3.2 / TIP)) + open(near(FER - 3.5, 1));
    const face = at(END, 0.92);
    face.forEach((q, k) => { const r = face[(k + 1) % 6]; if (!(onOutline(q) && onOutline(r))) d += seg(q, r); });
    for (const k of nearIdx) if (!onBody(at(TIP)[k]) && !onBody(at(BODY)[k])) d += seg(at(TIP)[k], at(BODY)[k]);
    marks.setAttribute("d", d);
    line.setAttribute("d", seg(P(X0, LY, 0), tip));
    read.textContent = over ? ((x - X0) / 10).toFixed(1) + " cm" : "rest";
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    if (!over) sp.t = REST;
    else {
      const a = P(X0, LY, 0)[0], b = P(X1, LY, 0)[0];
      const raw = X0 + clamp((over[0] - a) / (b - a), 0, 1) * (X1 - X0);
      sp.t = clamp(X0 + Math.round((raw - X0) / step) * step, X0 + 6, X1);
    }
    drawn = NaN;
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { over = p; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { step = v; if (over) retarget(); },
    destroy: bag.dispose,
  };
}

export default {
  name: "ruler",
  means: "A pencil against a ruler: the pointer slides it along, and the ruled line follows to its tip.",
  rules: [1, 3, 5, 8],
  range: [1, 5, 10],
  mount,
};
