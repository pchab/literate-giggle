import { QUEST_DWARVEN_HIGHWAY } from "@/modules/campaign/data/dwarven-passage/dwarvenPassage.quest";
import { VERDANT_RECLAMATION_MAP_NODES } from "@/modules/campaign/data/verdant-reclamation/verdantReclamation.mapNodes";
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
		background: "ironhold_gates",
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
			{
				condition: {
					type: "QUEST_ACTIVE",
					questId: VERDANT_RECLAMATION.id,
					stepId: [VERDANT_RECLAMATION.steps.assault_ironhold],
				},
				override: {
					name: "Ironhold (Under Siege)",
					townId: townId("ironhold_assault"),
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
		background: "plain_crossroad",
	},
	wizard_tower: {
		id: mapNodeId("wizard_tower"),
		name: "Wizard Tower",
		type: "EVENT",
		position: { x: 70, y: 64 },
		connectedNodeIds: [mapNodeId("crossroads"), mapNodeId("port_city")],
		background: "dungeon",
	},
	port_city: {
		id: mapNodeId("port_city"),
		name: "Port City",
		type: "TOWN",
		townId: townId("port_city"),
		position: { x: 80, y: 70 },
		connectedNodeIds: [
			mapNodeId("wizard_tower"),
			mapNodeId("whispering_woods"),
		],
		background: "city",
	},
	desert_ruins: {
		id: mapNodeId("desert_ruins"),
		name: "Desert Ruins",
		type: "BATTLE",
		position: { x: 52, y: 80 },
		connectedNodeIds: [mapNodeId("crossroads"), mapNodeId("cromee_town")],
		encounterId: encounterId("skeleton_horde"),
		background: "desert_ruins",
	},
	cromee_town: {
		id: mapNodeId("cromee_town"),
		name: "Cromee Town",
		type: "TOWN",
		townId: townId("cromee_town"),
		position: { x: 49, y: 67 },
		connectedNodeIds: [mapNodeId("desert_ruins")],
		background: "city",
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
		background: "plain_crossroad",
	},
	dark_forest: {
		id: mapNodeId("dark_forest"),
		name: "Deep Dark Forest",
		type: "BATTLE",
		position: { x: 67, y: 22 },
		connectedNodeIds: [mapNodeId("northern_road"), mapNodeId("connury_town")],
		encounterId: encounterId("bat_swarm"),
		background: "forest",
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
	whispering_woods: {
		id: mapNodeId("whispering_woods"),
		name: "Whispering Woods",
		type: "BATTLE",
		position: { x: 72, y: 76 },
		connectedNodeIds: [mapNodeId("port_city"), mapNodeId("wizard_tower")],
		encounterId: encounterId("bat_swarm"),
		background: "forest",
	},
	connury_town: {
		id: mapNodeId("connury_town"),
		name: "Connury Town",
		type: "TOWN",
		townId: townId("connury_town"),
		position: { x: 75, y: 24 },
		connectedNodeIds: [mapNodeId("northern_road"), mapNodeId("dark_forest")],
		background: "city",
	},
	// --- DWARVEN PASSAGE QUEST NODES ---
	stone_gates: {
		id: mapNodeId("stone_gates"),
		name: "Stone Gate",
		type: "BATTLE",
		background: "cave",
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
		background: "mountain_city",
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
	...VERDANT_RECLAMATION_MAP_NODES,
};
