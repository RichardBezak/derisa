/**
 * Gentle hand-drawn scene decorations.
 * Purely decorative: pointer-events are disabled and everything sits behind
 * MUMO and the controls, so no touch target is ever covered.
 */
export type DecorScene = "room" | "bath" | "school" | "playground" | "trampoline" | "sing";

const Layer = ({ children }: { children: React.ReactNode }) => (
  <svg
    aria-hidden
    viewBox="0 0 390 700"
    preserveAspectRatio="xMidYMid meet"
    className="pointer-events-none absolute inset-y-0 left-1/2 z-0 h-full w-full max-w-[620px] -translate-x-1/2"
  >
    {children}
  </svg>
);

const Cloud = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="white" opacity="0.75">
    <ellipse cx="0" cy="0" rx="26" ry="16" />
    <ellipse cx="22" cy="6" rx="20" ry="12" />
    <ellipse cx="-22" cy="6" rx="18" ry="11" />
  </g>
);

const Flower = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 0 L0 -14" stroke="var(--sage)" strokeWidth="3" strokeLinecap="round" />
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx="0" cy="-20" rx="4" ry="6" fill={color} transform={`rotate(${a} 0 -14)`} />
    ))}
    <circle cx="0" cy="-14" r="3.2" fill="var(--honey-deep)" />
  </g>
);

