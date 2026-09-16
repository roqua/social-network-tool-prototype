// Variant C: data-entry grid. Every person is a row, every option a column.
// Dense, fully keyboard-operable, no gestures.
import { OTHER } from "../network";
import type { BinStageProps } from "./BinStage";

export function BinMatrix({ stage, network, actions }: BinStageProps) {
  const { prompt } = stage;
  return (
    <section className="matrix">
      <p className="prompt">{prompt.text}</p>
      <table>
        <thead>
          <tr>
            <th scope="col">Persoon</th>
            {prompt.options.map((o) => (
              <th key={o.value} scope="col">
                {o.label}
              </th>
            ))}
            {prompt.other && <th scope="col">{prompt.other.label}</th>}
          </tr>
        </thead>
        <tbody>
          {network.members.map((m) => {
            const current = m.attributes[prompt.variable];
            const radio = (value: number | typeof OTHER) => (
              <input
                type="radio"
                name={`${prompt.variable}-${m.id}`}
                checked={current === value}
                onChange={() => actions.setAttribute(m.id, prompt.variable, value)}
                aria-label={`${m.name}: ${value === OTHER ? prompt.other?.label : prompt.options.find((o) => o.value === value)?.label}`}
              />
            );
            return (
              <tr key={m.id} className={current === undefined ? "unanswered" : ""}>
                <th scope="row">
                  {m.name}
                  {prompt.other && current === OTHER && (
                    <input
                      className="comment"
                      placeholder={prompt.other.commentPrompt}
                      value={String(m.attributes[prompt.other.commentVariable] ?? "")}
                      onChange={(e) => actions.setAttribute(m.id, prompt.other!.commentVariable, e.target.value)}
                    />
                  )}
                </th>
                {prompt.options.map((o) => (
                  <td key={o.value}>{radio(o.value)}</td>
                ))}
                {prompt.other && <td>{radio(OTHER)}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
