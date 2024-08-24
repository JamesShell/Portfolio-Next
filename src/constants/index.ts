import * as di from 'react-icons/di';
import * as fa from 'react-icons/fa';
import { jelth } from "../assets";
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
}

export interface ProjectTag {
  name: string;
  color: string;
}

export interface Project {
  name: string;
  description: string;
  tags: ProjectTag[];
  image: StaticImageData; // Assuming 'image' is a URL or path string
  source_code_link: string;
  Icon: IconType;
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
  { testimonial: "This guy is a top-notch full-stack web developer. Highly recommended!", name: "Ethan Lawson" },
  { testimonial: "Those web development skills are exceptional. Choose him for outstanding results!", name: "Lily Bennett" },
  { testimonial: "Ettouzany is a professional and dedicated full-stack web developer. Impressive work!", name: "Owen Sullivan" },
];

const projects: any[] = [
  {
    name: "Jelth",
    description: "A fully responsive web app where users complete tasks to earn gift cards. Built with React (Vite) for the frontend, Node.js for the backend, Firebase for authentication and database, and Redis for caching. Showcases a modern tech stack and effective web design.",
    tags: [
      { name: "react", color: "#1267b7" },
      { name: "nodejs", color: "#309700" },
      { name: "tailwind", color: "#3d8dd8" },
    ],
    image: jelth,
    source_code_link: "https://github.com/JamesShell",
    Icon: di.DiGithub
  },
];

export { services, technologies, testimonials, projects };
