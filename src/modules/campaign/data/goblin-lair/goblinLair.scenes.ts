// import { mapNodeId } from '@/modules/world/domain/map.types';
import type { Scene } from "../../domain/scenes.type";
import { GOBLIN_LAIR } from "./goblinLair.definitions";

export const GOBLIN_LAIR_SCENES: Record<Scene["id"], Scene> = {
	[GOBLIN_LAIR.scenes.goblin_loot]: {
		id: GOBLIN_LAIR.scenes.goblin_loot,
		initialStepId: "vane-greeting",
		steps: {
			"vane-greeting": {
				speaker: "Captain Vane",
				text: "Keep your distance, traveler. The Hollow Keel doesn't take kindly to dockside lurkers. Unless... you're the one the harbor master mentioned? The one with a sharp blade and a dull sense of self-preservation?",
				backgroundImage: "/scenes/port_city_ship.webp",
				choices: [
					{
						label: "I'm looking for work, not insults.",
						actions: [{ type: "CHANGE_STEP", stepId: "vane-the-job" }],
					},
					{
						label: "(Arcane Insight) Your compass... it's bleeding mana.",
						reqClass: "MAGE",
						actions: [{ type: "CHANGE_STEP", stepId: "vane-arcane-reaction" }],
					},
				],
			},

			"vane-arcane-reaction": {
				speaker: "Captain Vane",
				text: "Sharp eyes, sparky. It’s not just mana; it’s a tether. My family’s 'Warding Sigil' was swallowed by a Briar Wolf three nights ago during a supply run. Now the beast is a walking beacon of cursed energy.",
				backgroundImage: "/scenes/port_city_ship.webp",
				onNext: [{ type: "CHANGE_STEP", stepId: "vane-the-job" }],
			},

			"vane-the-job": {
				speaker: "Captain Vane",
				text: "The job is simple: Head into the Briarwoods. Track the beast that smells like ozone and rotted wood. Cut my sigil out of its gullet. Do that, and I'll grant you passage to the Iron Isles—free of charge.",
				backgroundImage: "/scenes/port_city_ship.webp",
				choices: [
					{
						label: "A wolf made of thorns? I'll handle it.",
						actions: [
							{ type: "SET_FLAG", flagId: "vane_contract_signed" },
							{
								type: "ADVANCE_QUEST",
								questId: GOBLIN_LAIR.id,
								newStepId: GOBLIN_LAIR.steps.find_the_goblin_lair,
							},
							{ type: "END_SCENE" },
						],
					},
					{
						label: "The Iron Isles? That's a death sentence.",
						actions: [{ type: "CHANGE_STEP", stepId: "vane-warning" }],
					},
				],
			},

			"vane-warning": {
				speaker: "Captain Vane",
				text: "Life is a death sentence, lad. At least on my ship, you'll die with a view and a belly full of grog. Come back when you've found your spine.",
				backgroundImage: "/scenes/port_city_ship.webp",
				choices: [
					{
						label: "Fine. I'll take the job.",
						actions: [{ type: "CHANGE_STEP", stepId: "vane-the-job" }],
					},
					{ label: "Leave.", actions: [{ type: "END_SCENE" }] },
				],
			},
		},
	},
	[GOBLIN_LAIR.scenes.find_goblin_lair]: {
		id: GOBLIN_LAIR.scenes.find_goblin_lair,
		initialStepId: "intro",
		steps: {
			intro: {
				text: "The forest grows silent. Thorns pull at your armor. Suddenly, a snarl erupts from the thicket.",
				backgroundImage: "/scenes/briar_wolf_ambush.webp",
				choices: [
					{
						label: "Draw your steel!",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: GOBLIN_LAIR.encounters.goblin_shaman,
								background: "/battlegrounds/forest.webp",
							},
						],
					},
				],
			},
		},
	},
	[GOBLIN_LAIR.scenes.captured_slaves]: {
		id: GOBLIN_LAIR.scenes.captured_slaves,
		initialStepId: "the-relic",
		steps: {
			"the-relic": {
				text: "The Briar Wolf collapses, its thorny body dissolving into grey ash. Amidst the pile of rotted wood and matted fur, a metallic glint catches the light. You reach in and pull out a heavy silver sigil, warm to the touch and pulsing with a faint blue light.",
				backgroundImage: "/scenes/briar_wolf_victory.webp",
				choices: [
					{
						label: "Clean the sigil and head back.",
						actions: [
							{
								type: "ADVANCE_QUEST",
								questId: GOBLIN_LAIR.id,
								newStepId: GOBLIN_LAIR.steps.confront_merchant,
							},
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},

	[GOBLIN_LAIR.scenes.help_merchant]: {
		id: GOBLIN_LAIR.scenes.help_merchant,
		initialStepId: "return-to-vane",
		steps: {
			"return-to-vane": {
				speaker: "Captain Vane",
				text: "You're back. And you're still in one piece. I'll admit, I already had the cabin boy picking out who got your boots. Tell me... did you find it?",
				backgroundImage: "/scenes/port_city_ship.webp",
				choices: [
					{
						label: "Here is your family's sigil. (Hand it over)",
						actions: [{ type: "CHANGE_STEP", stepId: "vane-reward" }],
					},
					{
						label: "I found it, but a 'free ride' isn't enough. I want gold.",
						actions: [{ type: "CHANGE_STEP", stepId: "vane-haggle" }],
					},
				],
			},

			"vane-haggle": {
				speaker: "Captain Vane",
				text: "Greedy, aren't we? I like that. Fine. I'll throw in a handful of sovereign coins and a bottle of 'Dead Man's Grog.' But don't push your luck, mate. The sea has a way of swallowing the over-ambitious.",
				backgroundImage: "/scenes/port_city_ship.webp",
				onNext: [{ type: "CHANGE_STEP", stepId: "vane-reward" }],
			},

			"vane-reward": {
				speaker: "Captain Vane",
				text: "The Hollow Keel is yours to board whenever you're ready to leave this stench-filled city behind. We sail for the Iron Isles at midnight. Don't be late.",
				backgroundImage: "/scenes/port_city_ship.webp",
				choices: [
					{
						label: "I'm ready. Let's go.",
						actions: [
							{ type: "REWARD_EVO_RUNE", evoRune: "rune_tides" },
							{ type: "COMPLETE_QUEST", questId: GOBLIN_LAIR.id },
							// { type: "FORCE_MOVE", nodeId: mapNodeId("iron_isles_landing") },
							{ type: "END_SCENE" },
						],
					},
					{
						label: "I have things to finish here first.",
						actions: [
							{ type: "REWARD_EVO_RUNE", evoRune: "rune_tides" },
							{ type: "COMPLETE_QUEST", questId: GOBLIN_LAIR.id },
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},
};
