import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

export interface StreamableWithSessionId {
  [sessionId: string]: StreamableHTTPServerTransport;
}

export interface SseWithSessionId {
  [sessionId: string]: SSEServerTransport;
}

export interface AuthData {
  token: string;
  issuer: string;
  subject: string;
  clientId?: string;
  scopes: string[];
  claims: {
    [key: string]: any;
  };
};