import { motion } from 'framer-motion';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';

const ThemeToggle = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative inline-flex h-10 w-[86px] items-center rounded-full border border-slate-300/20 bg-white/35 px-1 transition hover:shadow-neonBlue dark:bg-slate-900/40"
      aria-label="Toggle theme"
    >
      <motion.span
        className="absolute left-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-neonPurple to-neonBlue text-white shadow-neon"
        animate={{ x: isDark ? 0 : 44 }}
        transition={{ type: 'spring', stiffness: 310, damping: 24 }}
      >
        {isDark ? <HiOutlineMoon size={16} /> : <HiOutlineSun size={16} />}
      </motion.span>
      <span
        className={`pointer-events-none absolute left-2 text-slate-500 transition-opacity duration-200 dark:text-slate-400 ${
          isDark ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <HiOutlineMoon size={16} />
      </span>
      <span
        className={`pointer-events-none absolute right-2 text-amber-300 transition-opacity duration-200 ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <HiOutlineSun size={16} />
      </span>
    </button>
  );
};

export default ThemeToggle;
