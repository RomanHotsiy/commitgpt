// Adapted from: https://github.com/wong2/chat-gpt-google-extension/blob/main/background/index.mjs

import { Configuration, OpenAIApi } from "openai";
import { getApiKey } from "./config.js";

const configuration = new Configuration({
  apiKey: await getApiKey(),
});
const openai = new OpenAIApi(configuration);

export class ChatGPTClient {
  async getAnswer(question: string): Promise<string> {
    try {
      const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: question,
        max_tokens: 2048,
        temperature: 0.5,
      });
      return result.data.choices[0].text;
    } catch (e) {
      console.error(e?.response ?? e);
      throw e;
    }

    // @ts-ignore
  }
}
