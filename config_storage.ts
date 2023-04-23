import { homedir } from "os";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { defaultPromptTemplate } from "./template.js";

const GLOBAL_CONFIG_PATH = `${homedir()}/.commitgpt.json`;
const LOCAL_CONFIG_PATH = `${process.cwd()}/.commitgpt.json`;

const GLOBAL_PROMPT_TEMPLATE_PATH = `${homedir()}/.commitgpt-template`;
const LOCAL_PROMPT_TEMPLATE_PATH = `${process.cwd()}/.commitgpt-template`;

interface Config {
  /**
   * The OpenAI API key.
   */
  apiKey?: string;
  /**
   * The prompt template.
   */
  promptTemplate?: string;
  /**
   * The OpenAI model to use.
   *
   * @example "text-davinci-003"
   * @example "gpt-4"
   *
   * @see https://platform.openai.com/docs/models
   */
  model: string;
  /**
   * The sampling temperature to use for the model, between 0 and 2.
   *
   * @example 0.5
   */
  temperature: number;
  /**
   * The maximum number of tokens to generate in the completion.
   *
   * @example 2048
   */
  maxTokens: number;
}

/**
 * The default configuration.
 */
const defaultConfig = {
  model: "text-davinci-003",
  temperature: 0.5,
  maxTokens: 2048,
} satisfies Config;

/**
 * Writes a JSON object to a file.
 *
 * @param path - The path of the file to write to.
 * @param data - The data to write to the file.
 */
const writeJsonFile = (path: string, data: unknown) => {
  writeFileSync(path, JSON.stringify(data, null, 2));
};

/**
 * Ensures that the global configuration file exists.
 */
function ensureGlobal() {
  if (!existsSync(GLOBAL_CONFIG_PATH)) {
    writeJsonFile(GLOBAL_CONFIG_PATH, {});
  }
}

/**
 * Loads the global configuration file.
 *
 * @returns The global configuration file.
 */
function loadGlobal() {
  return JSON.parse(readFileSync(GLOBAL_CONFIG_PATH, "utf-8"));
}

/**
 * Loads the local configuration file.
 *
 * @returns The local configuration file.
 */
function loadLocal(): Partial<Config> {
  if (!existsSync(LOCAL_CONFIG_PATH)) return {};
  return JSON.parse(readFileSync(LOCAL_CONFIG_PATH, "utf-8"));
}

let cache = null;

/**
 * Loads the configuration file.
 *
 * @returns The configuration file.
 */
function load() {
  if (cache) return cache;
  ensureGlobal();
  const global = loadGlobal();
  const local = loadLocal();
  cache = { ...defaultConfig, ...global, ...local };
  return cache;
}

/**
 * Asserts that the prompt template is valid.
 *
 * @param t - The prompt template to validate.
 * @throws An error if the prompt template is invalid.
 */
function assertTempValid(t: string) {
  // should include {{diff}}
  if (!t.includes("{{diff}}")) {
    throw new Error("Template must include {{diff}}");
  }
}

/**
 * Loads the prompt template from the configuration file.
 *
 * @returns The prompt template.
 */
export function loadPromptTemplate(): string {
  if (existsSync(LOCAL_CONFIG_PATH)) {
    const temp = readFileSync(LOCAL_PROMPT_TEMPLATE_PATH, "utf-8");
    assertTempValid(temp);

    return temp;
  }

  if (existsSync(GLOBAL_PROMPT_TEMPLATE_PATH)) {
    const temp = readFileSync(GLOBAL_PROMPT_TEMPLATE_PATH, "utf-8");
    assertTempValid(temp);

    return temp;
  }

  return defaultPromptTemplate;
}

/**
 * Gets a configuration value from the configuration file.
 *
 * @param key - The key of the configuration value to get.
 * @returns The configuration value.
 */
export function getConfig<T>(key: string): T {
  const config = load();
  return config[key];
}

/**
 * Sets a global configuration value in the configuration file.
 *
 * @param key - The key of the configuration value to set.
 * @param value - The value to set.
 */
export function setGlobalConfig(key: string, value: unknown) {
  const config = loadGlobal();
  config[key] = value;
  writeJsonFile(GLOBAL_CONFIG_PATH, config);
}
