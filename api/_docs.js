// Self-contained HTML documentation + live tester for the MCP endpoint.
//
// Served on GET requests to /mcp (browser visits). Renders a Swagger-style page
// that documents the server and lets visitors call every tool live, directly
// from the browser, against the same /mcp endpoint (which they reach via POST).

export function renderDocsHtml(endpointUrl) {
  const ep = endpointUrl;
  const vscodeCfg = JSON.stringify(
    { servers: { "kashyap-portfolio": { type: "http", url: ep } } },
    null,
    2
  );
  const cursorCfg = JSON.stringify(
    { mcpServers: { "kashyap-portfolio": { url: ep } } },
    null,
    2
  );
  const claudeCfg = JSON.stringify(
    {
      mcpServers: {
        "kashyap-portfolio": {
          command: "npx",
          args: ["-y", "mcp-remote", ep]
        }
      }
    },
    null,
    2
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Kashyap Portfolio MCP — Docs &amp; Live Tester</title>
<meta name="description" content="Live documentation and interactive tester for the Kashyap Prajapati portfolio Model Context Protocol (MCP) server." />
<style>
  :root {
    --bg: #0b0f17;
    --panel: #121826;
    --panel-2: #0e1420;
    --border: #1f2a3d;
    --text: #e6edf6;
    --muted: #8aa0bd;
    --accent: #5b8cff;
    --accent-2: #36d399;
    --danger: #ff6b6b;
    --code: #0a0e16;
    --radius: 12px;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: radial-gradient(1200px 600px at 80% -10%, #16203a 0%, var(--bg) 55%);
    color: var(--text);
    line-height: 1.6;
  }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  .wrap { max-width: 980px; margin: 0 auto; padding: 32px 20px 80px; }
  header.hero {
    display: flex; flex-direction: column; gap: 10px;
    padding: 28px 28px 24px;
    background: linear-gradient(135deg, #16223f 0%, #101727 100%);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  .badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 12px; font-weight: 600; letter-spacing: .4px;
    color: var(--accent-2); text-transform: uppercase;
  }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-2); box-shadow: 0 0 10px var(--accent-2); }
  h1 { margin: 4px 0 0; font-size: 28px; }
  .sub { color: var(--muted); margin: 0; }
  .endpoint {
    margin-top: 14px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
    background: var(--code); border: 1px solid var(--border); border-radius: 10px;
    padding: 10px 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }
  .method { color: var(--accent-2); font-weight: 700; }
  .url { color: var(--text); word-break: break-all; }
  .copy-btn, .btn {
    cursor: pointer; border: 1px solid var(--border); background: var(--panel);
    color: var(--text); border-radius: 8px; padding: 6px 12px; font-size: 13px;
    transition: .15s;
  }
  .copy-btn:hover, .btn:hover { border-color: var(--accent); color: #fff; }
  .btn-run { background: var(--accent); border-color: var(--accent); color: #fff; font-weight: 600; }
  .btn-run:hover { filter: brightness(1.1); }
  section { margin-top: 34px; }
  h2 { font-size: 20px; margin: 0 0 14px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .grid { display: grid; gap: 14px; }
  .card {
    background: var(--panel); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px 18px;
  }
  .card h3 { margin: 0; font-size: 16px; font-family: ui-monospace, monospace; color: #fff; }
  .tag { font-size: 11px; color: var(--accent); border: 1px solid var(--border); border-radius: 6px; padding: 2px 8px; }
  .desc { color: var(--muted); margin: 8px 0 0; font-size: 14px; }
  .params { margin-top: 12px; display: grid; gap: 10px; }
  .param-row { display: grid; gap: 4px; }
  .param-row label { font-size: 13px; color: var(--muted); font-family: ui-monospace, monospace; }
  .param-row input {
    background: var(--code); border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); padding: 8px 10px; font-size: 13px; font-family: ui-monospace, monospace;
  }
  .param-row input:focus { outline: none; border-color: var(--accent); }
  .opt { color: var(--muted); font-size: 11px; }
  .actions { margin-top: 12px; display: flex; gap: 10px; align-items: center; }
  pre {
    background: var(--code); border: 1px solid var(--border); border-radius: 10px;
    padding: 12px 14px; overflow: auto; margin: 0; font-size: 12.5px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }
  .result { margin-top: 12px; display: none; }
  .result.show { display: block; }
  .result pre { max-height: 360px; }
  .result.error pre { border-color: var(--danger); color: #ffb4b4; }
  .tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
  .tab { font-size: 13px; }
  .tab.active { border-color: var(--accent); color: #fff; }
  .cfg { display: none; }
  .cfg.active { display: block; }
  .muted { color: var(--muted); }
  .pill { font-size: 12px; color: var(--muted); }
  footer { margin-top: 48px; color: var(--muted); font-size: 13px; text-align: center; }
  .loading { color: var(--muted); font-style: italic; }
  .resource { font-family: ui-monospace, monospace; color: var(--accent-2); }
</style>
</head>
<body>
<div class="wrap">

  <header class="hero">
    <span class="badge"><span class="dot"></span> Live MCP Server</span>
    <h1>Kashyap Portfolio · MCP Server</h1>
    <p class="sub">A Model Context Protocol server exposing Kashyap Prajapati's profile, skills, projects, experience, education &amp; contact as AI-callable tools and resources.</p>
    <div class="endpoint">
      <span class="method">POST</span>
      <span class="url" id="ep">${ep}</span>
      <button class="copy-btn" data-copy="${ep}">Copy URL</button>
    </div>
  </header>

  <section>
    <h2>What is this?</h2>
    <p class="muted">This endpoint speaks the <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener">Model Context Protocol</a> over <strong>Streamable HTTP</strong>. Add the URL to any MCP-compatible AI client and ask plain-English questions like <em>"What's Kashyap's experience?"</em> or <em>"Show me his backend projects."</em> — the assistant answers using live data from this site.</p>
    <p class="pill">Browser GET → this documentation. MCP clients → JSON-RPC over POST. Both share the same URL.</p>
  </section>

  <section>
    <h2>Connect from a client</h2>
    <div class="tabs">
      <button class="btn tab active" data-tab="vscode">VS Code</button>
      <button class="btn tab" data-tab="cursor">Cursor</button>
      <button class="btn tab" data-tab="claude">Claude Desktop</button>
    </div>
    <div class="cfg active" id="cfg-vscode">
      <p class="muted">Add to <code>.vscode/mcp.json</code>, then open Copilot Chat in <strong>Agent mode</strong>:</p>
      <pre>${escapeHtml(vscodeCfg)}</pre>
      <button class="copy-btn" data-copy='${attr(vscodeCfg)}'>Copy config</button>
    </div>
    <div class="cfg" id="cfg-cursor">
      <p class="muted">Add to <code>.cursor/mcp.json</code>:</p>
      <pre>${escapeHtml(cursorCfg)}</pre>
      <button class="copy-btn" data-copy='${attr(cursorCfg)}'>Copy config</button>
    </div>
    <div class="cfg" id="cfg-claude">
      <p class="muted">Claude launches local processes, so bridge the URL with <a href="https://www.npmjs.com/package/mcp-remote" target="_blank" rel="noopener">mcp-remote</a> in <code>claude_desktop_config.json</code>:</p>
      <pre>${escapeHtml(claudeCfg)}</pre>
      <button class="copy-btn" data-copy='${attr(claudeCfg)}'>Copy config</button>
    </div>
  </section>

  <section>
    <h2>Tools <span class="pill" id="tool-count"></span></h2>
    <p class="muted">Call any tool live, right here in your browser. Fill in optional parameters and hit <strong>Run</strong>.</p>
    <div class="grid" id="tools"><p class="loading">Loading tools from the live server…</p></div>
  </section>

  <section>
    <h2>Resources</h2>
    <div class="grid" id="resources"><p class="loading">Loading resources…</p></div>
  </section>

  <footer>
    Built by <a href="https://www.kashyapprajapati.in" target="_blank" rel="noopener">Kashyap Prajapati</a> ·
    <a href="https://github.com/kashyapprajapat/kp_Portfolio" target="_blank" rel="noopener">Source on GitHub</a> ·
    Powered by the Model Context Protocol
  </footer>

</div>

<script>
const ENDPOINT = ${JSON.stringify(ep)};
let RPC_ID = 1;

async function mcp(method, params) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: RPC_ID++, method, params: params || {} })
  });
  const text = await res.text();
  let data;
  const line = text.split("\\n").find(l => l.startsWith("data:"));
  data = JSON.parse(line ? line.slice(5).trim() : text);
  if (data.error) throw new Error(data.error.message || "RPC error");
  return data.result;
}

function el(tag, attrs, children) {
  const e = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    if (k === "class") e.className = attrs[k];
    else if (k === "text") e.textContent = attrs[k];
    else e.setAttribute(k, attrs[k]);
  }
  (children || []).forEach(c => e.appendChild(c));
  return e;
}

function renderTool(tool) {
  const card = el("div", { class: "card" });
  const head = el("div", null, []);
  head.style.display = "flex";
  head.style.alignItems = "center";
  head.style.gap = "10px";
  head.appendChild(el("h3", { text: tool.name }));
  head.appendChild(el("span", { class: "tag", text: "tool" }));
  card.appendChild(head);
  card.appendChild(el("p", { class: "desc", text: tool.description || "" }));

  const props = (tool.inputSchema && tool.inputSchema.properties) || {};
  const required = (tool.inputSchema && tool.inputSchema.required) || [];
  const inputs = {};
  const keys = Object.keys(props);
  if (keys.length) {
    const pbox = el("div", { class: "params" });
    keys.forEach(key => {
      const isReq = required.includes(key);
      const row = el("div", { class: "param-row" });
      const lbl = el("label");
      lbl.textContent = key + " ";
      lbl.appendChild(el("span", { class: "opt", text: isReq ? "(required)" : "(optional)" }));
      const desc = props[key].description;
      const inp = el("input", { type: "text", placeholder: desc || key });
      inputs[key] = inp;
      row.appendChild(lbl);
      row.appendChild(inp);
      pbox.appendChild(row);
    });
    card.appendChild(pbox);
  }

  const result = el("div", { class: "result" });
  const pre = el("pre");
  result.appendChild(pre);

  const runBtn = el("button", { class: "btn btn-run", text: "Run" });
  runBtn.addEventListener("click", async () => {
    const args = {};
    Object.keys(inputs).forEach(k => {
      const v = inputs[k].value.trim();
      if (v) args[k] = v;
    });
    runBtn.disabled = true;
    runBtn.textContent = "Running…";
    result.className = "result show";
    pre.textContent = "…";
    try {
      const r = await mcp("tools/call", { name: tool.name, arguments: args });
      const txt = (r.content || []).map(c => c.text || "").join("\\n");
      let pretty = txt;
      try { pretty = JSON.stringify(JSON.parse(txt), null, 2); } catch {}
      pre.textContent = pretty || JSON.stringify(r, null, 2);
    } catch (err) {
      result.className = "result show error";
      pre.textContent = "Error: " + err.message;
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = "Run";
    }
  });

  const actions = el("div", { class: "actions" });
  actions.appendChild(runBtn);
  card.appendChild(actions);
  card.appendChild(result);
  return card;
}

async function init() {
  try {
    const { tools } = await mcp("tools/list", {});
    const box = document.getElementById("tools");
    box.innerHTML = "";
    document.getElementById("tool-count").textContent = tools.length + " available";
    tools.forEach(t => box.appendChild(renderTool(t)));
  } catch (err) {
    document.getElementById("tools").innerHTML =
      '<p class="result show error"><pre>Failed to load tools: ' + err.message + '</pre></p>';
  }

  try {
    const { resources } = await mcp("resources/list", {});
    const box = document.getElementById("resources");
    box.innerHTML = "";
    resources.forEach(r => {
      const card = el("div", { class: "card" });
      const head = el("div");
      head.style.display = "flex";
      head.style.alignItems = "center";
      head.style.gap = "10px";
      head.appendChild(el("h3", { class: "resource", text: r.uri }));
      head.appendChild(el("span", { class: "tag", text: "resource" }));
      card.appendChild(head);
      if (r.name) card.appendChild(el("p", { class: "desc", text: r.name }));
      box.appendChild(card);
    });
  } catch (err) {
    document.getElementById("resources").innerHTML =
      '<p class="muted">Resources unavailable: ' + err.message + '</p>';
  }
}

// Tabs
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".cfg").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("cfg-" + tab.dataset.tab).classList.add("active");
  });
});

// Copy buttons
document.querySelectorAll(".copy-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      const old = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = old), 1200);
    } catch {}
  });
});

init();
</script>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// For use inside single-quoted HTML attributes (data-copy='...').
function attr(s) {
  return escapeHtml(s).replace(/'/g, "&#39;");
}
