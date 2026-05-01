import { motion } from 'framer-motion';
import { T, SPRING, SPRING_SLOW } from '../transitions';
import { asset } from '../utils/asset';

export function GridItem({ item, onItemClick }) {
  const [col, row] = item.span || [1, 1];
  const hasImage = Boolean(item.image);
  const isImageTile = item.content?.type === 'image';

  return (
    <motion.div
      className={`grid-item card-${item.tone || 'base'}${hasImage ? ' item-has-image' : ''}`}
      style={{
        '--cs': col,
        '--rs': row,
        ...(hasImage ? {
          backgroundImage: `url(${asset(item.image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}),
      }}
      role="button"
      tabIndex={0}
      aria-label={item.label}
      onClick={() => onItemClick(item)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onItemClick(item); } }}
      layoutId={`item-${item.id}`}
      layout
      variants={{
        hidden: { opacity: 0, y: 18, scale: 0.97 },
        show:   { opacity: 1, y: 0,  scale: 1,    transition: SPRING_SLOW },
      }}
      whileHover={{ scale: 1.02, transition: SPRING }}
      transition={{ layout: T }}
    >
      {hasImage && <div className="grid-item-img-gradient" aria-hidden="true" />}

      {item.illustration && !hasImage && (
        <div className="grid-item-illus" aria-hidden="true">
          <img src={asset(`/images/illustrations/${item.illustration}.svg`)} className="grid-item-illus-img" alt="" />
        </div>
      )}

      <div className="grid-corners" aria-hidden="true">
        <span /><span /><span /><span />
      </div>

      <div className="grid-item-inner">
        {isImageTile ? (
          item.label && <div className="grid-item-caption">{item.label}</div>
        ) : (
          <>
            <div className="grid-item-label">{item.label}</div>
            {item.type === 'grid' && item.badgeLabel && (
              <div className="grid-item-badge">
                {item.items?.length} {item.badgeLabel}
              </div>
            )}
            {item.type === 'page' && item.content?.tagline && (
              <div className="grid-item-sub">{item.content.tagline}</div>
            )}
            {item.type === 'page' && item.content?.type === 'hero' && (
              <div className="grid-item-sub">{item.content.role}</div>
            )}
          </>
        )}
      </div>

      <div className="grid-item-hint" aria-hidden="true">↗</div>
    </motion.div>
  );
}
