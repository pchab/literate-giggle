"use client";

import { BattleGrid } from "@/components/BattleGrid";
import { useBattleStore } from "@/store/battle.store";
import { useShallow } from "zustand/shallow";

export default function Home() {
	const { heroes, resetBattle } = useBattleStore(
		useShallow((state) => ({
			heroes: state.heroes,
			resetBattle: state.resetBattle,
		})),
	);

	return (
		<section className="h-full w-full flex flex-col bg-zinc-950">
			<div className="flex-1 flex items-center justify-center p-8">
				<button
					type="button"
					className="absolute top-0 right-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					onClick={() => resetBattle()}
				>
					RESET BATTLE
				</button>
				<BattleGrid units={heroes} />
			</div>
		</section>
	);
}
