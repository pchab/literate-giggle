import { mapNodeId } from "@/modules/map/domain/map.model";
import { type Quest, questId, questStepId } from "./quests.type";
import { sceneId } from "./scenes.type";

export const QUEST_MAGE_AWAKENING = questId("mage_awakening");

export const QUEST_DB: Record<Quest["id"], Quest> = {
	[QUEST_MAGE_AWAKENING]: {
		id: QUEST_MAGE_AWAKENING,
		title: "The Archmage's Price",
		loreDescription:
			"To unlock the deeper mysteries of the arcane, you must prove your worth to the reclusive Archmage.",
		initialStepId: questStepId("visit_tower"),
		steps: {
			[questStepId("visit_tower")]: {
				id: questStepId("visit_tower"),
				logDescription:
					"Travel to the Wizard Tower and seek an audience with the Archmage.",
				targetNodeId: mapNodeId("wizard_tower"),
				onEnterSceneId: sceneId("mage_tower_intro"),
			},
			[questStepId("search_ruins")]: {
				id: questStepId("search_ruins"),
				logDescription: "Search the Desert Ruins for the Ancient Spellbook.",
				targetNodeId: mapNodeId("desert_ruins"),
				onWinSceneId: sceneId("ruins_crypt_reveal"),
			},
			[questStepId("defeat_necromancer")]: {
				id: questStepId("defeat_necromancer"),
				logDescription:
					"A Crypt has been revealed! Defeat the Necromancer within to claim the book.",
				targetNodeId: mapNodeId("desert_ruins"),
				onEnterSceneId: sceneId("crypt_reenter"),
				onWinSceneId: sceneId("crypt_victory"),
			},
			[questStepId("return_to_tower")]: {
				id: questStepId("return_to_tower"),
				logDescription: "Return the Ancient Spellbook to the Archmage.",
				targetNodeId: mapNodeId("wizard_tower"),
				onEnterSceneId: sceneId("mage_tower_finale"),
			},
		},
	},
};
