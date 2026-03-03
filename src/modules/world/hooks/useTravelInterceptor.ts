// src/modules/campaign/useMapInterceptor.ts
import { redirect } from "next/navigation";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import type { MapNode } from "@/modules/world/domain/map.types";
import { useWorldStore } from "@/modules/world/store/world.store";
import { WorldMapNodes } from "../data/mapNodes.data";

export function useTravelInterceptor() {
	const [isTraveling, setIsTraveling] = useState(false);

	const { getOverride, setActiveSceneId } = useCampaignStore(
		useShallow((state) => ({
			getOverride: state.getOverride,
			setActiveSceneId: state.setActiveSceneId,
		})),
	);

	const { travelToNode, currentNodeId, setPhase } = useWorldStore(
		useShallow((state) => ({
			travelToNode: state.travelToNode,
			currentNodeId: state.currentNodeId,
			setPhase: state.setPhase,
		})),
	);

	const handleNodeClick = (nodeId: MapNode["id"]) => {
		const currentNode = WorldMapNodes[currentNodeId];
		const sceneId = getOverride(nodeId, "onEnter");

		if (currentNode?.type === "TOWN" && currentNodeId === nodeId) {
			setPhase("TOWN");
		} else {
			if (!currentNode?.connectedNodeIds.includes(nodeId)) {
				console.warn("You cannot travel there from your current location.");
				return;
			}
			travelToNode(nodeId);
		}

		if (sceneId) {
			setPhase("SCENE");
			setActiveSceneId(sceneId);
		}
		setIsTraveling(true);
		setTimeout(() => {
			setIsTraveling(false);
			redirect("/");
		}, 500);
	};

	return { handleNodeClick, isTraveling };
}
