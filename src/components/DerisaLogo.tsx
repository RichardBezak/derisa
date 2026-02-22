interface DerisaLogoProps {
  className?: string;
  color?: string;
}

export function DerisaLogo({ className = "", color = "currentColor" }: DerisaLogoProps) {
  return (
    <svg
      viewBox="0 0 360 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circle */}
      <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="2.5" fill="none" />
      
      {/* Four vesica piscis / leaf shapes */}
      {/* Top leaf */}
      <path
        d="M50 12 C62 30, 62 70, 50 88 C38 70, 38 30, 50 12Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* Horizontal leaf */}
      <path
        d="M12 50 C30 38, 70 38, 88 50 C70 62, 30 62, 12 50Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      
      {/* Text: DERISA o.z. */}
      <text
        x="110"
        y="58"
        fill={color}
        fontFamily="'Cormorant Garamond', serif"
        fontSize="38"
        fontWeight="500"
        letterSpacing="6"
      >
        DERISA
      </text>
      <text
        x="295"
        y="58"
        fill={color}
        fontFamily="'Cormorant Garamond', serif"
        fontSize="30"
        fontWeight="400"
        letterSpacing="2"
      >
        o.z.
      </text>
    </svg>
  );
}
