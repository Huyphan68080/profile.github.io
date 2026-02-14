import { motion, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';
import { profile } from '../../data/siteData';
import { useLoopTypewriter } from '../../hooks/useLoopTypewriter';
import { useSiteStatus } from '../../hooks/useSiteStatus';
import { useTypewriter } from '../../hooks/useTypewriter';
import Reveal from '../common/Reveal';
import RippleButton from '../common/RippleButton';

const HeroSection = () => {
  const [avatarSrc, setAvatarSrc] = useState('/avatar.jpg');
  const typedText = useTypewriter(profile.typewriterText, 40, 620);
  const runtimeStatus = useSiteStatus();
  const loopingName = useLoopTypewriter(profile.name.toUpperCase(), {
    typeSpeed: 170,
    deleteSpeed: 95,
    pauseBeforeDelete: 1050,
    pauseBeforeType: 320,
  });

  const { scrollYProgress } = useScroll();

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.87]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -95]);

  return (
    <motion.section
      id="hero"
      style={{ scale, opacity, y }}
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
          <div className="relative w-[min(74vw,360px)]">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-neonPurple/55 via-neonBlue/30 to-cyanSoft/35 blur-2xl" />
            <motion.img
              src={avatarSrc}
              alt="Personal Avatar"
              onError={(event) => {
                if (avatarSrc === '/avatar.svg') return;
                event.currentTarget.onerror = null;
                setAvatarSrc('/avatar.svg');
              }}
              initial={{ opacity: 0, scale: 0.73, filter: 'blur(22px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="glass-panel relative z-10 block h-auto max-h-[66vh] w-full rounded-[2rem] border border-slate-200/25 object-contain"
            />

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.05 }}
              className="glass-panel mt-4 w-[min(92vw,340px)] rounded-2xl px-4 py-3"
            >
              <p className="cyber-title text-[10px] uppercase tracking-[0.24em] text-rose-400 dark:text-rose-300">
                Status
              </p>
              <p className={`mt-1 flex items-center gap-2 text-sm ${runtimeStatus.toneClass}`}>
                <span className={`inline-block h-2.5 w-2.5 animate-pulse rounded-full ${runtimeStatus.dotClass}`} />
                {runtimeStatus.label}
              </p>
              {runtimeStatus.appLabel ? (
                <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-200">{runtimeStatus.appLabel}</p>
              ) : null}
              {runtimeStatus.mediaLabel ? (
                <p className="mt-1 text-xs text-orange-600 dark:text-orange-300">{runtimeStatus.mediaLabel}</p>
              ) : null}
              {runtimeStatus.durationLabel ? (
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-300">{runtimeStatus.durationLabel}</p>
              ) : null}
              {runtimeStatus.customLabel && !runtimeStatus.appLabel && !runtimeStatus.mediaLabel ? (
                <p className="mt-1 text-xs italic text-zinc-600 dark:text-zinc-300">{runtimeStatus.customLabel}</p>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
