import { motion } from 'framer-motion';

const LoadingScreen = ({ progress, theme, isMobile = false }) => {
  const isDark = theme === 'dark';

  return (
    <motion.div
      className={`fixed inset-0 z-[120] flex items-center justify-center overflow-hidden backdrop-blur-2xl ${
        isDark ? 'bg-[#090102]/95' : 'bg-[#fff1f3]/92'
      }`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75, ease: 'easeInOut' }}
    >
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[linear-gradient(132deg,#090102_8%,#2e040d_42%,#4a0b17_68%,#130204_100%)] opacity-88'
            : 'bg-[linear-gradient(132deg,#fff5f7_8%,#ffdce3_42%,#ffc6d1_68%,#ffe8ec_100%)] opacity-100'
        }`}
      />
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_20%_20%,rgba(255,55,95,0.28),transparent_42%),radial-gradient(circle_at_84%_70%,rgba(255,120,70,0.24),transparent_46%)]'
            : 'bg-[radial-gradient(circle_at_20%_20%,rgba(255,96,130,0.22),transparent_40%),radial-gradient(circle_at_84%_70%,rgba(255,138,96,0.2),transparent_48%)]'
        }`}
      />
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-neonPurple/35 blur-[130px]" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-neonBlue/35 blur-[130px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className="glass-panel relative w-[min(560px,90vw)] rounded-3xl border border-slate-200/20 p-8 sm:p-10"
      >
        <p className={`cyber-title text-xs uppercase tracking-[0.3em] ${isDark ? 'text-rose-300' : 'text-rose-500'}`}>
          Boot Sequence
        </p>
        <h2 className={`neon-text mt-4 text-2xl font-semibold sm:text-3xl ${isDark ? 'text-slate-100' : 'text-zinc-900'}`}>
          Initializing Portfolio Interface
        </h2>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-700/35">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-orange-400 shadow-neon"
            animate={{ width: `${Math.round(progress)}%` }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          />
        </div>
        <div
          className={`mt-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] ${
            isDark ? 'text-slate-300/90' : 'text-zinc-700'
          }`}
        >
          <span>Neural Sync</span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div className={`mt-7 flex items-center gap-3 text-sm ${isDark ? 'text-slate-300/85' : 'text-zinc-700'}`}>
          <motion.span
            className="inline-block h-2.5 w-2.5 rounded-full bg-rose-300"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
          />
          Optimizing shaders and scene layers...
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
