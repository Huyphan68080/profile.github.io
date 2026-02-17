import { motion, useTransform } from 'framer-motion';
import ParticleField from '../effects/ParticleField';

const parallaxOrbs = [
  {
    id: 'far',
    className:
      'absolute -left-44 -top-36 h-[34rem] w-[34rem] rounded-full bg-neonPurple/16 blur-[150px] will-change-transform',
    mobileClassName: '-left-28 -top-20 h-[20rem] w-[20rem] blur-[90px]',
    depth: 16,
  },
  {
    id: 'mid',
    className:
      'absolute right-[-12rem] top-[18%] h-[26rem] w-[26rem] rounded-full bg-neonBlue/16 blur-[130px] will-change-transform',
    mobileClassName: '-right-24 top-[22%] h-[17rem] w-[17rem] blur-[80px]',
    depth: 26,
  },
  {
    id: 'near',
    className:
      'absolute bottom-[-14rem] left-[34%] h-[24rem] w-[24rem] rounded-full bg-neonPink/13 blur-[115px] will-change-transform',
    mobileClassName: 'bottom-[-8rem] left-[30%] h-[14rem] w-[14rem] blur-[70px]',
    depth: 36,
  },
];

const ParallaxOrb = ({ orb, depth, enableParallax, isMobile }) => {
  const x = useTransform(depth.x, (value) => (enableParallax ? value * orb.depth : 0));
  const y = useTransform(depth.y, (value) => (enableParallax ? value * orb.depth : 0));

  return <motion.div className={`${orb.className} ${isMobile ? orb.mobileClassName : ''}`} style={{ x, y }} />;
};

const AnimatedBackground = ({ depth, theme, isMobile = false, reduceMotion = false }) => {
  const isDark = theme === 'dark';
  const enableParallax = !reduceMotion;
  const activeOrbs = parallaxOrbs;
  const auroraPrimaryX = useTransform(depth.x, (value) => (enableParallax ? value * 18 : 0));
  const auroraPrimaryY = useTransform(depth.y, (value) => (enableParallax ? value * 14 : 0));
  const auroraSecondaryX = useTransform(depth.x, (value) => (enableParallax ? value * -22 : 0));
  const auroraSecondaryY = useTransform(depth.y, (value) => (enableParallax ? value * -16 : 0));

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [contain:layout_paint_style]">
      <div className={`absolute inset-0 ${isDark ? 'bg-red-void opacity-98' : 'bg-red-void-light opacity-96'}`} />
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_top_right,rgba(255,106,61,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(255,43,85,0.22),transparent_52%)]'
            : 'bg-[radial-gradient(circle_at_top_right,rgba(189,47,84,0.12),transparent_46%),radial-gradient(circle_at_bottom_left,rgba(143,26,59,0.1),transparent_54%)]'
        }`}
      />
      <motion.div
        style={{ x: auroraPrimaryX, y: auroraPrimaryY }}
        className={`absolute inset-[-24%] aurora-layer aurora-layer-primary ${reduceMotion ? 'aurora-static' : ''}`}
      />
      <motion.div
        style={{ x: auroraSecondaryX, y: auroraSecondaryY }}
        className={`absolute inset-[-30%] aurora-layer aurora-layer-secondary ${reduceMotion ? 'aurora-static' : ''}`}
      />

      {activeOrbs.map((orb) => (
        <ParallaxOrb key={orb.id} orb={orb} depth={depth} enableParallax={enableParallax} isMobile={isMobile} />
      ))}

      <div
        className={`absolute inset-0 [background-image:linear-gradient(rgba(251,113,133,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(251,113,133,0.16)_1px,transparent_1px)] [background-size:70px_70px] [mask-image:radial-gradient(circle_at_center,black_42%,transparent_86%)] ${
          isDark ? 'opacity-18' : 'opacity-16'
        } ${reduceMotion ? '' : 'cyber-grid'}`}
      />
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.82)_100%)]'
            : 'bg-[radial-gradient(circle_at_center,transparent_42%,rgba(42,7,18,0.24)_100%)]'
        }`}
      />
      <ParticleField depth={depth} theme={theme} isMobile={isMobile} reduceMotion={reduceMotion} />
    </div>
  );
};

export default AnimatedBackground;
