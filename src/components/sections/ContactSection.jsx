import { FiMail, FiMapPin } from 'react-icons/fi';
import { contactMeta, socialLinks } from '../../data/siteData';
import Reveal from '../common/Reveal';
import RippleButton from '../common/RippleButton';
import SectionTitle from '../common/SectionTitle';

const ContactSection = () => {
  return (
    <section id="contact" className="mx-auto max-w-6xl py-24">
      <SectionTitle
        kicker="Contact"
        title="Let's build your next immersive product."
        subtitle="Share your idea, timeline, and goals. I can help from design direction to production-ready React implementation."
      />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal className="space-y-4">
          <article className="glass-panel rounded-2xl border border-slate-200/20 p-5">
            <div className="flex items-center gap-3 text-zinc-800 dark:text-zinc-100">
              <FiMail className="text-rose-400" />
              <p>{contactMeta.email}</p>
            </div>
            <div className="mt-3 flex items-center gap-3 text-zinc-800 dark:text-zinc-100">
              <FiMapPin className="text-orange-400" />
              <p>{contactMeta.location}</p>
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300/90">{contactMeta.availability}</p>
          </article>

          <article className="glass-panel rounded-2xl border border-slate-200/20 p-5">
            <p className="cyber-title text-xs uppercase tracking-[0.3em] text-rose-500 dark:text-rose-300">Social</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-rose-300/35 bg-rose-100/28 px-4 py-2 text-sm text-rose-900 transition hover:shadow-neon dark:bg-rose-500/14 dark:text-rose-100"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.12}>
          <form
            onSubmit={(event) => event.preventDefault()}
            className="glass-panel rounded-3xl border border-slate-200/20 p-6 sm:p-7"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-zinc-700 dark:text-zinc-300">
                Name
                <input
                  type="text"
                  className="mt-2 w-full rounded-xl border border-rose-300/35 bg-rose-100/20 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-rose-400 focus:shadow-neon dark:bg-rose-500/12 dark:text-zinc-100"
                  placeholder="Your name"
                />
              </label>

              <label className="text-sm text-zinc-700 dark:text-zinc-300">
                Email
                <input
                  type="email"
                  className="mt-2 w-full rounded-xl border border-rose-300/35 bg-rose-100/20 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-rose-400 focus:shadow-neon dark:bg-rose-500/12 dark:text-zinc-100"
                  placeholder="you@email.com"
                />
              </label>
            </div>

            <label className="mt-4 block text-sm text-zinc-700 dark:text-zinc-300">
              Message
              <textarea
                rows={5}
                className="mt-2 w-full rounded-xl border border-rose-300/35 bg-rose-100/20 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-rose-400 focus:shadow-neon dark:bg-rose-500/12 dark:text-zinc-100"
                placeholder="Describe your project or idea..."
              />
            </label>

            <div className="mt-6">
              <RippleButton type="submit" className="bg-gradient-to-r from-rose-500/80 via-red-500/75 to-orange-500/75">
                Send Message
              </RippleButton>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default ContactSection;
