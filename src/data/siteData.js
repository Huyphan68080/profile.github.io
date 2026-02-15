import { FaFigma, FaGitAlt } from 'react-icons/fa';
import { SiHtml5, SiGithub,SiCss3, SiTailwindcss, SiThreedotjs, SiTypescript, SiVite, SiJavascript, SiReact, SiNodedotjs, SiMongodb } from 'react-icons/si';

export const profile = {
  brand: 'Sun',
  name: 'Huy Phan',
  role: 'Fullstack developer',
  kicker: 'Profile',
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
  { label: 'Years Experience', value: '3+' },
  { label: 'Completed Projects', value: '3' },
  { label: 'Avg Performance', value: '85/100' },
];

export const skills = [
  { name: 'Github', level: 70, icon: SiGithub, color: 'text-rose-400' },
  { name: 'Html5', level: 91, icon: SiHtml5, color: 'text-red-400' },
  { name: 'Css', level: 85, icon: SiCss3, color: 'text-blue-500' },
  { name: 'JavaScript', level: 60, icon: SiJavascript, color: 'text-amber-400' },
  { name: 'TailwindCSS', level: 50, icon: SiTailwindcss, color: 'text-orange-400' },
  { name: 'React', level: 30, icon: SiReact, color: 'text-red-500' },
  { name: 'Nodejs', level: 80, icon:SiNodedotjs, color: 'text-pink-400' },
  { name: 'MongoDB', level: 70, icon: SiMongodb, color: 'text-orange-500' },
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
  email: 'Huyphan68080@gmail.com',
  location: 'Ho Chi Minh City, Vietnam',
  availability: 'Open for freelance and product collaborations',
};

export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/huyphan68080' },
  { label: 'Facebook', href: 'https://www.facebook.com/hphan.media.vn' },
  { label: 'Behance', href: 'https://www.behance.net/' },
];

export const integrations = {
  discordUserId: '1043123309983846482',
};
