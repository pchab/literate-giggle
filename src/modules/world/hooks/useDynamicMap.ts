import {
	checkCondition,
	useCheckConditions,
} from "@/modules/campaign/hooks/useCheckConditions.hook";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import type { CampaignCondition } from "@/modules/world/domain/map.types";
import { WorldMapNodes } from "../data/mapNodes.data";
import type { MapNode } from "../domain/map.types";
import { useWorldStore } from "../store/world.store";

function buildDynamicMap(
	isConditionMet: (condition?: CampaignCondition) => boolean,
	currentNodeId: MapNode["id"],
) {
	return Object.values(WorldMapNodes).reduce<Record<string, MapNode>>(
		(acc, { variants, ...baseNode }) => {
			const variantNode = (variants || []).reduce((current, variant) => {
				if (isConditionMet(variant.condition)) {
					Object.assign(current, variant.override);
					return current;
				}
				return current;
			}, baseNode);

			const conditions = variantNode.unlockCondition;

			// Never lock the node the party stands on, or the map has nowhere to start from.
			if (
				variantNode.id !== currentNodeId &&
				conditions &&
				!conditions.some((cond) => isConditionMet(cond))
			) {
				return acc;
			}
			acc[variantNode.id] = variantNode;
			return acc;
		},
		{},
	);
}

/** The map as it is right now, outside React (e.g. after a scene action changed the campaign). */
export function getDynamicMap() {
	const state = useCampaignStore.getState();
	return buildDynamicMap(
		(condition) => checkCondition(condition, state),
		useWorldStore.getState().currentNodeId,
	);
}

export function useDynamicMap() {
	const isConditionMet = useCheckConditions();
	const currentNodeId = useWorldStore((state) => state.currentNodeId);
	return buildDynamicMap(isConditionMet, currentNodeId);
}
