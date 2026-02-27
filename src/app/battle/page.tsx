"use client";

import { getImageProps } from "next/image";
import { redirect } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { BattleGrid } from "@/components/grid/BattleGrid";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { terrainImageMapping } from "@/modules/grid/terrains/terrains.data";
import { useBattleStore } from "@/store/battle.store";
import { useWorldStore } from "@/store/world.store";

function getBackgroundImage(srcSet = "") {
	const imageSet = srcSet
		.split(", ")
		.map((str) => {
			const [url, dpi] = str.split(" ");
			return `url("${url}") ${dpi}`;
		})
		.join(", ");
	return `image-set(${imageSet})`;
}

export default function Home() {
	const { heroes, monsters, cardUsageLog } = useBattleStore(
		useShallow((state) => ({
			heroes: state.heroes,
			monsters: state.monsters,
			cardUsageLog: state.cardUsageLog,
		})),
	);
	const { stageBattleRewards, mapData, currentNodeId } = useWorldStore(
		useShallow((state) => ({
			stageBattleRewards: state.stageBattleRewards,
			mapData: state.mapData,
			currentNodeId: state.currentNodeId,
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

	const terrainBgPath = terrainImageMapping[mapData[currentNodeId].terrain];
	const {
		props: { srcSet },
	} = getImageProps({ alt: "", width: 1200, height: 817, src: terrainBgPath });
	const backgroundImage = getBackgroundImage(srcSet);

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