const Butterfly = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`} opacity="0.9">
    <ellipse cx="-5" cy="0" rx="6" ry="8" fill="var(--coral)" />
    <ellipse cx="5" cy="0" rx="6" ry="8" fill="var(--honey)" />
    <rect x="-1" y="-7" width="2" height="14" rx="1" fill="var(--cocoa)" />
  </g>
);

const Plant = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-16 0 L16 0 L11 26 L-11 26 Z" fill="var(--coral)" opacity="0.85" />
    <path d="M0 0 C-4 -22 -18 -26 -20 -34 C-8 -34 -2 -22 0 -12" fill="var(--sage)" />
    <path d="M0 0 C4 -26 18 -30 22 -38 C10 -40 2 -24 0 -14" fill="var(--sage)" opacity="0.85" />
  </g>
);

export function SceneDecor({ scene, night = false }: { scene: DecorScene; night?: boolean }) {
  if (scene === "room") {
    return (
      <Layer>
        {/* window */}
        <rect x="28" y="70" width="128" height="112" rx="14" fill={night ? "var(--night-soft)" : "var(--sky)"} />
        <rect x="28" y="70" width="128" height="112" rx="14" fill="none" stroke="var(--cocoa)" strokeWidth="5" opacity="0.5" />
        <path d="M92 70 L92 182 M28 126 L156 126" stroke="var(--cocoa)" strokeWidth="4" opacity="0.4" />
        {night ? (
          <g fill="var(--cream)" opacity="0.9">
            <circle cx="60" cy="100" r="3" />
            <circle cx="122" cy="96" r="2.4" />
            <circle cx="132" cy="150" r="2.4" />
            <path d="M118 140 a12 12 0 1 1-10-15 a10 10 0 0 0 10 15z" fill="var(--cream)" />
          </g>
        ) : (
          <>
            <Cloud x={70} y={100} s={0.5} />
            <Cloud x={126} y={146} s={0.42} />
          </>
        )}
        {/* curtains */}
        <path d="M22 62 C34 100 30 150 24 190 L46 190 C40 148 44 100 50 62 Z" fill="var(--coral)" opacity="0.65" />
        <path d="M162 62 C150 100 154 150 160 190 L138 190 C144 148 140 100 134 62 Z" fill="var(--coral)" opacity="0.65" />
        {/* shelf with toys */}
        <rect x="222" y="150" width="140" height="10" rx="5" fill="var(--honey-deep)" opacity="0.8" />
        <rect x="232" y="118" width="20" height="32" rx="4" fill="var(--sky)" />
        <rect x="258" y="126" width="18" height="24" rx="4" fill="var(--coral)" opacity="0.8" />
        <circle cx="296" cy="136" r="14" fill="var(--sage)" />
        <path d="M282 136 h28" stroke="var(--cocoa)" strokeWidth="2.5" opacity="0.5" />
        <rect x="320" y="122" width="30" height="28" rx="6" fill="var(--honey)" />
        {/* framed picture */}
        <rect x="236" y="56" width="74" height="56" rx="8" fill="var(--cream-deep)" stroke="var(--cocoa)" strokeWidth="4" opacity="0.85" />
        <path d="M246 100 l16 -20 l14 16 l12 -12 l14 16z" fill="var(--sage)" opacity="0.9" />
        <circle cx="258" cy="72" r="6" fill="var(--honey)" />
        {/* lamp */}
        <path d="M344 196 l-22 0 l11 -30z" fill="var(--honey)" />
        <rect x="331" y="196" width="5" height="60" fill="var(--cocoa)" opacity="0.6" />
        <rect x="316" y="254" width="35" height="7" rx="3.5" fill="var(--cocoa)" opacity="0.6" />
      </Layer>
    );
  }

  if (scene === "bath") {
    return (
      <Layer>
        {/* wall tiles */}
        <g stroke="white" strokeWidth="3" opacity="0.35">
          {[80, 140, 200].map((y) => (
            <path key={y} d={`M0 ${y} H390`} />
          ))}
          {[60, 150, 240, 330].map((x) => (
            <path key={x} d={`M${x} 60 V240`} />
          ))}
        </g>
        {/* shelf with soap and duck */}
        <rect x="250" y="146" width="120" height="9" rx="4.5" fill="var(--cocoa)" opacity="0.45" />
        <rect x="262" y="124" width="34" height="22" rx="8" fill="var(--cream)" />
        <g transform="translate(330 128)">
          <ellipse cx="0" cy="10" rx="20" ry="13" fill="var(--honey)" />
          <circle cx="10" cy="-4" r="10" fill="var(--honey)" />
          <path d="M18 -4 l12 3 l-12 4z" fill="var(--coral)" />
          <circle cx="13" cy="-7" r="1.8" fill="var(--cocoa)" />
        </g>
        {/* towel */}
        <rect x="18" y="120" width="70" height="8" rx="4" fill="var(--cocoa)" opacity="0.4" />
        <path d="M26 128 h54 l-6 110 h-42z" fill="var(--cream)" opacity="0.95" />
        <path d="M26 170 h54" stroke="var(--coral)" strokeWidth="8" opacity="0.6" />
        {/* floor puddles + bubbles */}
        <ellipse cx="195" cy="662" rx="170" ry="40" fill="white" opacity="0.35" />
        <g fill="white" opacity="0.55">
          <circle cx="60" cy="600" r="12" />
          <circle cx="92" cy="628" r="8" />
          <circle cx="330" cy="596" r="14" />
          <circle cx="302" cy="626" r="9" />
        </g>
      </Layer>
    );
  }

  if (scene === "school") {
    return (
      <Layer>
        {/* school window */}
        <rect x="256" y="252" width="104" height="94" rx="12" fill="var(--sky)" />
        <rect x="256" y="252" width="104" height="94" rx="12" fill="none" stroke="var(--cocoa)" strokeWidth="5" opacity="0.5" />
        <path d="M308 252 V346 M256 299 H360" stroke="var(--cocoa)" strokeWidth="4" opacity="0.4" />
        <Cloud x={288} y={280} s={0.4} />
        {/* desk with books and crayons */}
        <rect x="16" y="560" width="358" height="22" rx="10" fill="var(--honey-deep)" opacity="0.85" />
        <rect x="44" y="582" width="16" height="92" rx="6" fill="var(--cocoa)" opacity="0.55" />
        <rect x="330" y="582" width="16" height="92" rx="6" fill="var(--cocoa)" opacity="0.55" />
        <rect x="50" y="528" width="76" height="14" rx="4" fill="var(--coral)" />
        <rect x="58" y="512" width="60" height="16" rx="4" fill="var(--sky)" />
        <g>
          {[
            ["var(--coral)", 0],
            ["var(--sky)", 18],
            ["var(--sage)", 36],
            ["var(--honey-deep)", 54],
          ].map(([c, dx]) => (
            <g key={String(dx)} transform={`translate(${268 + Number(dx)} 508)`}>
              <rect x="0" y="0" width="10" height="44" rx="3" fill={String(c)} />
              <path d="M0 0 l5 -10 l5 10z" fill="var(--cream)" />
            </g>
          ))}
        </g>
      </Layer>
    );
  }

  if (scene === "playground") {
    return (
      <Layer>
        <Cloud x={70} y={80} s={0.9} />
        <Cloud x={300} y={130} s={0.7} />
        <circle cx="330" cy="70" r="30" fill="var(--honey)" opacity="0.8" />
        {/* tree */}
        <rect x="42" y="430" width="22" height="140" rx="8" fill="var(--cocoa)" opacity="0.65" />
        <circle cx="54" cy="410" r="58" fill="var(--sage)" />
        <circle cx="96" cy="440" r="34" fill="var(--sage)" opacity="0.85" />
        <circle cx="18" cy="444" r="30" fill="var(--sage)" opacity="0.85" />
        <circle cx="40" cy="392" r="6" fill="var(--coral)" />
        <circle cx="76" cy="422" r="5" fill="var(--coral)" />
        {/* bench */}
        <g transform="translate(272 480)">
          <rect x="0" y="0" width="96" height="12" rx="5" fill="var(--honey-deep)" />
          <rect x="0" y="-22" width="96" height="10" rx="5" fill="var(--honey-deep)" opacity="0.85" />
          <rect x="8" y="12" width="10" height="34" rx="4" fill="var(--cocoa)" opacity="0.6" />
          <rect x="78" y="12" width="10" height="34" rx="4" fill="var(--cocoa)" opacity="0.6" />
        </g>
        {/* grass */}
        <path d="M0 596 C90 566 300 566 390 596 L390 700 L0 700 Z" fill="var(--sage)" opacity="0.95" />
        <g stroke="var(--cocoa)" strokeWidth="3" opacity="0.25" strokeLinecap="round">
          {[30, 110, 190, 270, 350].map((x) => (
            <path key={x} d={`M${x} 660 q6 -18 12 -2`} />
          ))}
        </g>
        <Flower x={60} y={648} color="var(--coral)" />
        <Flower x={148} y={668} color="var(--cream)" />
        <Flower x={318} y={652} color="var(--honey)" />
        <Butterfly x={220} y={430} />
      </Layer>
    );
  }

  if (scene === "trampoline") {
    return (
      <Layer>
        <Cloud x={80} y={90} s={0.8} />
        <Cloud x={310} y={150} s={0.6} />
        {/* bushes */}
        <circle cx="34" cy="520" r="44" fill="var(--sage)" />
        <circle cx="84" cy="540" r="32" fill="var(--sage)" opacity="0.9" />
        <circle cx="356" cy="522" r="42" fill="var(--sage)" />
        <circle cx="310" cy="544" r="28" fill="var(--sage)" opacity="0.9" />
        {/* fence */}
        <g fill="var(--cream)" opacity="0.95">
          {[0, 46, 92, 138, 184, 230, 276, 322, 368].map((x) => (
            <path key={x} d={`M${x} 470 h26 v90 h-26z M${x} 470 l13 -16 l13 16z`} />
          ))}
        </g>
        <rect x="0" y="498" width="390" height="10" fill="var(--cream)" opacity="0.8" />
        {/* grass */}
        <path d="M0 592 C90 566 300 566 390 592 L390 700 L0 700 Z" fill="var(--sage)" opacity="0.95" />
        <Flower x={44} y={660} color="var(--cream)" />
        <Flower x={340} y={652} color="var(--coral)" />
        <Butterfly x={300} y={430} />
        <g transform="translate(70 400)" opacity="0.9">
          <ellipse cx="0" cy="0" rx="11" ry="8" fill="var(--sky)" />
          <circle cx="8" cy="-6" r="6" fill="var(--sky)" />
          <path d="M14 -6 l8 2 l-8 3z" fill="var(--honey-deep)" />
        </g>
      </Layer>
    );
  }

  // sing
  return (
    <Layer>
      <g stroke="var(--cocoa)" strokeWidth="4" opacity="0.28" fill="none">
        <path d="M46 120 q18 -26 36 -4" />
        <path d="M300 96 q18 -26 36 -4" />
      </g>
      <g fill="var(--cocoa)" opacity="0.3">
        {[
          [56, 130],
          [318, 110],
          [120, 170],
          [280, 190],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
            <ellipse cx="0" cy="0" rx="9" ry="7" transform="rotate(-20)" />
            <rect x="7" y="-30" width="4" height="30" rx="2" />
          </g>
        ))}
      </g>
      <circle cx="46" cy="240" r="16" fill="var(--honey)" opacity="0.6" />
      <circle cx="344" cy="266" r="12" fill="var(--coral)" opacity="0.55" />
      <ellipse cx="195" cy="664" rx="160" ry="42" fill="var(--honey)" opacity="0.45" />
      <Plant x={352} y={560} />
      <Plant x={34} y={580} />
    </Layer>
  );
}
