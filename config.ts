import { readFileSync, writeFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import enquirer from 'enquirer';

import { ClientConfig, refreshAccessToken } from './client.js';

const CONFIG_FILE_NAME = `${homedir()}/.commit-gpt.json`;

export async function ensureSessionToken(): Promise<string> {
  let config: Partial<ClientConfig> = {};

  if (existsSync(CONFIG_FILE_NAME)) {
    config = JSON.parse(readFileSync(CONFIG_FILE_NAME, 'utf-8'));
  }

  if (!config.sessionToken) {
    config.sessionToken = await promptToken();
  }

  while (true) {
    try {
      await refreshAccessToken(config.sessionToken);
      writeFileSync(CONFIG_FILE_NAME, JSON.stringify(config, null, 2));
      return config.sessionToken;
    } catch (e) {
      console.log('Invalid token. Please try again.');
      config.sessionToken = await promptToken();
    }
  }
}

async function promptToken() {
  try {
    console.log(
      'Follow instructions here to get your OpenAI session token: https://github.com/RomanHotsiy/commitgpt#get-your-session-token'
    );

    const answer = await enquirer.prompt<{ sessionToken: string }>({
      type: 'password',
      name: 'sessionToken',
      message: 'Paste your session token here:',
    });

    return answer.sessionToken;
  } catch (e) {
    console.log('Aborted.');
    process.exit(1);
  }
}
