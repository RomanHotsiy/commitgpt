import enquirer from "enquirer";
import { getConfig, setGlobalConfig } from "./config_storage.js";

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
