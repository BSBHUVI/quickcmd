#!/usr/bin/env node
import { addAliasInteractive } from "./add.js";
import { loadConfig, ensureDefaultConfig, AliasCommand } from "./config.js";
import { editAlias } from "./edit.js";
import { runQuickCommand } from "./runner.js";
import { getSuggestions } from "./suggest.js";

async function main() {
  const [, , cmd, ...rest] = process.argv;

  if (cmd === "init") {
    ensureDefaultConfig();
    return;
  }

  const config = loadConfig();
  if (!config) {
    console.error("No quickcmd config found.");
    console.log("Create ~/.quickcmd.json or run: quick init");
    process.exit(1);
  }

  if (cmd === "list") {
    console.log("Available aliases:");
    Object.keys(config.aliases).forEach((k) => {
      let description =
        typeof config.aliases[k] !== "string"
          ? config.aliases[k]?.description
          : "";
      console.log(`- ${k} - ${description}`);
    });
    process.exit(0);
  }

  if (cmd === "add") {
    await addAliasInteractive();
    process.exit(0);
  }

  if (cmd === "edit") {
    const alias = rest[0];
    if(alias) await editAlias(alias);
    process.exit(0);
  }

  if (!cmd) {
    console.log("Usage:");
    console.log("  q <alias> [...args]");
    console.log("  q <alias> <mode> [...args]");
    console.log("  q list");
    console.log("  q init");
    process.exit(0);
  }

  // main: try run alias
  try {
    await runQuickCommand(config, [cmd, ...rest]);
  } catch (e: any) {
    console.error(e.message);
    const suggestions = getSuggestions(config, cmd);
    if (suggestions.length) {
      console.log("\nDid you mean:");
      suggestions.forEach((s) => console.log("  -", s));
    }
    process.exit(1);
  }
}

main();
