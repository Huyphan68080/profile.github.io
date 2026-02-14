import { FaFigma, FaGitAlt, FaReact } from 'react-icons/fa';
import { SiFramer, SiTailwindcss, SiThreedotjs, SiTypescript, SiVite } from 'react-icons/si';

export const profile = {
  brand: 'HP//2026',
  name: 'Huy Phan',
  role: 'Frontend Engineer & Motion Designer',
  kicker: 'FUTURISTIC PERSONAL SITE',
  typewriterText: 'Building cinematic 3D experiences for the next generation of web products.',
  headline:
    'I craft high-performance interfaces that blend cyberpunk aesthetics, fluid motion, and practical product UX.',
};

export const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export const aboutParagraphs = [
  'I am a frontend-focused builder who treats every page like an interactive scene. From concept to production, I prioritize clarity, speed, and visual identity.',
  'My workflow combines product thinking, micro-interactions, and scalable React architecture. The goal is simple: create digital experiences that people remember.',
];

export const aboutStats = [
  { label: 'Years Experience', value: '4+' },
  { label: 'Completed Projects', value: '45+' },
  { label: 'Avg Performance', value: '95/100' },
];

export const skills = [
  { name: 'React Architecture', level: 93, icon: FaReact, color: 'text-rose-400' },
  { name: 'Framer Motion', level: 91, icon: SiFramer, color: 'text-red-400' },
  { name: 'TailwindCSS', level: 95, icon: SiTailwindcss, color: 'text-orange-400' },
  { name: 'TypeScript', level: 86, icon: SiTypescript, color: 'text-amber-400' },
  { name: 'Vite Tooling', level: 88, icon: SiVite, color: 'text-rose-500' },
  { name: '3D Interface Thinking', level: 82, icon: SiThreedotjs, color: 'text-red-500' },
  { name: 'UI Prototyping', level: 89, icon: FaFigma, color: 'text-pink-400' },
  { name: 'Git Workflow', level: 90, icon: FaGitAlt, color: 'text-orange-500' },
];

export const projects = [
  {
    title: 'Neon Commerce XR',
    description:
      'A futuristic shopping experience with animated product layers, immersive transitions, and smooth checkout flow.',
    tags: ['React', 'Framer Motion', 'Tailwind'],
    href: '#',
    accentClass: 'from-neonPurple/45 via-neonPink/35 to-neonBlue/35',
  },
  {
    title: 'Pulse Analytics Hub',
    description:
      'Real-time dashboard concept focused on data storytelling, live charts, and high-readability glass panels.',
    tags: ['Dashboard', 'Motion UX', 'Performance'],
    href: '#',
    accentClass: 'from-neonBlue/40 via-cyanSoft/25 to-neonPurple/35',
  },
  {
    title: 'Orbit Portfolio CMS',
    description:
      'Content-driven portfolio system with modular sections, responsive layout presets, and visual editing logic.',
    tags: ['Headless', 'Component System', 'SEO'],
    href: '#',
    accentClass: 'from-neonPink/35 via-neonPurple/35 to-cyanSoft/30',
  },
];

export const contactMeta = {
  email: 'hello@huyphant.dev',
  location: 'Ho Chi Minh City, Vietnam',
  availability: 'Open for freelance and product collaborations',
};

export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'Behance', href: 'https://www.behance.net/' },
];

export const integrations = {
  discordUserId: '1043123309983846482',
};
