import { useCheckConditions } from "@/modules/campaign/hooks/useCheckConditions.hook";
import { WorldMapNodes } from "../data/mapNodes.data";
import type { MapNode } from "../domain/map.types";

export function useDynamicMap() {
	const isConditionMet = useCheckConditions();

	const activeMap = Object.values(WorldMapNodes).reduce<
		Record<string, MapNode>
	>((acc, { variants, ...baseNode }) => {
		const variantNode = (variants || []).reduce((current, variant) => {
			if (isConditionMet(variant.condition)) {
				Object.assign(current, variant.override);
				return current;
			}
			return current;
		}, baseNode);

		const conditions = variantNode.unlockCondition;

		if (conditions && !conditions.some((cond) => isConditionMet(cond))) {
			return acc;
		}
		acc[variantNode.id] = variantNode;
		return acc;
	}, {});

	return activeMap;
}
