import { motion } from 'framer-motion';
import { T, SPRING_SLOW } from '../transitions';
import { asset } from '../utils/asset';
import { BuildIllustration } from './illustrations/BuildIllustration';
import { ContactIllustration } from './illustrations/ContactIllustration';
import { CraftIllustration } from './illustrations/CraftIllustration';
import { ProcessIllustration } from './illustrations/ProcessIllustration';
import { ProjectsIllustration } from './illustrations/ProjectsIllustration';

const ILLUSTRATIONS = {
  build: BuildIllustration,
  contact: ContactIllustration,
  craft: CraftIllustration,
  process: ProcessIllustration,
  projects: ProjectsIllustration,
};

export function GridItem({ item, onItemClick }) {
  const [col, row] = item.span || [1, 1];
  const hasImage    = Boolean(item.image);
  const isImageTile = item.content?.type === 'image';
  const Illustration = ILLUSTRATIONS[item.illustration];

  return (
    <motion.div
      className={`grid-item card-${item.tone || 'base'}${hasImage ? ' item-has-image' : ''}`}
      style={{
        '--cs': col,
        '--rs': row,
        ...(hasImage ? {
          ...(item.bg ? { backgroundColor: item.bg } : {}),
          backgroundImage: item.bgImage
            ? `url(${asset(item.image)}), url(${asset(item.bgImage)})`
            : `url(${asset(item.image)})`,
          backgroundSize: item.fit === 'contain'
            ? (item.bgImage ? 'contain, cover' : 'contain')
            : 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
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
      transition={{ layout: T }}
    >
      {hasImage && <div className="grid-item-img-gradient" aria-hidden="true" />}
      {Illustration && <Illustration className="grid-item-illustration" aria-hidden="true" />}

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
            {item.type === 'page' && (item.content?.type === 'hero' || item.content?.type === 'about') && item.content?.role && (
              <div className="grid-item-sub">{item.content.role}</div>
            )}
          </>
        )}
      </div>

      <div className="grid-item-hint" aria-hidden="true">↗</div>
    </motion.div>
  );
}
