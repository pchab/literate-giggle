import { townId } from "@/modules/towns/domain/towns.type";
import { type MapData, mapNodeId } from "@/modules/world/domain/map.types";
import { encounterId } from "../../domain/encounters.type";
import { VERDANT_RECLAMATION } from "./verdantReclamation.quest";

export const VERDANT_RECLAMATION_MAP_NODES: MapData = {
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
		type: "ROAD",
		encounterId: encounterId("elven_commander"),
		position: { x: 47, y: 46 },
		connectedNodeIds: [
			"ironhold_city",
			"peaks_logging_camp",
			"northern_treant_army",
			"western_weavers_army",
			"southern_beastmaster_army",
			"heart_tree",
		],
		background: "/battlegrounds/kiven_dam_hostile.webp",
		unlockCondition: [
			{
				type: "QUEST_ACTIVE",
				questId: VERDANT_RECLAMATION.id,
			},
			{
				type: "QUEST_COMPLETED",
				questId: VERDANT_RECLAMATION.id,
			}
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
					type: "EVENT",
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
