import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import ProcessDiagram from './ProcessDiagram';
import RippleGrid from './RippleGrid';
import ScrollCue from './ScrollCue';
import { AI_SCENE_FROM_STEP, applyDiagramState, indexDiagram } from './processDiagramModel';

// The scrollytelling panel is pinned while an invisible track scrolls past.
// Each step owns TRANSITION + DRAW + HOLD of that track (in scroller heights):
// first its text scrolls in from below 1:1 with the scroll while the previous
// text scrolls out the top (like the About page), then the text holds at the
// center while the drawing plays and the finished state rests.
const TRANSITION_LENGTH = 0.5;
const DRAW_LENGTH = 0.6;
const HOLD_LENGTH = 0.3;
const STEP_LENGTH = TRANSITION_LENGTH + DRAW_LENGTH + HOLD_LENGTH;
const REDUCED_FADE_MS = 180;
// The drawing plays on its own clock after the scroll, like the About page,
// so a snap or a fast flick never rushes it. It is a sequence of segments —
// each step's drawing, plus the Double Diamond → AI-native hand-over — played
// in order, each over its own duration at an even pace, with a gentle ease
// in and out. Scroll only sets how far each segment should get.
const DRAW_S = [2.0, 1.6, 2.0, 2.6, 6.0, 8.0, 1.0];
const HANDOVER_S = 2.0;
// Scrolling back rewinds quickly — the slow pace is for watching forward.
const REWIND_FACTOR = 4;
// Only the step being arrived at plays at its pace; any earlier unfinished
// segments (after a jump of several steps) rush through first.
const CATCH_UP_AFTER = 1;
const CATCH_UP_FACTOR = 5;
// Half linear, half smoothstep: nearly even, a touch slower at both ends.
const gentle = (u) => 0.5 * u + 0.5 * u * u * (3 - 2 * u);

