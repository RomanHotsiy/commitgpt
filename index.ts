#!/usr/bin/env node

import { execSync } from "child_process";
import enquirer from "enquirer";
import ora from "ora";

import { ChatGPTClient } from "./client.js";
import { loadPromptTemplate } from "./config_storage.js";

/**
 * Logs debug information to the console if the DEBUG environment variable is set.
 *
 * @param args - The arguments to log.
 */
const debug = (...args: unknown[]): void => {
  if (process.env.DEBUG) {
    console.debug(...args);
  }
};

/**
 * The string value for the custom message option in the commit message prompt.
 */
const CUSTOM_MESSAGE_OPTION = "[write own message]...";

/**
 * The spinner used to indicate that the tool is waiting for a response from the ChatGPT API.
 */
const spinner = ora();

/**
 * Runs the commit message prompt.
 *
 * @param diff - The diff to use in the prompt.
 */
async function runCommitMessagePrompt(diff: string): Promise<void> {
  // TODO: we should use a good tokenizer here
  const diffTokens = diff.split(" ").length;
  if (diffTokens > 2000) {
    console.log(`Diff is way too big. Truncating to 700 tokens. It may help`);
    diff = diff.split(" ").slice(0, 700).join(" ");
  }

  const api = new ChatGPTClient();

  const prompt = loadPromptTemplate().replace(
    "{{diff}}",
    ["```", diff, "```"].join("\n")
  );

  const message = await promptForCommitMessage(api, prompt);

  if (message === CUSTOM_MESSAGE_OPTION) {
    execSync("git commit", { stdio: "inherit" });
  } else {
    execSync(`git commit -m '${escapeCommitMessage(message)}'`, {
      stdio: "inherit",
    });
  }
}

/**
 * Prompts the user to select a commit message.
 *
 * @param api - The OpenAI API client to use.
 * @param prompt - The prompt to use.
 * @returns The selected commit message.
 * @throws An error if the prompt fails or the user cancels the prompt.
 */
async function promptForCommitMessage(
  api: ChatGPTClient,
  prompt: string
): Promise<string> {
  while (true) {
    debug("prompt: ", prompt);
    const choices = await getMessages(api, prompt);

    try {
      const answer = await enquirer.prompt<{ message: string }>({
        type: "select",
        name: "message",
        message: "Pick a message",
        choices,
      });

      return answer.message;
    } catch (e) {
      console.log("Aborted.");
      console.log(e);
      process.exit(1);
    }
  }
}

/**
 * Gets a list of commit messages from the ChatGPT API.
 *
 * @param api - The ChatGPT API client.
 * @param request - The request to send to the API.
 * @returns A list of commit messages.
 */
async function getMessages(
  api: ChatGPTClient,
  request: string
): Promise<string[]> {
  spinner.start("Asking ChatGPT 🤖 for commit messages...");

  // send a message and wait for the response
  try {
    const response = await api.getAnswer(request);
    // find json array of strings in the response
    const messages = response
      .split("\n")
      .map(normalizeMessage)
      .filter((l) => l.length > 1);

    spinner.stop();

    debug("response: ", response);

    messages.push(CUSTOM_MESSAGE_OPTION);
    return messages;
  } catch (e) {
    spinner.stop();
    if (e.message === "Unauthorized") {
      return getMessages(api, request);
    } else {
      throw e;
    }
  }
}

/**
 * Normalizes a commit message by removing unnecessary characters and whitespace.
 *
 * @param line - The commit message to normalize.
 * @returns The normalized commit message.
 */
function normalizeMessage(line: string): string {
  return line
    .trim()
    .replace(/^(\d+\.|-|\*)\s+/, "")
    .replace(/^[`"']/, "")
    .replace(/[`"']$/, "")
    .replace(/[`"']:/, ":") // sometimes it formats messages like this: `feat`: message
    .replace(/:[`"']/, ":") // sometimes it formats messages like this: `feat:` message
    .replace(/\\n/g, "")
    .trim();
}

/**
 * Escapes single quotes in a commit message by replacing them with two single quotes.
 *
 * @param message - The commit message to escape.
 * @returns The escaped commit message.
 */
function escapeCommitMessage(message: string): string {
  return message.replace(/'/, `''`);
}

let diff = "";
try {
  diff = execSync("git diff --cached").toString();
  if (!diff) {
    console.log("No changes to commit.");
    process.exit(0);
  }
} catch (e) {
  console.log("Failed to run git diff --cached");
  process.exit(1);
}

runCommitMessagePrompt(diff)
  .then(() => {
    process.exit(0);
  })
  .catch((e: Error) => {
    console.log("Error: " + e.message, e.cause ?? "");
    process.exit(1);
  });
