// Dummy data for the prototype: what the index page shows on load. Nothing
// is persisted; reloading brings this back.

import { stages } from "./protocol";
import type { Member, SocialNetwork, Tie } from "./network";

export const exampleNames = ["Henk", "Tom", "Dennis", "Marie", "Herman"];

export function membersFromNames(names: string[]): Member[] {
  return names.map((name) => ({ id: name.toLowerCase(), name, attributes: {} }));
}

// A fully answered network: every question answered with a deterministic
// spread over the options, everyone placed on a circle. `seed` shifts the
// answers so two networks of the same people look different.
function answeredMembers(names: string[], seed: number): Member[] {
  const prompts = stages.flatMap((s) => (s.type === "bins" ? [s.prompt] : []));
  return membersFromNames(names).map((member, i) => {
    const attributes = Object.fromEntries(
      prompts.map((p, j) => [p.variable, p.options[(i * 3 + j + seed) % p.options.length]!.value]),
    );
    const angle = (i / names.length) * 2 * Math.PI - Math.PI / 2;
    const position = { x: 0.5 + 0.35 * Math.cos(angle), y: 0.5 + 0.38 * Math.sin(angle) };
    return { ...member, attributes, position };
  });
}

const ties = (pairs: [string, string][]): Tie[] => pairs.map(([from, to]) => ({ from, to }));

export const demoNetworks: SocialNetwork[] = [
  {
    id: "intake",
    name: "Intake",
    status: "final",
    createdAt: "2026-03-12T10:00:00",
    finalizedAt: "2026-03-12T11:20:00",
    members: answeredMembers(exampleNames, 0),
    ties: ties([
      ["henk", "marie"],
      ["marie", "herman"],
      ["tom", "dennis"],
    ]),
  },
  {
    id: "evaluatie-3-maanden",
    name: "Evaluatie na 3 maanden",
    status: "final",
    createdAt: "2026-06-18T14:00:00",
    finalizedAt: "2026-06-18T15:05:00",
    // Tom has dropped out and Fatima has joined; the others keep their ids
    // from the intake, so they are the same people over time.
    members: answeredMembers(["Henk", "Dennis", "Marie", "Herman", "Fatima"], 2),
    ties: ties([
      ["henk", "marie"],
      ["marie", "herman"],
      ["marie", "fatima"],
    ]),
  },
  {
    id: "evaluatie-6-maanden",
    name: "Evaluatie na 6 maanden",
    status: "draft",
    createdAt: "2026-09-15T09:30:00",
    members: membersFromNames(exampleNames),
    ties: [],
  },
];
