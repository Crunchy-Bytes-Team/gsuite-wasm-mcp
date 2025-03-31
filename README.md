# Google Workspace MCP Server

A Model Context Protocol (MCP) server that provides tools for interacting with Gmail and Calendar APIs. This server enables you to manage your emails and calendar events programmatically through the MCP interface.

## Features

### Gmail Tools
- `list_emails`: List recent emails from your inbox with optional filtering
- `search_emails`: Advanced email search with Gmail query syntax
- `send_email`: Send new emails with support for CC and BCC
- `modify_email`: Modify email labels (archive, trash, mark read/unread)

### Calendar Tools
- `list_events`: List upcoming calendar events with date range filtering
- `create_event`: Create new calendar events with attendees
- `update_event`: Update existing calendar events
- `delete_event`: Delete calendar events

### User Tools
- `list_contacts`: List contacts from Google Contacts
- `get_user_info`: Get user information

## Prerequisites

1. **Node.js**: Install Node.js version 14 or higher
2. **Google API Access Token**: You'll need a valid access token for authenticating with Google APIs

## Setup Instructions

1. **Clone and Install**:
   ```bash
   git clone https://github.com/yourusername/google-workspace-mcp-server.git
   cd google-workspace-mcp-server
   npm install
   ```

2. **Build and Run**:
   ```bash
   npm run build
   ```

## Usage Examples

All operations require a valid `accessToken` parameter. This token must have the appropriate OAuth scopes for the operation you're performing.

### Gmail Operations

1. **List Recent Emails**:
   ```json
   {
     "accessToken": "your_access_token",
     "maxResults": 5,
     "query": "is:unread"
   }
   ```

2. **Search Emails**:
   ```json
   {
     "accessToken": "your_access_token",
     "query": "from:example@gmail.com has:attachment",
     "maxResults": 10
   }
   ```

3. **Send Email**:
   ```json
   {
     "accessToken": "your_access_token",
     "to": "recipient@example.com",
     "subject": "Hello",
     "body": "Message content",
     "cc": "cc@example.com",
     "bcc": "bcc@example.com"
   }
   ```

4. **Modify Email**:
   ```json
   {
     "accessToken": "your_access_token",
     "id": "message_id",
     "addLabels": ["UNREAD"],
     "removeLabels": ["INBOX"]
   }
   ```

### Calendar Operations

1. **List Events**:
   ```json
   {
     "accessToken": "your_access_token",
     "maxResults": 10,
     "daysBack": 7,
     "daysForward": 30
   }
   ```

2. **Create Event**:
   ```json
   {
     "accessToken": "your_access_token",
     "summary": "Team Meeting",
     "location": "Conference Room",
     "description": "Weekly sync-up",
     "start": "2024-01-24T10:00:00Z",
     "end": "2024-01-24T11:00:00Z",
     "attendees": ["colleague@example.com"],
     "includeGoogleMeetDetails": true
   }
   ```

3. **Update Event**:
   ```json
   {
     "accessToken": "your_access_token",
     "eventId": "event_id",
     "summary": "Updated Meeting Title",
     "location": "Virtual",
     "start": "2024-01-24T11:00:00Z",
     "end": "2024-01-24T12:00:00Z"
   }
   ```

4. **Delete Event**:
   ```json
   {
     "accessToken": "your_access_token",
     "eventId": "event_id"
   }
   ```

### User Operations

1. **List Contacts**:
   ```json
   {
     "accessToken": "your_access_token"
   }
   ```

2. **Get User Info**:
   ```json
   {
     "accessToken": "your_access_token"
   }
   ```

## Project Structure

This project is organized in a modular structure:

- `src/index.ts`: The main entry point
- `src/server.ts`: The server class that sets up request handlers
- `src/tools/definitions.ts`: Tool definitions for the MCP interface
- `src/handlers/email.ts`: Handlers for Gmail operations
- `src/handlers/calendar.ts`: Handlers for Calendar operations
- `src/handlers/user.ts`: Handlers for user and contacts operations

## License

This project is licensed under the MIT License.
