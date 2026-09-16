import { useEffect } from "react";

// Keys 1-9 pick option 1-9, 0 picks the tenth. Ignored while typing in a field.
export const hotkeyLabel = (index: number) => (index < 9 ? String(index + 1) : index === 9 ? "0" : "");

export function useNumberHotkeys(count: number, onPick: (index: number) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable]")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const index = e.key === "0" ? 9 : /^[1-9]$/.test(e.key) ? Number(e.key) - 1 : -1;
      if (index < 0 || index >= count) return;
      e.preventDefault();
      onPick(index);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, onPick]);
}
