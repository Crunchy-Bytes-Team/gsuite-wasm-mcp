import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { toolDefinitions } from './tools/definitions.js';
import { 
  handleListEmails,
  handleSearchEmails,
  handleSendEmail,
  handleModifyEmail
} from './handlers/email.js';
import {
  handleListEvents,
  handleCreateEvent,
  handleUpdateEvent,
  handleDeleteEvent
} from './handlers/calendar.js';
import {
  handleListContacts,
  handleGetUserInfo
} from './handlers/user.js';

export class GoogleWorkspaceServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'google-workspace-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: toolDefinitions,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'list_emails':
          return await handleListEmails(request.params.arguments);
        case 'search_emails':
          return await handleSearchEmails(request.params.arguments);
        case 'send_email':
          return await handleSendEmail(request.params.arguments);
        case 'modify_email':
          return await handleModifyEmail(request.params.arguments);
        case 'list_events':
          return await handleListEvents(request.params.arguments);
        case 'create_event':
          return await handleCreateEvent(request.params.arguments);
        case 'update_event':
          return await handleUpdateEvent(request.params.arguments);
        case 'delete_event':
          return await handleDeleteEvent(request.params.arguments);
        case 'list_contacts':
          return await handleListContacts(request.params.arguments);
        case 'get_user_info':
          return await handleGetUserInfo(request.params.arguments);
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Google Workspace MCP server running on stdio');
  }
} 