// The interview stages, ported from the researcher's Network Canvas protocol
// (docs/Case studies network survey (1).netcanvas, schema version 5). Network
// Canvas groups several prompts into one stage; here every prompt is its own
// step so the flow is strictly linear.
// Variable names and option values match the codebook there, so the data
// this prototype produces lines up with what the researcher has seen before.

import { OTHER } from "./network";

// color is only needed on a question other steps colour people by.
export type Option = { value: number; label: string; color?: string };

export type Prompt = {
  variable: string;
  text: string;
  options: Option[];
  // Network Canvas' "other" bin: an extra category that asks for a free-text
  // comment stored in a second variable.
  other?: { label: string; color?: string; commentVariable: string; commentPrompt: string };
};

// Every stage can carry a longer instruction text under the question, for
// explanation that doesn't fit in the question itself. Blank lines separate
// paragraphs.
// colorBy names a variable asked on an earlier bins stage; people are
// coloured by their answer to it.
type StageBase = { id: string; label: string; instructions?: string; colorBy?: string };

export type Stage =
  | (StageBase & { type: "names"; prompt: string; maxMembers: number })
  | (StageBase & { type: "bins"; prompt: Prompt })
  | (StageBase & { type: "sociogram"; prompt: string });

// The bins of a prompt: its options in order, then the "other" bin if it has one.
export function binsOf(prompt: Prompt): { value: number | typeof OTHER; label: string; color?: string }[] {
  const { other } = prompt;
  return [...prompt.options, ...(other ? [{ value: OTHER as typeof OTHER, label: other.label, color: other.color }] : [])];
}

const frequencyOptions: Option[] = [
  { value: 0, label: "Nooit" },
  { value: 1, label: "Zelden" },
  { value: 2, label: "Soms" },
  { value: 3, label: "Vaak" },
  { value: 4, label: "Bijna altijd" },
];

const contactFrequencyOptions: Option[] = [
  { value: 0, label: "< 1 keer per maand" },
  { value: 1, label: "+/- 1 keer per maand" },
  { value: 2, label: "Paar keer per maand" },
  { value: 3, label: "Paar keer per week" },
  { value: 4, label: "Dagelijks" },
];

export const stages: Stage[] = [
  {
    id: "names",
    type: "names",
    label: "Netwerkleden",
    prompt:
      "Benoem de belangrijkste mensen in je leven. Denk aan mensen met wie je regelmatig contact hebt en ook aan mensen waarmee je dat niet hebt, maar met wie je wel contact zou kunnen opnemen.",
    maxMembers: 25,
  },
  {
    id: "relationship",
    type: "bins",
    label: "Relatie",
    prompt: {
      variable: "relationship",
      text: "Wat is je relatie met deze persoon?",
      // The researcher's colour scheme: shades of blue for family, red to
      // yellow from partner to care professional, neutral for anything else.
      options: [
        { value: 0, label: "kind", color: "#264B9A" },
        { value: 1, label: "partner", color: "#A50026" },
        { value: 2, label: "ouder", color: "#4A7BB7" },
        { value: 3, label: "broer of zus", color: "#6EA6CD" },
        { value: 4, label: "ander familielid", color: "#98CAE1" },
        { value: 5, label: "vriend", color: "#DD3D2D" },
        { value: 6, label: "collega", color: "#FDB366" },
        { value: 7, label: "kennis", color: "#F67E4B" },
        { value: 8, label: "begeleider / behandelaar", color: "#FEDA8B" },
      ],
      other: {
        label: "Anders ...",
        color: "#EAECCC",
        commentVariable: "comment",
        commentPrompt: "Wil je een opmerking toevoegen aan deze persoon?",
      },
    },
  },
  {
    id: "duration",
    type: "bins",
    label: "Duur van de relatie",
    colorBy: "relationship",
    prompt: {
      variable: "relationship_duration",
      text: "Hoe lang kennen jullie elkaar al?",
      options: [
        { value: 0, label: "Minder dan 1 jaar" },
        { value: 1, label: "Tussen 1 en 5 jaar" },
        { value: 2, label: "Meer dan 5 jaar" },
      ],
    },
  },
  {
    id: "contact_f2f",
    type: "bins",
    label: "Face-to-face contact",
    colorBy: "relationship",
    prompt: {
      variable: "contact_freq_f2f",
      text: "Hoe vaak heb je face to face contact met deze persoon?",
      options: contactFrequencyOptions,
    },
  },
  {
    id: "contact_digital",
    type: "bins",
    label: "Digitaal contact",
    colorBy: "relationship",
    prompt: {
      variable: "contact_freq_digital",
      text: "Hoe vaak heb je via digitale apparaten contact met deze persoon?",
      options: contactFrequencyOptions,
    },
  },
  {
    id: "discuss_personal",
    type: "bins",
    label: "Persoonlijke zaken",
    colorBy: "relationship",
    prompt: {
      variable: "discuss_personal",
      text: "Ik bespreek persoonlijke zaken met deze persoon.",
      options: frequencyOptions,
    },
  },
  {
    id: "emotional_support",
    type: "bins",
    label: "Emotionele steun",
    colorBy: "relationship",
    prompt: {
      variable: "emotional_support",
      text: "Deze persoon ondersteunt me wanneer ik emotionele steun nodig heb (bijv. troost, sympathie en aanmoediging).",
      // The codebook numbers this one 1-5 where every other frequency scale
      // is 0-4. Preserved as-is; worth confirming with the researcher.
      options: frequencyOptions.map((o) => ({ ...o, value: o.value + 1 })),
    },
  },
  {
    id: "be_myself",
    type: "bins",
    label: "Mezelf zijn",
    colorBy: "relationship",
    prompt: {
      variable: "be_myself",
      text: "Ik kan mezelf zijn bij deze persoon.",
      options: frequencyOptions,
    },
  },
  {
    id: "energy_cost",
    type: "bins",
    label: "Kost energie",
    colorBy: "relationship",
    prompt: {
      variable: "energy_cost",
      text: "Tijd doorbrengen met deze persoon kost me energie.",
      options: frequencyOptions,
    },
  },
  {
    id: "energy_give",
    type: "bins",
    label: "Geeft energie",
    colorBy: "relationship",
    prompt: {
      variable: "energy_give",
      text: "Tijd doorbrengen met deze persoon geeft me energie.",
      options: frequencyOptions,
    },
  },
  {
    id: "material",
    type: "bins",
    label: "Praktische steun",
    colorBy: "relationship",
    prompt: {
      variable: "material_support",
      text: "Deze persoon geeft mij praktische of materiële ondersteuning.",
      options: [
        { value: 1, label: "Ja" },
        { value: 0, label: "Nee" },
      ],
    },
  },
  {
    id: "connections",
    type: "sociogram",
    label: "Verbindingen",
    colorBy: "relationship",
    prompt: "Wie heeft contact met wie?",
    // Draft wording, to be replaced by the researcher's (see /vragen).
    instructions:
      "Zet alle personen in het veld. Zet mensen die veel met elkaar te maken hebben dicht bij elkaar, en mensen die weinig met elkaar te maken hebben verder uit elkaar.\n\nTrek daarna een lijn tussen twee personen als zij contact met elkaar hebben, ook als jij daar niet bij bent.",
  },
];

// The bins stage that asks a variable, so other stages can refer to its answers.
export function stageAsking(variable: string): Extract<Stage, { type: "bins" }> | undefined {
  return stages.find((s): s is Extract<Stage, { type: "bins" }> => s.type === "bins" && s.prompt.variable === variable);
}
