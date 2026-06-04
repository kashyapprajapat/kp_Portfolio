# Kashyap Portfolio MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that exposes
Kashyap Prajapati's portfolio — profile, skills, projects, experience, education, and
contact — as structured **tools** and **resources** that any MCP-compatible AI client
(Claude Desktop, VS Code, Cursor, etc.) can query.

Skills and projects are read live from the portfolio's own `skills.json` and
`projects/projects.json`, so the server stays in sync with the website.

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

## Setup

```bash
cd mcp-server
npm install
```

## Run

```bash
npm start
```

The server speaks JSON-RPC over **stdio**.

## Debug with MCP Inspector

```bash
npm run inspect
```

## Connect from a client

### VS Code (`.vscode/mcp.json`)

```jsonc
{
  "servers": {
    "kashyap-portfolio": {
      "type": "stdio",
      "command": "node",
      "args": ["src/index.js"],
      "cwd": "${workspaceFolder}/mcp-server"
    }
  }
}
```

### Claude Desktop (`claude_desktop_config.json`)

```jsonc
{
  "mcpServers": {
    "kashyap-portfolio": {
      "command": "node",
      "args": ["F:/portfolio/mcp-server/src/index.js"]
    }
  }
}
```

After saving, restart the client. You can then ask things like
*"List Kashyap's backend projects"* or *"What's Kashyap's experience?"*.

## Requirements

- Node.js >= 18
