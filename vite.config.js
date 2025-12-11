import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.NODE_ENV === "ghpages" ? "/thessa/" : "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
