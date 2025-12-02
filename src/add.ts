import prompts from "prompts";
import fs from "fs";
import os from "os";
import path from "path";
import { loadConfig } from "./config.js";

const CONFIG_PATH = path.join(os.homedir(), ".quickcmd.json");

export async function addAliasInteractive() {
  const config = loadConfig() || { aliases: {} };

  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "Enter shortcut name (example: gpa):"
  });

  if (!name) {
    console.log("Shortcut name required.");
    return;
  }

  if (config.aliases[name]) {
    console.log(`Shortcut '${name}' already exists. Use: quick edit ${name}`);
    return;
  }

  const { type } = await prompts({
    type: "select",
    name: "type",
    message: "Command type:",
    choices: [
      { title: "Single command", value: "single" },
      { title: "Multi command (chained)", value: "multi" },
      { title: "Command with variables", value: "vars" },
      { title: "Modes (dev/prod/etc.)", value: "modes" }
    ]
  });

  let entry: any = {};

  if (type === "single" || type === "multi") {
    const { cmd } = await prompts({
      type: "text",
      name: "cmd",
      message: "Enter full command:"
    });
    entry = cmd;
  }

  if (type === "vars") {
    const { cmd, vars } = await prompts([
      {
        type: "text",
        name: "cmd",
        message: "Enter command (use {{variableName}} syntax):"
      },
      {
        type: "list",
        name: "vars",
        message: "Enter variable names (comma separated):"
      }
    ]);

    entry = { command: cmd, vars };
  }

  if (type === "modes") {
    entry = { modes: {} };
    let addMore = true;

    while (addMore) {
      const { modeName, modeCmd } = await prompts([
        {
          type: "text",
          name: "modeName",
          message: "Mode name (example: dev, prod):"
        },
        {
          type: "text",
          name: "modeCmd",
          message: "Command for this mode:"
        }
      ]);

      entry.modes[modeName] = modeCmd;

      const { more } = await prompts({
        type: "confirm",
        name: "more",
        message: "Add another mode?"
      });

      addMore = more;
    }
  }

  config.aliases[name] = entry;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");

  console.log(`Shortcut '${name}' added successfully.`);
}
