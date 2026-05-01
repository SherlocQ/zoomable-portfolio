import { motion } from 'framer-motion';
import { GridItem } from './GridItem';

export default function GridView({ node, onItemClick, isHidden }) {
  return (
    <motion.div
      className="grid-view"
      variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } } }}
      initial="hidden"
      animate="show"
      style={isHidden ? { opacity: 0, pointerEvents: 'none' } : undefined}
    >
      {node.items.map((item) => (
        <GridItem key={item.id} item={item} onItemClick={onItemClick} />
      ))}
    </motion.div>
  );
}
