"use client";

import { useShallow } from "zustand/shallow";
import { useWorldStore } from "@/store/world.store";

export default function WorldMap() {
	const { mapData, currentNodeId, travelToNode } = useWorldStore(
		useShallow((state) => ({
			mapData: state.mapData,
			currentNodeId: state.currentNodeId,
			travelToNode: state.travelToNode,
		})),
	);

	const nodes = Object.values(mapData);
	const currentNode = mapData[currentNodeId];

	// Helper colors for the node types
	const nodeColors = {
		TOWN: "bg-blue-500",
		BATTLE: "bg-red-500",
		CAMP: "bg-green-500",
		EVENT: "bg-purple-500",
	};

	return (
		<div className="relative w-full max-w-4xl h-[600px] bg-zinc-950 border-2 border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
			{/* 1. SVG LAYER: Draw the lines between connected nodes */}
			<svg className="absolute inset-0 w-full h-full pointer-events-none">
				<title>Connecting lines</title>
				{nodes.map((node) =>
					node.connectedNodeIds.map((targetId) => {
						const targetNode = mapData[targetId];
						// Only draw lines in one direction to prevent double-drawing
						if (node.id > targetId) return null;

						const isTravelable =
							(node.id === currentNodeId &&
								currentNode.connectedNodeIds.includes(targetId)) ||
							(targetId === currentNodeId &&
								currentNode.connectedNodeIds.includes(node.id));

						return (
							<line
								key={`${node.id}-${targetId}`}
								x1={`${node.position.x}%`}
								y1={`${node.position.y}%`}
								x2={`${targetNode.position.x}%`}
								y2={`${targetNode.position.y}%`}
								stroke={isTravelable ? "#71717a" : "#27272a"} // Brighter line if you can walk it
								strokeWidth={isTravelable ? "4" : "2"}
								strokeDasharray="6 6"
							/>
						);
					}),
				)}
			</svg>

			{/* 2. HTML LAYER: Render the clickable locations */}
			{nodes.map((node) => {
				const isCurrentNode = node.id === currentNodeId;
				const isReachable = currentNode.connectedNodeIds.includes(node.id);

				return (
					<div
						key={node.id}
						className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
						style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
					>
						{/* Node Label */}
						<span className="mb-2 px-2 py-1 text-xs font-bold text-zinc-300 bg-zinc-900/80 rounded border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
							{node.name}
						</span>

						{/* Node Button */}
						<button
							type="button"
							onClick={() => {
								if (isReachable) travelToNode(node.id, node.type);
							}}
							disabled={!isReachable && !isCurrentNode}
							className={`
                                w-8 h-8 rounded-full border-2 transition-all duration-300 z-10
                                ${nodeColors[node.type]}
                                ${isCurrentNode ? "ring-4 ring-white border-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.5)]" : ""}
                                ${isReachable ? "cursor-pointer hover:scale-110 border-zinc-300 shadow-[0_0_10px_rgba(255,255,255,0.2)]" : ""}
                                ${!isReachable && !isCurrentNode ? "opacity-40 grayscale cursor-not-allowed border-zinc-700" : ""}
                            `}
						/>
					</div>
				);
			})}
		</div>
	);
}
