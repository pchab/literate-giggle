"use client";

import { redirect } from "next/navigation";
import WorldMap from "@/components/WorldMap";
import { useBattleStore } from "@/store/battle.store";
import { useWorldStore } from "@/store/world.store";

export default function WorldScreen() {
	const { phase, roster, mapData, currentNodeId } = useWorldStore();
	const { initBattle } = useBattleStore();

	if (phase === "BATTLE") {
		const currentNode = mapData[currentNodeId];
		if (currentNode.encounterId) {
			initBattle(roster, currentNode.encounterId);
		}
		return redirect("/");
	}

	return <WorldMap />;
}
