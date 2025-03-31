#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

class GoogleWorkspaceServer {
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
      tools: [
        {
          name: 'list_emails',
          description: 'List recent emails from Gmail inbox',
          inputSchema: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                description: 'Google API access token',
              },
              maxResults: {
                type: 'number',
                description: 'Maximum number of emails to return (default: 10)',
              },
              query: {
                type: 'string',
                description: 'Search query to filter emails',
              },
            },
            required: ['accessToken']
          },
        },
        {
          name: 'search_emails',
          description: 'Search emails with advanced query',
          inputSchema: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                description: 'Google API access token',
              },
              query: {
                type: 'string',
                description: 'Gmail search query (e.g., "from:example@gmail.com has:attachment")',
                required: true
              },
              maxResults: {
                type: 'number',
                description: 'Maximum number of emails to return (default: 10)',
              },
            },
            required: ['accessToken', 'query']
          },
        },
        {
          name: 'send_email',
          description: 'Send a new email',
          inputSchema: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                description: 'Google API access token',
              },
              to: {
                type: 'string',
                description: 'Recipient email address',
              },
              subject: {
                type: 'string',
                description: 'Email subject',
              },
              body: {
                type: 'string',
                description: 'Email body (can include HTML)',
              },
              cc: {
                type: 'string',
                description: 'CC recipients (comma-separated)',
              },
              bcc: {
                type: 'string',
                description: 'BCC recipients (comma-separated)',
              },
            },
            required: ['accessToken', 'to', 'subject', 'body']
          },
        },
        {
          name: 'modify_email',
          description: 'Modify email labels (archive, trash, mark read/unread)',
          inputSchema: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                description: 'Google API access token',
              },
              id: {
                type: 'string',
                description: 'Email ID',
              },
              addLabels: {
                type: 'array',
                items: { type: 'string' },
                description: 'Labels to add',
              },
              removeLabels: {
                type: 'array',
                items: { type: 'string' },
                description: 'Labels to remove',
              },
            },
            required: ['accessToken', 'id']
          },
        },
        {
          name: 'list_events',
          description: 'List upcoming calendar events',
          inputSchema: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                description: 'Google API access token',
              },
              maxResults: {
                type: 'number',
                description: 'Maximum number of events to return (default: 10)',
              },
              daysBack: {
                type: 'number',
                description: 'Earliest date to include events from (default: 0 for today)',
              },
              daysForward: {
                type: 'number',
                description: 'Latest date to include events to',
              },
            },
            required: ['accessToken']
          },
        },
        {
          name: 'create_event',
          description: 'Create a new calendar event',
          inputSchema: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                description: 'Google API access token',
              },
              summary: {
                type: 'string',
                description: 'Event title',
              },
              location: {
                type: 'string',
                description: 'Event location',
              },
              description: {
                type: 'string',
                description: 'Event description',
              },
              start: {
                type: 'string',
                description: 'Start time in ISO format',
              },
              end: {
                type: 'string',
                description: 'End time in ISO format',
              },
              attendees: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of attendee email addresses',
              },
              includeGoogleMeetDetails: {
                type: 'boolean',
                description: 'Whether to include Google Meet video conference details',
              },
            },
            required: ['accessToken', 'summary', 'start', 'end']
          },
        },
        {
          name: 'update_event',
          description: 'Update an existing calendar event',
          inputSchema: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                description: 'Google API access token',
              },
              eventId: {
                type: 'string',
                description: 'Event ID to update',
              },
              summary: {
                type: 'string',
                description: 'New event title',
              },
              location: {
                type: 'string',
                description: 'New event location',
              },
              description: {
                type: 'string',
                description: 'New event description',
              },
              start: {
                type: 'string',
                description: 'New start time in ISO format',
              },
              end: {
                type: 'string',
                description: 'New end time in ISO format',
              },
              attendees: {
                type: 'array',
                items: { type: 'string' },
                description: 'New list of attendee email addresses',
              },
              includeGoogleMeetDetails: {
                type: 'boolean',
                description: 'Whether to include Google Meet video conference details',
              },
            },
            required: ['accessToken', 'eventId']
          },
        },
        {
          name: 'delete_event',
          description: 'Delete a calendar event',
          inputSchema: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                description: 'Google API access token',
              },
              eventId: {
                type: 'string',
                description: 'Event ID to delete',
              },
            },
            required: ['accessToken', 'eventId']
          },
        },
        {
          name: 'list_contacts',
          description: 'List contacts from Google Contacts',
          inputSchema: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                description: 'Google API access token',
              },
            },
            required: ['accessToken']
          },
        },
        {
          name: 'get_user_info',
          description: 'Get user information',
          inputSchema: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                description: 'Google API access token',
              },
            },
            required: ['accessToken']
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'list_emails':
          return await this.handleListEmails(request.params.arguments);
        case 'search_emails':
          return await this.handleSearchEmails(request.params.arguments);
        case 'send_email':
          return await this.handleSendEmail(request.params.arguments);
        case 'modify_email':
          return await this.handleModifyEmail(request.params.arguments);
        case 'list_events':
          return await this.handleListEvents(request.params.arguments);
        case 'create_event':
          return await this.handleCreateEvent(request.params.arguments);
        case 'update_event':
          return await this.handleUpdateEvent(request.params.arguments);
        case 'delete_event':
          return await this.handleDeleteEvent(request.params.arguments);
        case 'list_contacts':
          return await this.handleListContacts(request.params.arguments);
        case 'get_user_info':
          return await this.handleGetUserInfo(request.params.arguments);
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  private async handleListEmails(args: any) {
    try {
      const { accessToken, maxResults = 10, query = '' } = args;

      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch emails: ${response.statusText}`);
      }

      const data = await response.json();
      const messages = data.messages || [];
      
      const emailDetails = await Promise.all(
        messages.map(async (msg: any) => {
          const detailResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          
          if (!detailResponse.ok) {
            throw new Error(`Failed to fetch email details: ${detailResponse.statusText}`);
          }
          
          const detail = await detailResponse.json();
          
          const headers = detail.payload?.headers;
          const subject = headers?.find((h: any) => h.name === 'Subject')?.value || '';
          const from = headers?.find((h: any) => h.name === 'From')?.value || '';
          const date = headers?.find((h: any) => h.name === 'Date')?.value || '';

          return {
            id: msg.id,
            subject,
            from,
            date,
          };
        })
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(emailDetails, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching emails: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleSearchEmails(args: any) {
    try {
      const { accessToken, maxResults = 10, query } = args;

      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to search emails: ${response.statusText}`);
      }

      const data = await response.json();
      const messages = data.messages || [];
      
      const emailDetails = await Promise.all(
        messages.map(async (msg: any) => {
          const detailResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          
          if (!detailResponse.ok) {
            throw new Error(`Failed to fetch email details: ${detailResponse.statusText}`);
          }
          
          const detail = await detailResponse.json();
          
          const headers = detail.payload?.headers;
          const subject = headers?.find((h: any) => h.name === 'Subject')?.value || '';
          const from = headers?.find((h: any) => h.name === 'From')?.value || '';
          const date = headers?.find((h: any) => h.name === 'Date')?.value || '';

          return {
            id: msg.id,
            subject,
            from,
            date,
          };
        })
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(emailDetails, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error searching emails: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleSendEmail(args: any) {
    try {
      const { accessToken, to, subject, body, cc, bcc } = args;

      // Create email content
      const message = [
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `To: ${to}`,
        cc ? `Cc: ${cc}` : '',
        bcc ? `Bcc: ${bcc}` : '',
        `Subject: ${subject}`,
        '',
        body,
      ].filter(Boolean).join('\r\n');

      // Encode the email
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send the email
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            raw: encodedMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        content: [
          {
            type: 'text',
            text: `Email sent successfully. Message ID: ${data.id}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error sending email: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleModifyEmail(args: any) {
    try {
      const { accessToken, id, addLabels = [], removeLabels = [] } = args;

      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            addLabelIds: addLabels,
            removeLabelIds: removeLabels,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to modify email: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        content: [
          {
            type: 'text',
            text: `Email modified successfully. Updated labels for message ID: ${data.id}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error modifying email: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private getEventTimeRange(daysBack?: number, daysForward?: number) {
    const timeMin = daysBack !== undefined 
      ? new Date(Date.now() - 1000 * 60 * 60 * 24 * daysBack).toISOString() 
      : undefined;
    
    const timeMax = daysForward !== undefined 
      ? new Date(Date.now() + 1000 * 60 * 60 * 24 * daysForward).toISOString() 
      : undefined;
    
    return { timeMin, timeMax };
  }

  private async handleListEvents(args: any) {
    try {
      const { 
        accessToken, 
        maxResults = 10, 
        daysBack = 0, 
        daysForward 
      } = args;

      const { timeMin, timeMax } = this.getEventTimeRange(daysBack, daysForward);

      const timeMinParam = timeMin ? `&timeMin=${timeMin}` : '';
      const timeMaxParam = timeMax ? `&timeMax=${timeMax}` : '';
      const maxResultsParam = maxResults ? `&maxResults=${maxResults}` : '';

      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?orderBy=startTime&singleEvents=true' +
        timeMinParam +
        timeMaxParam +
        maxResultsParam,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      const events = data.items?.map((event: any) => ({
        id: event.id,
        summary: event.summary,
        start: event.start,
        end: event.end,
        location: event.location,
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(events, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching calendar events: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleCreateEvent(args: any) {
    try {
      const { 
        accessToken, 
        summary, 
        location, 
        description, 
        start, 
        end, 
        attendees = [],
        includeGoogleMeetDetails = false 
      } = args;

      // Generate a UUID for the conference request ID if needed
      const conferenceRequestId = includeGoogleMeetDetails 
        ? Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        : undefined;

      const event = {
        summary,
        location,
        description,
        start: {
          dateTime: start,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: end,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        attendees: attendees.map((email: string) => ({ email })),
        conferenceData: includeGoogleMeetDetails
          ? {
              createRequest: {
                conferenceSolutionKey: {
                  type: 'hangoutsMeet',
                },
                requestId: conferenceRequestId,
              },
            }
          : undefined,
      };

      const conferenceDataVersion = includeGoogleMeetDetails ? '1' : '0';

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=${conferenceDataVersion}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create event: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        content: [
          {
            type: 'text',
            text: `Event created successfully. Event ID: ${data.id}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating event: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleUpdateEvent(args: any) {
    try {
      const { 
        accessToken, 
        eventId, 
        summary, 
        location, 
        description, 
        start, 
        end, 
        attendees, 
        includeGoogleMeetDetails = false 
      } = args;

      const event: any = {};
      if (summary !== undefined) event.summary = summary;
      if (location !== undefined) event.location = location;
      if (description !== undefined) event.description = description;
      
      if (start !== undefined) {
        event.start = {
          dateTime: start,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
      }
      
      if (end !== undefined) {
        event.end = {
          dateTime: end,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
      }
      
      if (attendees !== undefined) {
        event.attendees = attendees.map((email: string) => ({ email }));
      }

      // For conference data, we'd need to handle this more carefully in a real app
      // as you can't simply add/remove Google Meet links to existing events without
      // checking the current conferenceData status

      const conferenceDataVersion = includeGoogleMeetDetails ? '1' : '0';

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?conferenceDataVersion=${conferenceDataVersion}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update event: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        content: [
          {
            type: 'text',
            text: `Event updated successfully. Event ID: ${data.id}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error updating event: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleDeleteEvent(args: any) {
    try {
      const { accessToken, eventId } = args;

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.statusText}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: `Event deleted successfully. Event ID: ${eventId}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error deleting event: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleListContacts(args: any) {
    try {
      const { accessToken } = args;

      const response = await fetch(
        'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to list contacts: ${response.statusText}`);
      }

      const data = await response.json();
      const contacts = data.connections || [];

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(contacts, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching contacts: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleGetUserInfo(args: any) {
    try {
      const { accessToken } = args;

      const response = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.statusText}`);
      }

      const userInfo = await response.json();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(userInfo, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching user info: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Google Workspace MCP server running on stdio');
  }
}

const server = new GoogleWorkspaceServer();
server.run().catch(console.error);
