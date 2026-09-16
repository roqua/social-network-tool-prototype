// PROTOTYPE of the social network interview tool for the EPD.
// Three variants of the "sort members into columns" stages, switchable via
// ?variant=A|B|C and the floating bar. Name entry and the sociogram have one
// design each. All state lives in memory; reloading the page starts over.

import { useState } from "react";
import { stages, type Stage } from "./protocol";
import { demoNetwork, emptyNetwork, stageProgress, tieKey, type AttributeValue, type Network } from "./network";
import { useSearchParam } from "./useSearchParam";
import { PrototypeSwitcher } from "./PrototypeSwitcher";
import { NameGenerator } from "./stages/NameGenerator";
import { BinStage, binVariants } from "./stages/BinStage";
import { Sociogram } from "./stages/Sociogram";

export type NetworkActions = {
  addMember: (name: string) => void;
  renameMember: (id: string, name: string) => void;
  removeMember: (id: string) => void;
  setAttribute: (id: string, variable: string, value: AttributeValue | undefined) => void;
  setPosition: (id: string, position: { x: number; y: number } | undefined) => void;
  toggleTie: (a: string, b: string) => void;
};

export function Interview() {
  const [network, setNetwork] = useState<Network>(emptyNetwork);
  const [stageParam, setStageParam] = useSearchParam("stage", "0");
  const [variant, setVariant] = useSearchParam("variant", "A");
  const stageIndex = Math.min(Math.max(0, Number(stageParam) || 0), stages.length - 1);
  const stage: Stage = stages[stageIndex]!;

  const update = (fn: (n: Network) => Network) => setNetwork(fn);
  const updateMember = (id: string, fn: (m: Network["members"][number]) => Network["members"][number]) =>
    update((n) => ({ ...n, members: n.members.map((m) => (m.id === id ? fn(m) : m)) }));

  const actions: NetworkActions = {
    addMember: (name) =>
      update((n) => ({
        ...n,
        members: [...n.members, { id: `m${Date.now().toString(36)}${n.members.length}`, name, attributes: {} }],
      })),
    renameMember: (id, name) => updateMember(id, (m) => ({ ...m, name })),
    removeMember: (id) =>
      update((n) => ({
        members: n.members.filter((m) => m.id !== id),
        ties: n.ties.filter((t) => t.from !== id && t.to !== id),
      })),
    setAttribute: (id, variable, value) =>
      updateMember(id, (m) => {
        const attributes = { ...m.attributes };
        if (value === undefined) delete attributes[variable];
        else attributes[variable] = value;
        return { ...m, attributes };
      }),
    setPosition: (id, position) => updateMember(id, (m) => ({ ...m, position })),
    toggleTie: (a, b) =>
      update((n) => {
        const key = tieKey(a, b);
        const exists = n.ties.some((t) => tieKey(t.from, t.to) === key);
        return { ...n, ties: exists ? n.ties.filter((t) => tieKey(t.from, t.to) !== key) : [...n.ties, { from: a, to: b }] };
      }),
  };

  const goTo = (i: number) => setStageParam(String(Math.min(Math.max(0, i), stages.length - 1)));

  return (
    <div className="shell">
      <nav className="sidebar" aria-label="Interviewstappen">
        <h1>Sociaal netwerk</h1>
        <ol>
          {stages.map((s, i) => {
            const { done, total } = stageProgress(network, s);
            return (
              <li key={s.id} className={i === stageIndex ? "current" : ""}>
                <button onClick={() => goTo(i)}>
                  <span className="step-label">{s.label}</span>
                  {s.type !== "names" && total > 0 && (
                    <span className={`step-progress ${done === total ? "complete" : ""}`}>
                      {done}/{total}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
        <details className="state-panel">
          <summary>Data ({network.members.length} personen, {network.ties.length} verbindingen)</summary>
          <pre>{JSON.stringify(network, null, 1)}</pre>
        </details>
        <a className="sidebar-link" href="/vragen" target="_blank" rel="noreferrer">
          Open vragen voor de onderzoeker →
        </a>
      </nav>

      <main className="stage">
        {stage.type === "names" && (
          <NameGenerator
            stage={stage}
            network={network}
            actions={actions}
            onLoadDemo={() => setNetwork(demoNetwork)}
          />
        )}
        {stage.type === "bins" && <BinStage key={stage.id} stage={stage} network={network} actions={actions} variant={variant} />}
        {stage.type === "sociogram" && <Sociogram stage={stage} network={network} actions={actions} />}

        <footer className="stage-nav">
          <button onClick={() => goTo(stageIndex - 1)} disabled={stageIndex === 0}>
            ← Vorige
          </button>
          <span>
            Stap {stageIndex + 1} van {stages.length}
          </span>
          {stageIndex < stages.length - 1 ? (
            <button className="primary" onClick={() => goTo(stageIndex + 1)} disabled={network.members.length === 0}>
              Volgende →
            </button>
          ) : (
            <button className="primary" onClick={() => alert("Prototype: hier zou het netwerk opgeslagen worden.")}>
              Afronden
            </button>
          )}
        </footer>
      </main>

      <PrototypeSwitcher variants={binVariants} current={variant} onChange={setVariant} />
    </div>
  );
}
