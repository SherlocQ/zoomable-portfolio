// 2.5D oblique tile illustrations — Linear-style.
// Depth direction: (+12, -6) per unit. Painter's algorithm: back→front.
// .illus-face uses fill:var(--tile-bg) so front faces occlude edges behind them.

/* ─── Hero — floating design artboard ──────────────────────────────────── */
function IllusHero() {
  return (
    <svg className="tile-illus" viewBox="0 0 200 130" fill="none" aria-hidden="true">
      {/* Back face outline */}
      <rect x="28" y="18" width="128" height="82" rx="4"
        stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.28"/>

      {/* Top face — covers back top edge */}
      <polygon points="16,24 144,24 156,18 28,18"
        className="illus-face" stroke="currentColor" strokeWidth="0.85"/>

      {/* Right face — covers back right edge */}
      <polygon points="144,24 144,106 156,100 156,18"
        className="illus-face" stroke="currentColor" strokeWidth="0.85"/>

      {/* Front face */}
      <rect x="16" y="24" width="128" height="82" rx="4"
        className="illus-face" stroke="currentColor" strokeWidth="0.9"/>

      {/* Dot grid */}
      {[32,52,72,92,112,132].flatMap(x =>
        [38,54,70,86,100].map(y =>
          <circle key={`d${x}-${y}`} cx={x} cy={y} r="0.85"
            fill="currentColor" opacity="0.18"/>
        )
      )}

      {/* Inner design card */}
      <rect x="26" y="34" width="74" height="50" rx="2"
        stroke="currentColor" strokeWidth="0.75" fill="currentColor" fillOpacity="0.05"/>
      <rect x="26" y="34" width="74" height="18"
        stroke="none" fill="currentColor" fillOpacity="0.08"/>
      <line x1="26" y1="52" x2="100" y2="52" stroke="currentColor" strokeWidth="0.5" opacity="0.28"/>

      {/* Content lines — draw in on hover */}
      <line className="illus-draw" x1="33" y1="64" x2="94" y2="64"
        stroke="currentColor" strokeWidth="0.85"/>
      <line className="illus-draw illus-draw--d1" x1="33" y1="74" x2="84" y2="74"
        stroke="currentColor" strokeWidth="0.7"/>

      {/* Dashed selection box — draws in */}
      <rect className="illus-draw illus-draw--d2" x="23" y="31" width="80" height="56" rx="4"
        stroke="currentColor" strokeWidth="1.05" strokeDasharray="5 3"/>

      {/* Crosshair + expanding radar ring */}
      <g className="illus-fade">
        <circle className="illus-ring" cx="138" cy="52" r="10"
          stroke="currentColor" strokeWidth="1.0"/>
        <line x1="138" y1="41" x2="138" y2="63" stroke="currentColor" strokeWidth="1.0"/>
        <line x1="127" y1="52" x2="149" y2="52" stroke="currentColor" strokeWidth="1.0"/>
        <circle cx="138" cy="52" r="2.5" fill="currentColor" fillOpacity="0.7"/>
      </g>
    </svg>
  );
}

