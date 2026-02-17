import { motion } from 'framer-motion';
import { FiEye } from 'react-icons/fi';
import { navLinks, profile } from '../../data/siteData';

const Navbar = ({ viewCount }) => {
  return (
    <header className="fixed inset-x-0 top-2 z-50 px-2 sm:top-3 sm:px-4">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        className="glass-panel mx-auto w-full max-w-6xl rounded-xl border border-slate-300/20 px-2.5 py-2 shadow-glass sm:rounded-2xl sm:px-3 sm:py-2.5"
      >
        <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2 sm:gap-3">
          <a href="#hero" className="cyber-title neon-text rounded-full px-2.5 py-1.5 text-xs text-white sm:px-3 sm:py-2 sm:text-sm">
            {profile.brand}
          </a>

          <ul className="hidden items-center justify-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-sm text-zinc-800 transition hover:bg-rose-100/55 hover:text-rose-950 hover:shadow-neon dark:text-zinc-200 dark:hover:bg-rose-500/20 dark:hover:text-white xl:px-4 xl:py-2"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#ip-check"
              className="inline-flex h-8 items-center justify-center gap-1 rounded-full border border-rose-300/35 bg-rose-100/25 px-2 text-[11px] text-rose-900 transition hover:shadow-neon dark:bg-rose-500/14 dark:text-rose-100 sm:h-9 sm:gap-2 sm:px-3 sm:text-xs"
              aria-label="Open visitor stats"
            >
              <FiEye className="text-[13px] sm:text-sm" />
              <span>{typeof viewCount === 'number' ? viewCount.toLocaleString() : '--'}</span>
            </a>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-1 pb-0.5 sm:mt-2.5 md:grid-cols-6 lg:hidden">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="truncate rounded-lg border border-slate-300/20 px-2 py-1.5 text-center text-[11px] text-zinc-800 transition hover:bg-rose-100/60 dark:text-zinc-200 dark:hover:bg-rose-500/20 sm:rounded-full sm:text-xs"
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
