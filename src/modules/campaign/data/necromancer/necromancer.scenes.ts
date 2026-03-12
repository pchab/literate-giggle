import { encounterId } from "@/modules/campaign/domain/encounters.type";
import { questStepId } from "../../domain/quests.type";
import { type Scene, sceneId } from "../../domain/scenes.type";
import { NECROMANCER_QUEST_ID } from "./necromancer.quest";

export const NECROMANCER_SCENE_DB: Record<Scene["id"], Scene> = {
	[sceneId("mage_tower_intro")]: {
		id: sceneId("mage_tower_intro"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/wizard_tower.webp",
				speaker: "The Archmage",
				text: "I sense a spark of true power within you... but a spark is easily extinguished. If you wish for my tutelage, you must bring me the Ancient Spellbook lost in the shifting sands.",
				onNext: [
					{
						type: "ADVANCE_QUEST",
						questId: NECROMANCER_QUEST_ID,
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
				backgroundImage: "/scenes/crypt_entrance.webp",
				text: "As the dust from the battle settles, the ground begins to tremble. A massive stone slab slides away, revealing a dark, unnatural staircase leading deep into the earth. The air reeks of death.",
				choices: [
					{
						label: "Descend into the Crypt",
						actions: [
							{
								type: "ADVANCE_QUEST",
								questId: NECROMANCER_QUEST_ID,
								newStepId: questStepId("defeat_necromancer"),
							},
							{
								type: "START_BATTLE",
								encounterId: encounterId("necromancer_boss"),
								background: "/scenes/desert_crypt.webp",
							},
						],
					},
					{
						label: "We need to rest first. (Return to Map)",
						actions: [
							{
								type: "ADVANCE_QUEST",
								questId: NECROMANCER_QUEST_ID,
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
				backgroundImage: "/scenes/crypt_entrance.webp",
				text: "The dark staircase leading into the crypt still looms before you. The stench of death is stronger now.",
				choices: [
					{
						label: "Descend into the Crypt",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: encounterId("necromancer_boss"),
								background: "/scenes/desert_crypt.webp",
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
				backgroundImage: "/scenes/desert_crypt.webp",
				text: "The Necromancer crumbles to dust. On the altar behind him lies a heavy tome bound in strange leather. It pulses with a faint, violet light. You have the Ancient Spellbook.",
				onNext: [
					{
						type: "ADVANCE_QUEST",
						questId: NECROMANCER_QUEST_ID,
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
				backgroundImage: "/scenes/wizard_tower.webp",
				speaker: "The Archmage",
				text: "You survived... I am impressed. Hand over the tome. In exchange, I shall unlock the true potential of your incantations.",
				onNext: [
					{ type: "COMPLETE_QUEST", questId: NECROMANCER_QUEST_ID },
					{
						type: "REWARD_EVO_RUNE",
						evoRune: "rune_arcane",
					},
					{ type: "END_SCENE" },
				],
			},
		},
	},
};
