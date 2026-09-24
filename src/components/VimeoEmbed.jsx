import { useEffect, useRef, useState } from 'react';

const getVideoId = (src) => src.match(/player\.vimeo\.com\/video\/(\d+)/)?.[1];

export default function VimeoEmbed({ src, title, aspectRatio }) {
  const wrapperRef = useRef(null);
  const iframeRef = useRef(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [poster, setPoster] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [playerBlocked, setPlayerBlocked] = useState(false);
  const videoId = getVideoId(src);
  const videoUrl = videoId ? `https://vimeo.com/${videoId}` : src;
  const playerSrc = `${src}${src.includes('?') ? '&' : '?'}app_id=122963`;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !('IntersectionObserver' in window)) {
      setNearViewport(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: '400px' });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoId) return undefined;
    const controller = new AbortController();
    const endpoint = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}&width=1280`;
    fetch(endpoint, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data?.thumbnail_url) setPoster(data.thumbnail_url); })
      .catch(() => {});
    return () => controller.abort();
  }, [videoId, videoUrl]);

  useEffect(() => {
    if (!nearViewport) return undefined;
    const handleMessage = (event) => {
      if (event.origin !== 'https://player.vimeo.com' || event.source !== iframeRef.current?.contentWindow) return;
      let message = event.data;
      if (typeof message === 'string') {
        try { message = JSON.parse(message); } catch { return; }
      }
      if (['ready', 'loaded', 'play'].includes(message?.event)) {
        setPlayerReady(true);
        setPlayerBlocked(false);
      } else if (message?.event === 'error') {
        setPlayerBlocked(true);
      }
    };
    window.addEventListener('message', handleMessage);
    const timeout = window.setTimeout(() => setPlayerBlocked((blocked) => playerReady ? blocked : true), 9000);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.clearTimeout(timeout);
    };
  }, [nearViewport, playerReady]);

  return (
    <div ref={wrapperRef} className="section-video-wrap" style={{ '--video-ratio': aspectRatio }}>
      {nearViewport && (
        <iframe
          ref={iframeRef}
          src={playerSrc}
          className="section-video"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          title={title}
          onLoad={() => iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ method: 'ping' }), 'https://player.vimeo.com')}
        />
      )}
      {!playerReady && (
        <div className="section-video-fallback" style={poster ? { backgroundImage: `url("${poster}")` } : undefined}>
          {playerBlocked && (
            <a
              className="section-video-fallback-action"
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${title} on Vimeo`}
              title="Watch on Vimeo"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M6.75 4.8 13 9l-6.25 4.2V4.8Z" fill="currentColor"/>
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
