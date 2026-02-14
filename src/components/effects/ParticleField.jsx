import { useMemo } from 'react';

const DESKTOP_PARTICLES = 34;
const MOBILE_PARTICLES = 20;

const ParticleField = () => {
  const particleCount =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
      ? MOBILE_PARTICLES
      : DESKTOP_PARTICLES;

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2.6 + 1.1,
        delay: Math.random() * 8,
        duration: Math.random() * 9 + 8,
        xDrift: `${(Math.random() - 0.5) * 120}px`,
        yDrift: `${Math.random() * 140 + 30}px`,
      })),
    [particleCount],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="particle bg-white/45"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            '--delay': `${particle.delay}s`,
            '--duration': `${particle.duration}s`,
            '--x-drift': particle.xDrift,
            '--y-drift': particle.yDrift,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;
