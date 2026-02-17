import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import AboutSection from './components/sections/AboutSection';
import ContactSection from './components/sections/ContactSection';
import HeroSection from './components/sections/HeroSection';
import IpCheckSection from './components/sections/IpCheckSection';
import ProjectsSection from './components/sections/ProjectsSection';
import SkillsSection from './components/sections/SkillsSection';
import AnimatedBackground from './components/layout/AnimatedBackground';
import LoadingScreen from './components/layout/LoadingScreen';
import Navbar from './components/layout/Navbar';
import { useMouseDepth } from './hooks/useMouseDepth';
import { useVisitorInsights } from './hooks/useVisitorInsights';

const SectionLayer = ({ children, y, disabled }) => {
  if (disabled) {
    return <div className="section-wrap">{children}</div>;
  }

  return (
    <motion.div style={{ y }} className="section-wrap gpu-layer">
      {children}
    </motion.div>
  );
};

const App = () => {
  const depth = useMouseDepth();
  const visitorInsights = useVisitorInsights();
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.45,
  });
  const [isMobileView, setIsMobileView] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px)').matches;
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const shouldSimplifyMotion = prefersReducedMotion;
  const parallaxFactor = isMobileView ? 0.58 : 1;

  const aboutY = useTransform(smoothScrollProgress, [0, 1], [0, -84 * parallaxFactor]);
  const skillsY = useTransform(smoothScrollProgress, [0, 1], [0, 62 * parallaxFactor]);
  const projectsY = useTransform(smoothScrollProgress, [0, 1], [0, -48 * parallaxFactor]);
  const ipCheckY = useTransform(smoothScrollProgress, [0, 1], [0, 26 * parallaxFactor]);
  const contactY = useTransform(smoothScrollProgress, [0, 1], [0, 34 * parallaxFactor]);

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

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = (event) => setPrefersReducedMotion(event.matches);
    setPrefersReducedMotion(reducedMotionQuery.matches);

    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener('change', updateMotionPreference);
      return () => reducedMotionQuery.removeEventListener('change', updateMotionPreference);
    }

    reducedMotionQuery.addListener(updateMotionPreference);
    return () => reducedMotionQuery.removeListener(updateMotionPreference);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden transition-colors duration-500 selection:bg-neonPurple/40 selection:text-white">
      <AnimatedBackground depth={depth} theme="dark" isMobile={isMobileView} reduceMotion={shouldSimplifyMotion} />
      <Navbar viewCount={visitorInsights.viewCount} />

      <AnimatePresence>{isLoading ? <LoadingScreen progress={progress} theme="dark" isMobile={isMobileView} /> : null}</AnimatePresence>

      <main className="relative z-10 px-4 pb-14 pt-24 sm:px-6 sm:pb-16 lg:px-8">
        <HeroSection isMobileView={isMobileView} reduceMotion={shouldSimplifyMotion} />

        <SectionLayer y={aboutY} disabled={prefersReducedMotion}>
          <AboutSection />
        </SectionLayer>

        <SectionLayer y={skillsY} disabled={prefersReducedMotion}>
          <SkillsSection />
        </SectionLayer>

        <SectionLayer y={projectsY} disabled={prefersReducedMotion}>
          <ProjectsSection />
        </SectionLayer>

        <SectionLayer y={ipCheckY} disabled={prefersReducedMotion}>
          <IpCheckSection visitorInsights={visitorInsights} />
        </SectionLayer>

        <SectionLayer y={contactY} disabled={prefersReducedMotion}>
          <ContactSection />
        </SectionLayer>
      </main>
    </div>
  );
};

export default App;