/* ─── Projects — stacked cards (parallax layers) ────────────────────────── */
function IllusProjects() {
  return (
    <svg className="tile-illus" viewBox="0 0 196 126" fill="none" aria-hidden="true">

      {/* Back card */}
      <g className="illus-layer illus-layer--back">
        <rect x="38" y="14" width="116" height="72" rx="4"
          stroke="currentColor" strokeWidth="0.75" fill="currentColor" fillOpacity="0.02"/>
        <rect x="38" y="14" width="116" height="22" rx="4"
          stroke="none" fill="currentColor" fillOpacity="0.055"/>
        <line x1="38" y1="36" x2="154" y2="36" stroke="currentColor" strokeWidth="0.5" opacity="0.22"/>
        <line x1="52" y1="52" x2="142" y2="52" stroke="currentColor" strokeWidth="0.55" opacity="0.2"/>
        <line x1="52" y1="63" x2="130" y2="63" stroke="currentColor" strokeWidth="0.5" opacity="0.18"/>
      </g>

      {/* Mid card */}
      <g className="illus-layer illus-layer--mid">
        <rect x="24" y="20" width="116" height="72" rx="4"
          stroke="currentColor" strokeWidth="0.82" fill="currentColor" fillOpacity="0.03"/>
        <rect x="24" y="20" width="116" height="22" rx="4"
          stroke="none" fill="currentColor" fillOpacity="0.065"/>
        <line x1="24" y1="42" x2="140" y2="42" stroke="currentColor" strokeWidth="0.5" opacity="0.28"/>
        <line x1="38" y1="57" x2="128" y2="57" stroke="currentColor" strokeWidth="0.6" opacity="0.26"/>
        <line x1="38" y1="68" x2="116" y2="68" stroke="currentColor" strokeWidth="0.55" opacity="0.22"/>
      </g>

      {/* Front card — drawn last, fully opaque to occlude cards behind */}
      <g className="illus-layer illus-layer--front">
        <rect x="10" y="26" width="116" height="72" rx="4"
          className="illus-face" stroke="currentColor" strokeWidth="0.9"/>
        {/* Image strip */}
        <rect x="10" y="26" width="116" height="24" rx="4"
          stroke="none" fill="currentColor" fillOpacity="0.08"/>
        <line x1="10" y1="50" x2="126" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
        {/* Avatar + content lines */}
        <circle cx="24" cy="63" r="5" stroke="currentColor" strokeWidth="0.8" fill="currentColor" fillOpacity="0.06"/>
        <line className="illus-draw" x1="36" y1="61" x2="118" y2="61"
          stroke="currentColor" strokeWidth="0.85"/>
        <line className="illus-draw illus-draw--d1" x1="36" y1="71" x2="106" y2="71"
          stroke="currentColor" strokeWidth="0.7"/>
        <line className="illus-draw illus-draw--d2" x1="36" y1="81" x2="92" y2="81"
          stroke="currentColor" strokeWidth="0.65"/>
      </g>
    </svg>
  );
}

/* ─── About — 2.5D profile card ─────────────────────────────────────────── */
function IllusAbout() {
  const entries = [28, 68, 108];
  return (
    <svg className="tile-illus" viewBox="0 0 134 144" fill="none" aria-hidden="true">
      {/* Back face */}
      <rect x="34" y="14" width="92" height="118" rx="4"
        stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.26"/>
      {/* Top face */}
      <polygon points="22,20 114,20 126,14 34,14"
        className="illus-face" stroke="currentColor" strokeWidth="0.82"/>
      {/* Right face */}
      <polygon points="114,20 114,138 126,132 126,14"
        className="illus-face" stroke="currentColor" strokeWidth="0.82"/>
      {/* Front face */}
      <rect x="22" y="20" width="92" height="118" rx="4"
        className="illus-face" stroke="currentColor" strokeWidth="0.9"/>

      {/* Vertical spine */}
      <line className="illus-draw" x1="38" y1="22" x2="38" y2="132"
        stroke="currentColor" strokeWidth="0.85"/>

      {entries.map((y, i) => (
        <g key={y}>
          {/* Node outer ring */}
          <circle cx="38" cy={y} r="5.5"
            stroke="currentColor" strokeWidth="0.8" fill="currentColor" fillOpacity="0.04"/>
          {/* Node inner dot — spring-pop on hover */}
          <circle className="illus-scale"
            style={{ transitionDelay: `${0.16 + i * 0.10}s` }}
            cx="38" cy={y} r="2.8" fill="currentColor" fillOpacity="0.55"/>
          {/* Title line */}
          <line className={`illus-draw illus-draw--d${i + 1}`}
            x1="50" y1={y - 5} x2={50 + 58 - i * 8} y2={y - 5}
            stroke="currentColor" strokeWidth="0.9"/>
          {/* Sub line */}
          <line className={`illus-draw illus-draw--d${i + 1}`}
            x1="50" y1={y + 6} x2={50 + 46 - i * 6} y2={y + 6}
            stroke="currentColor" strokeWidth="0.65"/>
          {/* Date pill */}
          <rect className="illus-fade"
            style={{ transitionDelay: `${0.22 + i * 0.10}s` }}
            x={108 - 26} y={y - 8} width="26" height="10" rx="3"
            stroke="currentColor" strokeWidth="0.7" fill="currentColor" fillOpacity="0.05"/>
        </g>
      ))}
    </svg>
  );
}

