import type { NodeType } from "@/modules/map/map.model";
import type { GamePhase, WorldStoreServerAction } from "@/store/world.store";

export function travelToNode(
	nodeId: string,
	nodeType: NodeType,
): WorldStoreServerAction {
	return ({ mapData, currentNodeId }) => {
		const currentNode = mapData[currentNodeId];

		// 1. Guard: Ensure the node is actually connected
		if (!currentNode.connectedNodeIds.includes(nodeId)) {
			console.warn("You cannot travel there from your current location.");
			return {};
		}

		// 2. Determine the next phase based on the node they walked into
		let nextPhase: GamePhase = "MAP";
		if (nodeType === "BATTLE") {
			// Check if they already beat this node!
			const isFinished = mapData[nodeId].isCompleted;
			nextPhase = isFinished ? "MAP" : "BATTLE";
		} else if (nodeType === "CAMP") nextPhase = "CAMP";

		return {
			currentNodeId: nodeId,
			phase: nextPhase,
		};
	};
}
