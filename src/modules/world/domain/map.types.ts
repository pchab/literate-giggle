import type { TerrainType } from "@/modules/battle/domain/grid.type";
import type { Encounter } from "../../battle/data/encounters.data";

export type NodeType = "TOWN" | "BATTLE" | "CAMP" | "EVENT";

export interface MapNode {
	id: string & { readonly __brand: "NodeId" };
	name: string;
	type: NodeType;
	position: { x: number; y: number }; // CSS percentages (0-100)
	connectedNodeIds: string[];
	encounterId?: Encounter["id"];
	terrain: TerrainType;
}

export function mapNodeId(id: string): MapNode["id"] {
	return id as MapNode["id"];
}

export type MapData = Record<string, MapNode>;
