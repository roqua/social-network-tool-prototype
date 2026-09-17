import type { Prompt, Stage } from "./protocol";

// The value of an "other" bin. Everything else is the numeric option value.
export const OTHER = "other";
export type AttributeValue = number | typeof OTHER | string;

export type Member = {
  id: string;
  name: string;
  attributes: Record<string, AttributeValue>;
  // Sociogram position, normalised to 0..1 of the canvas so it survives resizing.
  position?: { x: number; y: number };
};

export type Tie = { from: string; to: string };

export type Network = { members: Member[]; ties: Tie[] };

// One inventory of the client's network, as listed on the index page. It
// stays editable until it is marked final; a final network is read-only and
// is what Petra offers to choose from. To change a final network, duplicate
// it into a new draft.
export type SocialNetwork = Network & {
  id: string;
  name: string;
  status: "draft" | "final";
  createdAt: string;
  finalizedAt?: string;
};

export function createNetwork(name: string): SocialNetwork {
  return { id: `n${Date.now().toString(36)}`, name, status: "draft", createdAt: new Date().toISOString(), members: [], ties: [] };
}

// Members keep their id in the copy, so the same person can be followed
// across successive networks of one dossier.
export function duplicateNetwork(source: SocialNetwork, name: string): SocialNetwork {
  return { ...createNetwork(name), members: structuredClone(source.members), ties: structuredClone(source.ties) };
}

export function finalizeNetwork(network: SocialNetwork): SocialNetwork {
  return { ...network, status: "final", finalizedAt: new Date().toISOString() };
}

export function hasAnswer(member: Member, prompt: Prompt): boolean {
  return member.attributes[prompt.variable] !== undefined;
}

// How many (member, prompt) pairs of a stage are answered, for progress display.
export function stageProgress(network: Network, stage: Stage): { done: number; total: number } {
  const n = network.members.length;
  switch (stage.type) {
    case "names":
      return { done: n, total: n };
    case "bins":
      return { done: network.members.filter((m) => hasAnswer(m, stage.prompt)).length, total: n };
    case "sociogram":
      return { done: network.members.filter((m) => m.position).length, total: n };
  }
}

export function tieKey(a: string, b: string): string {
  return [a, b].sort().join("|");
}

export function hasTie(network: Network, a: string, b: string): boolean {
  return network.ties.some((t) => tieKey(t.from, t.to) === tieKey(a, b));
}
