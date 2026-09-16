// Variant B: questionnaire-style. One person at a time, answered with plain
// buttons or their number hotkeys; picking an answer advances to the next
// unanswered person.
import { useState } from "react";
import { hasAnswer, OTHER } from "../network";
import type { BinStageProps } from "./BinStage";
import { hotkeyLabel, useNumberHotkeys } from "../useNumberHotkeys";

export function BinOnePerson({ stage, network, actions }: BinStageProps) {
  const [index, setIndex] = useState(0);
  const { prompt } = stage;
  const member = network.members[Math.min(index, network.members.length - 1)];
  const choices: (number | typeof OTHER)[] = [...prompt.options.map((o) => o.value), ...(prompt.other ? [OTHER as typeof OTHER] : [])];

  const answer = (value: number | typeof OTHER) => {
    if (!member) return;
    actions.setAttribute(member.id, prompt.variable, value);
    // "Other" wants a comment, so stay put for that one.
    if (value === OTHER) return;
    const next = network.members.findIndex((m, i) => i > index && !hasAnswer(m, prompt));
    if (next !== -1) setTimeout(() => setIndex(next), 250);
  };

  useNumberHotkeys(choices.length, (i) => answer(choices[i]!));

  if (!member) return <p className="hint">Voeg eerst personen toe.</p>;
  const current = member.attributes[prompt.variable];

  return (
    <section>
      <p className="prompt">{prompt.text}</p>
      <div className="one-person">
        <ol className="person-rail" aria-label="Personen">
          {network.members.map((m, i) => (
            <li key={m.id}>
              <button className={`${i === index ? "current" : ""} ${hasAnswer(m, prompt) ? "done" : ""}`} onClick={() => setIndex(i)}>
                {m.name}
              </button>
            </li>
          ))}
        </ol>

        <div className="person-card">
          <h2>{member.name}</h2>
          <div className="option-buttons" role="group" aria-label={prompt.text}>
            {prompt.options.map((o, i) => (
              <button key={o.value} className={current === o.value ? "chosen" : ""} aria-pressed={current === o.value} onClick={() => answer(o.value)}>
                <kbd>{hotkeyLabel(i)}</kbd> {o.label}
              </button>
            ))}
            {prompt.other && (
              <button className={current === OTHER ? "chosen" : ""} aria-pressed={current === OTHER} onClick={() => answer(OTHER)}>
                <kbd>{hotkeyLabel(prompt.options.length)}</kbd> {prompt.other.label}
              </button>
            )}
          </div>
          {prompt.other && current === OTHER && (
            <label className="comment-field">
              {prompt.other.commentPrompt}
              <textarea
                value={String(member.attributes[prompt.other.commentVariable] ?? "")}
                onChange={(e) => actions.setAttribute(member.id, prompt.other!.commentVariable, e.target.value)}
              />
            </label>
          )}
          <div className="person-nav">
            <button onClick={() => setIndex(index - 1)} disabled={index === 0}>
              ← Vorige persoon
            </button>
            <button onClick={() => setIndex(index + 1)} disabled={index >= network.members.length - 1}>
              Volgende persoon →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
