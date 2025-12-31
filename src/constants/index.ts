import * as di from 'react-icons/di';
import * as fa from 'react-icons/fa';
import { jelth, sybelle, put, hoodie, putma, putma1, putma2, sybelle1, sybelle2 } from "../assets";
import { IconType } from 'react-icons/lib';
import { StaticImageData } from 'next/image';

// Define TypeScript interfaces for the data structures

export interface NavLink {
  id: string;
  title: string;
}

export interface ServiceDetails {
  experience?: number;
  projects?: number;
  certifications?: number;
  clients?: number;
}

export interface Service {
  title: string;
  icon: IconType;
  description: string;
  skills: string[];
  tools: string[];
  percentage: number;
  details?: ServiceDetails;
}

export interface Technology {
  name: string;
  icon: IconType;
}

export interface Testimonial {
  testimonial: string;
  name: string;
  designation?: string;
  company?: string;
  image?: string;
}

export interface ProjectTag {
  name: string;
  color: string;
}

export interface Project {
  name: string;
  description: string;
  short_description?: string;
  tags: ProjectTag[];
  image?: StaticImageData | string;
  video?: string;
  link: string;
  Icon?: IconType;
  type?: "web" | "mobile" | "design" | "case_study";
}

// Define the data arrays with the types

export const navLinks: NavLink[] = [
  { id: "about", title: "About" },
  { id: "work", title: "Work" },
  { id: "contact", title: "Contact" },
];

const services: Service[] = [
  {
    title: "Frontend Developer",
    icon: di.DiReact,
    description: "My main skill is frontend development. React is how I got into web dev.",
    skills: ["React", "Three.js", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Vue"],
    tools: ["VS Code", "Git", "Chrome DevTools"],
    percentage: 0.9,
    details: { experience: 5, projects: 34, certifications: 4 }
  },
  {
    title: "Backend Developer",
    icon: di.DiMsqlServer,
    description: "I build and maintain backend systems. I focus on creating efficient and reliable server-side solutions.",
    skills: ["Node.js", "Nest.js", "Express", "SQL", "REST APIs"],
    tools: ["Postman", "Docker", "SQL Server Management Studio"],
    percentage: 0.75,
    details: { experience: 4, certifications: 3 }
  },
  {
    title: "Designer",
    icon: fa.FaPenFancy,
    description: "I design user-friendly interfaces and visuals. I enjoy making engaging and attractive designs.",
    skills: ["UI/UX Design", "Prototyping"],
    tools: ["Figma"],
    percentage: 0.8,
    details: { experience: 3, clients: 12 }
  },
  {
    title: "Chess Player",
    icon: fa.FaChessKnight,
    description: "1000 Elo rating on Chess.com",
    skills: [],
    tools: [],
    percentage: 0.3,
    details: {}
  },
];

const technologies: Technology[] = [
  { name: "HTML 5", icon: di.DiHtml5 },
  { name: "CSS 3", icon: di.DiCss3 },
  { name: "JavaScript", icon: di.DiJavascript },
  { name: "TypeScript", icon: di.DiJavascript1 },
  { name: "WordPress", icon: di.DiWordpress },
  { name: "React JS", icon: di.DiReact },
  { name: "Node JS", icon: di.DiNpm },
  { name: "AWS", icon: di.DiAws },
  { name: "MongoDB", icon: di.DiMongodb },
  { name: "Git", icon: di.DiGit },
  { name: "Docker", icon: di.DiDocker },
  { name: "Flutter", icon: di.DiAndroid },
  { name: "Firebase", icon: di.DiDatabase },
  { name: ".Net", icon: di.DiDotnet },
  { name: "Blockchain", icon: fa.FaCubes },
  { name: "Angular", icon: di.DiAngularSimple },
  { name: "Vue.js", icon: di.DiJsBadge },
  { name: "Python", icon: di.DiPython },
  { name: "MySQL", icon: di.DiMysql },
  { name: "Unity", icon: di.DiUnitySmall },
  { name: "C#", icon: fa.FaRocket },
];

const testimonials: Testimonial[] = [
  {
    testimonial:
      "Abdel is professional, adaptable, and always willing to learn. He works hard to solve problems and improve designs. I could not have asked for a better developer for my agency.",
    name: "Kodi Echeozo",
    designation: "CEO",
    company: "Sybelle",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  { testimonial: "Those web development skills are exceptional. Choose him for outstanding results!", name: "Lily Bennett" },
  { testimonial: "Ettouzany is a professional and dedicated full-stack web developer. Impressive work!", name: "Owen Sullivan" },
];


const projects: Project[] = [

  {
    name: "Sybelle",
    description: "Parallax Hero Landing Page for Sybelle.",
    short_description: "Parallax Hero Landing Page for Sybelle.",
    tags: [
      { name: "Video", color: "text-blue-500" },
      { name: "Motion", color: "text-purple-500" },
    ],
    video: sybelle2,
    link: "#",
    type: "design",
  },
  {
    name: "Hoodie",
    description: "A Money Earning Platform Landing Page.",
    short_description: "Money Earning Platform Landing Page",
    tags: [
      { name: "Design", color: "text-blue-500" },
      { name: "Fashion", color: "text-purple-500" },
    ],
    image: hoodie,
    link: "#",
    type: "design",
  },
  {
    name: "PUT.ma",
    description: "Innovative Platform for Listing Properties.",
    short_description: "Property Listing Platform",
    tags: [
      { name: "UI/UX", color: "text-blue-500" },
    ],
    image: putma,
    link: "#",
    type: "design",
  },
  {
    name: "Sybelle",
    description: "Sybelle Events & Awards Page Design.",
    short_description: "Sybelle Events & Awards Page Design.",
    tags: [
      { name: "Branding", color: "text-pink-500" },
    ],
    image: sybelle1,
    link: "#",
    type: "design",
  },
  {
    name: "Put.ma",
    description: "Put.ma Login Page Design.",
    short_description: "Put.ma Login Page Design.",
    tags: [
      { name: "Mobile", color: "text-pink-500" },
    ],
    image: putma1,
    link: "#",
    type: "mobile",
  },
  {
    name: "Put.ma",
    description: "Property Listing Platform",
    short_description: "Property Listing Platform.",
    tags: [
      { name: "Web", color: "text-blue-500" },
      { name: "Dashboard", color: "text-green-500" },
    ],
    image: putma2,
    link: "#",
    type: "web",
  },
];

const socialLinks = {
  github: { handle: "JamesShell", link: "https://github.com/JamesShell" },
  linkedin: { handle: "/in/Ettouzany", link: "https://www.linkedin.com/in/james-ettozany/" },
  dribble: { handle: "@ettouzany", link: "https://dribbble.com/juds69" },
  twitter: { handle: "@ettouzzany", link: "https://x.com/ettouzzany" },
  discord: { handle: "ettouzany#1234", link: "https://discord.com" },
  mail: { handle: "ettozany@gmail.com", link: "mailto:ettozany@gmail.com" },
}

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "";

export { services, technologies, testimonials, projects, socialLinks };
