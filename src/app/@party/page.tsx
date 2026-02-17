"use client";

import { HeroCard } from "@/components/HeroCard";
import { useBattleStore } from "@/store/battle.store";

export default function PartySidebar() {
	const heroes = useBattleStore((state) => state.heroes);

	return (
		<section className="h-full w-full flex flex-col gap-4 relative">
			<div className="flex-1 flex flex-col justify-around overflow-y-auto no-scrollbar">
				{heroes.map((hero) => (
					<HeroCard {...hero} key={hero.id} />
				))}
			</div>
		</section>
	);
}
