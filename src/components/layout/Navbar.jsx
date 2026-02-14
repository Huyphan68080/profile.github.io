import { motion } from 'framer-motion';
import { navLinks, profile } from '../../data/siteData';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = ({ theme, onToggleTheme }) => {
  return (
    <header className="fixed left-1/2 top-4 z-50 w-[min(1120px,94vw)] -translate-x-1/2">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        className="glass-panel rounded-2xl border border-slate-300/20 px-3 py-3 shadow-glass"
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

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
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
