"use client";

import { redirect } from "next/navigation";
import { useBattleStore } from "@/store/battle.store";
import { useWorldStore } from "@/store/world.store";

export default function Home() {
	const { phase, roster, mapData, currentNodeId } = useWorldStore();
	const { initBattle } = useBattleStore();

	switch (phase) {
		case "MAP":
			return redirect("/world");
		case "BATTLE": {
			const currentNode = mapData[currentNodeId];
			if (currentNode.encounterId) {
				initBattle(roster, currentNode.encounterId);
			}
			return redirect("/battle");
		}
		case "CAMP":
			return redirect("/camp");
		case "REWARD":
			return redirect("/reward");
	}
}
