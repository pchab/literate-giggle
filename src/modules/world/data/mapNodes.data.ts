import { QUEST_DWARVEN_HIGHWAY } from "@/modules/campaign/data/dwarven-passage/dwarvenPassage.quest";
import { VERDANT_RECLAMATION } from "@/modules/campaign/data/verdant-reclamation/verdantReclamation.quest";
import { encounterId } from "@/modules/campaign/domain/encounters.type";
import { townId } from "@/modules/towns/domain/towns.type";
import { type MapData, mapNodeId } from "../../world/domain/map.types";

export const WorldMapNodes: MapData = {
	// --- THE BASTION ---
	ironhold_city: {
		id: mapNodeId("ironhold_city"),
		name: "Ironhold City",
		type: "TOWN",
		townId: townId("ironhold_city"),
		position: { x: 58, y: 45 },
		connectedNodeIds: ["northern_road", "crossroads", "kiven_river_bridge"],
		background: "/battlegrounds/ironhold_gates.webp",
		variants: [
			{
				condition: { type: "HAS_FLAG", flagId: "ironhold_fallen" },
				override: {
					name: "Verdantreach (Former Ironhold)",
					townId: townId("ironhold_elven"),
				},
			},
			{
				condition: {
					type: "QUEST_ACTIVE",
					questId: VERDANT_RECLAMATION.id,
					stepId: [VERDANT_RECLAMATION.steps.defend_ironhold],
				},
				override: {
					name: "Ironhold (Under Siege)",
					townId: townId("ironhold_defense"),
				},
			},
		],
	},

	// Available at start of game
	crossroads: {
		id: mapNodeId("crossroads"),
		name: "The King's Road",
		type: "BATTLE",
		position: { x: 62, y: 60 },
		connectedNodeIds: [
			mapNodeId("ironhold_city"),
			mapNodeId("wizard_tower"),
			mapNodeId("desert_ruins"),
		],
		encounterId: encounterId("tutorial_fight"),
		background: "/battlegrounds/plain_crossroad.webp",
	},
	wizard_tower: {
		id: mapNodeId("wizard_tower"),
		name: "Wizard Tower",
		type: "EVENT",
		position: { x: 70, y: 64 },
		connectedNodeIds: [mapNodeId("crossroads"), mapNodeId("port_city")],
		background: "/battlegrounds/dungeon.webp",
	},
	port_city: {
		id: mapNodeId("port_city"),
		name: "Port City",
		type: "TOWN",
		townId: townId("port_city"),
		position: { x: 80, y: 70 },
		connectedNodeIds: [mapNodeId("wizard_tower")],
		background: "/battlegrounds/city.webp",
	},
	desert_ruins: {
		id: mapNodeId("desert_ruins"),
		name: "Desert Ruins",
		type: "BATTLE",
		position: { x: 52, y: 80 },
		connectedNodeIds: [mapNodeId("crossroads"), mapNodeId("cromee_town")],
		encounterId: encounterId("skeleton_horde"),
		background: "/battlegrounds/desert_ruins.webp",
	},
	cromee_town: {
		id: mapNodeId("cromee_town"),
		name: "Cromee Town",
		type: "TOWN",
		townId: townId("cromee_town"),
		position: { x: 49, y: 67 },
		connectedNodeIds: [mapNodeId("desert_ruins")],
		background: "/battlegrounds/city.webp",
	},
	northern_road: {
		id: mapNodeId("northern_road"),
		name: "Northern Road",
		type: "BATTLE",
		position: { x: 67, y: 35 },
		connectedNodeIds: [
			mapNodeId("ironhold_city"),
			mapNodeId("connury_town"),
			mapNodeId("dark_forest"),
		],
		encounterId: encounterId("cultists_ambush"),
		background: "/battlegrounds/plain_crossroad.webp",
	},
	dark_forest: {
		id: mapNodeId("dark_forest"),
		name: "Deep Dark Forest",
		type: "BATTLE",
		position: { x: 67, y: 22 },
		connectedNodeIds: [mapNodeId("northern_road"), mapNodeId("connury_town")],
		encounterId: encounterId("bat_swarm"),
		background: "/battlegrounds/forest.webp",
		variants: [
			{
				condition: {
					type: "QUEST_ACTIVE",
					questId: QUEST_DWARVEN_HIGHWAY,
				},
				override: {
					connectedNodeIds: [
						mapNodeId("northern_road"),
						mapNodeId("connury_town"),
						mapNodeId("stone_gates"),
					],
				},
			},
			{
				condition: {
					type: "QUEST_COMPLETED",
					questId: QUEST_DWARVEN_HIGHWAY,
				},
				override: {
					connectedNodeIds: [
						mapNodeId("northern_road"),
						mapNodeId("connury_town"),
						mapNodeId("dwarven_passage"),
					],
				},
			},
		],
	},
	connury_town: {
		id: mapNodeId("connury_town"),
		name: "Connury Town",
		type: "TOWN",
		townId: townId("connury_town"),
		position: { x: 75, y: 24 },
		connectedNodeIds: [mapNodeId("northern_road"), mapNodeId("dark_forest")],
		background: "/battlegrounds/city.webp",
	},
	// --- DWARVEN PASSAGE QUEST NDOES ---
	stone_gates: {
		id: mapNodeId("stone_gates"),
		name: "Stone Gate",
		type: "BATTLE",
		background: "/battlegrounds/cave.webp",
		position: { x: 56, y: 18 },
		encounterId: encounterId("stone_gate_guards"),
		connectedNodeIds: [mapNodeId("dark_forest")],
		unlockCondition: [
			{
				type: "QUEST_ACTIVE",
				questId: QUEST_DWARVEN_HIGHWAY,
			},
		],
	},
	dwarven_passage: {
		id: mapNodeId("dwarven_passage"),
		name: "Dwarven City",
		type: "EVENT",
		background: "/battlegrounds/mountain_city.webp",
		position: { x: 52, y: 16 },
		connectedNodeIds: [mapNodeId("dark_forest")],
		unlockCondition: [
			{
				type: "QUEST_COMPLETED",
				questId: QUEST_DWARVEN_HIGHWAY,
			},
		],
	},

	// --- VERDANT RECLAMATION QUEST NODES ---
	peaks_logging_camp: {
		id: mapNodeId("peaks_logging_camp"),
		name: "Peaks Logging Camp",
		type: "EVENT",
		position: { x: 40, y: 49 },
		connectedNodeIds: ["kiven_river_bridge"],
		background: "/battlegrounds/logging_camp_ruins.webp",
		unlockCondition: [
			{
				type: "QUEST_ACTIVE",
				questId: VERDANT_RECLAMATION.id,
				stepId: [VERDANT_RECLAMATION.steps.investigate_camp],
			},
		],
	},

	kiven_river_bridge: {
		id: mapNodeId("kiven_river_bridge"),
		name: "Kiven River Bridge",
		type: "EVENT",
		encounterId: encounterId("elven_commander"),
		position: { x: 47, y: 46 },
		connectedNodeIds: [
			"ironhold_city",
			"peaks_logging_camp",
			"northern_treant_army",
			"western_weavers_army",
			"southern_beastmaster_army",
		],
		background: "/battlegrounds/kiven_dam_hostile.webp",
		unlockCondition: [
			{
				type: "QUEST_ACTIVE",
				questId: VERDANT_RECLAMATION.id,
			},
		],
		variants: [
			{
				condition: {
					type: "QUEST_ACTIVE",
					questId: VERDANT_RECLAMATION.id,
					stepId: [VERDANT_RECLAMATION.steps.the_ultimatum],
				},
				override: {
					type: "BATTLE",
				},
			},
			{
				condition: { type: "HAS_FLAG", flagId: "aligned_with_forest" },
				override: {
					name: "Allied Weaver Camp",
					type: "CAMP",
					encounterId: undefined,
					background: "/camps/river_bridge_safe.webp",
				},
			},
			// Last battle against the remaining army.
			{
				condition: {
					type: "QUEST_ACTIVE",
					questId: VERDANT_RECLAMATION.id,
					stepId: [VERDANT_RECLAMATION.steps.stop_invasion_N],
				},
				override: {
					name: "Contested River Bridge",
					type: "BATTLE",
					encounterId: encounterId("treant_bruisers"),
					background: "/camps/kiven_bridge_hostile.webp",
				},
			},
			{
				condition: {
					type: "QUEST_ACTIVE",
					questId: VERDANT_RECLAMATION.id,
					stepId: [VERDANT_RECLAMATION.steps.stop_invasion_W],
				},
				override: {
					name: "Contested River Bridge",
					type: "BATTLE",
					encounterId: encounterId("elven_weavers"),
					background: "/camps/kiven_bridge_hostile.webp",
				},
			},
			{
				condition: {
					type: "QUEST_ACTIVE",
					questId: VERDANT_RECLAMATION.id,
					stepId: [VERDANT_RECLAMATION.steps.stop_invasion_S],
				},
				override: {
					name: "Contested River Bridge",
					type: "BATTLE",
					encounterId: encounterId("beastmasters"),
					background: "/camps/kiven_bridge_hostile.webp",
				},
			},
		],
	},

	// --- THE SECRET ELVEN BASE ---
	heart_tree: {
		id: mapNodeId("heart_tree"),
		name: "The Heart-Tree",
		type: "TOWN",
		townId: townId("heart_tree_sanctuary"),
		position: { x: 15, y: 20 },
		connectedNodeIds: ["kiven_river_bridge"],
		background: "/battlegrounds/heart_tree.webp",
		unlockCondition: [{ type: "HAS_FLAG", flagId: "aligned_with_forest" }],
	},

	// --- FRONT 1: THE NORTH ---
	northern_treant_army: {
		id: mapNodeId("northern_treant_army"),
		name: "Northern Treant Army",
		type: "BATTLE",
		encounterId: encounterId("treant_bruisers"),
		position: { x: 34, y: 28 },
		connectedNodeIds: ["kiven_river_bridge"],
		background: "/battlegrounds/plain.webp",
		unlockCondition: [
			{
				type: "QUEST_ACTIVE",
				questId: VERDANT_RECLAMATION.id,
				stepId: [
					VERDANT_RECLAMATION.steps.stop_invasion_N_W_S,
					VERDANT_RECLAMATION.steps.stop_invasion_N_S,
					VERDANT_RECLAMATION.steps.stop_invasion_N_W,
				],
			},
		],
		variants: [
			{
				condition: {
					type: "QUEST_ACTIVE",
					questId: VERDANT_RECLAMATION.id,
					stepId: [
						VERDANT_RECLAMATION.steps.stop_invasion_N_W,
						VERDANT_RECLAMATION.steps.stop_invasion_N_S,
					],
				},
				override: {
					position: { x: 42, y: 34 },
				},
			},
			{
				condition: { type: "HAS_FLAG", flagId: "north_cleared" },
				override: {
					unlockCondition: [],
				},
			},
			{
				condition: { type: "HAS_FLAG", flagId: "aligned_with_forest" },
				override: {
					unlockCondition: [],
				},
			},
		],
	},

	// --- FRONT 2: THE WEST ---
	western_weavers_army: {
		id: mapNodeId("western_weavers_army"),
		name: "Western Weavers Army",
		type: "BATTLE",
		encounterId: encounterId("elven_weavers"),
		position: { x: 32, y: 38 },
		connectedNodeIds: ["ironhold_city"],
		background: "/battlegrounds/plain_river.webp",
		unlockCondition: [
			{
				type: "QUEST_ACTIVE",
				questId: VERDANT_RECLAMATION.id,
				stepId: [
					VERDANT_RECLAMATION.steps.stop_invasion_N_W_S,
					VERDANT_RECLAMATION.steps.stop_invasion_N_W,
					VERDANT_RECLAMATION.steps.stop_invasion_W_S,
				],
			},
		],
		variants: [
			{
				condition: {
					type: "QUEST_ACTIVE",
					questId: VERDANT_RECLAMATION.id,
					stepId: [
						VERDANT_RECLAMATION.steps.stop_invasion_N_W,
						VERDANT_RECLAMATION.steps.stop_invasion_W_S,
					],
				},
				override: {
					position: { x: 40, y: 40 },
				},
			},
			{
				condition: { type: "HAS_FLAG", flagId: "west_cleared" },
				override: {
					unlockCondition: [],
				},
			},
			{
				condition: { type: "HAS_FLAG", flagId: "aligned_with_forest" },
				override: {
					unlockCondition: [],
				},
			},
		],
	},

	// --- FRONT 3: THE SOUTH ---
	southern_beastmaster_army: {
		id: mapNodeId("southern_beastmaster_army"),
		name: "Southern Beastmaster Army",
		type: "BATTLE",
		encounterId: encounterId("beastmasters"),
		position: { x: 30, y: 50 },
		connectedNodeIds: ["ironhold_city", "heart_tree"],
		background: "/battlegrounds/trade_road_ambush.webp",
		unlockCondition: [
			{
				type: "QUEST_ACTIVE",
				questId: VERDANT_RECLAMATION.id,
				stepId: [
					VERDANT_RECLAMATION.steps.stop_invasion_N_W_S,
					VERDANT_RECLAMATION.steps.stop_invasion_N_S,
					VERDANT_RECLAMATION.steps.stop_invasion_W_S,
				],
			},
		],
		variants: [
			{
				condition: {
					type: "QUEST_ACTIVE",
					questId: VERDANT_RECLAMATION.id,
					stepId: [
						VERDANT_RECLAMATION.steps.stop_invasion_N_S,
						VERDANT_RECLAMATION.steps.stop_invasion_W_S,
					],
				},
				override: {
					position: { x: 40, y: 50 },
				},
			},
			{
				condition: { type: "HAS_FLAG", flagId: "south_cleared" },
				override: {
					unlockCondition: [],
				},
			},
			{
				condition: { type: "HAS_FLAG", flagId: "aligned_with_forest" },
				override: {
					unlockCondition: [],
				},
			},
		],
	},
};
