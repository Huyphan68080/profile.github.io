import { motion } from 'framer-motion';
import { useState } from 'react';
import RippleButton from '../common/RippleButton';

const ProjectCard = ({ project, index }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const posX = event.clientX - rect.left;
    const posY = event.clientY - rect.top;

    const rotateY = ((posX - rect.width / 2) / rect.width) * 16;
    const rotateX = ((rect.height / 2 - posY) / rect.height) * 16;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="[perspective:1100px]">
      <motion.article
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX: tilt.x, rotateY: tilt.y, transformStyle: 'preserve-3d' }}
        transition={{ type: 'spring', stiffness: 180, damping: 17, mass: 0.55 }}
        className="glass-panel group relative h-full rounded-3xl border border-slate-200/20 p-6 sm:p-7"
      >
        <div
          className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${project.accentClass} opacity-45 blur-xl transition group-hover:opacity-65`}
        />

        <div style={{ transform: 'translateZ(34px)' }}>
          <p className="cyber-title text-xs uppercase tracking-[0.3em] text-rose-500 dark:text-rose-300">
            Project {index + 1}
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{project.title}</h3>
          <p className="mt-4 leading-relaxed text-zinc-700 dark:text-zinc-300/90">{project.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-rose-300/30 bg-rose-100/25 px-3 py-1 text-xs uppercase tracking-[0.18em] text-rose-900 dark:bg-rose-500/12 dark:text-rose-100"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-7">
            <RippleButton
              href={project.href}
              className="bg-rose-100/25 text-xs tracking-[0.17em] uppercase dark:bg-rose-500/14"
            >
              View Case Study
            </RippleButton>
          </div>
        </div>
      </motion.article>
    </div>
  );
};

export default ProjectCard;
