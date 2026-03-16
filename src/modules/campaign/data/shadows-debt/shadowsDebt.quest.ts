import { townLocationId } from "@/modules/towns/domain/towns.type";
import { mapNodeId } from "@/modules/world/domain/map.types";
import type { Quest } from "../../domain/quests.type";
import { SHADOWS_DEBT } from "./shadowsDebt.definitions";

export const SHADOWS_DEBT_QUEST: Quest = {
  id: SHADOWS_DEBT.id,
  title: "The Shadow's Debt",
  loreDescription:
    "Captain Vane needs a brave soul to recover a stolen relic from the gut of a Briar Wolf in the deep forest.",
  initialStepId: SHADOWS_DEBT.steps.speak_to_vane,
  steps: {
    [SHADOWS_DEBT.steps.speak_to_vane]: {
      id: SHADOWS_DEBT.steps.speak_to_vane,
      logDescription: "Talk to Captain Vane at the Oakhaven Docks.",
      targetNodeId: [
        {
          mapNodeId: mapNodeId("port_city"),
          locationId: townLocationId("port_city_ship"),
        },
      ],
      onEnterSceneId: SHADOWS_DEBT.scenes.vane_intro,
    },
    [SHADOWS_DEBT.steps.hunt_the_wolf]: {
      id: SHADOWS_DEBT.steps.hunt_the_wolf,
      logDescription: "Track the Briar Wolf in the Whispering Woods.",
      targetNodeId: [{ mapNodeId: mapNodeId("whispering_woods") }],
      onEnterSceneId: SHADOWS_DEBT.scenes.wolf_ambush,
    },
    [SHADOWS_DEBT.steps.report_to_vane]: {
      id: SHADOWS_DEBT.steps.report_to_vane,
      logDescription: "Bring the relic back to Captain Vane.",
      targetNodeId: [
        {
          mapNodeId: mapNodeId("port_city"),
          locationId: townLocationId("port_city_ship"),
        },
      ],
      onEnterSceneId: SHADOWS_DEBT.scenes.report_to_vane,
    },
  },
};
