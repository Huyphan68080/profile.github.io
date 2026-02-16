import { motion } from 'framer-motion';
import { FiEye } from 'react-icons/fi';
import { navLinks, profile } from '../../data/siteData';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = ({ theme, onToggleTheme, viewCount }) => {
  return (
    <header className="fixed left-1/2 top-3 z-50 w-[min(1120px,94vw)] -translate-x-1/2 sm:top-4">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        className="glass-panel rounded-2xl border border-slate-300/20 px-2.5 py-2.5 shadow-glass sm:px-3 sm:py-3"
      >
        <div className="flex items-center justify-between gap-4">
          <a href="#hero" className="cyber-title neon-text rounded-full px-3 py-2 text-sm text-white">
            {profile.brand}
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm text-zinc-800 transition hover:bg-rose-100/55 hover:text-rose-950 hover:shadow-neon dark:text-zinc-200 dark:hover:bg-rose-500/20 dark:hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#ip-check"
              className="inline-flex items-center gap-2 rounded-full border border-rose-300/35 bg-rose-100/25 px-3 py-2 text-xs text-rose-900 transition hover:shadow-neon dark:bg-rose-500/14 dark:text-rose-100"
              aria-label="Open visitor stats"
            >
              <FiEye className="text-sm" />
              <span>{typeof viewCount === 'number' ? viewCount.toLocaleString() : '--'}</span>
            </a>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>

        <div className="mt-2 flex gap-1 overflow-x-auto pb-1 md:hidden">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-slate-300/20 px-3 py-1.5 text-xs text-zinc-800 transition hover:bg-rose-100/60 dark:text-zinc-200 dark:hover:bg-rose-500/20"
            >
              {item.label}
            </a>
          ))}
        </div>
      </motion.nav>
    </header>
  );
};

export default Navbar;
