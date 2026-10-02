import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Static, self-contained build served by DERISA under /pre-deti/mumo/
export default defineConfig({
  base: "/pre-deti/mumo/",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: { outDir: "../../public/pre-deti/mumo", emptyOutDir: true },
});
