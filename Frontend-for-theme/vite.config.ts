import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    // Add this to allow Cloudflare quick tunnels
    allowedHosts: [".trycloudflare.com"], // Note the leading dot for all subdomains
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
  },
});
