import { motion } from 'framer-motion';

const SectionTitle = ({ kicker, title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7 }}
      className="mb-10 max-w-3xl"
    >
      <p className="cyber-title text-xs uppercase tracking-[0.3em] text-rose-500 dark:text-rose-300">{kicker}</p>
      <h2 className="mt-3 text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-4 text-base text-zinc-700 dark:text-zinc-300/90">{subtitle}</p> : null}
    </motion.div>
  );
};

export default SectionTitle;
