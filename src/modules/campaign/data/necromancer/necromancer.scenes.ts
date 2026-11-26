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
								background: "desert_crypt",
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
								background: "desert_crypt",
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

	// SCENE 4: Returning the book — give it, keep it, or burn it
	[sceneId("mage_tower_finale")]: {
		id: sceneId("mage_tower_finale"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/wizard_tower.webp",
				speaker: "The Archmage",
				text: "You survived... I am impressed. Hand over the tome. In exchange, I shall unlock the true potential of your incantations.",
				onEnter: [
					{
						type: "IF_FLAGS",
						all: ["necromancer_free"],
						actions: [{ type: "CHANGE_STEP", stepId: "failed" }],
					},
				],
				choices: [
					{
						label: "Hand over the tome.",
						actions: [
							{ type: "COMPLETE_QUEST", questId: NECROMANCER_QUEST_ID },
							{ type: "REWARD_EVO_RUNE", evoRune: "rune_arcane" },
							{ type: "SET_FLAG", flagId: "archmage_ally" },
							{ type: "END_SCENE" },
						],
					},
					{
						label: "No. The tome stays with us.",
						actions: [{ type: "CHANGE_STEP", stepId: "keep" }],
					},
					{
						label: "[Cleric] Nobody should read this. It burns, here and now.",
						reqClass: "CLERIC",
						actions: [{ type: "CHANGE_STEP", stepId: "burn" }],
					},
				],
			},
			keep: {
				backgroundImage: "/scenes/wizard_tower.webp",
				speaker: "The Archmage",
				text: "So the spark became a fire. Keep it, then, and feel it whisper to you at night. But you will never climb these stairs again.",
				onNext: [
					{ type: "SET_FLAG", flagId: "kept_necronomicon" },
					{ type: "SET_FLAG", flagId: "archmage_hostile" },
					{ type: "COMPLETE_QUEST", questId: NECROMANCER_QUEST_ID },
					{ type: "REWARD_EVO_RUNE", evoRune: "rune_blood" },
					{ type: "END_SCENE" },
				],
			},
			burn: {
				backgroundImage: "/scenes/wizard_tower.webp",
				speaker: "The Archmage",
				text: "...Centuries of knowledge, gone. You fool. You may even be right. Go, before I decide which.",
				onNext: [
					{ type: "SET_FLAG", flagId: "tome_burned" },
					{ type: "HEAL_PARTY", amount: 99 },
					{ type: "COMPLETE_QUEST", questId: NECROMANCER_QUEST_ID },
					{ type: "END_SCENE" },
				],
			},
			failed: {
				backgroundImage: "/scenes/wizard_tower.webp",
				speaker: "The Archmage",
				text: "You sealed him in? He is still down there, with my tome, raising the dead of an entire city. A spark that runs from the dark is no spark at all.",
				choices: [
					{
						label: "Then we'll go back down and finish it.",
						actions: [
							{ type: "CLEAR_FLAG", flagId: "necromancer_free" },
							{
								type: "ADVANCE_QUEST",
								questId: NECROMANCER_QUEST_ID,
								newStepId: questStepId("defeat_necromancer"),
							},
							{ type: "END_SCENE" },
						],
					},
					{
						label: "We're done with your errands.",
						actions: [
							{ type: "SET_FLAG", flagId: "archmage_hostile" },
							{ type: "COMPLETE_QUEST", questId: NECROMANCER_QUEST_ID },
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},

	// DEFEAT in the crypt
	[sceneId("crypt_lost")]: {
		id: sceneId("crypt_lost"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/crypt_entrance.webp",
				text: "You scramble up the crypt stairs with the dead clawing at your heels. Below, the Necromancer's laughter echoes off the stone. The slab still hangs open.",
				choices: [
					{
						label: "Regroup. We'll go back down when we're ready.",
						actions: [{ type: "END_SCENE" }],
					},
					{
						label: "Drop the slab and seal him in. Tell the Archmage.",
						actions: [
							{ type: "SET_FLAG", flagId: "necromancer_free" },
							{
								type: "ADVANCE_QUEST",
								questId: NECROMANCER_QUEST_ID,
								newStepId: questStepId("return_to_tower"),
							},
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},
};
