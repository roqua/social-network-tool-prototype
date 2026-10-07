// Colouring people by their answer to a categorical question. The categories
// and their colours come from the question itself, so any bins variable can
// be used without listing colours per interview.
import type { CSSProperties } from "react";
import { binsOf, stageAsking } from "./protocol";
import type { Member } from "./network";

// Fallback for options without a colour of their own. Ten colours that stay
// apart; a variable with more bins repeats colours.
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
    entries: binsOf(stage.prompt).map((bin, i) => ({ ...bin, color: bin.color ?? palette[i % palette.length]! })),
  };
}

// Undefined when the person has no answer yet.
export function memberColor(scale: ColorScale, member: Member): string | undefined {
  return scale.entries.find((e) => e.value === member.attributes[scale.variable])?.color;
}

// Custom properties the chip and sociogram node styles read. The name goes in
// black or white, whichever reads better on the colour: the scheme runs from
// dark blue and red to pale yellow.
export function memberStyle(scale: ColorScale | undefined, member: Member): CSSProperties | undefined {
  const color = scale && memberColor(scale, member);
  if (!color) return undefined;
  return { "--member-color": color, "--member-ink": inkOn(color) } as CSSProperties;
}

function inkOn(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
  // Compare contrast against white (1.05 / (L + 0.05)) and black ((L + 0.05) / 0.05).
  return 1.05 / (luminance + 0.05) >= (luminance + 0.05) / 0.05 ? "#fff" : "#1a1a1a";
}
