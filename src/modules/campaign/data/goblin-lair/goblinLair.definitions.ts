import { encounterId } from "../../domain/encounters.type";
import { questId, questStepId } from "../../domain/quests.type";
import { sceneId } from "../../domain/scenes.type";

export const GOBLIN_LAIR = {
	id: questId("goblin_lair"),
	steps: {
		bring_back_ledger: questStepId("bring_back_ledger"),
		find_the_goblin_lair: questStepId("find_the_goblin_lair"),
		free_the_slaves: questStepId("free_the_slaves"),
		bring_back_goods: questStepId("bring_back_goods"),
		confront_merchant: questStepId("confront_merchant"),
	},
	scenes: {
		goblin_loot: sceneId("goblin_loot"),
		meet_merchant: sceneId("meet_merchant"),
		find_goblin_lair: sceneId("find_goblin_lair"),
		captured_slaves: sceneId("captured_slaves"),
		confront_merchant: sceneId("confront_merchant"),
		help_merchant: sceneId("help_merchant"),
		game_over_lair: sceneId("game_over_lair"),
	},
	encounters: {
		goblin_shaman: encounterId("goblin_shaman"),
		frenzied_merchant: encounterId("frenzied_merchant"),
	},
} as const;
