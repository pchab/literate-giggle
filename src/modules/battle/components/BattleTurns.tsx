"use client";

import type { Encounter } from "@/modules/campaign/domain/encounters.type";
import { useBattleTurns } from "../hooks/useBattleTurns";

export default function BattleTurns({
	encounterId,
}: {
	encounterId: Encounter["id"];
}) {
	const { isPlayerTurn } = useBattleTurns(encounterId);
	return (
		<div className="flex justify-center w-full my-4 pointer-events-none z-50">
			<div
				className={`
          px-4 py-1 rounded-full font-bold text-xs tracking-widest uppercase shadow-lg transition-all duration-500 backdrop-blur-sm
          ${
						isPlayerTurn
							? "bg-blue-600/80 text-blue-50 border border-blue-400/50 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
							: "bg-red-800/80 text-red-50 border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
					}
        `}
			>
				{isPlayerTurn ? "Player Turn" : "Enemy Turn"}
			</div>
		</div>
	);
}
