## KAshyap Prajapati Portfolio

---
### Github pages Link
https://kashyapprajapat.github.io/kp_Portfolio/

### Sevalla Link 
https://kashyap-87kfr.sevalla.page/

---

##### Glimps
![Image](https://res.cloudinary.com/dpf5bkafv/image/upload/v1748243347/portfolio/glibfvuygewli8kqysgd.png)


![Image](https://res.cloudinary.com/dpf5bkafv/image/upload/v1748243347/portfolio/f5368lxe8wiu3fhf7750.png)

---

---

### Microsoft Clarity Report
![clarity](./Macbook-Air-clarity.microsoft.com.png)

---

### 🤖 Portfolio MCP Server

This repository also ships a **Model Context Protocol (MCP) server** that exposes my
portfolio — profile, skills, projects, experience, education, and contact — as
structured tools and resources for AI assistants (VS Code, Claude Desktop, Cursor, etc.).

It reads live from `skills.json` and `projects/projects.json`, so it always stays in
sync with the website. The server is fully self-contained inside the [`mcp-server/`](./mcp-server) folder and does **not** affect the portfolio website in any way.

**Quick start**

```bash
cd mcp-server
npm install
npm start
```

**Available tools:** `get_profile`, `get_contact`, `get_experience`, `get_education`,
`list_skills`, `list_projects`, `search_projects`, `list_project_categories`,
`get_resume_summary`

**Resources:** `portfolio://profile`, `portfolio://skills`, `portfolio://projects`

See [`mcp-server/README.md`](./mcp-server/README.md) for client setup and full details.

---

# Thank You.