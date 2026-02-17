"use client";

import { BattleGrid } from "@/components/BattleGrid";
import { useBattleStore } from "@/store/battle.store";

export default function Home() {
	const heroes = useBattleStore((state) => state.heroes);

	return (
		<section className="h-full w-full flex flex-col bg-zinc-950">
			<div className="flex-1 flex items-center justify-center p-8">
				<BattleGrid units={heroes} />
			</div>
		</section>
	);
}
