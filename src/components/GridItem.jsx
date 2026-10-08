import { motion } from 'framer-motion';
import { T, LIGHTBOX_ZOOM, SPRING_SLOW } from '../transitions';
import { asset } from '../utils/asset';
import { HairlineFigure } from './HairlineFigure';
import bricks from '../hairline/bricks';
import envelope from '../hairline/envelope';
import folder from '../hairline/folder';
import keys from '../hairline/keys';
import layout from '../hairline/layout';
import ruler from '../hairline/ruler';
import tokens from '../hairline/tokens';
import ProgressiveBlur from './ProgressiveBlur';

const ILLUSTRATIONS = {
  build: bricks,
  contact: envelope,
  craft: ruler,
  process: keys,
  projects: folder,
  // Build projects
  'brand-tokens': tokens,
  'layout-inspector': layout,
};

export function GridItem({ item, onItemClick }) {
  const [col, row] = item.span || [1, 1];
  const hasImage    = Boolean(item.image);
  const isAnimatedImage = /\.gif(?:$|\?)/i.test(item.image || '');
  const isImageTile = item.content?.type === 'image';
  const useProgressiveBlur = hasImage && !isAnimatedImage;
  const figure = ILLUSTRATIONS[item.illustration];
  // Entry cards (Projects, Craft) zoom their image on hover, so the image and
  // its blur copies move into one layer that scales together instead of the
  // card background. Lightbox-source tiles keep their media untouched.
  const zoomsOnHover = hasImage && !isImageTile;
  // Project cards without an image (AI native vision) still get the text lift.
  const liftsOnHover = zoomsOnHover || item.content?.type === 'project';
  const imageBackground = hasImage && !isAnimatedImage && !isImageTile ? {
    backgroundImage: item.bgImage
      ? `url(${asset(item.image)}), url(${asset(item.bgImage)})`
      : `url(${asset(item.image)})`,
    backgroundSize: item.fit === 'contain' ? (item.bgImage ? 'contain, cover' : 'contain') : 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : null;

  return (
    <motion.div
      className={`grid-item card-${item.tone || 'base'}${hasImage ? ' item-has-image' : ''}`}
      data-tile={item.id}
      style={{
        '--cs': col,
        '--rs': row,
        ...(hasImage ? {
          ...(item.previewBg || item.bg ? { backgroundColor: item.previewBg || item.bg } : {}),
          ...(isImageTile && item.bgImage ? { backgroundImage: `url(${asset(item.bgImage)})` } : {}),
          // Image-page thumbnails use a real intrinsic-ratio <img>; this only
          // controls the optional backdrop layer beneath transparent pixels.
          // Entry-card CSS backgrounds continue to respect their own `fit`.
          ...(isImageTile ? {
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          } : {}),
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
      {isImageTile && (
        <motion.img
          src={asset(item.image)}
          alt=""
          aria-hidden="true"
          className={`grid-item-media${item.previewFit === 'cover' ? ' grid-item-media--cover' : ''}`}
          layoutId={`item-img-${item.id}`}
          data-lightbox-source={item.id}
          layoutCrossfade={false}
          transition={{ layout: LIGHTBOX_ZOOM }}
          draggable={false}
          decoding="async"
          loading={isAnimatedImage ? 'lazy' : undefined}
        />
      )}
      {isImageTile && isAnimatedImage && <ProgressiveBlur variant="card" animated />}
      {isImageTile && useProgressiveBlur && (
        <ProgressiveBlur
          src={asset(item.image)}
          variant="card"
          fit={item.fit === 'contain' ? 'contain' : 'cover'}
        />
      )}
      {zoomsOnHover && (
        <div className="grid-item-zoom" style={imageBackground || undefined} aria-hidden="true">
          {isAnimatedImage && (
            <img
              src={asset(item.image)}
              alt=""
              className={`grid-item-media${item.previewFit === 'cover' ? ' grid-item-media--cover' : ''}`}
              draggable={false}
              decoding="async"
              loading="lazy"
            />
          )}
          {isAnimatedImage ? (
            <ProgressiveBlur variant="card" animated />
          ) : (
            <ProgressiveBlur
              src={asset(item.image)}
              variant="card"
              fit={item.fit === 'contain' ? 'contain' : 'cover'}
            />
          )}
        </div>
      )}
      {hasImage && <div className="grid-item-img-gradient" aria-hidden="true" />}
      {figure && <HairlineFigure figure={figure} className="grid-item-illustration grid-item-illustration--hairline" />}
      {item.portrait && <img src={asset(item.portrait)} alt="" aria-hidden="true" className="grid-item-portrait" />}

      <div className={`grid-item-inner${liftsOnHover ? ' grid-item-inner--lift' : ''}`}>
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
