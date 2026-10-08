import { useEffect, useRef } from 'react';
import HL from '../hairline/kernel';

const FORWARD = ['pointermove', 'pointerdown', 'pointerleave'];

// Mounts one Hairline figure (src/hairline/*.js) the way the package's bench
// does: an svg in a [data-hairline] stage, the figure's default intensity,
// and a read-out nobody sees. Colours come from the --hairline-* tokens in
// App.css, so the figure follows the site's theme.
//
// The whole card is the input: the stage takes no pointer events itself, and
// the card's events are re-sent to it, so the figure reads points anywhere on
// the card (outside its own frame too) and only rests when the card is left.
// `inputSelector` names a different input area (the nearest matching
// ancestor); with `stretch`, that area's left and right edges are mapped onto
// the stage's, so crossing the whole area crosses the whole figure. With
// `interactive={false}` nothing is forwarded: the figure only plays what it
// does on its own (the Contact plane's throw).
export function HairlineFigure({ figure, className, inputSelector = '.grid-item', stretch = false, interactive = true }) {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const card = (interactive && stage.closest(inputSelector)) || stage;
    let undo = null, waiting = null;

    function start() {
      HL.inject(document);
      const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
      const handle = figure.mount({ stage, svg, read: { textContent: '' } }, figure.range[1]);
      const forward = (e) => {
        let { clientX } = e;
        if (stretch) {
          const area = card.getBoundingClientRect(), box = stage.getBoundingClientRect();
          clientX = box.left + ((clientX - area.left) / area.width) * box.width;
        }
        stage.dispatchEvent(new PointerEvent(e.type, {
          clientX, clientY: e.clientY, pointerId: e.pointerId, pointerType: e.pointerType,
        }));
      };
      if (card !== stage) FORWARD.forEach((type) => card.addEventListener(type, forward));
      undo = () => {
        if (card !== stage) FORWARD.forEach((type) => card.removeEventListener(type, forward));
        handle.destroy();
        svg.remove();
      };
    }

    // A figure that plays on its own waits for the first-load name intro to leave, so its
    // motion is seen rather than spent under the overlay.
    if (!interactive && document.querySelector('.preloader')) {
      waiting = new MutationObserver(() => {
        if (document.querySelector('.preloader')) return;
        waiting.disconnect();
        waiting = null;
        start();
      });
      waiting.observe(document.body, { childList: true, subtree: true });
    } else start();

    return () => {
      waiting?.disconnect();
      undo?.();
    };
  }, [figure, inputSelector, stretch, interactive]);

  return (
    <div className={className} aria-hidden="true">
      <div ref={stageRef} className="hairline-stage" data-hairline={figure.name} />
    </div>
  );
}
