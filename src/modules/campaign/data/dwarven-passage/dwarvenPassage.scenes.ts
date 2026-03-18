import { encounterId } from "@/modules/campaign/domain/encounters.type";
import { mapNodeId } from "@/modules/world/domain/map.types";
import { questStepId } from "../../domain/quests.type";
import { type Scene, sceneId } from "../../domain/scenes.type";
import { QUEST_DWARVEN_HIGHWAY } from "./dwarvenPassage.quest";

export const DWARVEN_PASSAGE_SCENE_DB: Record<Scene["id"], Scene> = {
	[sceneId("prospector_intro")]: {
		id: sceneId("prospector_intro"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/generic_tavern_2.webp",
				speaker: "Dwarven Prospector",
				text: "Aye, the tunnel in the mountain is still there, but the old automated defenses woke up. Clear 'em out, and I'll forge you some proper steel.",
				onNext: [
					{
						type: "ADVANCE_QUEST",
						questId: QUEST_DWARVEN_HIGHWAY,
						newStepId: questStepId("clear_gates"),
					},
					{ type: "END_SCENE" },
				],
			},
		},
	},

	[sceneId("gates_cleared")]: {
		id: sceneId("gates_cleared"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/stone_gates.webp",
				text: "The elementals crumble into gravel. The massive stone doors grind open, echoing into the darkness. Heavy, mechanical footsteps approach from within.",
				choices: [
					{
						label: "Hold your ground! (Fight Boss)",
						actions: [
							{
								type: "ADVANCE_QUEST",
								questId: QUEST_DWARVEN_HIGHWAY,
								newStepId: questStepId("defeat_golem"),
							},
							{
								type: "START_BATTLE",
								encounterId: encounterId("golem_boss"),
								background: "mountain_city",
							},
						],
					},
					{
						label: "Fall back and rest. (Return to Map)",
						actions: [
							{
								type: "ADVANCE_QUEST",
								questId: QUEST_DWARVEN_HIGHWAY,
								newStepId: questStepId("defeat_golem"),
							},
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},

	[sceneId("gates_reenter")]: {
		id: sceneId("gates_reenter"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/stone_gates.webp",
				text: "The massive stone doors are still open. Heavy, mechanical footsteps approach from within.",
				choices: [
					{
						label: "Hold your ground! (Fight Boss)",
						actions: [
							{
								type: "ADVANCE_QUEST",
								questId: QUEST_DWARVEN_HIGHWAY,
								newStepId: questStepId("defeat_golem"),
							},
							{
								type: "START_BATTLE",
								encounterId: encounterId("golem_boss"),
								background: "mountain_city",
							},
						],
					},
					{
						label: "Fall back and rest. (Return to Map)",
						actions: [
							{
								type: "ADVANCE_QUEST",
								questId: QUEST_DWARVEN_HIGHWAY,
								newStepId: questStepId("defeat_golem"),
							},
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},

	[sceneId("golem_victory")]: {
		id: sceneId("golem_victory"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/open_stone_gates.webp",
				speaker: "Dwarven Prospector",
				text: "By the Ancestors, you actually did it! The passage is secure. Here, take this heavy armor plating as promised.",
				onNext: [
					{ type: "COMPLETE_QUEST", questId: QUEST_DWARVEN_HIGHWAY },
					{
						type: "REWARD_EVO_RUNE",
						evoRune: "rune_mountain",
					},
					{ type: "FORCE_MOVE", nodeId: mapNodeId("dwarven_passage") },
					{ type: "END_SCENE" },
				],
			},
		},
	},
};
