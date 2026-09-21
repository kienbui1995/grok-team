//! Software Works × Laya sidecar Host commands.
//!
//! Probe `python3` + `import laya`, then spawn `scripts/software-works-laya.py`.
//! Never writes shared `~/.grok`. Never fakes predict success.

use serde_json::{json, Value};
use std::io::Write;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc;
use std::thread;
use std::time::Duration;
use tauri::Manager;

const SCRIPT_NAME: &str = "software-works-laya.py";
const SCRIPT_SOURCE: &str = include_str!("../../scripts/software-works-laya.py");
/// Spec: Host kills the sidecar after 60s on the first predict.
const PREDICT_TIMEOUT_COLD_SECS: u64 = 60;
/// Spec: once a predict in this process has returned `answers`, later calls get 15s.
const PREDICT_TIMEOUT_WARM_SECS: u64 = 15;
/// Stable token. Studio maps it to i18n; it is never a suggestion.
const PREDICT_TIMEOUT_ERROR: &str = "timeout";
/// True after a predict child exited with an `answers` object. A timeout does not set this.
static PREDICT_WARMED: AtomicBool = AtomicBool::new(false);

/// True when `project_path` *is* shared user GROK_HOME (not `/repo/.grok`).
pub fn is_shared_user_grok_home(raw: Option<&str>) -> bool {
    let path = normalize_project_path(raw.unwrap_or(""));
    if path.is_empty() {
        return false;
    }
    let lower = path.to_ascii_lowercase();
    if lower == "~/.grok" {
        return true;
    }
    if !lower.ends_with("/.grok") {
        return false;
    }
    let parent = &lower[..lower.len() - "/.grok".len()];
    if parent == "~" || parent == "/root" {
        return true;
    }
    if looks_like_home_parent(parent) {
        return true;
    }
    let home = crate::process_util::user_home();
    let home_grok = normalize_project_path(&home.join(".grok").to_string_lossy());
    !home_grok.is_empty() && paths_equal(&lower, &home_grok)
}

fn normalize_project_path(raw: &str) -> String {
    raw.trim()
        .replace('\\', "/")
        .trim_end_matches('/')
        .to_string()
}

fn paths_equal(a: &str, b: &str) -> bool {
    a.eq_ignore_ascii_case(b)
}

fn looks_like_home_parent(parent: &str) -> bool {
    if parent == "~" || parent == "/root" {
        return true;
    }
    let parts: Vec<&str> = parent.split('/').filter(|p| !p.is_empty()).collect();
    // /home/user or /Users/user
    if parts.len() == 2
        && (parts[0].eq_ignore_ascii_case("home") || parts[0].eq_ignore_ascii_case("users"))
    {
        return true;
    }
    // C:/Users/user
    if parts.len() == 3 && parts[0].ends_with(':') && parts[1].eq_ignore_ascii_case("users") {
        return true;
    }
    false
}

fn python_bins() -> Vec<(&'static str, Vec<&'static str>)> {
    #[cfg(target_os = "windows")]
    {
        vec![("py", vec!["-3"]), ("python3", vec![]), ("python", vec![])]
    }
    #[cfg(not(target_os = "windows"))]
    {
        vec![("python3", vec![]), ("python", vec![])]
    }
}

fn find_python() -> Option<(String, Vec<String>)> {
    for (bin, prefix) in python_bins() {
        let mut cmd = Command::new(bin);
        crate::process_util::apply_no_window_std(&mut cmd);
        for arg in &prefix {
            cmd.arg(arg);
        }
        cmd.arg("-c").arg("import sys");
        if cmd
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .status()
            .map(|s| s.success())
            .unwrap_or(false)
        {
            return Some((
                bin.to_string(),
                prefix.iter().map(|s| (*s).to_string()).collect(),
            ));
        }
    }
    None
}

