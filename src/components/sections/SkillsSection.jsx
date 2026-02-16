import { motion } from 'framer-motion';
import { skills } from '../../data/siteData';
import SectionTitle from '../common/SectionTitle';

const SkillsSection = () => {
  return (
    <section id="skills" className="mx-auto max-w-6xl py-16 sm:py-20 lg:py-24">
      <SectionTitle
        kicker="Skills"
        title="Production-ready fullstack skill set."
        subtitle="Stack optimized for modern React products: performance, accessibility, animation quality, and component architecture."
      />

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {skills.map((skill, index) => {
          const Icon = skill.icon;
          return (
            <motion.article
              key={skill.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
              className="glass-panel rounded-2xl border border-slate-200/20 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`text-2xl ${skill.color}`}>
                    <Icon />
                  </span>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{skill.name}</h3>
                </div>
                <span className="cyber-title text-xs tracking-[0.2em] text-rose-500 dark:text-rose-300">
                  {skill.level}%
                </span>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-600/20 dark:bg-slate-700/40">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: false, amount: 0.55 }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.1 + index * 0.07 }}
                  className="h-full rounded-full bg-gradient-to-r from-neonPurple via-neonPink to-neonBlue"
                />
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default SkillsSection;
