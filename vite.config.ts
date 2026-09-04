import { defineConfig } from "vite";
// SWC avoids Babel codegen deopt on large modules (App.tsx ~800KB+).
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { vendorManualChunk } from "./src/lib/viteManualChunks";

/** Serve Lean sample artifacts for Story gates on `pnpm dev:ui` / preview. */
function serveEngineeringArtifacts(): Plugin {
  const root = path.resolve(__dirname, "artifacts");
  const handle = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url?.split("?")[0] ?? "";
    if (!url.startsWith("/artifacts/")) {
      next();
      return;
    }
    const rel = decodeURIComponent(url.slice("/artifacts/".length));
    if (
      !rel ||
      rel.includes("..") ||
      path.isAbsolute(rel) ||
      rel.includes("\\")
    ) {
      res.statusCode = 400;
      res.end("invalid path");
      return;
    }
    const file = path.resolve(root, rel);
    const relToRoot = path.relative(root, file);
    if (relToRoot.startsWith("..") || path.isAbsolute(relToRoot)) {
      res.statusCode = 400;
      res.end("invalid path");
      return;
    }
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.statusCode = 404;
      res.end("not found");
      return;
    }
    const ext = path.extname(file);
    res.setHeader(
      "Content-Type",
      ext === ".json"
        ? "application/json; charset=utf-8"
        : "text/plain; charset=utf-8",
    );
    fs.createReadStream(file).pipe(res);
  };
  return {
    name: "serve-engineering-artifacts",
    configureServer(server) {
      server.middlewares.use(handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle);
    },
  };
}

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(() => ({
  plugins: [react(), tailwindcss(), serveEngineeringArtifacts()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  clearScreen: false,
  server: {
    port: 1421,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1422,
        }
      : undefined,
    watch: {
      ignored: [
        "**/src-tauri/**",
        "**/.grok-app-dev-home/**",
        "**/.cargo-home/**",
        "**/*.tsbuildinfo",
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: vendorManualChunk,
      },
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.ts", "src/**/*.{test,spec}.tsx"],
    setupFiles: ["./src/test/loadLocaleCatalogs.ts"],
  },
}));
