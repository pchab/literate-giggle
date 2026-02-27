import type { TerrainType } from "../grid/grid.type";
import { createEncounterId, type Encounter } from "./encounters.data";

export type NodeType = "TOWN" | "BATTLE" | "CAMP" | "EVENT";

export interface MapNode {
	id: string;
	name: string;
	type: NodeType;
	position: { x: number; y: number }; // CSS percentages (0-100)
	connectedNodeIds: string[];
	encounterId?: Encounter["id"];
	terrain: TerrainType;
}

export type MapData = Record<string, MapNode>;

// A simple starting layout with backtracking!
export const PROTOTYPE_MAP: MapData = {
	ironhold_city: {
		id: "ironhold_city",
		name: "Ironhold",
		type: "TOWN",
		position: { x: 58, y: 45 },
		connectedNodeIds: ["crossroads", "dark_forest", "northern_road"],
		terrain: "CITY",
	},
	crossroads: {
		id: "crossroads",
		name: "The King's Road",
		type: "BATTLE",
		position: { x: 62, y: 60 },
		connectedNodeIds: [
			"ironhold_city",
			"wizard_tower",
			"dark_forest",
			"desert_ruins",
		],
		encounterId: createEncounterId("tutorial_fight"),
		terrain: "GRASS",
	},
	wizard_tower: {
		id: "wizard_tower",
		name: "Wizard Tower",
		type: "CAMP",
		position: { x: 70, y: 64 },
		connectedNodeIds: ["crossroads", "port_city"],
		terrain: "DUNGEON",
	},
	dark_forest: {
		id: "dark_forest",
		name: "Deep Dark Forest",
		type: "BATTLE",
		position: { x: 50, y: 56 },
		connectedNodeIds: ["crossroads", "ironhold_city", "cromee_town"],
		encounterId: createEncounterId("bat_swarm"),
		terrain: "FOREST",
	},
	port_city: {
		id: "port_city",
		name: "Port City",
		type: "TOWN",
		position: { x: 80, y: 70 },
		connectedNodeIds: ["wizard_tower"],
		terrain: "CITY",
	},
	desert_ruins: {
		id: "desert_ruins",
		name: "Desert Ruins",
		type: "BATTLE",
		position: { x: 52, y: 80 },
		connectedNodeIds: ["crossroads", "cromee_town"],
		encounterId: createEncounterId("skeleton_horde"),
		terrain: "RUINS",
	},
	cromee_town: {
		id: "cromee_town",
		name: "Cromee Town",
		type: "TOWN",
		position: { x: 49, y: 67 },
		connectedNodeIds: ["desert_ruins", "dark_forest"],
		terrain: "CITY",
	},
	northern_road: {
		id: "northern_road",
		name: "Northern Road",
		type: "BATTLE",
		position: { x: 67, y: 35 },
		connectedNodeIds: ["ironhold_city", "connury_town"],
		encounterId: createEncounterId("cultists_ambush"),
		terrain: "GRASS",
	},
	connury_town: {
		id: "connury_town",
		name: "Connury Town",
		type: "TOWN",
		position: { x: 75, y: 24 },
		connectedNodeIds: ["northern_road"],
		terrain: "CITY",
	},
};
