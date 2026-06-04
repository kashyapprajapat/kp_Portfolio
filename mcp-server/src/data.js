// Structured profile data for Kashyap Prajapati.
// Skills and projects are loaded from the portfolio's JSON files at runtime so
// this stays in sync with the website. Profile/experience/education/contact are
// stored here as structured data (sourced from llms.txt).

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// mcp-server/src -> portfolio root
const PORTFOLIO_ROOT = path.resolve(__dirname, "..", "..");

export const PROFILE = {
  name: "Kashyap Prajapati",
  title: "Full-Stack Developer, Backend Engineer & DevOps Enthusiast",
  location: "Gujarat, India (387002)",
  philosophy:
    "I get a real kick out of building things that work smoothly behind the scenes — the kind of stuff most people don't see, but everything depends on.",
  summary:
    "Versatile Full-Stack Developer, Backend Engineer, and DevOps Enthusiast specializing in robust backend infrastructure, DevOps pipelines, and seamless mobile and web experiences. Currently pursuing an MCA at The Maharaja Sayajirao University of Baroda.",
  competencies: {
    backend: {
      languages: ["Node.js", "Python", "Go", "Java", "C#", "C++", "C", "PHP"],
      frameworks: ["Express.js", "Fastify", "FastAPI", "Spring Boot", "Spring", ".NET"],
      apis: ["RESTful APIs", "GraphQL", "Socket.IO"],
      core: [
        "Microservices architecture",
        "API design",
        "Authentication/Authorization (JWT)",
        "Performance optimization"
      ]
    },
    databases: {
      nosql: ["MongoDB", "Redis"],
      sql: ["PostgreSQL", "MySQL", "Microsoft SQL Server", "SQLite", "MariaDB"],
      orms: ["Prisma"],
      baas: ["Supabase", "Appwrite", "Firebase"]
    },
    frontend: {
      languages: ["JavaScript", "TypeScript", "HTML5", "CSS3"],
      frameworks: ["ReactJS", "Next.js", "Bootstrap"],
      styling: ["Tailwind CSS", "shadcn/ui"],
      state: ["Redux", "Zustand", "TanStack Query"]
    },
    mobileDesktop: {
      mobile: ["React Native", "Android (Native)"],
      desktop: ["ElectronJS", "PyQt", "AWT"],
      other: ["Progressive Web Apps (PWAs)", "Browser Extensions"]
    },
    devops: {
      infra: ["Docker", "Linux server management"],
      cicd: ["Git", "GitHub", "GitHub Actions"],
      tooling: ["PM2", "Webpack", "NPM"],
      testing: ["Jest", "Postman"],
      media: ["FFmpeg", "Streamlit"],
      design: ["Figma"]
    }
  }
};

export const EXPERIENCE = [
  {
    company: "InfoDesk",
    role: "Full Stack Developer Intern",
    period: "Jan 2026 – May 2026",
    location: "Vadodara, Gujarat (On-site)",
    highlights: [
      "Contributed to building and optimizing scalable enterprise-grade applications.",
      "Developed high-performance backend services using FastAPI and MongoDB.",
      "Deployed and managed cloud infrastructure on AWS for reliability and scalability.",
      "Built modern frontend interfaces using Next.js and Radix UI.",
      "Integrated advanced search capabilities leveraging OpenSearch.",
      "Collaborated with cross-functional teams in an Agile environment."
    ]
  },
  {
    company: "Skynet Global Systems",
    role: "Backend Developer Intern",
    period: "Dec 2023 – Mar 2024",
    location: "Nadiad, Gujarat (On-site)",
    highlights: [
      "Led a 2-member development team driving timely delivery and code quality.",
      "Built scalable systems using the MERN stack.",
      "Designed and developed secure RESTful APIs with Node.js and Express.",
      "Managed database operations and complex queries in MongoDB.",
      "Handled secure authentication and advanced Git workflows in an Agile framework."
    ]
  }
];

export const EDUCATION = [
  {
    degree: "Master of Computer Applications (M.C.A)",
    institution: "The Maharaja Sayajirao University of Baroda",
    period: "2024 - 2026",
    status: "Pursuing"
  },
  {
    degree: "Bachelor of Computer Applications (B.C.A)",
    institution: "Dharmsinh Desai University",
    period: "2021 - 2024",
    status: "Completed",
    result: "CGPA: 8.2"
  },
  {
    degree: "Higher Secondary (12th Commerce)",
    institution: "St. Mary's High School - GSEB",
    period: "2020 - 2021",
    status: "Completed",
    result: "1st Rank in School | 82.27%"
  },
  {
    degree: "Secondary (10th)",
    institution: "St. Mary's High School - GSEB",
    period: "2018 - 2019",
    status: "Completed",
    result: "80%"
  }
];

export const CONTACT = {
  email: "prajapatikashyap14@gmail.com",
  phone: "+91 6354195682",
  github: "https://github.com/kashyapprajapat",
  linkedin: "https://www.linkedin.com/in/kashyap-prajapati14/",
  twitter: "https://x.com/Kashyap14112003",
  dailydev: "https://app.daily.dev/kashyapprajapati",
  hashnode: "https://hashnode.com/@kp007",
  medium: "https://medium.com/@prajapatikashyap14",
  portfolio: "https://kp-portfolio-five.vercel.app"
};

let skillsCache = null;
let projectsCache = null;

export async function getSkills() {
  if (!skillsCache) {
    const raw = await readFile(path.join(PORTFOLIO_ROOT, "skills.json"), "utf-8");
    skillsCache = JSON.parse(raw);
  }
  return skillsCache;
}

export async function getProjects() {
  if (!projectsCache) {
    const raw = await readFile(
      path.join(PORTFOLIO_ROOT, "projects", "projects.json"),
      "utf-8"
    );
    projectsCache = JSON.parse(raw);
  }
  return projectsCache;
}
