import { useCallback, useEffect } from "react";

interface LightboxProps {
  images: { src: string; alt: string }[];
  selectedIndex: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

export function Lightbox({ images, selectedIndex, onClose, onChange }: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onChange((selectedIndex - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onChange((selectedIndex + 1) % images.length);
    },
    [selectedIndex, images.length, onClose, onChange]
  );

  useEffect(() => {
    if (selectedIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedIndex, handleKeyDown]);

  if (selectedIndex === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 text-white/80 hover:text-white text-4xl font-light"
        onClick={onClose}
      >
        ×
      </button>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl px-3"
        onClick={(e) => {
          e.stopPropagation();
          onChange((selectedIndex - 1 + images.length) % images.length);
        }}
      >
        ‹
      </button>
      <img
        src={images[selectedIndex].src}
        alt={images[selectedIndex].alt}
        className="max-h-[85vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl px-3"
        onClick={(e) => {
          e.stopPropagation();
          onChange((selectedIndex + 1) % images.length);
        }}
      >
        ›
      </button>
    </div>
  );
}
