import { useState } from "react";
import type { Stage } from "../protocol";
import type { Network } from "../network";
import type { NetworkActions } from "../Interview";

export function NameGenerator({
  stage,
  network,
  actions,
  onLoadDemo,
}: {
  stage: Extract<Stage, { type: "names" }>;
  network: Network;
  actions: NetworkActions;
  onLoadDemo: () => void;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const name = draft.trim();
    if (!name) return;
    actions.addMember(name);
    setDraft("");
  };

  return (
    <section>
      <p className="prompt">{stage.prompt}</p>

      <form
        className="name-form"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Naam of omschrijving, bijv. 'Henk' of 'buurvrouw'"
          aria-label="Naam van netwerklid"
        />
        <button type="submit" className="primary" disabled={!draft.trim()}>
          Toevoegen
        </button>
      </form>

      {network.members.length === 0 ? (
        <p className="hint">
          Nog geen personen.{" "}
          <button className="link" onClick={onLoadDemo}>
            Voorbeeldnamen laden
          </button>{" "}
          om snel door te klikken.
        </p>
      ) : (
        <ul className="member-list">
          {network.members.map((m) => (
            <li key={m.id}>
              <input value={m.name} onChange={(e) => actions.renameMember(m.id, e.target.value)} aria-label="Naam" />
              <button className="icon" onClick={() => actions.removeMember(m.id)} aria-label={`${m.name} verwijderen`}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
