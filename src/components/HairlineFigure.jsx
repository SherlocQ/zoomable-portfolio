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
export function HairlineFigure({ figure, className }) {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const card = stage.closest('.grid-item') || stage;
    HL.inject(document);
    const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
    const handle = figure.mount({ stage, svg, read: { textContent: '' } }, figure.range[1]);

    const forward = (e) => {
      stage.dispatchEvent(new PointerEvent(e.type, {
        clientX: e.clientX, clientY: e.clientY, pointerId: e.pointerId, pointerType: e.pointerType,
      }));
    };
    if (card !== stage) FORWARD.forEach((type) => card.addEventListener(type, forward));

    return () => {
      if (card !== stage) FORWARD.forEach((type) => card.removeEventListener(type, forward));
      handle.destroy();
      svg.remove();
    };
  }, [figure]);

  return (
    <div className={className} aria-hidden="true">
      <div ref={stageRef} className="hairline-stage" data-hairline={figure.name} />
    </div>
  );
}
