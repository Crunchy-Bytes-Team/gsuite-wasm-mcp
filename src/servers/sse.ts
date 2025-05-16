
import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import { StreamableWithSessionId, SseWithSessionId } from "../types.js";

const transports = {
  streamable: {} as StreamableWithSessionId,
  sse: {} as SseWithSessionId
};

export default function configureSSEServer(app: express.Express, server: Server) {

  app.get('/sse', async (req, res) => {
    // Create SSE transport for legacy clients
    const transport = new SSEServerTransport('/messages', res) as SSEServerTransport;
    transports.sse[transport.sessionId] = transport;
    
    res.on("close", () => {
      delete transports.sse[transport.sessionId];
    });
    
    await server.connect(transport);
  });
  
  app.post('/messages', async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports.sse[sessionId];
    if (transport) {
      await transport.handlePostMessage(req, res, req.body);
    } else {
      res.status(400).send('No transport found for sessionId');
    }
  });

}