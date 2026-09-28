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

const DIAGRAM_LABEL = "Two diagrams, shown one after the other. First, the Double Diamond: Discover and Define, then Develop and Deliver, each diamond going wide and converging at a fixed point. Then the AI-native design process: the first diamond shrinks into a Bet; five loops go wide quickly and narrow down slowly; AI routes each loop's feedback three ways — noise fades out, execution issues go back into the next loop, direction signals go down to a decision; only matching signals from consecutive loops settle, growing a Direction triangle across the width, taller and deeper to the right.";

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

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
    let unit = 1;
    let frame = 0;
    let fadeTimer = 0;

    const settledState = (active) => steps.map((_, k) => (k <= active ? 1 : 0));

    const render = () => {
      frame = 0;
      setShowCue(scroller.scrollTop <= 2);
      // How far the pinned panel has travelled into the track.
      const viewport = scroller.clientHeight;
      const travelled = scroller.getBoundingClientRect().top - section.getBoundingClientRect().top;
      const stepLength = viewport * STEP_LENGTH;
      const transition = viewport * TRANSITION_LENGTH;
      const pinned = viewport * (DRAW_LENGTH + HOLD_LENGTH);
      // Each text reaches the center when its transition ends, holds there for
      // the draw + hold, then leaves upward; offsets are 1:1 with the scroll.
      const offsets = steps.map((_, k) => {
        const arrive = k * stepLength + transition;
        if (travelled < arrive) return arrive - travelled;
        if (travelled > arrive + pinned) return arrive + pinned - travelled;
        return 0;
      });
      let active = 0;
      offsets.forEach((y, k) => { if (Math.abs(y) < Math.abs(offsets[active])) active = k; });
      const P = steps.map((_, k) => clamp01((travelled - k * stepLength - transition) / (viewport * DRAW_LENGTH)));
      if (!reduceMotion) {
        stepRefs.current.forEach((el, k) => {
          if (!el) return;
          el.style.transform = `translate3d(0, ${offsets[k]}px, 0)`;
          el.style.opacity = String(clamp01(1 - Math.abs(offsets[k]) / transition));
        });
      }

      if (reduceMotion) {
        // No scrubbing: each step cross-fades to its finished state.
        if (!commitActive(active)) return;
        diagram.classList.add('pd-scenes--swap');
        window.clearTimeout(fadeTimer);
        fadeTimer = window.setTimeout(() => {
          applyDiagramState(index, settledState(active), unit, active >= AI_SCENE_FROM_STEP ? 1 : 0);
          diagram.classList.remove('pd-scenes--swap');
        }, REDUCED_FADE_MS);
        return;
      }
      commitActive(active);
      // The Double Diamond hands over to the AI-native scene while step 3's
      // text scrolls in, so the first diamond's shrink into the Bet scrubs too.
      const handover = clamp01((travelled - AI_SCENE_FROM_STEP * stepLength) / transition);
      applyDiagramState(index, P, unit, handover);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };

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
      if (reduceMotion) applyDiagramState(index, settledState(activeRef.current), unit, activeRef.current >= AI_SCENE_FROM_STEP ? 1 : 0);
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
                <p className="ps-step-body">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="ps-stage">
            <ProcessDiagram ref={diagramRef} activeStep={activeStep} label={DIAGRAM_LABEL} />
          </div>
        </div>
        <div className="ps-track" aria-hidden="true" />
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
