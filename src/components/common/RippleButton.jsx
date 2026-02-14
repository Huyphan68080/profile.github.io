import { motion } from 'framer-motion';
import { useState } from 'react';

const baseClass =
  'relative inline-flex items-center justify-center overflow-hidden rounded-full border border-rose-300/40 bg-rose-100/30 px-6 py-3 text-sm font-medium text-rose-950 backdrop-blur-md transition hover:border-rose-300/70 hover:bg-rose-500/20 hover:shadow-neon dark:border-rose-400/30 dark:bg-rose-500/14 dark:text-rose-100';

const RippleButton = ({
  children,
  href,
  external = false,
  className = '',
  onClick,
  type = 'button',
}) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.2;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const nextRipple = {
      id: `${Date.now()}-${Math.random()}`,
      x,
      y,
      size,
    };

    setRipples((current) => [...current, nextRipple]);
  };

  const removeRipple = (rippleId) => {
    setRipples((current) => current.filter((item) => item.id !== rippleId));
  };

  const handleClick = (event) => {
    createRipple(event);
    onClick?.(event);
  };

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          className="pointer-events-none absolute rounded-full bg-rose-100/45 dark:bg-rose-200/35"
          initial={{ scale: 0, opacity: 0.65 }}
          animate={{ scale: 3.2, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          onAnimationComplete={() => removeRipple(ripple.id)}
        />
      ))}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        onClick={handleClick}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={`${baseClass} ${className}`}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClass} ${className}`}
    >
      {content}
    </motion.button>
  );
};

export default RippleButton;
