import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: '/air/',
  server: {
    port: 8080,
    open: true,
  },
});
