import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // frontend port (default)
    proxy: {
      "/register": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/login": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/check": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/generate-seed": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/validate-seed": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
