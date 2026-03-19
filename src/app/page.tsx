"use client";

import { redirect } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import { useDynamicMap } from "@/modules/world/hooks/useDynamicMap";
import { useWorldStore } from "@/modules/world/store/world.store";

function redirectToPhase(path: string) {
	setTimeout(() => redirect(path), 300);
}

export default function Home() {
	const {
		phase,
		currentNodeId,
		unlockedQuestsQueue,
		clearUnlockedQuestsQueue,
	} = useWorldStore(
		useShallow((state) => ({
			phase: state.phase,
			currentNodeId: state.currentNodeId,
			unlockedQuestsQueue: state.unlockedQuestsQueue,
			clearUnlockedQuestsQueue: state.clearUnlockedQuestsQueue,
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
			redirectToPhase(
				`/battle/${currentNode.encounterId}?background=${currentNode.background}`,
			);
			break;
		}
		case "TOWN":
			return redirectToPhase(`/towns/${currentNode.townId}`);
		case "SCENE":
			return redirectToPhase(`/scenes/${activeSceneId}`);
		case "REWARD":
			return redirectToPhase("/reward");
		default:
			redirect("/start");
	}
}
