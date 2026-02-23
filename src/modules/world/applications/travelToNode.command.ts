import type { NodeType } from "@/modules/map/map.model";
import type { WorldStoreServerAction } from "@/store/world.store";

export function travelToNode(
	nodeId: string,
	nodeType: NodeType,
): WorldStoreServerAction {
	return () => {
		if (nodeType === "battle" || nodeType === "elite" || nodeType === "boss") {
			return { currentNodeId: nodeId, phase: "BATTLE" };
		}
		if (nodeType === "camp") {
			return { currentNodeId: nodeId, phase: "CAMP" };
		}
		return { currentNodeId: nodeId };
	};
}
