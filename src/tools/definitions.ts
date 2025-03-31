export const toolDefinitions = [
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
]; 