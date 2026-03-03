import type { MapNode } from "@/modules/world/domain/map.types";
import type {
	GamePhase,
	WorldStoreServerAction,
} from "@/modules/world/store/world.store";
import { WorldMapNodes } from "../../data/mapNodes.data";

export function travelToNode(nodeId: MapNode["id"]): WorldStoreServerAction {
	return ({ currentNodeId }) => {
		const currentNode = WorldMapNodes[currentNodeId];

		if (!currentNode.connectedNodeIds.includes(nodeId)) {
			console.warn("You cannot travel there from your current location.");
			return {};
		}

		const nextNode = WorldMapNodes[nodeId];
		let nextPhase: GamePhase = "MAP";
		if (nextNode.type === "BATTLE") nextPhase = "BATTLE";

		return {
			currentNodeId: nodeId,
			phase: nextPhase,
		};
	};
}