/* ─── Process — two 3D blocks + arrow ───────────────────────────────────── */
function IllusProcess() {
  const Block = ({ x, y, w = 52, h = 44, children }) => {
    const dx = 10, dy = -5;
    return (
      <g>
        <rect x={x + dx} y={y + dy} width={w} height={h} rx="3"
          stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.26"/>
        <polygon
          points={`${x},${y} ${x+w},${y} ${x+w+dx},${y+dy} ${x+dx},${y+dy}`}
          className="illus-face" stroke="currentColor" strokeWidth="0.8"/>
        <polygon
          points={`${x+w},${y} ${x+w},${y+h} ${x+w+dx},${y+h+dy} ${x+w+dx},${y+dy}`}
          className="illus-face" stroke="currentColor" strokeWidth="0.8"/>
        <rect x={x} y={y} width={w} height={h} rx="3"
          className="illus-face" stroke="currentColor" strokeWidth="0.9"/>
        {children}
      </g>
    );
  };

  return (
    <svg className="tile-illus" viewBox="0 0 184 128" fill="none" aria-hidden="true">
      {/* Left block — "Discover / Define" */}
      <Block x={10} y={38}>
        <line x1="22" y1="60" x2="50" y2="60" stroke="currentColor" strokeWidth="0.55" opacity="0.4"/>
        <line x1="36" y1="46" x2="36" y2="74" stroke="currentColor" strokeWidth="0.55" opacity="0.4"/>
        <circle cx="36" cy="60" r="6.5"
          stroke="currentColor" strokeWidth="0.85" fill="currentColor" fillOpacity="0.07"/>
        <circle className="illus-fade" cx="36" cy="60" r="2.5"
          fill="currentColor" fillOpacity="0.55"/>
      </Block>

      {/* Right block — "Design / Deliver" */}
      <Block x={102} y={38}>
        <circle className="illus-scale" cx="128" cy="60" r="9"
          stroke="currentColor" strokeWidth="0.9" fill="currentColor" fillOpacity="0.28"/>
        <path className="illus-fade"
          d="M122,60 L126,64 L135,55"
          stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </Block>

      {/* Connecting arrow */}
      <g className="illus-fade">
        <line x1="62" y1="60" x2="102" y2="60" stroke="currentColor" strokeWidth="1.05"/>
        <path d="M97,56 L102,60 L97,64" stroke="currentColor" strokeWidth="1.1"
          strokeLinecap="round" strokeLinejoin="round"/>
      </g>

      {/* Axis line — draws across both */}
      <line className="illus-draw" x1="10" y1="96" x2="174" y2="96"
        stroke="currentColor" strokeWidth="0.75"/>
      {[10, 62, 102, 154].map(x => (
        <line key={x} className="illus-fade"
          x1={x} y1="92" x2={x} y2="100"
          stroke="currentColor" strokeWidth="1.15"/>
      ))}
    </svg>
  );
}

