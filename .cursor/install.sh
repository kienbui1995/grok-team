#!/usr/bin/env bash
# Cloud Agent bootstrap for grok-app (Tauri desktop: React/Vite UI + Rust host).
# Idempotent: safe to re-run. Runs from /workspace after checkout.
set -euo pipefail

# Native Tauri (Linux) build/run deps. Ayatana only — libappindicator3-dev
# conflicts with libayatana-appindicator3-dev on Ubuntu (see .github/workflows/ci.yml).
# --force-confold keeps fuse3's /etc/fuse.conf conffile prompt non-interactive.
sudo DEBIAN_FRONTEND=noninteractive apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -o Dpkg::Options::=--force-confold \
  libwebkit2gtk-4.1-dev \
  librsvg2-dev \
  patchelf \
  libgtk-3-dev \
  libayatana-appindicator3-dev

# A transitive crate (dlopen2) requires edition 2024 → Rust >= 1.85. Some base
# images pin an older default (e.g. 1.83); CI builds on latest stable.
rustup default stable

# Grok Build CLI satisfies the app's first-run hard gate (~/.grok/bin/grok).
# Non-fatal: the dev loop (UI, tests, cargo build) works without it.
curl -fsSL https://x.ai/cli/install.sh | bash || true

pnpm install --frozen-lockfile
