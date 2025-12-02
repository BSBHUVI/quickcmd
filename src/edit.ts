import { execSync } from "child_process";
import path from "path";
import os from "os";
import { loadConfig } from "./config.js";

export async function editAlias(alias: string) {
  const configPath = path.join(os.homedir(), ".quickcmd.json");
  const config = loadConfig();

  if (!config?.aliases[alias]) {
    console.log(`❌ Shortcut '${alias}' not found.`);
    return;
  }

  console.log(`✏️ Opening '${alias}' for editing...`);

  try {
    execSync(`code "${configPath}"`, { stdio: "ignore" });
  } catch {
    console.log("VS Code not found. Opening default editor...");
    execSync(`"${process.env.EDITOR || "notepad"}" "${configPath}"`);
  }
}
