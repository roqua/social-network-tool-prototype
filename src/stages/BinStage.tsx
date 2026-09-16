import type { Stage } from "../protocol";
import type { Network } from "../network";
import type { NetworkActions } from "../Interview";

export type BinStageProps = {
  stage: Extract<Stage, { type: "bins" }>;
  network: Network;
  actions: NetworkActions;
};
