import resized from '../data/resizedImages.json';

const RESIZED = new Set(resized);

/**
 * The file to show for an image path: the 2400px copy made by
 * scripts/resize-gallery-images.mjs when there is one, else the original.
 * Carousels, the Lightbox and their preloads all use it, so the same file is
 * fetched and decoded once wherever an image appears.
 */
export const mediaSrc = (src) => (RESIZED.has(src) ? src.replace(/^\/images\//, '/images/resized/') : src);
