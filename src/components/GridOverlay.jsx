import { motion } from 'framer-motion';
import { GridItem } from './GridItem';
import { T } from '../transitions';

/* Simulate CSS grid row auto-placement to count how many rows the items need. */
function computeRows(items, cols = 4) {
  const occ = {};
  let row = 1, col = 1, maxRow = 0;

  for (const item of items) {
    const cSpan = item.span?.[0] || 1;
    const rSpan = item.span?.[1] || 1;
    let placed = false;

    while (!placed) {
      if (col + cSpan - 1 <= cols) {
        let fits = true;
        outer:
        for (let r = row; r < row + rSpan; r++)
          for (let c = col; c < col + cSpan; c++)
            if (occ[`${r}_${c}`]) { fits = false; break outer; }

        if (fits) {
          for (let r = row; r < row + rSpan; r++)
            for (let c = col; c < col + cSpan; c++)
              occ[`${r}_${c}`] = true;
          maxRow = Math.max(maxRow, row + rSpan - 1);
          col += cSpan;
          placed = true;
        } else {
          col++;
          if (col + cSpan - 1 > cols) { col = 1; row++; }
        }
      } else {
        col = 1; row++;
      }
    }
  }
  return maxRow || 1;
}

export default function GridOverlay({ node, onItemClick, zIndex, isActive = true }) {
  const isGallery = node.gallery === true;
  const rows = isGallery ? computeRows(node.items) : null;

  // ≤ 2 rows: fill the overlay exactly (no scrolling)
  // > 2 rows: each row is ~half the viewport height, scroll for the rest
  const fits = rows !== null && rows <= 2;

  const innerStyle = isGallery && fits
    ? { gridTemplateRows: `repeat(${rows}, 1fr)`, height: '100%' }
    : undefined;

  return (
    <motion.div
      className={`overlay-shell grid-full-overlay${isGallery ? ' gallery-scroll' : ''}`}
      style={{ zIndex }}
      layoutId={`item-${node.id}`}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: T }}
      transition={{ ...T, opacity: { duration: 0.2 } }}
    >
      <motion.div
        className={`grid-overlay-inner${isGallery ? ' gallery-inner' : ''}${isGallery && !fits ? ' gallery-inner--scroll' : ''}`}
        style={innerStyle}
        variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.22 } } }}
        initial="hidden"
        animate="show"
      >
        {node.items.map((item) => (
          <GridItem key={item.id} item={item} onItemClick={onItemClick} />
        ))}
      </motion.div>
    </motion.div>
  );
}
