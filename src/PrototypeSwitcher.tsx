import { useEffect } from "react";

export type Variant = { key: string; name: string };

// Floating bar to flip between UI variants. ← / → keys also cycle, unless a
// form field is focused. Not gated on NODE_ENV: this whole repo is the prototype.
export function PrototypeSwitcher({
  variants,
  current,
  onChange,
}: {
  variants: Variant[];
  current: string;
  onChange: (key: string) => void;
}) {
  const index = Math.max(0, variants.findIndex((v) => v.key === current));
  const go = (delta: number) => onChange(variants[(index + delta + variants.length) % variants.length]!.key);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, variants]);

  return (
    <div className="switcher" role="toolbar" aria-label="Prototype-variant">
      <button onClick={() => go(-1)} aria-label="Vorige variant">←</button>
      <span>
        <strong>{variants[index]!.key}</strong> — {variants[index]!.name}
      </span>
      <button onClick={() => go(1)} aria-label="Volgende variant">→</button>
    </div>
  );
}
