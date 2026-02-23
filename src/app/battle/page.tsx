"use client";

import { redirect } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { BattleGrid } from "@/components/BattleGrid";
import type { Hero } from "@/modules/figures/figures.type";
import { useBattleStore } from "@/store/battle.store";
import { useWorldStore } from "@/store/world.store";

export default function Home() {
	const { heroes, monsters, cardUsageLog } = useBattleStore(
		useShallow((state) => ({
			heroes: state.heroes,
			monsters: state.monsters,
			cardUsageLog: state.cardUsageLog,
		})),
	);
	const { stageBattleRewards } = useWorldStore(
		useShallow((state) => ({
			stageBattleRewards: state.stageBattleRewards,
		})),
	);

	const isBattleWon = monsters.every((monster) => monster.currentHp <= 0);
	if (isBattleWon) {
		const remainingHealth = heroes.reduce(
			(acc, hero) => {
				acc[hero.id] = hero.currentHp;
				return acc;
			},
			{} as Record<Hero["id"], number>,
		);

		stageBattleRewards(remainingHealth, cardUsageLog);
		redirect("/");
	}

	return (
		<section className="h-full w-full flex flex-col bg-zinc-950">
			<div className="flex-1 flex items-center justify-center p-8">
				<BattleGrid units={heroes} />
			</div>
		</section>
	);
}
