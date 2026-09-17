// First step of creating a network: give it a name. The name is what the
// professional sees on the index and what Petra shows when picking a network.
// Duplicating a final network goes through here too, with `source` set.

import { useState } from "react";
import { createNetwork, duplicateNetwork, type SocialNetwork } from "./network";
import { Link, navigate } from "./navigation";

export function NewNetwork({
  source,
  onCreate,
}: {
  source?: SocialNetwork;
  onCreate: (network: SocialNetwork) => void;
}) {
  const [name, setName] = useState(source ? `Kopie van ${source.name}` : "");

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const network = source ? duplicateNetwork(source, trimmed) : createNetwork(trimmed);
    onCreate(network);
    navigate(`/netwerk/${network.id}`);
  };

  return (
    <main className="new-network">
      <Link to="/" className="back">
        ← Alle netwerken
      </Link>
      <h1>{source ? "Netwerk dupliceren" : "Nieuw netwerk"}</h1>
      {source ? (
        <p className="hint">
          De {source.members.length} personen en {source.ties.length} verbindingen van “{source.name}” worden overgenomen
          in een nieuw netwerk dat je kunt bewerken.
        </p>
      ) : (
        <p className="hint">
          Geef het netwerk een naam waaraan je het later herkent, bijvoorbeeld het moment in de behandeling. Deze naam zie
          je ook terug in Petra.
        </p>
      )}
      <form
        className="name-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="bijv. Intake of Evaluatie na 3 maanden"
          aria-label="Naam van het netwerk"
        />
        <button type="submit" className="primary" disabled={!name.trim()}>
          {source ? "Dupliceren" : "Aanmaken"}
        </button>
      </form>
    </main>
  );
}
