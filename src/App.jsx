import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import AboutSection from './components/sections/AboutSection';
import ContactSection from './components/sections/ContactSection';
import HeroSection from './components/sections/HeroSection';
import ProjectsSection from './components/sections/ProjectsSection';
import SkillsSection from './components/sections/SkillsSection';
import AnimatedBackground from './components/layout/AnimatedBackground';
import LoadingScreen from './components/layout/LoadingScreen';
import Navbar from './components/layout/Navbar';
import { useMouseDepth } from './hooks/useMouseDepth';
import { useTheme } from './hooks/useTheme';

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const depth = useMouseDepth();
  const { scrollYProgress } = useScroll();
  const [isMobileView, setIsMobileView] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px)').matches;
  });

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const parallaxFactor = isMobileView ? 0.36 : 1;

  const aboutY = useTransform(scrollYProgress, [0, 1], [0, -70 * parallaxFactor]);
  const skillsY = useTransform(scrollYProgress, [0, 1], [0, 50 * parallaxFactor]);
  const projectsY = useTransform(scrollYProgress, [0, 1], [0, -36 * parallaxFactor]);
  const contactY = useTransform(scrollYProgress, [0, 1], [0, 28 * parallaxFactor]);

  useEffect(() => {
    let timeoutId;
    const intervalId = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) return 100;

        const increment =
          current < 60 ? 3 + Math.random() * 5 : current < 86 ? 1.5 + Math.random() * 3 : 0.6 + Math.random() * 1.2;

        const nextValue = Math.min(100, current + increment);
        if (nextValue >= 100) {
          window.clearInterval(intervalId);
          timeoutId = window.setTimeout(() => setIsLoading(false), 540);
        }
        return nextValue;
      });
    }, 88);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const updateViewport = (event) => setIsMobileView(event.matches);
    setIsMobileView(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateViewport);
      return () => mediaQuery.removeEventListener('change', updateViewport);
    }

    mediaQuery.addListener(updateViewport);
    return () => mediaQuery.removeListener(updateViewport);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden transition-colors duration-500 selection:bg-neonPurple/40 selection:text-white">
      <AnimatedBackground depth={depth} theme={theme} />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <AnimatePresence>{isLoading ? <LoadingScreen progress={progress} /> : null}</AnimatePresence>

      <main className="relative z-10 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <HeroSection />

        <motion.div style={{ y: aboutY }} className="section-wrap gpu-layer">
          <AboutSection />
        </motion.div>

        <motion.div style={{ y: skillsY }} className="section-wrap gpu-layer">
          <SkillsSection />
        </motion.div>

        <motion.div style={{ y: projectsY }} className="section-wrap gpu-layer">
          <ProjectsSection />
        </motion.div>

        <motion.div style={{ y: contactY }} className="section-wrap gpu-layer">
          <ContactSection />
        </motion.div>
      </main>
    </div>
  );
};

export default App;
