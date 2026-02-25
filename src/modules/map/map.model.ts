import { createEncounterId, type Encounter } from "./encounters.data";

export type NodeType = "TOWN" | "BATTLE" | "CAMP" | "EVENT";

export interface MapNode {
	id: string;
	name: string;
	type: NodeType;
	position: { x: number; y: number }; // CSS percentages (0-100)
	connectedNodeIds: string[];
	encounterId?: Encounter["id"];
}

export type MapData = Record<string, MapNode>;

// A simple starting layout with backtracking!
export const PROTOTYPE_MAP: MapData = {
	start_town: {
		id: "start_town",
		name: "Oakhaven Village",
		type: "TOWN",
		position: { x: 50, y: 85 }, // Bottom center
		connectedNodeIds: ["crossroads"],
	},
	crossroads: {
		id: "crossroads",
		name: "The King's Road",
		type: "BATTLE",
		position: { x: 50, y: 60 },
		connectedNodeIds: ["start_town", "ruined_tower", "dark_forest"],
		encounterId: createEncounterId("tutorial_fight"),
	},
	ruined_tower: {
		id: "ruined_tower",
		name: "Ruined Tower",
		type: "CAMP",
		position: { x: 30, y: 40 },
		connectedNodeIds: ["crossroads"],
	},
	dark_forest: {
		id: "dark_forest",
		name: "Deep Dark Forest",
		type: "BATTLE",
		position: { x: 70, y: 40 },
		connectedNodeIds: ["crossroads"],
		encounterId: createEncounterId("forest_ambush"),
	},
};
