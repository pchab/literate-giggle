import { encounterId } from "@/modules/campaign/domain/encounters.type";
import { questId, questStepId } from "@/modules/campaign/domain/quests.type";
import { sceneId } from "@/modules/campaign/domain/scenes.type";

export const THE_ALCHEMISTS_LEDGER = {
	id: questId("the_alchemists_ledger"),
	steps: {
		track_goblins: questStepId("track_goblins"),
		infiltrate_lab: questStepId("infiltrate_lab"),
		confront_barnaby: questStepId("confront_barnaby"),
	},
	scenes: {
		intro: sceneId("alchemist_intro"),
		cache: sceneId("alchemist_cache"),
		betrayal: sceneId("alchemist_betrayal"),
	},
	encounters: {
		goblin_lab: encounterId("goblin_lab"),
		mutated_barnaby: encounterId("mutated_barnaby"), // For the next questline hook
	},
} as const;
