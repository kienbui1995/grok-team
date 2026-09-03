/**
 * Software Works path honesty.
 *
 * Shared GROK_HOME is the user's CLI home. Detection resolves, in order:
 *   1. explicit `GROK_HOME` / `process.env.GROK_HOME` (any OS, incl. custom),
 *   2. `~/.grok` (tilde),
 *   3. `/home/<user>/.grok`, `/Users/<user>/.grok`, `C:\\Users\\<user>\\.grok`,
 *   4. WSL / UNC mirrors: `\\wsl$\\<dist>\\home\<user>\\.grok`,
 *      `\\wsl.localhost\<dist>\home\<user>\.grok`.
 * A project `.grok` folder (`/repo/.grok`) and Independent
 * `~/.grok-app/agent-home` are not shared home.
 */

export function normalizeSoftwareTeamProjectPath(
  raw: string | null | undefined,
): string {
  return (raw ?? "").trim().replace(/\\/g, "/").replace(/\/+$/, "");
}

/** Lower-case, slash-normalized path with `~` expanded to `/home/<user>`. */
export function expandSoftwareTeamPath(raw: string | null | undefined): string {
  let path = normalizeSoftwareTeamProjectPath(raw);
  if (!path) return "";
  const home = softwareTeamUserHomeCandidates()[0] ?? "";
  if (home && (path === "~" || path.startsWith("~/"))) {
    path = `${home}${path.slice(1)}`;
  }
  // Case-insensitive match on Windows drive letters / user segments.
  return path;
}

/**
 * Candidate absolute paths for the current user's home directory, best-effort
 * (no Host call). Order: env HOME/USERPROFILE → conventional roots.
 */
export function softwareTeamUserHomeCandidates(): string[] {
  const out: string[] = [];
  const push = (v: string | undefined) => {
    const n = normalizeSoftwareTeamProjectPath(v);
    if (n && !out.includes(n)) out.push(n);
  };
  if (typeof process !== "undefined" && process.env) {
    push(process.env.HOME);
    push(process.env.USERPROFILE);
  }
  push("/root");
  push("/home/user");
  push("/Users/user");
  return out;
}

function softwareTeamGrokHomeCandidates(): string[] {
  const homes = softwareTeamUserHomeCandidates();
  const out: string[] = [];
  const push = (v: string) => {
    const n = normalizeSoftwareTeamProjectPath(v);
    if (n && !out.includes(n)) out.push(n);
  };
  if (typeof process !== "undefined" && process.env) {
    push(process.env.GROK_HOME);
  }
  for (const home of homes) {
    push(`${home}/.grok`);
  }
  // WSL / UNC mirrors of the conventional Linux home.
  push("//wsl$/Ubuntu/home/user/.grok");
  push("//wsl.localhost/Ubuntu/home/user/.grok");
  push("//wsl$/Debian/home/user/.grok");
  return out;
}

/**
 * True when `projectPath` *is* shared user GROK_HOME, not a normal repo
 * and not Independent agent-home.
 */
export function isSoftwareTeamSharedHomePath(
  raw: string | null | undefined,
): boolean {
  const path = expandSoftwareTeamPath(raw);
  if (!path) return false;
  const lower = path.toLowerCase();
  for (const candidate of softwareTeamGrokHomeCandidates()) {
    if (lower === candidate.toLowerCase()) return true;
  }
  // Fallback: ends with `/.grok` whose parent is a user home root.
  if (!lower.endsWith("/.grok")) return false;
  const parent = lower.slice(0, -"/.grok".length);
  if (parent === "~" || parent === "/root") return true;
  if (/^\/home\/[^/]+$/.test(parent)) return true;
  if (/^\/users\/[^/]+$/.test(parent)) return true;
  if (/^[a-z]:\/users\/[^/]+$/.test(parent)) return true;
  // WSL / UNC: `//wsl$/<dist>/home/<user>` or `//wsl.localhost/<dist>/home/<user>`.
  if (
    /^\/\/wsl\$\/[^/]+\/home\/[^/]+$/.test(parent) ||
    /^\/\/wsl\.localhost\/[^/]+\/home\/[^/]+$/.test(parent)
  ) {
    return true;
  }
  return false;
}

/**
 * Cache scope for the in-app pipeline store. `null` = unbound / browser /
 * shared-home (honest cache-only; never key as `~/.grok`).
 */
export function softwareTeamPipelineCacheScope(
  raw: string | null | undefined,
): string | null {
  const path = expandSoftwareTeamPath(raw);
  if (!path || isSoftwareTeamSharedHomePath(path)) return null;
  return path;
}
