import { encounterId } from "@/modules/campaign/domain/encounters.type";
import { questId, questStepId } from "@/modules/campaign/domain/quests.type";
import { sceneId } from "@/modules/campaign/domain/scenes.type";

export const QUEST_3_IRONHOLD_SUMP = {
	id: questId("ironhold_sump"),
	encounters: {
		giant_toad: encounterId("giant_toad"),
		riverbend_village: encounterId("riverbend_village"),
	},
	scenes: {
		intro: sceneId("ironhold_sump_intro"),
		victory: sceneId("ironhold_sump_victory"),
	},
	steps: {
		investigate: questStepId("sump_investigate"),
		resolved: questStepId("sump_resolved"),
	},
} as const;

// Stubs for the branching quests
export const QUEST_4A_SMUGGLER_DEN = {
	id: questId("smuggler_den"),
	steps: { find_cove: questStepId("find_cove") },
} as const;

export const QUEST_4B_ZOMBIE_RIVERBEND = {
	id: questId("zombie_riverbend"),
	steps: { travel_to_village: questStepId("travel_to_village") },
} as const;
