import type { MapNode } from "@/modules/world/domain/map.types";
import type {
	GamePhase,
	WorldStoreServerAction,
} from "@/modules/world/store/world.store";

export function travelToNode(
	nodeId: MapNode["id"],
	dynamicMap: Record<MapNode["id"], MapNode>,
): WorldStoreServerAction {
	return () => {
		const nextNode = dynamicMap[nodeId];
		let nextPhase: GamePhase = "MAP";
		if (nextNode.type === "BATTLE") nextPhase = "BATTLE";

		return {
			currentNodeId: nodeId,
			phase: nextPhase,
		};
	};
}
