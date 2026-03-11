import { encounterId } from "@/modules/campaign/domain/encounters.type";
import { mapNodeId } from "@/modules/world/domain/map.types";
import { type Scene, sceneId } from "../../domain/scenes.type";
import { VERDANT_RECLAMATION } from "./verdantReclamation.quest";

export const VERDANT_RECLAMATION_SCENE_DB: Record<Scene["id"], Scene> = {
	// --- ACT I: THE HOOK ---
	[sceneId("war_rumors")]: {
		id: sceneId("war_rumors"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Off-Duty Soldier",
				text: "Grab a stool, friend. It's tense in the city today. We lost contact with the Dragon's Tooth Logging Camp three days ago, and the scouts we sent never came back. The Captain is paying good coin for anyone brave enough to go check it out.",
				backgroundImage: "/scenes/generic_tavern.jpg",
				choices: [
					{
						label: "I'll head to the camp and investigate.",
						actions: [
							{
								type: "ADVANCE_QUEST",
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.investigate_camp,
							},
							{ type: "END_SCENE" },
						],
					},
					{
						label: "Sounds dangerous. I just want an ale.",
						actions: [{ type: "END_SCENE" }],
					},
				],
			},
		},
	},
	[sceneId("invasion_start")]: {
		id: sceneId("invasion_start"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Wounded Lumberjack",
				text: "You're too late... The trees, they just ripped themselves out of the earth. The Elves of the Briar Host are marching on Ironhold!",
				backgroundImage: "/scenes/road_fleeing_lumberjack.jpg",
				choices: [
					{
						label: "Return to the city. We must prepare the defenses.",
						actions: [
							{
								type: "ADVANCE_QUEST",
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.report_attack,
							},
							{ type: "FORCE_MOVE", nodeId: mapNodeId("kiven_river_bridge") },
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},
	[sceneId("meeting_the_king")]: {
		id: sceneId("meeting_the_king"),
		initialStepId: "report",
		steps: {
			report: {
				speaker: "King Tanotalos II",
				text: "The leaf eaters have attacked our logging camp ? How dare they... We need to send a message that Ironhold will not fall so easily.",
				backgroundImage: "/scenes/ironhold_throne_room.jpg",
				onNext: [{ type: "CHANGE_STEP", stepId: "getOrders" }],
			},
			getOrders: {
				speaker: "King Tanotalos II",
				text: "Ride out to the Kiven River Bridge and crush their forces before they can regroup!",
				backgroundImage: "/scenes/ironhold_throne_room.jpg",
				onNext: [
					{
						type: "ADVANCE_QUEST",
						questId: VERDANT_RECLAMATION.id,
						newStepId: VERDANT_RECLAMATION.steps.the_ultimatum,
					},
					{ type: "END_SCENE" },
				],
			},
		},
	},

	// --- ACT II: THE BRANCHING CHOICE ---
	[sceneId("elven_ultimatum")]: {
		id: sceneId("elven_ultimatum"),
		initialStepId: "confrontation",
		steps: {
			confrontation: {
				speaker: "Elven Commander",
				text: "The stone-dwellers are a disease on this land. Their greed devours the Whisperwood. Lay down your iron, and help us return this valley to the earth.",
				backgroundImage: "/scenes/river_bridge_hostile.jpg",
				choices: [
					{
						label: "[Defend the City] Ironhold is our home. Draw your blades!",
						actions: [
							{ type: "SET_FLAG", flagId: "aligned_with_ironhold" },
							{
								type: "ADVANCE_QUEST",
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.stop_invasion_N_W_S,
							},
							{
								type: "START_BATTLE",
								encounterId: encounterId("elven_commander"),
								background: "/battlegrounds/river_bridge_hostile.jpg",
							},
						],
					},
					{
						label:
							"[Join the Host] The city brought this upon itself. We stand with the forest.",
						actions: [
							{ type: "SET_FLAG", flagId: "aligned_with_forest" }, // Map variants lock Ironhold and open Heart-Tree
							{
								type: "ADVANCE_QUEST",
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.assault_ironhold,
							},
							{ type: "END_SCENE" }, // Bypasses the battle entirely!
						],
					},
				],
			},
		},
	},

	// --- ACT III (BRANCH A): DEFEND IRONHOLD ---
	[sceneId("victory_north_front")]: {
		id: sceneId("victory_north_front"),
		initialStepId: "intro",
		steps: {
			intro: {
				text: "The giant Treants splinter and fall, their glowing sap dimming into the soil. The northern front is secure... for now.",
				backgroundImage: "/scenes/plain_victory.jpg",
				choices: [
					{
						label: "Assess the remaining fronts.",
						actions: [
							{ type: "SET_FLAG", flagId: "north_cleared" },
							{
								type: "ADVANCE_QUEST",
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.stop_invasion_W_S,
							},
							{
								type: "ADVANCE_IF_FLAGS",
								requiredFlags: ["west_cleared"],
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.stop_invasion_S,
							},
							{
								type: "ADVANCE_IF_FLAGS",
								requiredFlags: ["south_cleared"],
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.stop_invasion_W,
							},
							{
								type: "ADVANCE_IF_FLAGS",
								requiredFlags: ["west_cleared", "south_cleared"],
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.defend_ironhold,
							},
							{ type: "FORCE_MOVE", nodeId: mapNodeId("kiven_river_bridge") },
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},

	[sceneId("victory_west_front")]: {
		id: sceneId("victory_west_front"),
		initialStepId: "intro",
		steps: {
			intro: {
				text: "The elven weavers fall, their magic fading into the wind. The western front is secure... for now.",
				backgroundImage: "/scenes/plain_victory.jpg",
				choices: [
					{
						label: "Assess the remaining fronts.",
						actions: [
							{ type: "SET_FLAG", flagId: "west_cleared" },
							{
								type: "ADVANCE_QUEST",
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.stop_invasion_N_S,
							},
							{
								type: "ADVANCE_IF_FLAGS",
								requiredFlags: ["north_cleared"],
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.stop_invasion_S,
							},
							{
								type: "ADVANCE_IF_FLAGS",
								requiredFlags: ["south_cleared"],
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.stop_invasion_N,
							},
							{
								type: "ADVANCE_IF_FLAGS",
								requiredFlags: ["north_cleared", "south_cleared"],
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.defend_ironhold,
							},
							{ type: "FORCE_MOVE", nodeId: mapNodeId("kiven_river_bridge") },
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},

	[sceneId("victory_south_front")]: {
		id: sceneId("victory_south_front"),
		initialStepId: "intro",
		steps: {
			intro: {
				text: "The elven beastmasters fall, their howls echoing into the air. The southern front is secure... for now.",
				backgroundImage: "/scenes/plain_victory.jpg",
				choices: [
					{
						label: "Assess the remaining fronts.",
						actions: [
							{ type: "SET_FLAG", flagId: "south_cleared" },
							{
								type: "ADVANCE_QUEST",
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.stop_invasion_N_W,
							},
							{
								type: "ADVANCE_IF_FLAGS",
								requiredFlags: ["north_cleared"],
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.stop_invasion_W,
							},
							{
								type: "ADVANCE_IF_FLAGS",
								requiredFlags: ["west_cleared"],
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.stop_invasion_N,
							},
							{
								type: "ADVANCE_IF_FLAGS",
								requiredFlags: ["north_cleared", "west_cleared"],
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.defend_ironhold,
							},
							{ type: "FORCE_MOVE", nodeId: mapNodeId("kiven_river_bridge") },
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},

	[sceneId("ironhold_siege_intro")]: {
		id: sceneId("ironhold_siege_intro"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Arch-Druid Sylas",
				text: "Your stone walls will crumble to dust, and roots will feast on your bones!",
				backgroundImage: "/scenes/ironhold_assault.jpg",
				choices: [
					{
						label: "Defend the city!",
						actions: [{ type: "END_SCENE" }],
					},
				],
			},
		},
	},

	// --- DISTRICT 1: THE MAIN GATES ---
	[sceneId("defend_siege_gates")]: {
		id: sceneId("defend_siege_gates"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Captain of the Guard",
				text: "The iron-oak doors didn't stand a chance against those bark-skinned behemoths! They are pouring into the lower courtyard. Hold the breach!",
				backgroundImage: "/scenes/ironhold_gates.jpg",
				choices: [
					{
						label: "Push them back! (Start Battle)",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: encounterId("defend_siege_gates"),
								background: "/battlegrounds/ironhold_gates.jpg",
							},
						],
					},
				],
			},
		},
	},

	[sceneId("victory_defend_siege_gates")]: {
		id: sceneId("victory_defend_siege_gates"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Captain of the Guard",
				text: "The breach is secure! But more are coming... We need to clear the rest of the city!",
				backgroundImage: "/scenes/ironhold_gates_humans.jpg",
				choices: [
					{
						label: "Go deeper into the city.",
						actions: [
							{
								type: "SET_FLAG",
								flagId: "gates_cleared",
							},
							{
								type: "END_SCENE",
							},
						],
					},
				],
			},
		},
	},

	[sceneId("assault_siege_gates")]: {
		id: sceneId("assault_siege_gates"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Arch-Druid Sylas",
				text: "The gates won't stand a chance against our treant brothers! Push through the breach and let the wilds reclaim this land!",
				backgroundImage: "/scenes/ironhold_gates.jpg",
				choices: [
					{
						label: "Charge! (Start Battle)",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: encounterId("assault_siege_gates"),
								background: "/battlegrounds/ironhold_gates.jpg",
							},
						],
					},
				],
			},
		},
	},

	[sceneId("victory_assault_siege_gates")]: {
		id: sceneId("victory_assault_siege_gates"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Arch-Druid Sylas",
				text: "The breach is secure! But more are coming... We need to clear the rest of the city!",
				backgroundImage: "/scenes/ironhold_gates_elves.jpg",
				choices: [
					{
						label: "Go deeper into the city.",
						actions: [
							{
								type: "SET_FLAG",
								flagId: "gates_cleared",
							},
							{
								type: "END_SCENE",
							},
						],
					},
				],
			},
		},
	},

	// --- DISTRICT 2: THE TAVERN ---
	[sceneId("defend_tavern_ambush")]: {
		id: sceneId("defend_tavern_ambush"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Panicked Barkeep",
				text: "They broke through the walls! There are wolves made of thorns tearing up the taproom! Please, help us!",
				backgroundImage: "/scenes/rusty_boar_assault.jpg",
				choices: [
					{
						label: "Defend the tavern! (Start Battle)",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: encounterId("defend_tavern_ambush"),
								background: "/battlegrounds/rusty_boar_ruined.jpg",
							},
						],
					},
				],
			},
		},
	},

	[sceneId("victory_defend_tavern_ambush")]: {
		id: sceneId("defend_tavern_ambush"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Panicked Barkeep",
				text: "Thank you! You saved us!",
				backgroundImage: "/scenes/rusty_boar_assault.jpg",
				choices: [
					{
						label: "Leave the tavern.",
						actions: [
							{
								type: "SET_FLAG",
								flagId: "tavern_cleared",
							},
							{
								type: "END_SCENE",
							},
						],
					},
				],
			},
		},
	},

	[sceneId("assault_tavern_ambush")]: {
		id: sceneId("assault_tavern_ambush"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Arch-Druid Sylas",
				text: "Our treants broke through their walls! Tear apart the tavern and let the wilds reclaim this land!",
				backgroundImage: "/scenes/rusty_boar_ruined.jpg",
				choices: [
					{
						label: "Assault the taproom! (Start Battle)",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: encounterId("assault_tavern_ambush"),
								background: "/battlegrounds/rusty_boar_assault.jpg",
							},
						],
					},
				],
			},
		},
	},

	[sceneId("victory_assault_tavern_ambush")]: {
		id: sceneId("victory_assault_tavern_ambush"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Arch-Druid Sylas",
				text: "The tavern is ours! The wilds will not be contained!",
				backgroundImage: "/scenes/rusty_boar_assault.jpg",
				choices: [
					{
						label: "Leave the tavern.",
						actions: [
							{
								type: "SET_FLAG",
								flagId: "tavern_cleared",
							},
							{
								type: "END_SCENE",
							},
						],
					},
				],
			},
		},
	},

	// --- ACT III (BRANCH B): ASSAULT IRONHOLD ---
	[sceneId("ironhold_defend_intro")]: {
		id: sceneId("ironhold_defend_intro"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Arch-Druid Sylas",
				text: "Nature Defilers! We will crush your puny resistance and tear down your stone walls!",
				backgroundImage: "/scenes/ironhold_throne_room.jpg",
				choices: [
					{
						label: "Defend the king.",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: encounterId("ironhold_arch_druid_boss"),
								background: "/battlegrounds/ironhold_throne_room.jpg",
							},
						],
					},
				],
			},
		},
	},
	[sceneId("ironhold_assault_intro")]: {
		id: sceneId("ironhold_assault_intro"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "King Tanotalos II",
				text: "Traitors! You dare march with the beasts against your own kind? I will crush you myself!",
				backgroundImage: "/scenes/ironhold_throne_room.jpg",
				choices: [
					{
						label: "Your reign ends today.",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: encounterId("ironhold_king_boss"),
								background: "/battlegrounds/ironhold_throne_room.jpg",
							},
						],
					},
				],
			},
		},
	},

	// --- THRONE ROOM BATTLE ---
	[sceneId("ironhold_siege_victory")]: {
		id: sceneId("ironhold_siege_victory"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "King Tanotalos II",
				text: "You saved us from the savage tide. The armory is yours. Take what you need to ensure they never return.",
				backgroundImage: "/scenes/ironhold_throne_room.jpg",
				choices: [
					{
						label: "Take the Iron rune.",
						actions: [
							{
								type: "REWARD_EVO_RUNE",
								evoRune: "rune_iron",
							},
							{ type: "SET_FLAG", flagId: "ironhold_saved" },
							{ type: "COMPLETE_QUEST", questId: VERDANT_RECLAMATION.id },
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},
	[sceneId("ironhold_assault_victory")]: {
		id: sceneId("ironhold_assault_victory"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Arch-Druid Sylas",
				text: "The iron is broken. The earth breathes again. Drink from the Heart-Tree's sap, champions, and let the wilds empower you.",
				backgroundImage: "/scenes/ironhold_throne_room_destroyed.jpg",
				choices: [
					{
						label: "Take the Nature rune.",
						actions: [
							{
								type: "REWARD_EVO_RUNE",
								evoRune: "rune_nature",
							},
							{ type: "SET_FLAG", flagId: "ironhold_fallen" },
							{ type: "COMPLETE_QUEST", questId: VERDANT_RECLAMATION.id },
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},
};
