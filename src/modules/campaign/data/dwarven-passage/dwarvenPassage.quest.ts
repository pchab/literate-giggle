import { townLocationId } from "@/modules/towns/domain/towns.type";
import { mapNodeId } from "@/modules/world/domain/map.types";
import { type Quest, questId, questStepId } from "../../domain/quests.type";
import { sceneId } from "../../domain/scenes.type";

export const QUEST_DWARVEN_HIGHWAY = questId("dwarven_highway");

export const DWARVEN_PASSAGE_QUEST: Quest = {
	id: QUEST_DWARVEN_HIGHWAY,
	title: "The Sealed Passage",
	loreDescription:
		"A dwarven prospector in Connury needs someone to clear the ancient Stone Gates so trade can resume with the town.",
	initialStepId: questStepId("visit_prospector"),
	steps: {
		[questStepId("visit_prospector")]: {
			id: questStepId("visit_prospector"),
			logDescription: "Speak to the Prospector in Connury Town.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("connury_town"),
					locationId: townLocationId("connury_tavern"),
				},
			],
			onEnterSceneId: sceneId("prospector_intro"),
		},
		[questStepId("clear_gates")]: {
			id: questStepId("clear_gates"),
			logDescription: "Travel to the mountains and clear the Stone Gates.",
			targetNodeId: [{ mapNodeId: mapNodeId("stone_gates") }],
			onWinSceneId: sceneId("gates_cleared"),
		},
		[questStepId("defeat_golem")]: {
			id: questStepId("defeat_golem"),
			logDescription: "Destroy the Golem Overseer inside the passage.",
			targetNodeId: [{ mapNodeId: mapNodeId("stone_gates") }],
			onEnterSceneId: sceneId("gates_reenter"), // If they rest
			onWinSceneId: sceneId("golem_victory"),
		},
	},
};
