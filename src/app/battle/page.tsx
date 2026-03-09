"use client";

import { redirect } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { BattleGrid } from "@/modules/battle/components/BattleGrid";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { getBackgroundImage } from "@/modules/shared/helpers/backgroundImage.helpers";
import { useWorldStore } from "@/modules/world/store/world.store";

export default function Home() {
	const { heroes, monsters, background } = useBattleStore(
		useShallow((state) => ({
			heroes: state.heroes,
			monsters: state.monsters,
			background: state.background,
		})),
	);
	const { phase, stageBattleRewards } = useWorldStore(
		useShallow((state) => ({
			phase: state.phase,
			stageBattleRewards: state.stageBattleRewards,
		})),
	);

	if (phase !== "BATTLE") {
		setTimeout(() => {
			redirect("/");
		}, 300);
	}

	const isBattleWon = monsters.every((monster) => monster.currentHp <= 0);
	if (isBattleWon) {
		const remainingHealth = heroes.reduce(
			(acc, hero) => {
				acc[hero.id] = hero.currentHp;
				return acc;
			},
			{} as Record<Hero["id"], number>,
		);

		stageBattleRewards(remainingHealth);
	}

	const backgroundImage = getBackgroundImage(background, 1200, 817);

	return (
		<section
			className="h-full w-full flex flex-col"
			style={{
				backgroundImage,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="flex-1 flex items-center justify-center p-8">
				<BattleGrid />
			</div>
		</section>
	);
}
