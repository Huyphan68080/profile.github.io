import { FaFigma, FaGitAlt } from 'react-icons/fa';
import { SiHtml5, SiGithub,SiCss3, SiTailwindcss, SiThreedotjs, SiTypescript, SiVite, SiJavascript, SiReact, SiNodedotjs, SiMongodb } from 'react-icons/si';

export const profile = {
  brand: 'Sun',
  name: 'Huy Phan',
  role: 'Fullstack developer',
  kicker: 'Profile',
  typewriterText: 'Build a fully functional web model.',
};

export const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'IP Check', href: '#ip-check' },
  { label: 'Contact', href: '#contact' },
];

export const aboutParagraphs = [
  'I am a frontend-focused builder who treats every page like an interactive scene. From concept to production, I prioritize clarity, speed, and visual identity.',
  'My workflow combines product thinking, micro-interactions, and scalable React architecture. The goal is simple: create digital experiences that people remember.',
];

export const aboutStats = [
  { label: 'Years Experience', value: '3+' },
  { label: 'Completed Projects', value: '2' },
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
    title: 'Note Web',
    description:
      'Web ghi chu va quan ly noi dung voi giao dien toi gian, de su dung.',
    tags: ['React', 'JavaScript', 'HTML', 'CSS'],
    href: 'https://huyphan68080.github.io/noteweb.github.io/',
    accentClass: 'from-neonPurple/45 via-neonPink/35 to-neonBlue/35',
  },
  {
    title: 'Quan Ly Hoc Sinh',
    description:
      'Ung dung quan ly hoc sinh voi cac chuc nang them, sua, xoa va tim kiem thong tin.',
    tags: ['React', 'Vite', 'TailwindCSS', 'Node.js', 'Express', 'MongoDB', 'Render'],
    href: 'https://huyphan68080.github.io/Quanlyhs.github.io/',
    accentClass: 'from-neonBlue/40 via-cyanSoft/25 to-neonPurple/35',
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
  { label: 'Discord', href: 'https://discord.com/users/1043123309983846482' },
];

export const integrations = {
  discordUserId: '1043123309983846482',
};
