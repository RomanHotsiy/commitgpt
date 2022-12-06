// Adapted from: https://github.com/wong2/chat-gpt-google-extension/blob/main/background/index.mjs

import { createParser } from 'eventsource-parser';
import { v4 as uuidv4 } from 'uuid';
import ExpiryMap from 'expiry-map';
import fetch, { Response } from 'node-fetch';

export type ClientConfig = {
  sessionToken: string;
};

const KEY_ACCESS_TOKEN = 'accessToken';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36';
const cache = new ExpiryMap(10 * 1000);

export async function refreshAccessToken(sessionToken: string) {
  if (cache.get(KEY_ACCESS_TOKEN)) {
    return cache.get(KEY_ACCESS_TOKEN);
  }
  const resp = await fetch('https://chat.openai.com/api/auth/session', {
    headers: {
      'User-Agent': USER_AGENT,
      cookie: '__Secure-next-auth.session-token=' + sessionToken,
    },
  })
    .then(r => r.json() as any)
    .catch(() => ({}));

  if (!resp.accessToken) {
    throw new Error('Unathorized');
  }

  cache.set(KEY_ACCESS_TOKEN, resp.accessToken);
  return resp.accessToken;
}

export class ChatGPTClient {
  constructor(public config: ClientConfig, public converstationId: string = uuidv4()) {}

  async ensureAuth() {
    await refreshAccessToken(this.config.sessionToken);
  }
  async getAnswer(question: string): Promise<string> {
    const accessToken = await refreshAccessToken(this.config.sessionToken);

    let response = '';
    return new Promise((resolve, reject) => {
      fetchSSE('https://chat.openai.com/backend-api/conversation', {
        method: 'POST',
        headers: {
          'User-Agent': USER_AGENT,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          action: 'next',
          messages: [
            {
              id: uuidv4(),
              role: 'user',
              content: {
                content_type: 'text',
                parts: [question],
              },
            },
          ],
          model: 'text-davinci-002-render',
          parent_message_id: this.converstationId,
        }),
        onMessage: (message: string) => {
          if (message === '[DONE]') {
            return resolve(response);
          }
          const data = JSON.parse(message);
          const text = data.message?.content?.parts?.[0];
          if (text) {
            response = text;
          }
        },
      }).catch(reject);
    });
  }
}

async function fetchSSE(resource, options) {
  const { onMessage, ...fetchOptions } = options;
  const resp = await fetch(resource, fetchOptions);
  const parser = createParser(event => {
    if (event.type === 'event') {
      onMessage(event.data);
    }
  });

  resp.body.on('readable', () => {
    let chunk;
    while (null !== (chunk = resp.body.read())) {
      parser.feed(chunk.toString());
    }
  });
}
