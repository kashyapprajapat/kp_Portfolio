// Shared portfolio data + MCP server builder for the live HTTP endpoint.
//
// This mirrors the stdio server in `mcp-server/src/` but is designed to run as a
// stateless Vercel Serverless Function. Skills and projects are fetched live from
// the deployed website over HTTPS (instead of reading from the local filesystem),
// so the MCP stays in sync with the portfolio and works in a serverless runtime.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Public base URL of the deployed portfolio. Override with the MCP_SITE_BASE env
// var in Vercel if the canonical domain ever changes.
const SITE_BASE =
  process.env.MCP_SITE_BASE || "https://www.kashyapprajapati.in";

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
  portfolio: "https://www.kashyapprajapati.in"
};

// Cache fetched JSON across warm invocations of the same function instance.
let skillsCache = null;
let projectsCache = null;

async function fetchJson(pathname) {
  const res = await fetch(`${SITE_BASE}${pathname}`, {
    headers: { Accept: "application/json" }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${pathname}: ${res.status}`);
  }
  return res.json();
}

export async function getSkills() {
  if (!skillsCache) {
    try {
      skillsCache = await fetchJson("/skills.json");
    } catch {
      skillsCache = [];
    }
  }
  return skillsCache;
}

export async function getProjects() {
  if (!projectsCache) {
    try {
      projectsCache = await fetchJson("/projects/projects.json");
    } catch {
      projectsCache = [];
    }
  }
  return projectsCache;
}

const json = (data) => ({
  content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
});

/**
 * Build a fresh McpServer instance with all portfolio tools and resources
 * registered. A new instance is created per request for stateless operation.
 */
export function buildServer() {
  const server = new McpServer({
    name: "kashyap-portfolio",
    version: "1.0.0"
  });

  /* ---------------------------- Resources ---------------------------- */

  server.resource("profile", "portfolio://profile", async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(PROFILE, null, 2)
      }
    ]
  }));

  server.resource("skills", "portfolio://skills", async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(await getSkills(), null, 2)
      }
    ]
  }));

  server.resource("projects", "portfolio://projects", async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(await getProjects(), null, 2)
      }
    ]
  }));

  /* ------------------------------ Tools ------------------------------ */

  server.tool(
    "get_profile",
    "Get Kashyap Prajapati's professional profile: title, location, summary, philosophy, and full technical competency breakdown.",
    {},
    async () => json(PROFILE)
  );

  server.tool(
    "get_contact",
    "Get Kashyap Prajapati's contact information and social/professional links (email, phone, GitHub, LinkedIn, X, blogs).",
    {},
    async () => json(CONTACT)
  );

  server.tool(
    "get_experience",
    "Get Kashyap Prajapati's professional work experience with roles, periods, and key highlights.",
    {},
    async () => json(EXPERIENCE)
  );

  server.tool(
    "get_education",
    "Get Kashyap Prajapati's educational background (degrees, institutions, periods, results).",
    {},
    async () => json(EDUCATION)
  );

  server.tool(
    "list_skills",
    "List Kashyap Prajapati's technical skills. Optionally filter by a name substring (case-insensitive).",
    {
      filter: z
        .string()
        .optional()
        .describe("Optional case-insensitive substring to filter skill names")
    },
    async ({ filter }) => {
      let skills = await getSkills();
      if (filter) {
        const f = filter.toLowerCase();
        skills = skills.filter((s) => s.name.toLowerCase().includes(f));
      }
      return json({ count: skills.length, skills });
    }
  );

  server.tool(
    "list_projects",
    "List Kashyap Prajapati's projects. Optionally filter by category (case-insensitive substring match).",
    {
      category: z
        .string()
        .optional()
        .describe("Optional case-insensitive category substring (e.g. 'backend', 'frontend')")
    },
    async ({ category }) => {
      let projects = await getProjects();
      if (category) {
        const c = category.toLowerCase();
        projects = projects.filter((p) =>
          (p.category || "").toLowerCase().includes(c)
        );
      }
      return json({ count: projects.length, projects });
    }
  );

  server.tool(
    "search_projects",
    "Search Kashyap Prajapati's projects by keyword across name, description, and category.",
    {
      query: z
        .string()
        .describe("Keyword to search for in project name, description, or category")
    },
    async ({ query }) => {
      const q = query.toLowerCase();
      const projects = await getProjects();
      const results = projects.filter((p) =>
        [p.name, p.desc, p.category]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q))
      );
      return json({ query, count: results.length, results });
    }
  );

  server.tool(
    "list_project_categories",
    "List all distinct project categories with the number of projects in each.",
    {},
    async () => {
      const projects = await getProjects();
      const counts = {};
      for (const p of projects) {
        const cat = p.category || "Uncategorized";
        counts[cat] = (counts[cat] || 0) + 1;
      }
      return json({ totalProjects: projects.length, categories: counts });
    }
  );

  server.tool(
    "get_resume_summary",
    "Get a concise, recruiter-friendly summary of Kashyap Prajapati combining profile, top skills, experience, education, and contact.",
    {},
    async () => {
      const skills = await getSkills();
      const projects = await getProjects();
      return json({
        name: PROFILE.name,
        title: PROFILE.title,
        location: PROFILE.location,
        summary: PROFILE.summary,
        totalSkills: skills.length,
        totalProjects: projects.length,
        experience: EXPERIENCE.map((e) => ({
          company: e.company,
          role: e.role,
          period: e.period
        })),
        education: EDUCATION.map((e) => ({
          degree: e.degree,
          institution: e.institution,
          period: e.period,
          status: e.status
        })),
        contact: CONTACT
      });
    }
  );

  return server;
}
