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

export const emptyNetwork: Network = { members: [], ties: [] };

export const demoNetwork: Network = {
  members: ["Henk", "Tom", "Dennis", "Marie", "Herman"].map((name) => ({
    id: name.toLowerCase(),
    name,
    attributes: {},
  })),
  ties: [],
};

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
