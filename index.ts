#!/usr/bin/env node
import { execSync } from "child_process";

import enquirer from "enquirer";
import ora from "ora";
import parseArgs from "yargs-parser";
import "colors";

import { ChatGPTClient } from "./client.js";
import { ensureSessionToken } from "./config.js";
import { error, log } from "./console.js";

const DIFF_COMMAND = "git diff --cached";

const CUSTOM_MESSAGE_OPTION = "[write own message]...";
const MORE_OPTION = "[ask for more ideas]...";
const spinner = ora();

const argv = parseArgs(process.argv.slice(2));

const conventionalCommit = argv.conventional || argv.c;
const CONVENTIONAL_REQUEST = conventionalCommit
  ? `following conventional commit (<type>: <subject>)`
  : "";

let diff = "";
try {
  diff = execSync(DIFF_COMMAND).toString();
  if (!diff) {
    log("No changes to commit.");
    process.exit(0);
  }
} catch (e) {
  error("Failed to run " + DIFF_COMMAND.bold);
  process.exit(1);
}

run(diff)
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    error(e.message);
    if ((e as any).details) {
      console.log((e as any).details);
    }
    process.exit(1);
  });

async function run(diff: string) {
  const api = new ChatGPTClient({
    sessionToken: await ensureSessionToken(),
  });

  spinner.start("Authorizing with OpenAI...");
  await api.ensureAuth();
  spinner.stop();

  const firstRequest =
    `Suggest me a few good commit messages for my commit ${CONVENTIONAL_REQUEST}.\n` +
    "```\n" +
    diff +
    "\n" +
    "```\n\n" +
    `Output results as a list, not more than 6 items.`;

  let firstRequestSent = false;

  while (true) {
    const choices = await getMessages(
      api,
      firstRequestSent
        ? `Suggest a few more commit messages for my changes (without explanations) ${CONVENTIONAL_REQUEST}`
        : firstRequest,
    );

    try {
      const answer = await enquirer.prompt<{ message: string }>({
        type: "select",
        name: "message",
        message: "Pick a message",
        choices,
      });

      firstRequestSent = true;

      if (answer.message === CUSTOM_MESSAGE_OPTION) {
        execSync("git commit", { stdio: "inherit" });
        return;
      } else if (answer.message === MORE_OPTION) {
        continue;
      } else {
        execSync(`git commit -m '${escapeCommitMessage(answer.message)}'`, {
          stdio: "inherit",
        });
        return;
      }
    } catch (e) {
      log("Aborted.");
      error(e);
      process.exit(1);
    }
  }
}

async function getMessages(api: ChatGPTClient, request: string) {
  spinner.start("Asking ChatGPT 🤖 for commit messages...");

  // send a message and wait for the response
  try {
    const response = await api.getAnswer(request);

    const messages = response
      .split("\n")
      .filter((line) => line.match(/^(\d+\.|-|\*)\s+/))
      .map(normalizeMessage);

    spinner.stop();

    messages.push(CUSTOM_MESSAGE_OPTION, MORE_OPTION);
    return messages;
  } catch (e) {
    spinner.stop();
    if (e.message === "Unauthorized") {
      log("Looks like your session token has expired");
      await ensureSessionToken(true);
      // retry
      return getMessages(api, request);
    } else {
      throw e;
    }
  }
}

function normalizeMessage(line: string) {
  return line
    .replace(/^(\d+\.|-|\*)\s+/, "")
    .replace(/^[`"']/, "")
    .replace(/[`"']$/, "")
    .replace(/[`"']:/, ":") // sometimes it formats messages like this: `feat`: message
    .replace(/:[`"']/, ":") // sometimes it formats messages like this: `feat:` message
    .replace(/\\n/g, "");
}

function escapeCommitMessage(message: string) {
  return message.replace(/'/, `''`);
}

