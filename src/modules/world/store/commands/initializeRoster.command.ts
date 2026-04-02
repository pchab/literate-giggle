import { initialDeck } from "@/modules/cards/data/cards.data";
import type { HeroCard } from "@/modules/cards/domain/cards.type";
import { createHeroCard } from "@/modules/cards/helpers/cards.helper";
import { baseHeroStats } from "@/modules/units/data/heroes/baseHeroStats";
import { heroId } from "@/modules/units/helpers/units.helpers";
import {
	initialWorldState,
	type WorldStoreServerAction,
} from "@/modules/world/store/world.store";

const startingIds = [
	heroId(crypto.randomUUID()),
	heroId(crypto.randomUUID()),
	heroId(crypto.randomUUID()),
];

export function initializeRoster(): WorldStoreServerAction {
	return () => {
		return {
			...initialWorldState,
			roster: [
				{
					id: startingIds[0],
					name: "Anselus",
					...baseHeroStats,
					variant: "default",
					currentHp: baseHeroStats.maxHp,
					deck: [...initialDeck].map(createHeroCard(startingIds[0])),
					selectedCards: [...initialDeck].map(
						createHeroCard(startingIds[0]),
					) as [HeroCard, HeroCard | null, HeroCard | null],
				},
				{
					id: startingIds[1],
					name: "Willet",
					...baseHeroStats,
					variant: "variant_ruby",
					currentHp: baseHeroStats.maxHp,
					deck: [...initialDeck].map(createHeroCard(startingIds[1])),
					selectedCards: [...initialDeck].map(
						createHeroCard(startingIds[1]),
					) as [HeroCard, HeroCard | null, HeroCard | null],
				},
				{
					id: startingIds[2],
					name: "Gabrien",
					...baseHeroStats,
					variant: "variant_emerald",
					currentHp: baseHeroStats.maxHp,
					deck: [...initialDeck].map(createHeroCard(startingIds[2])),
					selectedCards: [...initialDeck].map(
						createHeroCard(startingIds[2]),
					) as [HeroCard, HeroCard | null, HeroCard | null],
				},
			],
		};
	};
}
