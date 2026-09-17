import { motion } from 'framer-motion';
import { T, EASE, SPRING_SLOW } from '../transitions';
import { asset } from '../utils/asset';
import { BuildIllustration } from './illustrations/BuildIllustration';
import { ContactIllustration } from './illustrations/ContactIllustration';
import { CraftIllustration } from './illustrations/CraftIllustration';
import { ProcessIllustration } from './illustrations/ProcessIllustration';
import { ProjectsIllustration } from './illustrations/ProjectsIllustration';
import ProgressiveBlur from './ProgressiveBlur';

const ILLUSTRATIONS = {
  build: BuildIllustration,
  contact: ContactIllustration,
  craft: CraftIllustration,
  process: ProcessIllustration,
  projects: ProjectsIllustration,
};

const IMAGE_ZOOM = { duration: 0.56, ease: EASE };

export function GridItem({ item, onItemClick }) {
  const [col, row] = item.span || [1, 1];
  const hasImage    = Boolean(item.image);
  const isAnimatedImage = /\.gif(?:$|\?)/i.test(item.image || '');
  const isImageTile = item.content?.type === 'image';
  const preserveImageDetail = item.id?.startsWith('craft');
  const useProgressiveBlur = hasImage && !preserveImageDetail && !isImageTile && !isAnimatedImage;
  const Illustration = ILLUSTRATIONS[item.illustration];

  return (
    <motion.div
      className={`grid-item card-${item.tone || 'base'}${hasImage ? ' item-has-image' : ''}`}
      data-tile={item.id}
      style={{
        '--cs': col,
        '--rs': row,
        ...(hasImage ? {
          ...(item.previewBg || item.bg ? { backgroundColor: item.previewBg || item.bg } : {}),
          ...(!isAnimatedImage && !isImageTile ? {
            backgroundImage: item.bgImage
              ? `url(${asset(item.image)}), url(${asset(item.bgImage)})`
              : `url(${asset(item.image)})`,
          } : {}),
          ...(isImageTile && item.bgImage ? { backgroundImage: `url(${asset(item.bgImage)})` } : {}),
          // Image-page thumbnails use a real intrinsic-ratio <img>; this only
          // controls the optional backdrop layer beneath transparent pixels.
          // Entry-card CSS backgrounds continue to respect their own `fit`.
          backgroundSize: isImageTile
            ? 'cover'
            : item.fit === 'contain'
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
      {(isImageTile || isAnimatedImage) && (
        <motion.img
          src={asset(item.image)}
          alt=""
          aria-hidden="true"
          className={`grid-item-media${item.previewFit === 'cover' ? ' grid-item-media--cover' : ''}`}
          layoutId={isImageTile ? `item-img-${item.id}` : undefined}
          layoutCrossfade={false}
          transition={{ layout: IMAGE_ZOOM }}
          draggable={false}
          decoding="async"
        />
      )}
      {useProgressiveBlur && (
        <ProgressiveBlur
          src={asset(item.image)}
          variant="card"
          fit={item.fit === 'contain' ? 'contain' : 'cover'}
        />
      )}
      {hasImage && <div className="grid-item-img-gradient" aria-hidden="true" />}
      {Illustration && <Illustration className="grid-item-illustration" aria-hidden="true" />}
      {item.portrait && <img src={asset(item.portrait)} alt="" aria-hidden="true" className="grid-item-portrait" />}

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
