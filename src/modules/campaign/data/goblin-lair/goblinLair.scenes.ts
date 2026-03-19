import { mapNodeId } from "@/modules/world/domain/map.types";
import type { Scene } from "../../domain/scenes.type";
import { GOBLIN_LAIR } from "./goblinLair.definitions";

export const GOBLIN_LAIR_SCENES: Record<Scene["id"], Scene> = {
	[GOBLIN_LAIR.scenes.goblin_loot]: {
		id: GOBLIN_LAIR.scenes.goblin_loot,
		initialStepId: "goblin-loot",
		steps: {
			"goblin-loot": {
				text: "It seems those goblins found the stash of some merchants. Maybe that book contains information about whoever it belongs too.",
				backgroundImage: "/scenes/goblin_loot.webp",
				onNext: [
					{
						type: "ADVANCE_QUEST",
						questId: GOBLIN_LAIR.id,
						newStepId: GOBLIN_LAIR.steps.bring_back_ledger,
					},
					{ type: "END_SCENE" },
				],
			},
		},
	},
	[GOBLIN_LAIR.scenes.meet_merchant]: {
		id: GOBLIN_LAIR.scenes.meet_merchant,
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Alchemist Niklas",
				text: "You found my ledger and the alchemical supplies I had ordered from Ironhold ? I was suspecting something happened to the convoy...",
				backgroundImage: "/scenes/merchant_shop.webp",
				choices: [
					{
						label: "Give him the ledger and supplies.",
						actions: [{ type: "CHANGE_STEP", stepId: "deception" }],
					},
				],
			},
			deception: {
				speaker: "Alchemist Niklas",
				text: "That's all you found... Still, I must thank you for bringing what little remains to me.",
				backgroundImage: "/scenes/merchant_shop.webp",
				choices: [
					{
						label: "I could track the goblins.",
						actions: [{ type: "CHANGE_STEP", stepId: "job" }],
					},
					{
						label: "K Thx Bye.",
						actions: [
							{ type: "COMPLETE_QUEST", questId: GOBLIN_LAIR.id },
							{ type: "END_SCENE" },
						],
					},
				],
			},
			job: {
				speaker: "Alchemist Niklas",
				text: "Really ? That would be helpful. I will reward you if you find the missing supplies.",
				backgroundImage: "/scenes/merchant_shop.webp",
				choices: [
					{
						label: "Bye.",
						actions: [
							{
								type: "ADVANCE_QUEST",
								questId: GOBLIN_LAIR.id,
								newStepId: GOBLIN_LAIR.steps.find_the_goblin_lair,
							},
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},
	[GOBLIN_LAIR.scenes.find_goblin_lair]: {
		id: GOBLIN_LAIR.scenes.find_goblin_lair,
		initialStepId: "entrance",
		steps: {
			entrance: {
				text: "Following the traces of the goblin band was easy. You soon find their lair.",
				backgroundImage: "/scenes/goblin_lair_entrance.webp",
				choices: [
					{
						label: "Enter.",
						actions: [
							{
								type: "CHANGE_STEP",
								stepId: "lair",
							},
						],
					},
					{
						label: "Not yet.",
						actions: [
							{
								type: "FORCE_MOVE",
								nodeId: mapNodeId("connury_town"),
							},
							{
								type: "END_SCENE",
							},
						],
					},
				],
			},
			lair: {
				text: "...",
				backgroundImage: "/scenes/goblin_lair.webp",
				onNext: [
					{
						type: "START_BATTLE",
						encounterId: GOBLIN_LAIR.encounters.goblin_shaman,
						background: "goblin_lair",
					},
				],
			},
		},
	},
};