fn resolve_script_path(app: Option<&tauri::AppHandle>) -> Result<PathBuf, String> {
    let mut candidates: Vec<PathBuf> = Vec::new();
    if let Some(app) = app {
        if let Ok(dir) = app.path().resource_dir() {
            candidates.push(dir.join(SCRIPT_NAME));
            candidates.push(dir.join("scripts").join(SCRIPT_NAME));
        }
    }
    let manifest = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    candidates.push(manifest.join("../scripts").join(SCRIPT_NAME));
    candidates.push(PathBuf::from("scripts").join(SCRIPT_NAME));
    if let Ok(cwd) = std::env::current_dir() {
        candidates.push(cwd.join("scripts").join(SCRIPT_NAME));
        candidates.push(cwd.join("../scripts").join(SCRIPT_NAME));
    }
    if let Ok(exe) = std::env::current_exe() {
        if let Some(root) = exe.ancestors().nth(3) {
            candidates.push(root.join("scripts").join(SCRIPT_NAME));
        }
        if let Some(root) = exe.ancestors().nth(4) {
            candidates.push(root.join("scripts").join(SCRIPT_NAME));
        }
    }
    for c in candidates {
        if let Ok(canon) = c.canonicalize() {
            if canon.is_file() {
                return Ok(canon);
            }
        } else if c.is_file() {
            return Ok(c);
        }
    }
    // Packaged fallback: write the bundled source into App data, never ~/.grok.
    let dest = crate::paths::app_data_root().join(SCRIPT_NAME);
    if let Some(parent) = dest.parent() {
        let _ = std::fs::create_dir_all(parent);
    }
    let current = std::fs::read_to_string(&dest).unwrap_or_default();
    if current != SCRIPT_SOURCE {
        std::fs::write(&dest, SCRIPT_SOURCE)
            .map_err(|e| format!("write Laya sidecar script: {e}"))?;
    }
    Ok(dest)
}

/// 60s until a predict has returned `answers`; 15s after that. Timeout stays cold.
fn predict_timeout_secs(warmed: bool) -> u64 {
    if warmed {
        PREDICT_TIMEOUT_WARM_SECS
    } else {
        PREDICT_TIMEOUT_COLD_SECS
    }
}

/// A finished predict (including `LAYA_STUB=1`) warms the Host. Import failures,
/// non-JSON, and timeouts do not — the next call keeps the 60s cold budget.
fn predict_marks_warm(value: &Value) -> bool {
    value
        .get("answers")
        .and_then(|answers| answers.as_object())
        .is_some()
}

enum SidecarFail {
    Timeout,
    Other(String),
}

fn run_timed(
    mut cmd: Command,
    stdin_data: Option<&str>,
    timeout: Duration,
) -> Result<std::process::Output, SidecarFail> {
    crate::process_util::apply_no_window_std(&mut cmd);
    cmd.stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    let mut child = cmd
        .spawn()
        .map_err(|e| SidecarFail::Other(format!("spawn python: {e}")))?;
    if let Some(data) = stdin_data {
        if let Some(mut stdin) = child.stdin.take() {
            stdin
                .write_all(data.as_bytes())
                .map_err(|e| SidecarFail::Other(format!("write sidecar stdin: {e}")))?;
        }
    }
    let id = child.id();
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        let _ = tx.send(child.wait_with_output());
    });
    match rx.recv_timeout(timeout) {
        Ok(Ok(output)) => Ok(output),
        Ok(Err(err)) => Err(SidecarFail::Other(format!("wait python: {err}"))),
        Err(_) => {
            kill_pid(id);
            Err(SidecarFail::Timeout)
        }
    }
}

fn sidecar_error_text(fail: SidecarFail, predict: bool) -> String {
    match fail {
        SidecarFail::Timeout if predict => PREDICT_TIMEOUT_ERROR.to_string(),
        SidecarFail::Timeout => "Laya sidecar timed out".to_string(),
        SidecarFail::Other(message) => message,
    }
}

fn kill_pid(id: u32) {
    #[cfg(unix)]
    {
        let _ = Command::new("kill").arg("-9").arg(id.to_string()).status();
    }
    #[cfg(windows)]
    {
        let _ = Command::new("taskkill")
            .args(["/PID", &id.to_string(), "/F"])
            .status();
    }
}

fn python_command(bin: &str, prefix: &[String]) -> Command {
    let mut cmd = Command::new(bin);
    for arg in prefix {
        cmd.arg(arg);
    }
    cmd
}

fn allowed_cwd(project_path: Option<&str>) -> Option<PathBuf> {
    let raw = project_path.map(str::trim).filter(|s| !s.is_empty())?;
    if is_shared_user_grok_home(Some(raw)) {
        return None;
    }
    let path = PathBuf::from(raw);
    if path.is_dir() {
        Some(path)
    } else {
        None
    }
}

fn parse_sidecar_stdout(stdout: &str, stderr: &str) -> Value {
    let text = stdout.trim();
    if text.is_empty() {
        return json!({
            "ok": false,
            "reason": "host_error",
            "error": if stderr.trim().is_empty() { "empty sidecar stdout" } else { stderr.trim() },
        });
    }
    match serde_json::from_str::<Value>(text) {
        Ok(value) => value,
        Err(err) => json!({
            "ok": false,
            "reason": "host_error",
            "error": format!("{err}: {text}"),
        }),
    }
}

