"use client";

import { useMemo } from "react";
import {
	type MapNode,
	type NodeType,
	useWorldStore,
} from "../store/world.store";

// Simple helper to get icons/colors for node types
const getNodeVisuals = (type: NodeType) => {
	switch (type) {
		case "battle":
			return { color: "bg-red-900 border-red-500", icon: "⚔️" };
		case "elite":
			return { color: "bg-purple-900 border-purple-500", icon: "💀" };
		case "camp":
			return { color: "bg-green-900 border-green-500", icon: "🔥" };
		case "boss":
			return {
				color: "bg-red-950 border-red-600 outline outline-4 outline-red-900",
				icon: "👑",
			};
		case "event":
			return { color: "bg-blue-900 border-blue-500", icon: "?" };
		default:
			return { color: "bg-gray-800 border-gray-500", icon: "•" };
	}
};

export default function MapScreen() {
	const { mapData, currentNodeId, travelToNode } = useWorldStore();

	// Find where we currently are to determine what is clickable
	const {
		currentTierIndex,
		currentNodeData,
	}: { currentTierIndex: number; currentNodeData: MapNode } = useMemo(() => {
		let tierIndex = 0;
		let nodeData: MapNode | null = null;

		mapData.forEach((tier, index) => {
			const node = tier.nodes.find((n) => n.id === currentNodeId);
			if (node) {
				tierIndex = index;
				nodeData = node;
			}
		});
		if (!nodeData) {
			throw new Error(`Node ${currentNodeId} not found`);
		}

		return { currentTierIndex: tierIndex, currentNodeData: nodeData };
	}, [mapData, currentNodeId]);

	return (
		<div className="min-h-screen bg-gray-950 text-gray-300 p-8 flex flex-col items-center">
			<h1 className="text-3xl font-serif text-gray-400 mb-2">The Long Road</h1>
			<p className="text-gray-500 mb-12">Choose your next destination.</p>

			{/* Map Container - Flex row to read left to right */}
			<div className="flex flex-row items-center gap-16 overflow-x-auto p-8 border-2 border-gray-800 rounded-lg shadow-2xl bg-gray-900/50">
				{mapData.map(({ tier, nodes }) => {
					const isNextTier = tier === currentTierIndex + 1;

					return (
						<div key={tier} className="flex flex-col gap-8 relative">
							{nodes.map((node) => {
								const visuals = getNodeVisuals(node.type);
								const isCurrentNode = node.id === currentNodeId;
								// You can only click this node if it's in the next tier AND your current node connects to it
								const isClickable =
									isNextTier && currentNodeData?.nextNodes.includes(node.id);

								return (
									<button
										type="button"
										key={node.id}
										disabled={!isClickable}
										onClick={() => travelToNode(node.id, node.type)}
										className={`
                      w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300
                      border-2 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]
                      ${visuals.color}
                      ${isCurrentNode ? "ring-4 ring-white scale-110 opacity-100" : ""}
                      ${isClickable ? "hover:scale-110 hover:brightness-150 cursor-pointer opacity-100 animate-pulse" : ""}
                      ${!isCurrentNode && !isClickable ? "opacity-30 grayscale cursor-not-allowed" : ""}
                    `}
									>
										<span className="text-3xl mb-1 drop-shadow-md">
											{visuals.icon}
										</span>
										<span className="text-[10px] uppercase font-bold text-center leading-tight drop-shadow-md px-1">
											{node.name}
										</span>
									</button>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
}
