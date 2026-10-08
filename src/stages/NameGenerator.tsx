import { useState } from "react";
import type { Stage } from "../protocol";
import { isNameTaken, type Network } from "../network";
import type { NetworkActions } from "../Interview";
import { Instructions } from "../Instructions";

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

  const draftTaken = isNameTaken(network, draft);
  const full = network.members.length >= stage.maxMembers;

  const add = () => {
    const name = draft.trim();
    if (!name || draftTaken || full) return;
    actions.addMember(name);
    setDraft("");
  };

  return (
    <section>
      <p className="prompt">{stage.prompt}</p>
      <Instructions stage={stage} />

      <div className="name-field">
        <label htmlFor="member-name" className="name-label">
          Naam of omschrijving
        </label>
        <p id="member-name-hint" className="hint">
          Bijv. 'Henk' of 'buurvrouw'
        </p>
        <form
          className="name-form"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <input
            id="member-name"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-describedby="member-name-hint"
            aria-invalid={draftTaken}
            disabled={full}
          />
          <button type="submit" className="primary" disabled={!draft.trim() || draftTaken || full}>
            Toevoegen
          </button>
        </form>
      </div>
      {draftTaken && <DuplicateHint />}
      {full && <p className="hint">Het maximum van {stage.maxMembers} personen is bereikt.</p>}

      {network.members.length === 0 ? (
        <p className="hint">
          Nog geen personen.{" "}
          <button className="link" onClick={onLoadDemo}>
            Voorbeeldnamen laden
          </button>{" "}
          om snel door te klikken.
        </p>
      ) : (
        <>
          {/* Newest on top, right under the input, so the client sees what they just added. */}
          <ul className="member-list">
            {network.members.toReversed().map((m) => (
              <li key={m.id}>
                <input
                  value={m.name}
                  onChange={(e) => actions.renameMember(m.id, e.target.value)}
                  aria-label="Naam"
                  aria-invalid={isNameTaken(network, m.name, m.id)}
                />
                <button className="icon" onClick={() => actions.removeMember(m.id)} aria-label={`${m.name} verwijderen`}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
          {network.members.some((m) => isNameTaken(network, m.name, m.id)) && <DuplicateHint />}
        </>
      )}
    </section>
  );
}

function DuplicateHint() {
  return <p className="error">Deze naam staat er al. Maak hem uniek, bijv. 'Henk (werk)' en 'Henk (buurman)'.</p>;
}
