import type { Stage } from "../protocol";
import type { Network } from "../network";
import type { NetworkActions } from "../Interview";
import { BinDragColumns } from "./BinDragColumns";
import { BinOnePerson } from "./BinOnePerson";
import { BinMatrix } from "./BinMatrix";

export type BinStageProps = {
  stage: Extract<Stage, { type: "bins" }>;
  network: Network;
  actions: NetworkActions;
};

export const binVariants = [
  { key: "A", name: "Slepen in kolommen (Network Canvas)" },
  { key: "B", name: "Eén persoon tegelijk" },
  { key: "C", name: "Tabel: alle personen, alle antwoorden" },
];

export function BinStage({ variant, ...props }: BinStageProps & { variant: string }) {
  if (variant === "B") return <BinOnePerson {...props} />;
  if (variant === "C") return <BinMatrix {...props} />;
  return <BinDragColumns {...props} />;
}
