import { Backpack, Home, Mic, Music } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NeedIndicators } from "./NeedIndicators";
import { NEED_TO_TARGET, useSceneNav } from "./SceneNav";

/** Full-screen scene used for food, bath, sleep and activities. */
export function SceneShell({
  title,
  onClose,
  children,
  className,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  const nav = useSceneNav();

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 flex flex-col items-center overflow-y-auto px-4 pb-6 pt-4 sm:pb-8",
        "motion-safe:animate-[mumo-fade_0.25s_ease-out]",
        className,
      )}
    >
      <div className="relative z-20 flex w-full max-w-md items-center justify-between gap-3">
        <h2 className="min-w-0 truncate font-display text-xl font-bold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Domov do izbičky"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/80 text-cocoa shadow"
        >
          <Home className="size-6" />
        </button>
      </div>
      {nav && (
        <nav className="relative z-20 mt-2 w-full max-w-md rounded-3xl bg-white/45 px-2 py-1">
          <NeedIndicators
            needs={nav.needs}
            active={nav.active}
            disabledKeys={nav.sleeping ? ["satiety", "cleanliness", "joy"] : undefined}
            onSelect={(key) => nav.go(NEED_TO_TARGET[key])}
          />
        </nav>
      )}
      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 py-3 sm:gap-5 sm:py-4">
        {children}
      </div>
      {nav && (
        <nav className="relative z-20 grid w-full max-w-md grid-cols-3 gap-2">
          {(
            [
              { id: "skola", label: "Škola", Icon: Backpack, tone: "bg-honey" },
              { id: "spev", label: "Zaspievať", Icon: Mic, tone: "bg-coral" },
              { id: "uspavanka", label: "Zahraj mi uspávanku", Icon: Music, tone: "bg-sky" },
            ] as const
          ).map(({ id, label, Icon, tone }) => (
            <button
              key={id}
              type="button"
              onClick={() => nav.go(id)}
              disabled={nav.sleeping && id !== "uspavanka"}
              aria-label={label}
              aria-current={nav.scene === id ? "true" : undefined}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-center font-display text-sm font-bold leading-tight text-cocoa shadow-[0_5px_0_rgba(120,85,40,0.2)]",
                tone,
                nav.scene === id && "ring-4 ring-cocoa/30",
                "disabled:opacity-45 disabled:shadow-none",
              )}
            >
              <Icon className="size-6 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
