import { useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

const SPRING_CONFIG = {
  stiffness: 120,
  damping: 24,
  mass: 0.55,
};

export const useMouseDepth = () => {
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, SPRING_CONFIG);
  const y = useSpring(targetY, SPRING_CONFIG);
  const rafRef = useRef(0);
  const pointRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) {
      return undefined;
    }

    const updateTarget = () => {
      targetX.set(pointRef.current.x);
      targetY.set(pointRef.current.y);
      rafRef.current = 0;
    };

    const scheduleUpdate = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(updateTarget);
    };

    const handlePointerMove = (event) => {
      pointRef.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      };
      scheduleUpdate();
    };

    const resetDepth = () => {
      pointRef.current = { x: 0, y: 0 };
      scheduleUpdate();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', resetDepth);
    window.addEventListener('blur', resetDepth);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', resetDepth);
      window.removeEventListener('blur', resetDepth);
    };
  }, [targetX, targetY]);

  return { x, y };
};
