import "./index.css";
import { useState } from "react";
import { EpdLayout } from "./epd-layout/EpdLayout";
import { Interview } from "./Interview";
import { NetworkIndex } from "./NetworkIndex";
import { NewNetwork } from "./NewNetwork";
import { OpenQuestions } from "./OpenQuestions";
import { demoNetworks } from "./demo";
import type { SocialNetwork } from "./network";
import { Link, usePathname } from "./navigation";

// No router: the pathname picks the page. Vercel rewrites every path to
// index.html. The dossier's networks live here, in memory only.
export function App() {
  const [networks, setNetworks] = useState<SocialNetwork[]>(demoNetworks);
  const pathname = usePathname();

  const updateNetwork = (id: string, fn: (n: SocialNetwork) => SocialNetwork) =>
    setNetworks((all) => all.map((n) => (n.id === id ? fn(n) : n)));

  let page;
  if (pathname === "/vragen") {
    page = <OpenQuestions />;
  } else if (pathname === "/nieuw") {
    const sourceId = new URLSearchParams(window.location.search).get("van");
    page = (
      <NewNetwork
        key={sourceId}
        source={networks.find((n) => n.id === sourceId)}
        onCreate={(network) => setNetworks((all) => [...all, network])}
      />
    );
  } else if (pathname.startsWith("/netwerk/")) {
    const id = pathname.slice("/netwerk/".length);
    const network = networks.find((n) => n.id === id);
    page = network ? (
      <Interview key={id} network={network} onChange={(fn) => updateNetwork(id, fn)} />
    ) : (
      <main className="index">
        <p>Dit netwerk bestaat niet (meer). De prototype-data gaat verloren bij het herladen van de pagina.</p>
        <Link to="/">← Alle netwerken</Link>
      </main>
    );
  } else {
    page = <NetworkIndex networks={networks} onChange={updateNetwork} />;
  }

  return <EpdLayout>{page}</EpdLayout>;
}

export default App;
