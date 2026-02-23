export type NodeType = "battle" | "elite" | "camp" | "boss" | "event";

export interface MapNode {
	id: string;
	type: NodeType;
	name: string;
	nextNodes: string[]; // IDs of nodes you can travel to from here
}

export interface MapTier {
	tier: number;
	nodes: MapNode[];
}

// A simple hardcoded prototype map
export const PROTOTYPE_MAP: MapTier[] = [
	{
		tier: 0,
		nodes: [
			{
				id: "start",
				type: "camp",
				name: "Safe Haven",
				nextNodes: ["b1", "b2"],
			},
		],
	},
	{
		tier: 1,
		nodes: [
			{ id: "b1", type: "battle", name: "Dark Woods", nextNodes: ["c1"] },
			{ id: "b2", type: "battle", name: "Swamp Edge", nextNodes: ["c1", "e1"] },
		],
	},
	{
		tier: 2,
		nodes: [
			{ id: "c1", type: "camp", name: "Ruined Shrine", nextNodes: ["boss1"] },
			{ id: "e1", type: "elite", name: "Crypt Entrance", nextNodes: ["boss1"] },
		],
	},
	{
		tier: 3,
		nodes: [
			{ id: "boss1", type: "boss", name: "The Bone King", nextNodes: [] },
		],
	},
];
