"use client";

import { useBattleStore } from "@/modules/battle/store/battle.store";
import { HeroCard } from "@/modules/units/components/HeroCard";
import { isHero } from "@/modules/units/helpers/units.helpers";

export default function PartySidebar() {
	const units = useBattleStore((state) => state.units);

	return (
		<section className="flex flex-col justify-center no-scrollbar gap-4">
			{units.filter(isHero).map((hero) => (
				<HeroCard {...hero} key={hero.id} />
			))}
		</section>
	);
}
