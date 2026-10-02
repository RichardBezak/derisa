import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/fredoka/400.css";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import "./styles.css";
import { HedgehogGame } from "./App";
const Root = HedgehogGame;

/** Small DERISA return link — the only addition on top of the original app. */
function BackToDerisa() {
  return (
    <a
      href="/pre-deti"
      aria-label="Späť na DERISA – Pre deti"
      style={{
        position: "fixed", left: "max(10px, env(safe-area-inset-left))", bottom: "max(10px, env(safe-area-inset-bottom))",
        zIndex: 9999, padding: "6px 12px", borderRadius: 999, fontSize: 13, fontFamily: "system-ui, sans-serif",
        background: "rgba(255,255,255,0.85)", color: "#2f5d43", textDecoration: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      ← DERISA
    </a>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
    <BackToDerisa />
  </StrictMode>,
);
