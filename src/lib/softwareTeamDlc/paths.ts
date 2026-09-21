/**
 * Software Works path honesty.
 *
 * Shared GROK_HOME is the user's CLI home (`~/.grok`, `/home/u/.grok`,
 * `C:\Users\u\.grok`). A project `.grok` folder (`/repo/.grok`) and
 * Independent `~/.grok-app/agent-home` are not shared home.
 */

export function normalizeSoftwareTeamProjectPath(
  raw: string | null | undefined,
): string {
  return (raw ?? "").trim().replace(/\\/g, "/").replace(/\/+$/, "");
}

/**
 * True when `projectPath` *is* shared user GROK_HOME, not a normal repo
 * and not Independent agent-home.
 */
export function isSoftwareTeamSharedHomePath(
  raw: string | null | undefined,
): boolean {
  const path = normalizeSoftwareTeamProjectPath(raw);
  if (!path) return false;
  const lower = path.toLowerCase();
  if (lower === "~/.grok") return true;
  if (!lower.endsWith("/.grok")) return false;
  const parent = lower.slice(0, -"/.grok".length);
  if (parent === "~" || parent === "/root") return true;
  if (/^\/home\/[^/]+$/.test(parent)) return true;
  if (/^\/users\/[^/]+$/.test(parent)) return true;
  if (/^[a-z]:\/users\/[^/]+$/.test(parent)) return true;
  return false;
}

/**
 * Cache scope for the in-app pipeline store. `null` = unbound / browser /
 * shared-home (honest cache-only; never key as `~/.grok`).
 */
export function softwareTeamPipelineCacheScope(
  raw: string | null | undefined,
): string | null {
  const path = normalizeSoftwareTeamProjectPath(raw);
  if (!path || isSoftwareTeamSharedHomePath(path)) return null;
  return path;
}
