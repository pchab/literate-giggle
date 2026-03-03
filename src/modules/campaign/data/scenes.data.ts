import { encounterId } from "@/modules/battle/data/encounters.data";
import { cardId } from "@/modules/cards/helpers/cards.helper";
import { mapNodeId } from "@/modules/world/domain/map.types";
import { questStepId } from "../domain/quests.type";
import { type Scene, sceneId } from "../domain/scenes.type";
import { QUEST_DWARVEN_HIGHWAY, QUEST_MAGE_AWAKENING } from "./quests.data";

export const SCENE_DB: Record<Scene["id"], Scene> = {
	// GENERIC scenes
	[sceneId("generic_tavern")]: {
		id: sceneId("generic_tavern"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/generic_tavern.jpg",
				text: "You enter the tavern, the smell of roasted meat and ale fills your nostrils. The barkeep greets you with a smile.",
				onNext: [{ type: "END_SCENE" }],
			},
		},
	},
	// SCENE 1: Arriving at the tower
	[sceneId("mage_tower_intro")]: {
		id: sceneId("mage_tower_intro"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/wizard_tower.jpg",
				speaker: "The Archmage",
				text: "I sense a spark of true power within you... but a spark is easily extinguished. If you wish for my tutelage, you must bring me the Ancient Spellbook lost in the shifting sands.",
				onNext: [
					{
						type: "ADVANCE_QUEST",
						questId: QUEST_MAGE_AWAKENING,
						newStepId: questStepId("search_ruins"),
					},
					{ type: "END_SCENE" },
				],
			},
		},
	},

	// SCENE 2: The post-battle reveal at the Desert Ruins
	[sceneId("ruins_crypt_reveal")]: {
		id: sceneId("ruins_crypt_reveal"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/crypt_entrance.jpg",
				text: "As the dust from the battle settles, the ground begins to tremble. A massive stone slab slides away, revealing a dark, unnatural staircase leading deep into the earth. The air reeks of death.",
				choices: [
					{
						label: "Descend into the Crypt",
						actions: [
							{
								type: "ADVANCE_QUEST",
								questId: QUEST_MAGE_AWAKENING,
								newStepId: questStepId("defeat_necromancer"),
							},
							{
								type: "START_BATTLE",
								encounterId: encounterId("necromancer_boss"),
								background: "/scenes/desert_crypt.jpg",
							},
						],
					},
					{
						label: "We need to rest first. (Return to Map)",
						actions: [
							{
								type: "ADVANCE_QUEST",
								questId: QUEST_MAGE_AWAKENING,
								newStepId: questStepId("defeat_necromancer"),
							},
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},

	[sceneId("crypt_reenter")]: {
		id: sceneId("crypt_reenter"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/crypt_entrance.jpg",
				text: "The dark staircase leading into the crypt still looms before you. The stench of death is stronger now.",
				choices: [
					{
						label: "Descend into the Crypt",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: encounterId("necromancer_boss"),
								background: "/scenes/desert_crypt.jpg",
							},
						],
					},
					{
						label: "Not yet. (Return to Map)",
						actions: [{ type: "END_SCENE" }],
					},
				],
			},
		},
	},

	// SCENE 3: After defeating the Necromancer
	[sceneId("crypt_victory")]: {
		id: sceneId("crypt_victory"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/desert_crypt.jpg",
				text: "The Necromancer crumbles to dust. On the altar behind him lies a heavy tome bound in strange leather. It pulses with a faint, violet light. You have the Ancient Spellbook.",
				onNext: [
					{
						type: "ADVANCE_QUEST",
						questId: QUEST_MAGE_AWAKENING,
						newStepId: questStepId("return_to_tower"),
					},
					{ type: "END_SCENE" },
				],
			},
		},
	},

	// SCENE 4: Returning the book & The Reward!
	[sceneId("mage_tower_finale")]: {
		id: sceneId("mage_tower_finale"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/wizard_tower.jpg",
				speaker: "The Archmage",
				text: "You survived... I am impressed. Hand over the tome. In exchange, I shall unlock the true potential of your incantations.",
				onNext: [
					{ type: "COMPLETE_QUEST", questId: QUEST_MAGE_AWAKENING },
					{
						type: "UPGRADE_CLASS_CARDS",
						cardUpgrades: {
							[cardId("arcane-shield-1")]: cardId("arcane-shield-2"),
						},
					},
					{ type: "END_SCENE" },
				],
			},
		},
	},

	[sceneId("prospector_intro")]: {
		id: sceneId("prospector_intro"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/ironhold_tavern.jpg",
				speaker: "Dwarven Prospector",
				text: "Aye, the tunnel to Cromee is still there, but the old automated defenses woke up. Clear 'em out, and I'll forge you some proper steel.",
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
				backgroundImage: "/scenes/stone_gates.jpg",
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
								background: "/battlegrounds/mountain_city.jpg",
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
				backgroundImage: "/scenes/stone_gates.jpg",
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
								background: "/battlegrounds/mountain_city.jpg",
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
				backgroundImage: "/scenes/open_stone_gates.jpg",
				speaker: "Dwarven Prospector",
				text: "By the Ancestors, you actually did it! The passage is secure. Here, take this heavy armor plating as promised.",
				onNext: [
					{ type: "COMPLETE_QUEST", questId: QUEST_DWARVEN_HIGHWAY },
					{
						type: "UPGRADE_CLASS_CARDS",
						cardUpgrades: {
							[cardId("shield-block-1")]: cardId("shield-block-2"),
							[cardId("battle-cry-1")]: cardId("battle-cry-2"),
						},
					},
					{ type: "FORCE_MOVE", nodeId: mapNodeId("dwarven_passage") },
					{ type: "END_SCENE" },
				],
			},
		},
	},
};