const DIAGRAM_LABEL = "Two diagrams, shown one after the other. First, the Double Diamond: Discover and Define, then Develop and Deliver, each diamond going wide and converging at a fixed point. Then the AI-native design process: the first diamond shrinks into a Bet; five loops go wide quickly and narrow down slowly; AI routes each loop's feedback three ways — noise fades out, how-it's-built issues go back into the next loop, right-problem signals come down to a decision; there, each signal is settled, tested in the next loop, or dropped, and only settled signals grow a Direction triangle across the width, taller and deeper to the right.";

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// Step copy: paragraphs split by a blank line; "• Label: text" lines become
// a list whose label (the call's name on the diagram) is bold.
function StepBody({ text }) {
  return text.split('\n\n').map((block, i) => {
    const lines = block.split('\n');
    const intro = lines.filter((line) => !line.startsWith('• '));
    const items = lines.filter((line) => line.startsWith('• ')).map((line) => line.slice(2));
    return (
      <div key={i} className="ps-step-block">
        {intro.length > 0 && <p className="ps-step-body">{intro.join(' ')}</p>}
        {items.length > 0 && (
          <ul className="ps-step-list">
            {items.map((item) => {
              const cut = item.indexOf(': ');
              return (
                <li key={item}>
                  {cut > 0 ? <><strong>{item.slice(0, cut)}:</strong>{item.slice(cut + 1)}</> : item}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  });
}

export default function ProcessStory({ content }) {
  const { steps } = content;
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const diagramRef = useRef(null);
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [showCue, setShowCue] = useState(true);
  const activeRef = useRef(-1);
  const cueRef = useRef(true);

  const commitActive = useCallback((step) => {
    if (activeRef.current === step) return false;
    activeRef.current = step;
    setActiveStep(step);
    return true;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const diagram = diagramRef.current;
    const section = sectionRef.current;
    const scroller = root?.closest('.page-body');
    if (!root || !diagram || !section || !scroller) return undefined;
    // Index the whole diagram (titles live outside the scenes container).
    const index = indexDiagram(diagram.parentElement);
    const scenes = [...diagram.querySelectorAll('.pd-svg')];
    const block = diagram.parentElement;
    let unit = 1;
    // Step opacity is CSS-driven (.is-active); clear any inline value left
    // by an earlier scrubbed version so it can never hide a step.
    stepRefs.current.forEach((el) => { if (el) el.style.opacity = ''; });
    // Playback segments in order: draws 0–1, the hand-over, draws 2–6.
    const segments = [
      ...[0, 1].map((k) => ({ step: k, seconds: DRAW_S[k] })),
      { handover: true, seconds: HANDOVER_S },
      ...steps.slice(2).map((_, j) => ({ step: j + 2, seconds: DRAW_S[j + 2] })),
    ].map((seg) => ({ ...seg, u: 0 }));
    let started = false;
    let lastTime = 0;
    // Both scenes are top-aligned in one stage sized for the taller AI-native
    // scene (so the first diamond can morph into the Bet in place). While the
    // shorter Double Diamond shows, the whole diagram is lowered by half the
    // height difference so it reads centered, then rises back during the
    // hand-over, carrying both scenes together.
    let ddLift = 0;
    const setLift = (handover) => {
      const y = ddLift * (1 - easeInOut(clamp01(handover)));
      block.style.transform = y ? `translate3d(0, ${y}px, 0)` : '';
    };
    let frame = 0;
    let fadeTimer = 0;

    const settledState = (active) => steps.map((_, k) => (k <= active ? 1 : 0));

    const render = (now = performance.now()) => {
      frame = 0;
      const atTop = scroller.scrollTop <= 2;
      if (atTop !== cueRef.current) { cueRef.current = atTop; setShowCue(atTop); }
      // How far the pinned panel has travelled into the track.
      const viewport = scroller.clientHeight;
      const target = scroller.getBoundingClientRect().top - section.getBoundingClientRect().top;
      const dt = Math.min(64, lastTime ? now - lastTime : 16) / 1000;
      lastTime = now;
      const stepPxFull = viewport * STEP_LENGTH;
      const transitionPx = viewport * TRANSITION_LENGTH;
      // Where scroll says each segment should be (0–1).
      segments.forEach((seg) => {
        seg.goal = seg.handover
          ? clamp01((target - AI_SCENE_FROM_STEP * stepPxFull) / transitionPx)
          : clamp01((target - seg.step * stepPxFull - transitionPx) / (viewport * DRAW_LENGTH));
      });
      if (!started || reduceMotion) {
        segments.forEach((seg) => { seg.u = seg.goal; });
        started = true;
      } else {
        const behind = segments.filter((seg) => seg.u < seg.goal).length;
        const forward = segments.find((seg) => seg.u < seg.goal);
        if (forward) {
          // Forward: only the earliest unfinished segment plays.
          const boost = behind > CATCH_UP_AFTER ? CATCH_UP_FACTOR : 1;
          forward.u = Math.min(forward.goal, forward.u + (dt * boost) / forward.seconds);
        } else {
          // Back: the latest segment past its goal rewinds, quickly.
          const back = [...segments].reverse().find((seg) => seg.u > seg.goal);
          if (back) back.u = Math.max(back.goal, back.u - (dt * REWIND_FACTOR) / back.seconds);
        }
      }
      if (segments.some((seg) => Math.abs(seg.u - seg.goal) > 0.0005)) frame = requestAnimationFrame(render);
      // Text follows the scroll itself (like the About page: it arrives with
      // the scroll/snap and fades on its own clock); only the drawing plays
      // after it, at its own pace (`shown`).
      const travelled = target;
      const stepLength = viewport * STEP_LENGTH;
      const transition = viewport * TRANSITION_LENGTH;
      // Each text sits at the center at its step's resting point (where the
      // scroll snaps) and moves across the whole scroll to the next rest —
      // the next text rising in as this one leaves upward — so the move is
      // spread over the full snap, paced like the About page's text.
      const rests = steps.map((_, k) => k * stepLength + transition + viewport * DRAW_LENGTH);
      const offsets = rests.map((rest) => (travelled < rest
        ? transition * clamp01((rest - travelled) / stepLength)
        : -transition * clamp01((travelled - rest) / stepLength)));
      let active = 0;
      offsets.forEach((y, k) => { if (Math.abs(y) < Math.abs(offsets[active])) active = k; });
      const P = steps.map((_, k) => gentle(segments.find((seg) => seg.step === k).u));
      if (!reduceMotion) {
        stepRefs.current.forEach((el, k) => {
          if (!el) return;
          el.style.transform = `translate3d(0, ${offsets[k]}px, 0)`;
          // Opacity is not scrubbed: like the About page, the active step
          // fades in on its own clock (CSS, .ps-step.is-active).
        });
      }

      if (reduceMotion) {
        // No scrubbing: each step cross-fades to its finished state.
        if (!commitActive(active)) return;
        diagram.classList.add('pd-scenes--swap');
        window.clearTimeout(fadeTimer);
        fadeTimer = window.setTimeout(() => {
          applyDiagramState(index, settledState(active), unit, active >= AI_SCENE_FROM_STEP ? 1 : 0);
          setLift(active >= AI_SCENE_FROM_STEP ? 1 : 0);
          diagram.classList.remove('pd-scenes--swap');
        }, REDUCED_FADE_MS);
        return;
      }
      commitActive(active);
      // The Double Diamond hands over to the AI-native scene while step 3's
      // text scrolls in, so the first diamond's shrink into the Bet scrubs too.
      const handover = gentle(segments.find((seg) => seg.handover).u);
      applyDiagramState(index, P, unit, handover);
      setLift(handover);
    };
    const schedule = () => {
      if (frame) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(render);
    };

    const measure = () => {
      root.style.setProperty('--pd-viewport', `${scroller.clientHeight}px`);
      // Each scene is letterboxed inside the shared stage, so its scale is set
      // by whichever axis is tighter. Layout sizes, not getBoundingClientRect:
      // the page opens under a scale transform ResizeObserver never reports.
      scenes.forEach((svg) => {
        const [, , vbW, vbH] = svg.getAttribute('viewBox').split(' ').map(Number);
        const u = Math.max(vbW / (svg.clientWidth || vbW), vbH / (svg.clientHeight || vbH));
        svg.style.setProperty('--pd-u', String(u));
        unit = u; // the last scene (AI-native) carries the particles
      });
      const [ddHeight, aiHeight] = scenes.map((svg) => Number(svg.getAttribute('viewBox').split(' ')[3]));
      ddLift = (aiHeight - ddHeight) / 2 / unit;
      if (reduceMotion) {
        applyDiagramState(index, settledState(activeRef.current), unit, activeRef.current >= AI_SCENE_FROM_STEP ? 1 : 0);
        setLift(activeRef.current >= AI_SCENE_FROM_STEP ? 1 : 0);
      }
      schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(scroller);
    resize.observe(diagram);
    measure();

    scroller.addEventListener('scroll', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(fadeTimer);
      resize.disconnect();
      scroller.removeEventListener('scroll', schedule);
    };
  }, [commitActive, reduceMotion, steps]);

  return (
    <div className={`process-story${reduceMotion ? ' process-story--static' : ''}`} ref={rootRef}>
      <header className="ps-intro">
        <RippleGrid />
        <div className="ps-intro-copy">
          <p className="ps-eyebrow">{content.eyebrow}</p>
          <h1 className="ps-headline">{content.headline}</h1>
          <p className="ps-subline">{content.subline}</p>
        </div>
        <ScrollCue visible={showCue} className="project-scroll-cue" />
      </header>

      <section
        ref={sectionRef}
        className="ps-scrolly"
        aria-label={content.eyebrow}
        style={{ '--ps-steps': steps.length, '--ps-step-length': STEP_LENGTH }}
      >
        {/* Pinned for the whole track: text (one step at a time, cross-faded
            in place) beside the diagram on desktop, below it on mobile. */}
        <div className="ps-pin">
          <ol className="ps-steps">
            {steps.map((step, k) => (
              <li
                key={step.id}
                ref={(el) => { stepRefs.current[k] = el; }}
                className={`ps-step${activeStep === k ? ' is-active' : ''}`}
                aria-current={activeStep === k ? 'step' : undefined}
              >
                <h2 className="ps-step-title">{step.title}</h2>
                <StepBody text={step.body} />
              </li>
            ))}
          </ol>
          <div className="ps-stage">
            <ProcessDiagram ref={diagramRef} activeStep={activeStep} label={DIAGRAM_LABEL} />
          </div>
        </div>
        <div className="ps-track" aria-hidden="true" />
        {/* Snap stops, like the About page: scrolling settles where a step's
            drawing has just finished, never mid-animation. Plain markers —
            the sticky panel itself is never a snap target. */}
        {steps.map((step, k) => (
          <div
            key={step.id}
            className="ps-snap"
            aria-hidden="true"
            style={{ top: `calc(var(--pd-viewport) * ${k * STEP_LENGTH + TRANSITION_LENGTH + DRAW_LENGTH})` }}
          />
        ))}
      </section>

      <footer className="ps-closing">
        <RippleGrid />
        <div className="ps-closing-copy">
          <p className="ps-closing-line">{content.closing.line}</p>
          <p className="ps-closing-words">{content.closing.tagline}</p>
        </div>
      </footer>
    </div>
  );
}
