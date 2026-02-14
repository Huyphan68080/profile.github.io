import { motion } from 'framer-motion';
import { projects } from '../../data/siteData';
import ProjectCard from '../cards/ProjectCard';
import SectionTitle from '../common/SectionTitle';

const ProjectsSection = () => {
  return (
    <section id="projects" className="mx-auto max-w-6xl py-24">
      <SectionTitle
        kicker="Projects"
        title="Selected interfaces with bold motion language."
        subtitle="Cards use 3D hover tilt and viewport-triggered slide animations from alternating directions."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.72, delay: index * 0.1 }}
          >
            <ProjectCard project={project} index={index} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
