"use client";

import { HeroCard } from "@/components/HeroCard";
import { useBattleStore } from "@/store/battle.store";

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
