#!/usr/bin/env python3
"""Software Works Laya sidecar. Stdin JSON → stdout JSON. Never writes ~/.grok."""
import json
import os
import sys

def main() -> int:
    try:
        raw = sys.stdin.read()
        req = json.loads(raw or "{}")
    except json.JSONDecodeError as err:
        print(json.dumps({"ok": False, "reason": "host_error", "error": str(err)}))
        return 0
    state = req.get("state") or {}
    questions = req.get("questions") or {}
    if os.environ.get("LAYA_STUB") == "1":
        print(json.dumps({
            "answers": {
                "priority": {"choice": "p2", "confidence": 0.8},
                "template": {"choice": "feature", "confidence": 0.8},
                "firstRole": {"choice": "product", "confidence": 0.8},
                "shipReady": {"noul": 0.1, "confidence": 0.8},
            },
            "routing": {"model": "stub", "reason": "LAYA_STUB=1"},
        }))
        return 0
    try:
        from laya import Router
    except Exception as err:
        print(json.dumps({"ok": False, "reason": "need_laya", "error": str(err)}))
        return 0
    try:
        router = Router(preload=False)
        result = router.predict(state, questions)
        print(json.dumps(result, default=str))
        return 0
    except Exception as err:
        print(json.dumps({"ok": False, "reason": "host_error", "error": str(err)}))
        return 0

if __name__ == "__main__":
    raise SystemExit(main())