/* ─── Craft — parallax layered frames (2.5D separation on hover) ─────────── */
function IllusCraft() {
  return (
    <svg className="tile-illus" viewBox="0 0 156 136" fill="none" aria-hidden="true">
      {/* Back layer — scan lines */}
      <g className="illus-layer illus-layer--back">
        <rect x="40" y="42" width="98" height="66" rx="3"
          stroke="currentColor" strokeWidth="0.7" fill="currentColor" fillOpacity="0.02"/>
        {[56, 66, 76, 86, 96, 106].map(y => (
          <line key={y} x1="50" y1={y} x2="128" y2={y}
            stroke="currentColor" strokeWidth="0.5" opacity="0.20"/>
        ))}
      </g>

      {/* Mid layer — dot matrix */}
      <g className="illus-layer illus-layer--mid">
        <rect x="26" y="30" width="98" height="66" rx="3"
          stroke="currentColor" strokeWidth="0.8" fill="currentColor" fillOpacity="0.03"/>
        {[40, 54, 68, 82, 96].flatMap(x =>
          [44, 56, 68, 80, 90].map(y =>
            <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9"
              fill="currentColor" opacity="0.26"/>
          )
        )}
      </g>

      {/* Front layer — waveform, drawn on top */}
      <g className="illus-layer illus-layer--front">
        <rect x="12" y="18" width="98" height="66" rx="4"
          className="illus-face" stroke="currentColor" strokeWidth="0.9"/>

        {/* Playhead marker */}
        <line x1="52" y1="24" x2="52" y2="78"
          stroke="currentColor" strokeWidth="0.6" opacity="0.30"/>

        {/* Waveform — draws in on hover */}
        <path className="illus-draw"
          d="M20,51 C30,35 42,67 54,51 C66,35 78,67 90,51 C96,43 102,41 108,40"
          stroke="currentColor" strokeWidth="1.15" fill="none"/>

        {/* Peak dots */}
        <circle className="illus-fade" cx="54" cy="39" r="3"
          fill="currentColor" fillOpacity="0.65"/>
        <circle className="illus-fade" cx="20" cy="51" r="2.2"
          fill="currentColor" fillOpacity="0.4"/>
        <circle className="illus-fade" cx="90" cy="51" r="2.2"
          fill="currentColor" fillOpacity="0.4"/>

        {/* Time-ruler ticks */}
        {[20, 35, 52, 67, 82, 97].map(x => (
          <line key={x} className="illus-fade"
            x1={x} y1="73" x2={x} y2="79"
            stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
        ))}
      </g>
    </svg>
  );
}

/* ─── Contact — 2.5D envelope with opening flap ─────────────────────────── */
function IllusContact() {
  return (
    <svg className="tile-illus" viewBox="0 0 168 116" fill="none" aria-hidden="true">
      {/* ── Envelope body — back→front ── */}

      {/* Back face */}
      <rect x="22" y="24" width="132" height="78" rx="4"
        stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.26"/>

      {/* Top face */}
      <polygon points="10,30 142,30 154,24 22,24"
        className="illus-face" stroke="currentColor" strokeWidth="0.82"/>

      {/* Right face */}
      <polygon points="142,30 142,108 154,102 154,24"
        className="illus-face" stroke="currentColor" strokeWidth="0.82"/>

      {/* Front face */}
      <rect x="10" y="30" width="132" height="78" rx="4"
        className="illus-face" stroke="currentColor" strokeWidth="0.9"/>

      {/* Bottom V-fold lines */}
      <line x1="10" y1="108" x2="58" y2="68"
        stroke="currentColor" strokeWidth="0.7" opacity="0.42"/>
      <line x1="142" y1="108" x2="94" y2="68"
        stroke="currentColor" strokeWidth="0.7" opacity="0.42"/>

      {/* Address lines */}
      <line x1="24" y1="78" x2="88" y2="78" stroke="currentColor" strokeWidth="0.7" opacity="0.36"/>
      <line x1="24" y1="89" x2="76" y2="89" stroke="currentColor" strokeWidth="0.65" opacity="0.28"/>

      {/* Stamp */}
      <rect x="106" y="44" width="26" height="22" rx="2"
        stroke="currentColor" strokeWidth="0.8" fill="currentColor" fillOpacity="0.05"
        strokeDasharray="2.5 2"/>
      <line x1="115" y1="51" x2="123" y2="59" stroke="currentColor" strokeWidth="0.7" opacity="0.45"/>
      <line x1="123" y1="51" x2="115" y2="59" stroke="currentColor" strokeWidth="0.7" opacity="0.45"/>

      {/* ── Letter — slides up from inside ── */}
      <g className="illus-letter">
        <rect x="44" y="40" width="62" height="40" rx="2"
          stroke="currentColor" strokeWidth="0.8" fill="currentColor" fillOpacity="0.08"/>
        <line className="illus-draw" x1="54" y1="52" x2="97" y2="52"
          stroke="currentColor" strokeWidth="0.75"/>
        <line className="illus-draw illus-draw--d1" x1="54" y1="61" x2="88" y2="61"
          stroke="currentColor" strokeWidth="0.65"/>
        <line className="illus-draw illus-draw--d2" x1="54" y1="70" x2="80" y2="70"
          stroke="currentColor" strokeWidth="0.65"/>
      </g>

      {/* ── Envelope lid — drawn on top of letter, slides away on hover ── */}
      <g className="illus-envelope-lid">
        {/* Lid back-surface (depth strip, covers the gap) */}
        <polygon points="22,24 87,60 154,24 142,30 76,66 10,30"
          className="illus-face" stroke="none"/>
        {/* Left depth edge of flap */}
        <line x1="10" y1="30" x2="22" y2="24" stroke="currentColor" strokeWidth="0.72"/>
        <line x1="76" y1="66" x2="88" y2="60" stroke="currentColor" strokeWidth="0.72"/>
        {/* Right depth edge */}
        <line x1="142" y1="30" x2="154" y2="24" stroke="currentColor" strokeWidth="0.72"/>
        {/* V-fold front face — fills to occlude letter */}
        <polygon points="10,30 76,66 142,30"
          className="illus-face" stroke="currentColor" strokeWidth="0.9"/>
      </g>
    </svg>
  );
}

