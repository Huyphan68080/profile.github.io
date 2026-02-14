import { motion, useTransform } from 'framer-motion';
import ParticleField from '../effects/ParticleField';

const parallaxOrbs = [
  {
    id: 'far',
    className:
      'absolute -left-44 -top-36 h-[34rem] w-[34rem] rounded-full bg-neonPurple/25 blur-[140px] will-change-transform',
    depth: 16,
  },
  {
    id: 'mid',
    className:
      'absolute right-[-12rem] top-[18%] h-[26rem] w-[26rem] rounded-full bg-neonBlue/25 blur-[120px] will-change-transform',
    depth: 26,
  },
  {
    id: 'near',
    className:
      'absolute bottom-[-14rem] left-[34%] h-[24rem] w-[24rem] rounded-full bg-neonPink/20 blur-[100px] will-change-transform',
    depth: 36,
  },
];

const ParallaxOrb = ({ orb, depth }) => {
  const x = useTransform(depth.x, (value) => value * orb.depth);
  const y = useTransform(depth.y, (value) => value * orb.depth);

  return <motion.div className={orb.className} style={{ x, y }} />;
};

const AnimatedBackground = ({ depth, theme }) => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [contain:paint]">
      <div className={`bg-red-void absolute inset-0 ${theme === 'dark' ? 'opacity-95' : 'opacity-92'}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,106,61,0.28),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(255,43,85,0.34),transparent_52%)]" />

      {parallaxOrbs.map((orb) => (
        <ParallaxOrb key={orb.id} orb={orb} depth={depth} />
      ))}

      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(251,113,133,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(251,113,133,0.16)_1px,transparent_1px)] [background-size:70px_70px] [mask-image:radial-gradient(circle_at_center,black_42%,transparent_86%)]" />
      <ParticleField />
    </div>
  );
};

export default AnimatedBackground;