#[tauri::command]
pub fn software_team_laya_probe() -> Result<Value, String> {
    let Some((bin, prefix)) = find_python() else {
        return Ok(json!({
            "pythonOk": false,
            "layaImportOk": false,
            "error": "python3 not found",
        }));
    };
    let mut cmd = python_command(&bin, &prefix);
    cmd.arg("-c").arg("import laya");
    match run_timed(cmd, None, Duration::from_secs(15)) {
        Ok(output) if output.status.success() => Ok(json!({
            "pythonOk": true,
            "layaImportOk": true,
        })),
        Ok(output) => {
            let err = String::from_utf8_lossy(&output.stderr).trim().to_string();
            Ok(json!({
                "pythonOk": true,
                "layaImportOk": false,
                "error": if err.is_empty() { "import laya failed" } else { &err },
            }))
        }
        Err(error) => Ok(json!({
            "pythonOk": true,
            "layaImportOk": false,
            "error": sidecar_error_text(error, false),
        })),
    }
}

#[tauri::command]
pub fn software_team_laya_predict(
    app: tauri::AppHandle,
    project_path: Option<String>,
    request_json: String,
) -> Result<Value, String> {
    if is_shared_user_grok_home(project_path.as_deref()) {
        return Ok(json!({
            "ok": false,
            "reason": "blocked_shared_home",
        }));
    }
    let Some((bin, prefix)) = find_python() else {
        return Ok(json!({
            "ok": false,
            "reason": "need_python",
            "error": "python3 not found",
        }));
    };
    let script = resolve_script_path(Some(&app))?;
    // Refuse if the resolved script somehow lives under shared ~/.grok.
    if is_shared_user_grok_home(script.parent().and_then(|p| p.to_str())) {
        return Ok(json!({
            "ok": false,
            "reason": "blocked_shared_home",
            "error": "refusing to run a sidecar from ~/.grok",
        }));
    }
    let mut cmd = python_command(&bin, &prefix);
    cmd.arg(&script);
    if let Some(cwd) = allowed_cwd(project_path.as_deref()) {
        cmd.current_dir(cwd);
    }
    let warmed = PREDICT_WARMED.load(Ordering::Acquire);
    match run_timed(
        cmd,
        Some(&request_json),
        Duration::from_secs(predict_timeout_secs(warmed)),
    ) {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let stderr = String::from_utf8_lossy(&output.stderr);
            let parsed = parse_sidecar_stdout(&stdout, &stderr);
            if predict_marks_warm(&parsed) {
                PREDICT_WARMED.store(true, Ordering::Release);
            }
            Ok(parsed)
        }
        Err(error) => Ok(json!({
            "ok": false,
            "reason": "host_error",
            "error": sidecar_error_text(error, true),
        })),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn shared_home_matches_user_grok_only() {
        assert!(is_shared_user_grok_home(Some("~/.grok")));
        assert!(is_shared_user_grok_home(Some("/home/u/.grok")));
        assert!(is_shared_user_grok_home(Some("/Users/u/.grok")));
        assert!(is_shared_user_grok_home(Some(r"C:\Users\u\.grok")));
        assert!(!is_shared_user_grok_home(Some("/repo/.grok")));
        assert!(!is_shared_user_grok_home(Some("/repo")));
        assert!(!is_shared_user_grok_home(Some("~/.grok-app/agent-home")));
        assert!(!is_shared_user_grok_home(None));
    }

    #[test]
    fn predict_timeout_is_60s_cold_and_15s_warm() {
        assert_eq!(PREDICT_TIMEOUT_COLD_SECS, 60);
        assert_eq!(PREDICT_TIMEOUT_WARM_SECS, 15);
        assert_eq!(predict_timeout_secs(false), 60);
        assert_eq!(predict_timeout_secs(true), 15);
        assert_eq!(PREDICT_TIMEOUT_ERROR, "timeout");
    }

    #[test]
    fn answers_warm_the_host_timeout_does_not() {
        assert!(predict_marks_warm(&json!({
            "answers": { "priority": { "choice": "p2", "confidence": 0.8 } }
        })));
        assert!(!predict_marks_warm(&json!({
            "ok": false,
            "reason": "need_laya",
            "error": "import laya failed"
        })));
        assert!(!predict_marks_warm(&json!({
            "ok": false,
            "reason": "host_error",
            "error": "timeout"
        })));
        assert!(!predict_marks_warm(&json!({ "answers": "not-an-object" })));
        assert!(!predict_marks_warm(&json!("nope")));
    }
}
