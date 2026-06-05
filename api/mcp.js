// Live MCP endpoint — Streamable HTTP transport (stateless).
//
// Exposes the Kashyap Prajapati portfolio MCP server over HTTP so any
// MCP-compatible client (VS Code, Cursor, Claude Desktop via mcp-remote, etc.)
// can connect to https://www.kashyapprajapati.in/mcp.
//
// Runs as a stateless Vercel Serverless Function: a fresh server + transport is
// created per request, so no session storage or Redis is required (fully free).

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { buildServer } from "./_portfolio.js";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Authorization, mcp-session-id, mcp-protocol-version"
  );
  res.setHeader("Access-Control-Expose-Headers", "mcp-session-id");
}

// Read and JSON-parse the raw request body directly from the stream.
//
// We deliberately avoid Vercel's lazy `req.body` getter: accessing it triggers
// Vercel's own body parser, which conflicts with the MCP transport and throws
// "Invalid JSON". Reading the stream ourselves keeps full control.
function readJsonBody(req) {
  return new Promise((resolve) => {
    // If a framework already parsed the body into an object, reuse it.
    const pre = Object.getOwnPropertyDescriptor(req, "body");
    if (pre && typeof pre.value === "object" && pre.value !== null) {
      resolve(pre.value);
      return;
    }
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve(undefined);
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(undefined);
      }
    });
    req.on("error", () => resolve(undefined));
  });
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  // Stateless mode only supports request/response over POST. GET (SSE stream)
  // and DELETE (session teardown) are not used without a session store.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed. Use POST." },
      id: null
    });
    return;
  }

  const parsedBody = await readJsonBody(req);

  const server = buildServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined // stateless
  });

  res.on("close", () => {
    transport.close();
    server.close();
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, parsedBody);
  } catch (err) {
    console.error("MCP request error:", err);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null
      });
    }
  }
}
