import { motion, useTransform } from 'framer-motion';
import ParticleField from '../effects/ParticleField';

const parallaxOrbs = [
  {
    id: 'far',
    className:
      'absolute -left-44 -top-36 h-[34rem] w-[34rem] rounded-full bg-neonPurple/25 blur-[140px] will-change-transform',
    mobileClassName: '-left-28 -top-20 h-[20rem] w-[20rem] blur-[90px]',
    depth: 16,
  },
  {
    id: 'mid',
    className:
      'absolute right-[-12rem] top-[18%] h-[26rem] w-[26rem] rounded-full bg-neonBlue/25 blur-[120px] will-change-transform',
    mobileClassName: '-right-24 top-[22%] h-[17rem] w-[17rem] blur-[80px]',
    depth: 26,
  },
  {
    id: 'near',
    className:
      'absolute bottom-[-14rem] left-[34%] h-[24rem] w-[24rem] rounded-full bg-neonPink/20 blur-[100px] will-change-transform',
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

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [contain:layout_paint_style]">
      <div className={`absolute inset-0 ${isDark ? 'bg-red-void opacity-95' : 'bg-red-void-light opacity-100'}`} />
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_top_right,rgba(255,106,61,0.28),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(255,43,85,0.34),transparent_52%)]'
            : 'bg-[radial-gradient(circle_at_top_right,rgba(255,128,110,0.24),transparent_46%),radial-gradient(circle_at_bottom_left,rgba(255,64,104,0.2),transparent_54%)]'
        }`}
      />

      {activeOrbs.map((orb) => (
        <ParallaxOrb key={orb.id} orb={orb} depth={depth} enableParallax={enableParallax} isMobile={isMobile} />
      ))}

      <div
        className={`absolute inset-0 [background-image:linear-gradient(rgba(251,113,133,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(251,113,133,0.16)_1px,transparent_1px)] [background-size:70px_70px] [mask-image:radial-gradient(circle_at_center,black_42%,transparent_86%)] ${
          isDark ? 'opacity-25' : 'opacity-35'
        }`}
      />
      <ParticleField isMobile={isMobile} reduceMotion={reduceMotion} />
    </div>
  );
};

export default AnimatedBackground;
