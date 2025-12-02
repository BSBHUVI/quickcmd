import fs from "fs";
import path from "path";
import os from "os";

export type AliasCommand =
  | string
  | {
      command?: string;            // actual command string
      vars?: string[];             // named variables
      modes?: Record<string, AliasCommand>; // for sub-modes
      description?: string;
    };

export interface QuickConfig {
  extends?: string[]; // other config files to merge
  aliases: Record<string, AliasCommand>;
}

const DEFAULT_GLOBAL = path.join(os.homedir(), ".quickcmd.json");
const PROJECT_FILE = ".quickcmd.json";

function fileExists(p: string) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function loadConfigFile(p: string): QuickConfig | null {
  if (!fileExists(p)) return null;
  const raw = fs.readFileSync(p, "utf8");
  const json = JSON.parse(raw);
  return json;
}

function mergeConfigs(base: QuickConfig, extra: QuickConfig): QuickConfig {
  return {
    extends: [...(base.extends || []), ...(extra.extends || [])],
    aliases: {
      ...base.aliases,
      ...extra.aliases, // project overrides global
    },
  };
}

export function loadConfig(): QuickConfig | null {
  let config: QuickConfig | null = null;

  const globalCfg = loadConfigFile(DEFAULT_GLOBAL);
  if (globalCfg) config = globalCfg;

  const projectCfg = loadConfigFile(path.join(process.cwd(), PROJECT_FILE));
  if (projectCfg) {
    config = config ? mergeConfigs(config, projectCfg) : projectCfg;
  }

  // handle "extends"
  if (config && config.extends && config.extends.length > 0) {
    for (const extPath of config.extends) {
      const resolved = path.isAbsolute(extPath)
        ? extPath
        : path.join(process.cwd(), extPath);
      const extCfg = loadConfigFile(resolved);
      if (extCfg) {
        config = mergeConfigs(config, extCfg);
      }
    }
  }

  return config;
}

export function ensureDefaultConfig() {
  if (!fileExists(DEFAULT_GLOBAL)) {
    const defaultCfg: QuickConfig = {
      aliases: {
        gp: "git push",
        gs: "git status"
      }
    };
    fs.writeFileSync(
      DEFAULT_GLOBAL,
      JSON.stringify(defaultCfg, null, 2),
      "utf8"
    );
    console.log(`✅ Created default config at ${DEFAULT_GLOBAL}`);
  } else {
    console.log(`✔ Config already exists at ${DEFAULT_GLOBAL}`);
  }
}
