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
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("MCP request error:", err);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
          data: { message: String(err?.message), stack: String(err?.stack) }
        },
        id: null
      });
    }
  }
}
