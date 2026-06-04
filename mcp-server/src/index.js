#!/usr/bin/env node
// MCP server exposing Kashyap Prajapati's portfolio as tools and resources.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import {
  PROFILE,
  EXPERIENCE,
  EDUCATION,
  CONTACT,
  getSkills,
  getProjects
} from "./data.js";

const server = new McpServer({
  name: "kashyap-portfolio",
  version: "1.0.0"
});

const json = (data) => ({
  content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
});

/* ----------------------------- Resources ----------------------------- */

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

/* ------------------------------- Tools ------------------------------- */

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
    query: z.string().describe("Keyword to search for in project name, description, or category")
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

/* ------------------------------- Start ------------------------------- */

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Logs go to stderr so they don't corrupt the stdio JSON-RPC stream.
  console.error("Kashyap Portfolio MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error starting MCP server:", err);
  process.exit(1);
});
