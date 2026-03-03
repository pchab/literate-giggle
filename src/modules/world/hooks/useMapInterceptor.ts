// src/modules/campaign/useMapInterceptor.ts
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import type { MapNode, NodeType } from "@/modules/world/domain/map.types";
import { useWorldStore } from "@/modules/world/store/world.store";

export function useMapInterceptor() {
	const router = useRouter();
	const [isTraveling, setIsTraveling] = useState(false);

	const { getOverride, setActiveSceneId } = useCampaignStore(
		useShallow((state) => ({
			getOverride: state.getOverride,
			setActiveSceneId: state.setActiveSceneId,
		})),
	);

	const { travelToNode, mapData, currentNodeId, setPhase } = useWorldStore(
		useShallow((state) => ({
			travelToNode: state.travelToNode,
			mapData: state.mapData,
			currentNodeId: state.currentNodeId,
			setPhase: state.setPhase,
		})),
	);

	const handleNodeClick = (nodeId: MapNode["id"], nodeType: NodeType) => {
		const currentNode = mapData[currentNodeId];

		if (!currentNode?.connectedNodeIds.includes(nodeId)) {
			console.warn("You cannot travel there from your current location.");
			return;
		}
		const sceneId = getOverride(nodeId, "onEnter");
		travelToNode(nodeId, nodeType);

		if (sceneId) {
			setPhase("SCENE");
			setActiveSceneId(sceneId);
		}
		setIsTraveling(true);
		setTimeout(() => {
			router.push("/");
			setIsTraveling(false);
		}, 500);
	};

	return { handleNodeClick, isTraveling };
}