/* ─── AI-Native Vision — 2.5D neural network ─────────────────────────────── */
function IllusAIVision() {
  const nodes = [
    { cx: 18,  cy: 62, r: 4.5 },
    { cx: 66,  cy: 26, r: 5.5 },
    { cx: 66,  cy: 98, r: 5.0 },
    { cx: 120, cy: 62, r: 9.0, active: true },
    { cx: 168, cy: 26, r: 4.5 },
    { cx: 168, cy: 98, r: 4.5 },
  ];
  const edges = [
    [0,1,0],[0,2,0],[1,3,1],[2,3,1],[3,4,1],[3,5,1],[1,4,0],[2,5,0],
  ];

  return (
    <svg className="tile-illus" viewBox="0 0 194 124" fill="none" aria-hidden="true">
      {/* Edges — drawn before nodes so nodes occlude them */}
      {edges.map(([a, b, w], i) => {
        const delay = i >= 4 ? ` illus-draw--d${Math.min(i - 3, 4)}` : '';
        return (
          <line key={i}
            className={w ? `illus-draw${delay}` : ''}
            x1={nodes[a].cx} y1={nodes[a].cy}
            x2={nodes[b].cx} y2={nodes[b].cy}
            stroke="currentColor" strokeWidth={w ? 0.9 : 0.55}
            opacity={w ? 1 : 0.5}/>
        );
      })}

      {/* Data particles along primary paths */}
      {[[66,26,120,62],[120,62,168,26],[66,98,120,62]].map(([x1,y1,x2,y2], i) => (
        <circle key={i} className="illus-fade"
          style={{ transitionDelay: `${0.30 + i * 0.12}s` }}
          cx={(x1+x2)/2} cy={(y1+y2)/2}
          r="2.5" fill="currentColor" fillOpacity="0.7"/>
      ))}

      {/* Regular nodes — circles with face fill (occlude edges) */}
      {nodes.filter(n => !n.active).map((n, i) => (
        <circle key={i}
          cx={n.cx} cy={n.cy} r={n.r}
          className="illus-face"
          stroke="currentColor" strokeWidth="0.85"/>
      ))}

      {/* Active center node */}
      <circle className="illus-ring"
        cx={nodes[3].cx} cy={nodes[3].cy} r={nodes[3].r + 7}
        stroke="currentColor" strokeWidth="1.2"/>
      <circle
        className="illus-node-pulse"
        cx={nodes[3].cx} cy={nodes[3].cy} r={nodes[3].r}
        stroke="currentColor" strokeWidth="1.1"
        fill="currentColor" fillOpacity="0.35"/>
    </svg>
  );
}

/* ─── Map + export ───────────────────────────────────────────────────────── */
const ILLUS_MAP = {
  hero:                IllusHero,
  projects:            IllusProjects,
  about:               IllusAbout,
  process:             IllusProcess,
  craft:               IllusCraft,
  contact:             IllusContact,
  'project-ai-vision': IllusAIVision,
};

export function TileIllustration({ id }) {
  const Component = ILLUS_MAP[id];
  return Component ? <Component /> : null;
}
