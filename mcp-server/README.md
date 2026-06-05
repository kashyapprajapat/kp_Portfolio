# Kashyap Portfolio MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that exposes
Kashyap Prajapati's portfolio — profile, skills, projects, experience, education, and
contact — as structured **tools** and **resources** that any MCP-compatible AI client
(Claude Desktop, VS Code, Cursor, etc.) can query.

Skills and projects are read live from the portfolio's own `skills.json` and
`projects/projects.json`, so the server stays in sync with the website.

> **Live endpoint:** `https://www.kashyapprajapati.in/mcp` — connect instantly,
> no install required. Jump to [Two ways to connect](#two-ways-to-connect).

## Tools

| Tool | Description |
| --- | --- |
| `get_profile` | Professional profile, summary, philosophy, and full technical competency breakdown |
| `get_contact` | Email, phone, and social/professional links |
| `get_experience` | Work experience with roles, periods, and highlights |
| `get_education` | Educational background |
| `list_skills` | All technical skills (optional `filter` substring) |
| `list_projects` | All projects (optional `category` filter) |
| `search_projects` | Keyword search across project name, description, and category |
| `list_project_categories` | Distinct project categories with counts |
| `get_resume_summary` | Concise recruiter-friendly summary |

## Resources

| URI | Description |
| --- | --- |
| `portfolio://profile` | Structured profile JSON |
| `portfolio://skills` | Full skills list |
| `portfolio://projects` | Full projects list |

## Two ways to connect

There are two transports for the **exact same tools and resources**:

| Mode | Transport | Where it runs | Best for |
| --- | --- | --- | --- |
| **Live (hosted)** | Streamable **HTTP** | Vercel Serverless Function at `https://www.kashyapprajapati.in/mcp` | Anyone, anywhere — no install |
| **Local (dev)** | **stdio** | Your machine (`node src/index.js`) | Local development & debugging |

> The hosted endpoint is implemented at [`/api/mcp.js`](../api/mcp.js) and
> [`/api/_portfolio.js`](../api/_portfolio.js) in the repo root. See the root
> [`README.md`](../README.md#-live-mcp-server-use-it-in-your-ai-assistant) for the
> deployment and architecture overview.

---

## A) Live (hosted) — recommended

The server is deployed alongside the portfolio website, so **no installation is
required**. Just point your client at the URL.

**Endpoint**

```
https://www.kashyapprajapati.in/mcp
```

### VS Code (`.vscode/mcp.json`)

```jsonc
{
  "servers": {
    "kashyap-portfolio": {
      "type": "http",
      "url": "https://www.kashyapprajapati.in/mcp"
    }
  }
}
```

Open Copilot Chat in **Agent mode** — the tools appear automatically.

### Cursor (`~/.cursor/mcp.json` or project `.cursor/mcp.json`)

```jsonc
{
  "mcpServers": {
    "kashyap-portfolio": {
      "url": "https://www.kashyapprajapati.in/mcp"
    }
  }
}
```

### Claude Desktop (`claude_desktop_config.json`)

Claude Desktop launches local processes, so bridge the HTTP endpoint with
[`mcp-remote`](https://www.npmjs.com/package/mcp-remote):

```jsonc
{
  "mcpServers": {
    "kashyap-portfolio": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://www.kashyapprajapati.in/mcp"]
    }
  }
}
```

After saving, restart the client. You can then ask things like
*"List Kashyap's backend projects"* or *"What's Kashyap's experience?"*.

### Quick test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector
```

Choose transport **Streamable HTTP** and enter
`https://www.kashyapprajapati.in/mcp` to browse and call every tool in a UI.

---

## B) Local (stdio) — for development

### Setup

```bash
cd mcp-server
npm install
```

### Run

```bash
npm start
```

The server speaks JSON-RPC over **stdio**.

### Debug with MCP Inspector

```bash
npm run inspect
```

### Connect from a client (local)

**VS Code (`.vscode/mcp.json`)**

```jsonc
{
  "servers": {
    "kashyap-portfolio-local": {
      "type": "stdio",
      "command": "node",
      "args": ["src/index.js"],
      "cwd": "${workspaceFolder}/mcp-server"
    }
  }
}
```

**Claude Desktop (`claude_desktop_config.json`)**

```jsonc
{
  "mcpServers": {
    "kashyap-portfolio-local": {
      "command": "node",
      "args": ["F:/portfolio/mcp-server/src/index.js"]
    }
  }
}
```

---

## Architecture

```
Local (stdio)                         Live (HTTP)
─────────────                         ───────────
mcp-server/src/index.js               api/mcp.js          (Vercel function)
mcp-server/src/data.js                api/_portfolio.js   (data + server builder)
  └─ reads local skills.json            └─ fetches skills.json / projects.json
     & projects/projects.json              from https://www.kashyapprajapati.in
```

Both expose the identical 9 tools and 3 resources. The hosted version is
**stateless** (a fresh server is created per request), so it needs no database or
Redis and runs on Vercel's free Hobby tier.

## Requirements

- Node.js >= 18 (for local stdio mode)
