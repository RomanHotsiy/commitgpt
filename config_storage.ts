import { homedir } from "os";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { defaultPromptTemplate } from "./template.js";

const GLOBAL_CONFIG_PATH = `${homedir()}/.commitgpt.json`;
const LOCAL_CONFIG_PATH = `${process.cwd()}/.commitgpt.json`;

const GLOBAL_PROMPT_TEMPLATE_PATH = `${homedir()}/.commitgpt-template`;
const LOCAL_PROMPT_TEMPLATE_PATH = `${process.cwd()}/.commitgpt-template`;

interface Config {
  apiKey?: string;
  promptTemplate?: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

const defaultConfig = {
  model: "text-davinci-003",
  temperature: 0.5,
  maxTokens: 2048,
} satisfies Config;

const writeJsonFile = (path: string, data: unknown) => {
  writeFileSync(path, JSON.stringify(data, null, 2));
};

function ensureGlobal() {
  if (!existsSync(GLOBAL_CONFIG_PATH)) {
    writeJsonFile(GLOBAL_CONFIG_PATH, {});
  }
}

function loadGlobal() {
  return JSON.parse(readFileSync(GLOBAL_CONFIG_PATH, "utf-8"));
}

function loadLocal(): Partial<Config> {
  if (!existsSync(LOCAL_CONFIG_PATH)) return {};
  return JSON.parse(readFileSync(LOCAL_CONFIG_PATH, "utf-8"));
}

let cache = null;
function load() {
  if (cache) return cache;
  ensureGlobal();
  const global = loadGlobal();
  const local = loadLocal();
  cache = { ...defaultConfig, ...global, ...local };
  return cache;
}

function assertTempValid(t: string) {
  // should include {{diff}}
  if (!t.includes("{{diff}}")) {
    throw new Error("Template must include {{diff}}");
  }
}

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

export function getConfig<T>(key: string): T {
  const config = load();
  return config[key];
}

export function setGlobalConfig(key: string, value: unknown) {
  const config = loadGlobal();
  config[key] = value;
  writeJsonFile(GLOBAL_CONFIG_PATH, config);
}
