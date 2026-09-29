import { memberColor, type ColorScale } from "./colors";
import type { Member } from "./network";

// Lists only the categories present among these members.
export function Legend({ scale, members }: { scale: ColorScale; members: Member[] }) {
  const used = scale.entries.filter((e) => members.some((m) => m.attributes[scale.variable] === e.value));
  return (
    <ul className="legend" aria-label={`Kleur: ${scale.label}`}>
      {used.map((e) => (
        <li key={String(e.value)}>
          <span className="swatch" style={{ background: e.color }} /> {e.label}
        </li>
      ))}
      {members.some((m) => !memberColor(scale, m)) && (
        <li>
          <span className="swatch no-value" /> Nog geen antwoord
        </li>
      )}
    </ul>
  );
}
