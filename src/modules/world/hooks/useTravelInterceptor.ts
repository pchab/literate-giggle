import { redirect } from "next/navigation";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import type { MapNode } from "@/modules/world/domain/map.types";
import { useWorldStore } from "@/modules/world/store/world.store";
import { useDynamicMap } from "./useDynamicMap";

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
	const dynamicMap = useDynamicMap();

	const handleNodeClick = (nodeId: MapNode["id"]) => {
		const currentNode = dynamicMap[currentNodeId];
		const targetNode = dynamicMap[nodeId];
		const sceneId = getOverride(nodeId, "onEnter");

		// 1. If clicking the Town you are currently standing on, just open the town menu.
		if (currentNode?.type === "TOWN" && currentNodeId === nodeId) {
			setPhase("TOWN");
			return;
		}

		// 2. Validate the path
		if (!currentNode?.connectedNodeIds.includes(nodeId)) {
			console.warn("You cannot travel there from your current location.");
			return;
		}

		// 3. Move the player's token on the map
		travelToNode(nodeId, dynamicMap);

		// 4. The Interceptor Logic: Determine the next Phase
		if (sceneId) {
			setPhase("SCENE");
			setActiveSceneId(sceneId);
		} else {
			switch (targetNode.type) {
				case "BATTLE":
					setPhase("BATTLE");
					break;
				case "TOWN":
					setPhase("TOWN");
					break;
				case "CAMP":
					setPhase("CAMP");
					break;
				case "EVENT":
					console.warn(
						`Arrived at EVENT node ${nodeId}, but no scene was provided.`,
					);
					break;
			}
		}

		// 5. Trigger the travel transition
		setIsTraveling(true);
		setTimeout(() => {
			setIsTraveling(false);
			redirect("/");
		}, 300);
	};

	return { handleNodeClick, isTraveling };
}
