import type { Scene } from "@/modules/campaign/domain/scenes.type";
import { mapNodeId } from "@/modules/world/domain/map.types";
import { SEWER_CONTAMINATION } from "../sewer-contamination/sewerContamination.definitions";
import { THE_ALCHEMISTS_LEDGER as ALCHEMIST } from "./alchemistsLedger.definitions";

export const alchemistScenes: Record<string, Scene> = {
	[ALCHEMIST.scenes.intro]: {
		id: ALCHEMIST.scenes.intro,
		initialStepId: "step_1",
		steps: {
			step_1: {
				speaker: "Barnaby",
				backgroundImage: "/scenes/merchant_shop.webp",
				text: "Ah, hired muscle. Excellent. My shop was ransacked last night by goblins from the frost-caves. They ignored the coin and stole my master ledger.",
				onNext: [{ type: "CHANGE_STEP", stepId: "step_2" }],
			},
			step_2: {
				speaker: "Barnaby",
				backgroundImage: "/scenes/merchant_shop.webp",
				text: "It contains cures for the weeping rot. My life's work! I need you to track those beasts and recover it before they destroy it.",
				choices: [
					{
						label: "Consider it done. We'll track them.",
						actions: [{ type: "CHANGE_STEP", stepId: "step_accept" }],
					},
					{
						label: "[MAGE] Goblins don't steal books. What's really in it?",
						reqClass: "MAGE",
						actions: [{ type: "CHANGE_STEP", stepId: "step_mage_push" }],
					},
				],
			},
			step_accept: {
				speaker: "Barnaby",
				backgroundImage: "/scenes/merchant_shop.webp",
				text: "Thank the gods. I'll double your usual rate. Just hurry!",
				onNext: [
					{
						type: "ADVANCE_QUEST",
						questId: ALCHEMIST.id,
						newStepId: ALCHEMIST.steps.track_goblins,
					},
					{ type: "END_SCENE" },
				],
			},
			step_mage_push: {
				speaker: "Barnaby",
				backgroundImage: "/scenes/merchant_shop.webp",
				text: "Do not question me, spell-slinger! It is medicine! Now go, before the trail goes cold!",
				onNext: [
					{
						type: "ADVANCE_QUEST",
						questId: ALCHEMIST.id,
						newStepId: ALCHEMIST.steps.track_goblins,
					},
					{ type: "END_SCENE" },
				],
			},
		},
	},

	[ALCHEMIST.scenes.cache]: {
		id: ALCHEMIST.scenes.cache,
		initialStepId: "step_1",
		steps: {
			step_1: {
				backgroundImage: "/scenes/goblin_loot.webp",
				text: "You track the goblins to a temporary cache in the freezing woods. The crates are smashed, and vials of strange, glowing green liquid are spilled everywhere.",
				onNext: [{ type: "CHANGE_STEP", stepId: "step_2" }],
			},
			step_2: {
				backgroundImage: "/scenes/goblin_loot.webp",
				text: "You find a torn page from Barnaby's ledger half-buried in the snow. It outlines horrifying transmutations—flesh melting, bones warping into weapons.",
				choices: [
					{
						label: "This isn't medicine. We need to find the rest of the book.",
						actions: [{ type: "CHANGE_STEP", stepId: "step_3" }],
					},
				],
			},
			step_3: {
				backgroundImage: "/scenes/goblin_lair_entrance.webp",
				text: "Footprints lead deeper into a nearby cave system. You can hear chanting and the shattering of glass echoing from below.",
				onNext: [
					{
						type: "ADVANCE_QUEST",
						questId: ALCHEMIST.id,
						newStepId: ALCHEMIST.steps.infiltrate_lab,
					},
					{
						type: "END_SCENE",
					},
				],
			},
		},
	},

	[ALCHEMIST.scenes.goblin_lab_victory]: {
		id: ALCHEMIST.scenes.goblin_lab_victory,
		initialStepId: "loot",
		steps: {
			loot: {
				backgroundImage: "/scenes/goblin_lab_victory.webp",
				text: "I find the missing ledger amidst the mess.",
				onNext: [{ type: "CHANGE_STEP", stepId: "inspect" }],
			},
			inspect: {
				backgroundImage: "/scenes/goblin_lab_victory.webp",
				text: "The ledger reveals more of Barnaby's horrific experiments...",
				onNext: [
					{
						type: "ADVANCE_QUEST",
						questId: ALCHEMIST.id,
						newStepId: ALCHEMIST.steps.confront_barnaby,
					},
					{ type: "FORCE_MOVE", nodeId: mapNodeId("northern_road") },
					{ type: "END_SCENE" },
				],
			},
		},
	},

	[ALCHEMIST.scenes.betrayal]: {
		id: ALCHEMIST.scenes.betrayal,
		initialStepId: "step_1",
		steps: {
			step_1: {
				speaker: "Barnaby",
				backgroundImage: "/scenes/merchant_shop.webp",
				text: "You survived! And you have the ledger! Give it to me at once!",
				choices: [
					{
						label: "We read it, Barnaby. This is poison.",
						actions: [{ type: "CHANGE_STEP", stepId: "step_2" }],
					},
				],
			},
			step_2: {
				speaker: "Barnaby",
				backgroundImage: "/scenes/merchant_shop.webp",
				text: "Poison? You ignorant gutter-trash. It is evolution! The city rejects my genius, so I will force them to see it!",
				onNext: [{ type: "CHANGE_STEP", stepId: "step_3" }],
			},
			step_3: {
				backgroundImage: "/scenes/merchant_potion.webp",
				text: "Barnaby draws a swirling purple vial from his coat. His eyes gleam with a manic, desperate light before he uncorks it and downs it in one gulp.",
				onNext: [
					{
						type: "START_BATTLE",
						encounterId: ALCHEMIST.encounters.mutated_barnaby,
						background: "alchemist_shop",
					},
				],
			},
		},
	},
	[ALCHEMIST.scenes.barnaby_defeated]: {
		id: ALCHEMIST.scenes.barnaby_defeated,
		initialStepId: "step_1",
		steps: {
			step_1: {
				backgroundImage: "/scenes/alchemist_aftermath.webp",
				text: `Barnaby collapses into a display case, shattering what little glass remained in the shop. His mutated muscles twitch and shrink as the volatile concoctions leave his system.
					The air is thick with the acrid smoke of bubbling acid and crushed herbs.
					As you search the wreckage, you spot something humming at the bottom of a broken vat. It is a jagged, glowing green stone that seems to melt the very wood it rests upon.`,
				onNext: [
					{ type: "COMPLETE_QUEST", questId: ALCHEMIST.id },
					{
						type: "ADVANCE_QUEST",
						questId: SEWER_CONTAMINATION.id,
						newStepId: SEWER_CONTAMINATION.steps.investigate,
					},
					{ type: "REWARD_EVO_RUNE", evoRune: "rune_acid" },
					{ type: "END_SCENE" },
				],
			},
		},
	},
};
