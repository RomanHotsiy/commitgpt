import enquirer from "enquirer";
import { getConfig, setGlobalConfig } from "./config_storage.js";

/**
 * Prompts the user to enter their OpenAI API key.
 *
 * @returns The user's OpenAI API key.
 */
async function promptToken() {
  try {
    const answer = await enquirer.prompt<{ apikey: string }>({
      type: "password",
      name: "apikey",
      message: "Paste your OpenAI apikey here:",
    });

    return answer.apikey;
  } catch (e) {
    console.log("Aborted.");
    process.exit(1);
  }
}

/**
 * Gets the user's OpenAI API key from the configuration file or prompts the user to enter it.
 *
 * @param clean - Whether to clear the cached API key.
 * @returns The user's OpenAI API key.
 */
export async function getApiKey(clean?: boolean): Promise<string> {
  let apiKey = getConfig<string | undefined>("apiKey");

  if (clean) {
    apiKey = undefined;
  }

  if (!apiKey) {
    apiKey = await promptToken();
    setGlobalConfig("apiKey", apiKey);
  }

  return apiKey;
}

/**
 * Gets the prompt options from the configuration file.
 *
 * @returns The prompt options.
 */
export async function getPromptOptions(): Promise<{
  model: string;
  temperature: number;
  maxTokens: number;
}> {
  const model = getConfig<string>("model");
  const temperature = getConfig<number>("temperature");
  const maxTokens = getConfig<number>("maxTokens");

  return {
    model,
    temperature,
    maxTokens,
  };
}
