import { readFileSync, writeFileSync, existsSync } from "fs";
import { homedir } from "os";
import enquirer from "enquirer";

import { ClientConfig, refreshAccessToken } from "./client.js";
import { error, info, warn } from "./console.js";

const CONFIG_FILE_NAME = `${homedir()}/.commit-gpt.json`;

export async function ensureSessionToken(clean?: boolean): Promise<string> {
  let config: Partial<ClientConfig> = {};

  if (existsSync(CONFIG_FILE_NAME) && !clean) {
    config = JSON.parse(readFileSync(CONFIG_FILE_NAME, "utf-8"));
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
      error("Invalid token. Please try again.");
      config.sessionToken = await promptToken();
    }
  }
}

async function promptToken() {
  try {
    const help_url =
      "https://github.com/RomanHotsiy/commitgpt#get-your-session-token"
        .underline.bold;
    info(
      "Follow instructions here to get your OpenAI session token: " + help_url,
    );

    const answer = await enquirer.prompt<{ sessionToken: string }>({
      type: "password",
      name: "sessionToken",
      message: "Paste your session token here:",
    });

    return answer.sessionToken;
  } catch (e) {
    warn("Aborted.");
    process.exit(1);
  }
}

