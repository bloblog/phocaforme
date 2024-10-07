import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.PNG"],
  // resolve: {
  //   alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  // },
  define: {
    global: {},
  },
  optimizeDeps: {
    include: ["esm-dep > cjs-dep"],
  },
  server: {
    port: 3000,
  },
});
