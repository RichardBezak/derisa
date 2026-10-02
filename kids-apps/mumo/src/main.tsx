import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/baloo-2/500.css";
import "@fontsource/baloo-2/700.css";
import "./styles.css";
import { MumoProvider, useMumo } from "@/game/store";
import { MainRoom } from "@/components/mumo/MainRoom";
import { Onboarding } from "@/components/mumo/Onboarding";

function MumoApp() {
  const { state, ready } = useMumo();
  if (!ready) return <div className="min-h-screen bg-cream" />;
  return state.onboardingDone ? <MainRoom /> : <Onboarding />;
}
const Root = () => (
  <MumoProvider>
    <MumoApp />
  </MumoProvider>
);

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
