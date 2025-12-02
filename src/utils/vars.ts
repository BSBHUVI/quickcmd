export function applyPositionalVariables(
  command: string,
  args: string[]
): string {
  let result = command;
  args.forEach((val, idx) => {
    const token = `{{${idx}}}`;
    result = result.replaceAll(token, val);
  });
  return result;
}

export function applyNamedVariables(
  command: string,
  vars: string[],
  values: Record<string, string>
): string {
  let result = command;
  vars.forEach((name) => {
    const token = `{{${name}}}`;
    result = result.replaceAll(token, values[name] ?? "");
  });
  return result;
}
