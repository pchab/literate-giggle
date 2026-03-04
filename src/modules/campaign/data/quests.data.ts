import { townLocationId } from "@/modules/towns/domain/towns.type";
import { mapNodeId } from "@/modules/world/domain/map.types";
import { type Quest, questId, questStepId } from "../domain/quests.type";
import { sceneId } from "../domain/scenes.type";

export const QUEST_MAGE_AWAKENING = questId("mage_awakening");
export const QUEST_DWARVEN_HIGHWAY = questId("dwarven_highway");

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
				targetNodeId: { mapNodeId: mapNodeId("wizard_tower") },
				onEnterSceneId: sceneId("mage_tower_intro"),
			},
			[questStepId("search_ruins")]: {
				id: questStepId("search_ruins"),
				logDescription: "Search the Desert Ruins for the Ancient Spellbook.",
				targetNodeId: { mapNodeId: mapNodeId("desert_ruins") },
				onWinSceneId: sceneId("ruins_crypt_reveal"),
			},
			[questStepId("defeat_necromancer")]: {
				id: questStepId("defeat_necromancer"),
				logDescription:
					"A Crypt has been revealed! Defeat the Necromancer within to claim the book.",
				targetNodeId: { mapNodeId: mapNodeId("desert_ruins") },
				onEnterSceneId: sceneId("crypt_reenter"),
				onWinSceneId: sceneId("crypt_victory"),
			},
			[questStepId("return_to_tower")]: {
				id: questStepId("return_to_tower"),
				logDescription: "Return the Ancient Spellbook to the Archmage.",
				targetNodeId: { mapNodeId: mapNodeId("wizard_tower") },
				onEnterSceneId: sceneId("mage_tower_finale"),
			},
		},
	},
	[questId("dwarven_highway")]: {
		id: questId("dwarven_highway"),
		title: "The Sealed Passage",
		loreDescription:
			"A dwarven prospector in Ironhold needs someone to clear the ancient Stone Gates so trade can resume with Cromee Town.",
		initialStepId: questStepId("visit_prospector"),
		steps: {
			[questStepId("visit_prospector")]: {
				id: questStepId("visit_prospector"),
				logDescription: "Speak to the Prospector in Ironhold City.",
				targetNodeId: {
					mapNodeId: mapNodeId("ironhold_city"),
					locationId: townLocationId("ironhold_tavern"),
				},
				onEnterSceneId: sceneId("prospector_intro"),
			},
			[questStepId("clear_gates")]: {
				id: questStepId("clear_gates"),
				logDescription: "Travel to the mountains and clear the Stone Gates.",
				targetNodeId: { mapNodeId: mapNodeId("stone_gates") },
				onWinSceneId: sceneId("gates_cleared"),
			},
			[questStepId("defeat_golem")]: {
				id: questStepId("defeat_golem"),
				logDescription: "Destroy the Golem Overseer inside the passage.",
				targetNodeId: { mapNodeId: mapNodeId("stone_gates") },
				onEnterSceneId: sceneId("gates_reenter"), // If they rest
				onWinSceneId: sceneId("golem_victory"),
			},
		},
	},
};
