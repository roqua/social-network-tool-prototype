import type { Stage } from "./protocol";

export function Instructions({ stage }: { stage: Stage }) {
  if (!stage.instructions) return null;
  return (
    <div className="instructions">
      {stage.instructions.split(/\n\s*\n/).map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}
