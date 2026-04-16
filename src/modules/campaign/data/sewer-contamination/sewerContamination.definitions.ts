import { encounterId } from "@/modules/campaign/domain/encounters.type";
import { questId, questStepId } from "@/modules/campaign/domain/quests.type";
import { sceneId } from "@/modules/campaign/domain/scenes.type";

export const SEWER_CONTAMINATION = {
	id: questId("ironhold_sump"),
	encounters: {
		giant_toad: encounterId("giant_toad"),
		riverbend_village: encounterId("riverbend_village"),
		sump_watcher: encounterId("sump_watcher"),
	},
	scenes: {
		intro: sceneId("ironhold_sump_intro"),
		victory: sceneId("ironhold_sump_victory"),
		riverbend_arrival: sceneId("riverbend_arrival"),
	},
	steps: {
		investigate: questStepId("sump_investigate"),
		find_cove: questStepId("find_cove"),
		travel_to_village: questStepId("travel_to_village"),
	},
} as const;
