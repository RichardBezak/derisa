export function SpeechBubble({ text }: { text: string }) {
  return (
    <div className="relative mx-auto max-w-[19rem] rounded-3xl bg-white/90 px-5 py-3 text-center shadow-[0_6px_20px_-10px_rgba(90,60,20,0.5)]">
      <p className="font-display text-lg leading-snug text-cocoa">{text}</p>
      <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white/90" />
    </div>
  );
}
