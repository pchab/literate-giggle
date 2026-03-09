"use client";

import { redirect } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import { useDynamicMap } from "@/modules/world/hooks/useDynamicMap";
import { useWorldStore } from "@/modules/world/store/world.store";

function redirectToPhase(path: string) {
	setTimeout(() => redirect(path), 300);
}

export default function Home() {
	const {
		phase,
		roster,
		currentNodeId,
		unlockedQuestsQueue,
		clearUnlockedQuestsQueue,
	} = useWorldStore(
		useShallow((state) => ({
			phase: state.phase,
			roster: state.roster,
			currentNodeId: state.currentNodeId,
			unlockedQuestsQueue: state.unlockedQuestsQueue,
			clearUnlockedQuestsQueue: state.clearUnlockedQuestsQueue,
		})),
	);
	const { initBattle } = useBattleStore(
		useShallow((state) => ({
			initBattle: state.initBattle,
		})),
	);
	const { activeSceneId, unlockQuest } = useCampaignStore(
		useShallow((state) => ({
			activeSceneId: state.activeSceneId,
			unlockQuest: state.unlockQuest,
		})),
	);
	const dynamicMap = useDynamicMap();

	if (unlockedQuestsQueue.length > 0) {
		unlockedQuestsQueue.forEach((questId) => {
			unlockQuest(questId);
		});
		clearUnlockedQuestsQueue();
	}

	const currentNode = dynamicMap[currentNodeId];
	switch (phase) {
		case "MAP":
			return redirectToPhase("/world");
		case "BATTLE": {
			if (currentNode.encounterId) {
				initBattle(roster, currentNode.encounterId, currentNode.background);
			}
			return redirectToPhase("/battle");
		}
		case "TOWN":
			return redirectToPhase(`/towns/${currentNode.townId}`);
		case "SCENE":
			return redirectToPhase(`/scenes/${activeSceneId}`);
		case "REWARD":
			return redirectToPhase("/reward");
	}
}
