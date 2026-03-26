import logoImage from "@/assets/derisa-logo.png";

interface DerisaLogoProps {
  className?: string;
  color?: string;
}

export function DerisaLogo({ className = "", color = "currentColor" }: DerisaLogoProps) {
  // When color is white, invert + brighten the logo for visibility on dark backgrounds
  const isWhite = color === "white" || color === "#fff" || color === "#ffffff";
  
  return (
    <img
      src={logoImage}
      alt="DERISA o.z."
      className={`${className} ${isWhite ? "brightness-0 invert" : ""}`}
    />
  );
}
