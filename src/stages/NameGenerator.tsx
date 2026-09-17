import { useState, type DragEvent } from "react";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
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
  const [dragOver, setDragOver] = useState<number | null>(null);

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
        <>
          <p className="hint">In deze volgorde komen de personen in de volgende stappen aan de beurt. Sleep of gebruik de pijltjes om de volgorde aan te passen.</p>
          <ol className="member-list">
            {network.members.map((m, i) => (
              <li
                key={m.id}
                className={dragOver === i ? "drag-over" : ""}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", m.id)}
                onDragOver={(e: DragEvent) => {
                  e.preventDefault();
                  setDragOver(i);
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e: DragEvent) => {
                  e.preventDefault();
                  setDragOver(null);
                  actions.moveMember(e.dataTransfer.getData("text/plain"), i);
                }}
              >
                <GripVertical size={16} className="grip" aria-hidden />
                <span className="member-index">{i + 1}</span>
                <input value={m.name} onChange={(e) => actions.renameMember(m.id, e.target.value)} aria-label="Naam" />
                <button className="icon" onClick={() => actions.moveMember(m.id, i - 1)} disabled={i === 0} aria-label={`${m.name} omhoog`}>
                  <ChevronUp size={16} />
                </button>
                <button
                  className="icon"
                  onClick={() => actions.moveMember(m.id, i + 1)}
                  disabled={i === network.members.length - 1}
                  aria-label={`${m.name} omlaag`}
                >
                  <ChevronDown size={16} />
                </button>
                <button className="icon" onClick={() => actions.removeMember(m.id)} aria-label={`${m.name} verwijderen`}>
                  ✕
                </button>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
