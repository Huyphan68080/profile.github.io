import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import RippleButton from '../common/RippleButton';

const isValidHttpUrl = (value) => {
  if (typeof value !== 'string') return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const getPreviewSources = (project) => {
  const sources = [];
  const imageValue = typeof project.image === 'string' ? project.image.trim() : '';
  const hrefValue = typeof project.href === 'string' ? project.href.trim() : '';

  if (isValidHttpUrl(imageValue)) {
    sources.push(imageValue);
  }

  if (isValidHttpUrl(hrefValue)) {
    const encodedUrl = encodeURIComponent(hrefValue);
    sources.push(`https://image.thum.io/get/width/1200/noanimate/${hrefValue}`);
    sources.push(`https://s.wordpress.com/mshots/v1/${encodedUrl}?w=1200`);
  }

  return Array.from(new Set(sources));
};

const ProjectCard = ({ project, index }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const hrefValue = typeof project.href === 'string' ? project.href.trim() : '';
  const hasLiveDemo = hrefValue !== '#' && isValidHttpUrl(hrefValue);
  const previewSources = useMemo(() => getPreviewSources(project), [project.href, project.image]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const [frameFailed, setFrameFailed] = useState(false);
  const imageSrc = previewSources[previewIndex] || '';
  const hasManualImage = Boolean(typeof project.image === 'string' && isValidHttpUrl(project.image.trim()));
  const shouldUseLiveFrame = hasLiveDemo && !hasManualImage;

  useEffect(() => {
    setPreviewIndex(0);
    setImageFailed(false);
    setFrameReady(false);
    setFrameFailed(false);
  }, [project.href, project.image, project.title]);

  useEffect(() => {
    if (!shouldUseLiveFrame || frameReady) return undefined;

    const timeoutId = window.setTimeout(() => {
      setFrameFailed(true);
    }, 4500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [shouldUseLiveFrame, project.href, frameReady]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const posX = event.clientX - rect.left;
    const posY = event.clientY - rect.top;

    const rotateY = ((posX - rect.width / 2) / rect.width) * 16;
    const rotateX = ((rect.height / 2 - posY) / rect.height) * 16;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="[perspective:1100px]">
      <motion.article
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX: tilt.x, rotateY: tilt.y, transformStyle: 'preserve-3d' }}
        transition={{ type: 'spring', stiffness: 180, damping: 17, mass: 0.55 }}
        className="glass-panel group relative h-full rounded-3xl border border-slate-200/20 p-6 sm:p-7"
      >
        <div
          className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${project.accentClass} opacity-45 blur-xl transition group-hover:opacity-65`}
        />

        <div style={{ transform: 'translateZ(34px)' }}>
          {shouldUseLiveFrame && !frameFailed ? (
            <a
              href={hasLiveDemo ? project.href : undefined}
              target={hasLiveDemo ? '_blank' : undefined}
              rel={hasLiveDemo ? 'noreferrer' : undefined}
              className={`group/preview relative block overflow-hidden rounded-2xl border border-rose-300/25 ${
                hasLiveDemo ? 'cursor-pointer' : 'cursor-default'
              }`}
              aria-label={hasLiveDemo ? `Open ${project.title}` : `${project.title} preview`}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black/30">
                <div className="absolute left-0 top-0 h-[300%] w-[300%] origin-top-left scale-[0.3334]">
                  <iframe
                    src={hrefValue}
                    title={`${project.title} live preview`}
                    loading="lazy"
                    className="h-full w-full border-0"
                    tabIndex={-1}
                    onLoad={() => {
                      setFrameReady(true);
                      setFrameFailed(false);
                    }}
                  />
                </div>
                {!frameReady ? (
                  <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.18em] text-rose-100/90">
                    Loading Preview...
                  </div>
                ) : null}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/36 via-transparent to-transparent" />
              </div>
            </a>
          ) : imageSrc && !imageFailed ? (
            <a
              href={hasLiveDemo ? project.href : undefined}
              target={hasLiveDemo ? '_blank' : undefined}
              rel={hasLiveDemo ? 'noreferrer' : undefined}
              className={`group/preview relative block overflow-hidden rounded-2xl border border-rose-300/25 ${
                hasLiveDemo ? 'cursor-pointer' : 'cursor-default'
              }`}
              aria-label={hasLiveDemo ? `Open ${project.title}` : `${project.title} preview`}
            >
              <img
                src={imageSrc}
                alt={`${project.title} preview`}
                loading="lazy"
                className="aspect-video w-full object-cover transition duration-500 group-hover/preview:scale-[1.03]"
                onError={() => {
                  if (previewIndex < previewSources.length - 1) {
                    setPreviewIndex((current) => current + 1);
                    return;
                  }
                  setImageFailed(true);
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/36 via-transparent to-transparent" />
            </a>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-2xl border border-rose-300/25 bg-rose-100/20 text-xs uppercase tracking-[0.18em] text-rose-900 dark:bg-rose-500/12 dark:text-rose-100">
              Preview Coming Soon
            </div>
          )}

          <p className="cyber-title mt-5 text-xs uppercase tracking-[0.3em] text-rose-500 dark:text-rose-300">
            Project {index + 1}
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{project.title}</h3>
          <p className="mt-4 leading-relaxed text-zinc-700 dark:text-zinc-300/90">{project.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-rose-300/30 bg-rose-100/25 px-3 py-1 text-xs uppercase tracking-[0.18em] text-rose-900 dark:bg-rose-500/12 dark:text-rose-100"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-7">
            <RippleButton
              href={hasLiveDemo ? project.href : undefined}
              external={hasLiveDemo}
              className="bg-rose-100/25 text-xs tracking-[0.17em] uppercase dark:bg-rose-500/14"
            >
              {hasLiveDemo ? 'Visit Website' : 'Coming Soon'}
            </RippleButton>
          </div>
        </div>
      </motion.article>
    </div>
  );
};

export default ProjectCard;
