"use client";

import { useBattleStore } from "@/modules/battle/store/battle.store";
import { HeroCard } from "@/modules/figures/components/HeroCard";

export default function PartySidebar() {
	const heroes = useBattleStore((state) => state.heroes);

	return (
		<section className="h-full w-full flex-1 flex flex-col justify-center no-scrollbar gap-8">
			{heroes.map((hero) => (
				<HeroCard {...hero} key={hero.id} />
			))}
		</section>
	);
}
