// Index page: the dossier's social networks. Drafts can be edited or made
// final; final networks are read-only and can be duplicated into a new draft.

import { finalizeNetwork, type SocialNetwork } from "./network";
import { Link, navigate } from "./navigation";

export function NetworkIndex({
  networks,
  onChange,
}: {
  networks: SocialNetwork[];
  onChange: (id: string, fn: (n: SocialNetwork) => SocialNetwork) => void;
}) {
  const finalize = (network: SocialNetwork) => {
    const ok = confirm(
      `"${network.name}" definitief maken?\n\nEen definitief netwerk kan niet meer gewijzigd worden en kan in Petra gekozen worden. Wil je later verder werken, dan dupliceer je het.`,
    );
    if (ok) onChange(network.id, finalizeNetwork);
  };

  return (
    <main className="index">
      <header className="index-header">
        <div>
          <h1>Sociale netwerken</h1>
          <p className="hint">
            Een netwerk blijft te bewerken tot het definitief is. Definitieve netwerken zijn te kiezen in Petra en
            kunnen alleen nog gedupliceerd worden.
          </p>
        </div>
        <button className="primary" onClick={() => navigate("/nieuw")}>
          Nieuw netwerk
        </button>
      </header>

      {networks.length === 0 ? (
        <p className="hint">Nog geen netwerken in dit dossier.</p>
      ) : (
        <table className="network-table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>Status</th>
              <th>Personen</th>
              <th>Aangemaakt</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {networks.map((n) => (
              <tr key={n.id}>
                <td>
                  <Link to={`/netwerk/${n.id}`}>{n.name}</Link>
                </td>
                <td>
                  <StatusBadge network={n} />
                </td>
                <td>{n.members.length}</td>
                <td>{formatDate(n.createdAt)}</td>
                <td className="actions">
                  {n.status === "draft" ? (
                    <>
                      <button onClick={() => navigate(`/netwerk/${n.id}`)}>Bewerken</button>
                      <button onClick={() => finalize(n)}>Definitief maken</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => navigate(`/netwerk/${n.id}`)}>Bekijken</button>
                      <button onClick={() => navigate(`/nieuw?van=${n.id}`)}>Dupliceren</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

export function StatusBadge({ network }: { network: SocialNetwork }) {
  return network.status === "final" ? (
    <span className="badge final" title={`Definitief sinds ${formatDate(network.finalizedAt!)}`}>
      Definitief
    </span>
  ) : (
    <span className="badge draft">Concept</span>
  );
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}
