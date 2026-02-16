import { aboutParagraphs, aboutStats } from '../../data/siteData';
import Reveal from '../common/Reveal';
import SectionTitle from '../common/SectionTitle';

const AboutSection = () => {
  return (
    <section id="about" className="mx-auto max-w-6xl py-16 sm:py-20 lg:py-24">
      <SectionTitle
        kicker="About Me"
        title="I blend product clarity with futuristic visual language."
        subtitle="From interaction concept to polished release, I focus on smooth motion, strong hierarchy, and measurable UX quality."
      />

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          {aboutParagraphs.map((paragraph, index) => (
            <Reveal key={paragraph} delay={0.14 + index * 0.1}>
              <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300/90">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {aboutStats.map((item, index) => (
            <Reveal key={item.label} delay={0.22 + index * 0.1}>
              <article className="glass-panel rounded-2xl border border-slate-200/20 p-5">
                <p className="cyber-title text-xs uppercase tracking-[0.25em] text-rose-500 dark:text-rose-300">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{item.value}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
