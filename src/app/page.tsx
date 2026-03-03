"use client";

import { redirect } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import { WorldMapNodes } from "@/modules/world/data/mapNodes.data";
import { useWorldStore } from "@/modules/world/store/world.store";

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

	if (unlockedQuestsQueue.length > 0) {
		unlockedQuestsQueue.forEach((questId) => {
			unlockQuest(questId);
		});
		clearUnlockedQuestsQueue();
	}

	const currentNode = WorldMapNodes[currentNodeId];
	switch (phase) {
		case "MAP":
			return redirect("/world");
		case "BATTLE": {
			if (currentNode.encounterId) {
				initBattle(roster, currentNode.encounterId, currentNode.background);
			}
			return redirect("/battle");
		}
		case "TOWN":
			return redirect(`/towns/${currentNode.townId}`);
		case "SCENE":
			return redirect(`/scenes/${activeSceneId}`);
		case "REWARD":
			return redirect("/reward");
	}
}
