import { execSync, ExecSyncOptions } from "child_process";
import prompts, { PromptObject } from "prompts";
import { AliasCommand, QuickConfig } from "./config.js";
import { applyNamedVariables, applyPositionalVariables } from "./utils/vars.js";

type ResolveResult = {
  command: string;
};

async function resolveAlias(
  config: QuickConfig,
  args: string[]
): Promise<ResolveResult | null> {
  if (args.length === 0) return null;

  const [alias, maybeMode, ...rest] = args;
  if(!alias) return null;
  const entry = config.aliases[alias];

  if (!entry) return null;

  // 1) Simple string alias
  if (typeof entry === "string") {
    const cmd = rest.length
      ? applyPositionalVariables(entry, rest)
      : entry;
    return { command: cmd };
  }

  // 2) Mode-based alias: deploy prod / deploy dev
  if (entry.modes && maybeMode && entry.modes[maybeMode]) {
    const modeEntry = entry.modes[maybeMode];
    const remaining = rest;

    if (typeof modeEntry === "string") {
      const cmd = remaining.length
        ? applyPositionalVariables(modeEntry, remaining)
        : modeEntry;
      return { command: cmd };
    } else if (typeof modeEntry === "object" && modeEntry.command) {
      return await resolveObjectCommand(modeEntry, remaining);
    }
  }

  // 3) Object alias with "command"
  if (entry.command) {
    return await resolveObjectCommand(entry, maybeMode ? [maybeMode, ...rest].filter(Boolean): [...rest].filter(Boolean));
  }

  return null;
}

async function resolveObjectCommand(
  entry: Exclude<AliasCommand, string>,
  args: string[]
): Promise<ResolveResult> {
  let command = entry.command || "";
  const vars = entry.vars || [];

  if (vars.length === 0) {
    // no named vars, treat args as positional {{0}}, {{1}}, ...
    if (args.length > 0) {
      command = applyPositionalVariables(command, args);
    }
    return { command };
  }

  const values: Record<string, string> = {};
  // if args provided, map them in order
  vars.forEach((name, idx) => {
    if (args[idx]) values[name] = args[idx];
  });

  // if some vars still missing -> interactive prompt
  const missing = vars.filter((name) => !values[name]);
  if (missing.length > 0) {
    const questions : PromptObject<string>[] = missing.map((name) => ({
      type: "text",
      name,
      message: `Enter value for ${name}:`
    }));
    const answers = await prompts(questions);
    Object.assign(values, answers);
  }

  command = applyNamedVariables(command, vars, values);
  return { command };
}

export async function runQuickCommand(
  config: QuickConfig,
  args: string[]
) {
  const resolved = await resolveAlias(config, args);
  if (!resolved) {
    throw new Error("Alias not found or incomplete command.");
  }

  console.log(`🚀 Running: ${resolved.command}\n`);

  try {
    execSync(resolved.command, {
      stdio: "inherit",
      shell: true as unknown as string // important for cross-platform
    });
  } catch (e: any) {
    console.error("❌ Command failed.");
    if (e?.message) {
      console.error(e.message);
    }
  }
}
