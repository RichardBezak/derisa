import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Static, self-contained build served by DERISA under /pre-deti/jezko/
export default defineConfig({
  base: "/pre-deti/jezko/",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: { outDir: "../../public/pre-deti/jezko", emptyOutDir: true },
});
