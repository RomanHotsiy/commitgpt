// Adapted from: https://github.com/wong2/chat-gpt-google-extension/blob/main/background/index.mjs

import { Configuration, OpenAIApi } from "openai";
import { getApiKey, getPromptOptions } from "./config.js";
import { getConfig } from "./config_storage.js";

const configuration = new Configuration({
  apiKey: await getApiKey(),
});
const openai = new OpenAIApi(configuration);

/**
 * A client for the OpenAI GPT-3 API.
 */
export class ChatGPTClient {
  /**
   * Gets an answer to a question from the OpenAI GPT-3 API.
   * @param question - The question to ask.
   * @returns The answer to the question.
   * @throws An error if the API request fails.
   */
  async getAnswer(question: string): Promise<string> {
    const { model, maxTokens, temperature } = await getPromptOptions();

    try {
      const result = await openai.createCompletion({
        model,
        prompt: question,
        max_tokens: maxTokens,
        temperature,
      });
      return result.data.choices[0].text;
    } catch (e) {
      console.error(e?.response ?? e);
      throw e;
    }

    // @ts-ignore
  }
}
