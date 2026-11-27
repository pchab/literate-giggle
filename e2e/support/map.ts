import { QUEST_DB } from "@/modules/campaign/data/quests.data";
import type { Quest, QuestStep } from "@/modules/campaign/domain/quests.type";
import { WorldMapNodes } from "@/modules/world/data/mapNodes.data";
import type {
	CampaignCondition,
	MapNode,
} from "@/modules/world/domain/map.types";
import type { CampaignSave } from "./state";

/** Same rules as useCheckConditions, against a saved campaign. */
function conditionMet(c: CampaignCondition | undefined, camp: CampaignSave) {
	if (!c) return true;
	switch (c.type) {
		case "QUEST_COMPLETED":
			return camp.completedQuests.includes(c.questId);
		case "QUEST_ACTIVE": {
			const step = camp.activeQuests[c.questId];
			if (!step) return false;
			return c.stepId ? (c.stepId as string[]).includes(step) : true;
		}
		case "HAS_FLAG":
			return camp.flags.includes(c.flagId);
		default:
			return false;
	}
}

/** Same rules as useDynamicMap: variants applied in order, any unlock condition, current node kept. */
export function dynamicMap(camp: CampaignSave, currentNodeId: string) {
	const map: Record<string, MapNode> = {};
	for (const { variants, ...base } of Object.values(WorldMapNodes)) {
		const node = { ...base } as MapNode;
		for (const v of variants ?? []) {
			if (conditionMet(v.condition, camp)) Object.assign(node, v.override);
		}
		const unlock = node.unlockCondition;
		if (
			node.id !== currentNodeId &&
			unlock &&
			!unlock.some((c) => conditionMet(c, camp))
		)
			continue;
		map[node.id] = node;
	}
	return map;
}

export function shortestPath(
	map: Record<string, MapNode>,
	from: string,
	to: string,
): string[] | null {
	const prev = new Map<string, string | null>([[from, null]]);
	const queue = [from];
	while (queue.length) {
		const n = queue.shift() as string;
		if (n === to) {
			const path: string[] = [];
			for (let at: string | null = n; at; at = prev.get(at) ?? null)
				path.unshift(at);
			return path;
		}
		for (const m of map[n]?.connectedNodeIds ?? []) {
			if (map[m] && !prev.has(m)) {
				prev.set(m, n);
				queue.push(m);
			}
		}
	}
	return null;
}

export function questTargets(questId: string, stepId: string) {
	const quest = QUEST_DB[questId as Quest["id"]];
	return quest?.steps[stepId as QuestStep["id"]]?.targetNodeId ?? [];
}
