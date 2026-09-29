// Colouring people by their answer to a categorical question. The categories
// come from the question itself, so any bins variable can be used without
// listing colours per interview.
import { binsOf, stageAsking } from "./protocol";
import type { Member } from "./network";

// Ten colours that stay apart and keep white text readable. Ten is about the
// most people can tell apart; a variable with more bins repeats colours.
const palette = ["#1f5fa8", "#c0392b", "#2e7d32", "#7b3fa0", "#b35900", "#00796b", "#ad1457", "#5d4037", "#455a64", "#8a6d00"];

export type ColorScale = {
  variable: string;
  label: string;
  entries: { value: string | number; label: string; color: string }[];
};

export function colorScale(variable: string | undefined): ColorScale | undefined {
  const stage = variable ? stageAsking(variable) : undefined;
  if (!stage) return undefined;
  return {
    variable: stage.prompt.variable,
    label: stage.label,
    entries: binsOf(stage.prompt).map((bin, i) => ({ ...bin, color: palette[i % palette.length]! })),
  };
}

// Undefined when the person has no answer yet.
export function memberColor(scale: ColorScale, member: Member): string | undefined {
  return scale.entries.find((e) => e.value === member.attributes[scale.variable])?.color;
}
