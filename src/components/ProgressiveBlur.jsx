/**
 * Independently masked copies of the source image create a gradual blur
 * without making each band blur the output of the previous band. The image
 * remains sharp above the text region and blur grows toward the bottom edge.
 */
export default function ProgressiveBlur({ src, variant = 'hero', fit = 'cover', className = '' }) {
  if (!src) return null;

  const isHero = variant === 'hero';
  const layerCount = isHero ? 6 : 4;
  const maxBlur = isHero ? 5 : 2.5;
  const regionStart = isHero ? 76 : 66;
  const increment = (100 - regionStart) / layerCount;

  const layers = Array.from({ length: layerCount }, (_, index) => {
    const step = index + 1;
    const linearProgress = step / layerCount;
    const blur = Math.max(0.35, maxBlur * Math.pow(linearProgress, 1.8));
    const start = Math.max(regionStart, regionStart + increment * (step - 1));
    const opaqueStart = Math.min(100, regionStart + increment * step);
    const opaqueEnd = regionStart + increment * (step + 1);
    const end = regionStart + increment * (step + 2);
    const stops = [
      `transparent ${start.toFixed(1)}%`,
      `#000 ${opaqueStart.toFixed(1)}%`,
    ];
    if (opaqueEnd < 100) stops.push(`#000 ${opaqueEnd.toFixed(1)}%`);
    if (end < 100) stops.push(`transparent ${end.toFixed(1)}%`);
    const mask = `linear-gradient(to bottom, ${stops.join(', ')})`;

    return (
      <img
        key={step}
        src={src}
        alt=""
        className="progressive-blur-band"
        draggable={false}
        decoding="async"
        loading="eager"
        fetchPriority="high"
        style={{
          '--progressive-blur-radius': `${blur.toFixed(2)}px`,
          '--progressive-blur-mask': mask,
          objectFit: fit,
        }}
      />
    );
  });

  return (
    <div
      className={`progressive-blur progressive-blur--${variant}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      {layers}
    </div>
  );
}
