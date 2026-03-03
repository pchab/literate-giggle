import type { MapNode, NodeType } from "@/modules/world/domain/map.types";
import type {
	GamePhase,
	WorldStoreServerAction,
} from "@/modules/world/store/world.store";

export function travelToNode(
	nodeId: MapNode["id"],
	nodeType: NodeType,
): WorldStoreServerAction {
	return ({ mapData, currentNodeId }) => {
		const currentNode = mapData[currentNodeId];

		if (!currentNode.connectedNodeIds.includes(nodeId)) {
			console.warn("You cannot travel there from your current location.");
			return {};
		}

		let nextPhase: GamePhase = "MAP";
		if (nodeType === "BATTLE") nextPhase = "BATTLE";

		return {
			currentNodeId: nodeId,
			phase: nextPhase,
		};
	};
}
