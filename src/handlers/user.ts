import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export async function handleListContacts(args: any) {
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

export async function handleGetUserInfo(args: any) {
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