// The interview stages, ported from the researcher's Network Canvas protocol
// (docs/Case studies network survey (1).netcanvas, schema version 5). Network
// Canvas groups several prompts into one stage; here every prompt is its own
// step so the flow is strictly linear.
// Variable names and option values match the codebook there, so the data
// this prototype produces lines up with what the researcher has seen before.

export type Option = { value: number; label: string };

export type Prompt = {
  variable: string;
  text: string;
  options: Option[];
  // Network Canvas' "other" bin: an extra category that asks for a free-text
  // comment stored in a second variable.
  other?: { label: string; commentVariable: string; commentPrompt: string };
};

export type Stage =
  | { id: string; type: "names"; label: string; prompt: string }
  | { id: string; type: "bins"; label: string; prompt: Prompt }
  | { id: string; type: "sociogram"; label: string; prompt: string };

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
  },
  {
    id: "relationship",
    type: "bins",
    label: "Relatie",
    prompt: {
      variable: "relationship",
      text: "Wat is je relatie met deze persoon?",
      options: [
        { value: 0, label: "kind" },
        { value: 1, label: "partner" },
        { value: 2, label: "ouder" },
        { value: 3, label: "broer of zus" },
        { value: 4, label: "ander familielid" },
        { value: 5, label: "vriend" },
        { value: 6, label: "collega" },
        { value: 7, label: "kennis" },
        { value: 8, label: "begeleider / behandelaar" },
      ],
      other: {
        label: "Anders ...",
        commentVariable: "comment",
        commentPrompt: "Wil je een opmerking toevoegen aan deze persoon?",
      },
    },
  },
  {
    id: "duration",
    type: "bins",
    label: "Duur van de relatie",
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
    prompt: "Wie heeft contact met wie?",
  },
];
