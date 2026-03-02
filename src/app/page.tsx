"use client";

import { redirect } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/store/battle.store";
import { useCampaignStore } from "@/store/campaign.store";
import { useWorldStore } from "@/store/world.store";
import { terrainImageMapping } from "@/modules/grid/terrains/terrains.data";

export default function Home() {
	const {
		phase,
		roster,
		mapData,
		currentNodeId,
		unlockedQuestsQueue,
		clearUnlockedQuestsQueue,
	} = useWorldStore(
		useShallow((state) => ({
			phase: state.phase,
			roster: state.roster,
			mapData: state.mapData,
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

	switch (phase) {
		case "MAP":
			return redirect("/world");
		case "BATTLE": {
			const currentNode = mapData[currentNodeId];
			if (currentNode.encounterId) {
				initBattle(roster, currentNode.encounterId, terrainImageMapping[currentNode.terrain]);
			}
			return redirect("/battle");
		}
		case "SCENE":
			return redirect(`/scenes/${activeSceneId}`);
		case "REWARD":
			return redirect("/reward");
	}
}
