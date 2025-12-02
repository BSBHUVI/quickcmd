import { QuickConfig, AliasCommand } from "./config.js";

function collectKeys(
  aliases: Record<string, AliasCommand>,
  prefix = ""
): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(aliases)) {
    const full = prefix ? `${prefix} ${key}` : key;
    keys.push(full);
    if (typeof value === "object" && value?.modes) {
      for (const sub of Object.keys(value.modes)) {
        keys.push(`${full} ${sub}`);
      }
    }
  }
  return keys;
}

export function getSuggestions(config: QuickConfig, input: string): string[] {
  const allKeys = collectKeys(config.aliases);
  const lower = input.toLowerCase();

  const suggestions = allKeys.filter(
    (k) =>
      k.toLowerCase().startsWith(lower) ||
      k.toLowerCase().includes(lower)
  );

  return suggestions.slice(0, 5);
}
