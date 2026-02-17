import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { profile } from '../../data/siteData';
import { useLoopTypewriter } from '../../hooks/useLoopTypewriter';
import { useSiteStatus } from '../../hooks/useSiteStatus';
import { useTypewriter } from '../../hooks/useTypewriter';
import Reveal from '../common/Reveal';
import RippleButton from '../common/RippleButton';

const HeroSection = ({ isMobileView = false, reduceMotion = false }) => {
  const typedText = useTypewriter(profile.typewriterText, 40, 620);
  const runtimeStatus = useSiteStatus();
  const [decorationIndex, setDecorationIndex] = useState(0);
  const loopingName = useLoopTypewriter(profile.name.toUpperCase(), {
    typeSpeed: 170,
    deleteSpeed: 95,
    pauseBeforeDelete: 1050,
    pauseBeforeType: 320,
  });

  const { scrollYProgress } = useScroll();

  const scale = useTransform(scrollYProgress, [0, 1], [1, isMobileView ? 0.92 : 0.87]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isMobileView ? 0.45 : 0.2]);
  const y = useTransform(scrollYProgress, [0, 1], [0, isMobileView ? -68 : -95]);

  const decorationCandidates = useMemo(
    () => [runtimeStatus.avatarDecorationUrl, runtimeStatus.avatarDecorationFallbackUrl].filter(Boolean),
    [runtimeStatus.avatarDecorationUrl, runtimeStatus.avatarDecorationFallbackUrl]
  );
  const activeDecorationSrc = decorationCandidates[decorationIndex] || '';

  useEffect(() => {
    setDecorationIndex(0);
  }, [runtimeStatus.avatarDecorationUrl, runtimeStatus.avatarDecorationFallbackUrl]);

  return (
    <motion.section
      id="hero"
      style={reduceMotion ? undefined : { scale, opacity, y }}
      className="relative flex min-h-[94vh] items-center"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 pt-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Reveal delay={0.1}>
            <p className="cyber-title text-xs uppercase tracking-[0.28em] text-rose-500 dark:text-rose-300">
              {profile.kicker}
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <h1 className="text-4xl font-extrabold leading-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl lg:text-6xl">
              <span className="inline-flex items-center">
                <span>{loopingName || '\u00A0'}</span>
                <span className="ml-2 inline-block h-[0.95em] w-[2px] animate-pulse bg-rose-400/90" />
              </span>
              <span className="mt-2 block text-xl font-semibold text-rose-500 dark:text-rose-300 sm:text-2xl">
                {profile.role}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.42}>
            <p className="neon-text min-h-14 text-lg font-medium text-orange-500 dark:text-orange-300">
              {typedText}
              <span className="ml-1 inline-block w-3 animate-pulse">|</span>
            </p>
          </Reveal>

          <Reveal delay={0.55}>
            <p className="max-w-xl text-base leading-relaxed text-zinc-700 dark:text-zinc-300/90">
              {profile.headline}
            </p>
          </Reveal>

          <Reveal delay={0.7}>
            <div className="flex flex-wrap items-center gap-4">
              <RippleButton href="#projects">Explore Projects</RippleButton>
              <RippleButton href="#contact" className="bg-rose-200/30 dark:bg-rose-500/16">
                Contact Me
              </RippleButton>
            </div>
          </Reveal>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative w-[min(92vw,350px)] sm:w-[min(74vw,380px)] lg:w-[min(44vw,420px)]">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-neonPurple/55 via-neonBlue/30 to-cyanSoft/35 blur-2xl" />
            <motion.div
              initial={{ opacity: 0, scale: 0.73, filter: 'blur(22px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="glass-panel relative z-10 mx-auto w-[min(68vw,290px)] sm:w-[min(56vw,300px)] lg:w-[min(19rem,80%)] rounded-[1.45rem] border border-slate-200/25 p-3"
            >
              <div className="relative mx-auto aspect-square w-full max-w-[245px]">
                <div className="h-full w-full overflow-hidden rounded-full border border-white/20 bg-zinc-900/70">
                  {runtimeStatus.avatarUrl ? (
                    <img src={runtimeStatus.avatarUrl} alt="Discord Avatar" className="block h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-zinc-900/70" />
                  )}
                </div>

                {activeDecorationSrc ? (
                  <img
                    src={activeDecorationSrc}
                    alt=""
                    aria-hidden="true"
                    onError={() => {
                      setDecorationIndex((prev) => prev + 1);
                    }}
                    className="pointer-events-none absolute -inset-[12%] z-10 h-[124%] w-[124%] max-w-none object-contain"
                  />
                ) : null}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.05 }}
              className="glass-panel mt-3 w-full rounded-xl px-3 py-2.5 sm:mt-4 sm:rounded-2xl sm:px-4 sm:py-3"
            >
              <p className="cyber-title text-[10px] uppercase tracking-[0.24em] text-rose-400 dark:text-rose-300">
                Status
              </p>
              <p className={`mt-1 flex items-center gap-2 text-sm leading-snug ${runtimeStatus.toneClass}`}>
                <span className={`inline-block h-2.5 w-2.5 animate-pulse rounded-full ${runtimeStatus.dotClass}`} />
                {runtimeStatus.label}
              </p>

              {runtimeStatus.activityLines?.length > 0 ? (
                <div className="mt-2 max-h-32 space-y-1 overflow-y-auto pr-1">
                  {runtimeStatus.activityLines.map((item) => (
                    <p
                      key={item.id}
                      className={`break-words text-xs leading-relaxed ${item.isMedia ? 'text-orange-600 dark:text-orange-300' : 'text-zinc-700 dark:text-zinc-200'}`}
                    >
                      {item.label}
                      {item.duration ? (
                        <span className="ml-1 text-emerald-600 dark:text-emerald-300">({item.duration})</span>
                      ) : null}
                    </p>
                  ))}
                </div>
              ) : null}

              {runtimeStatus.customLabel && !runtimeStatus.activityLines?.length ? (
                <p className="mt-1 break-words text-xs italic text-zinc-600 dark:text-zinc-300">{runtimeStatus.customLabel}</p>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
