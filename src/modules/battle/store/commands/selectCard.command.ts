import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import { type Hero, UnitStance } from "@/modules/figures/domain/figures.type";
import { resolveCard } from "./resolveCard.command";

export const selectCard =
	(get: StoreGet, set: StoreSet) => async (heroId: Hero["id"], card: Card) => {
		const { heroes, activeHeroCard, usedCardsThisTurn } = get();
		if (activeHeroCard) return;
		if (usedCardsThisTurn[heroId]) {
			console.warn("This hero has already played a card this turn!");
			return;
		}

		if (card.playRequirement === "no_target") {
			await resolveCard(get, set)(null);

			set((prev) => ({
				...prev,
				activeHeroCard: null,
			}));
		}

		const heroIndex = heroes.findIndex(({ id }) => id === heroId);

		set(({ heroes, ...prev }) => ({
			...prev,
			heroes: heroes.with(heroIndex, {
				...heroes[heroIndex],
				stance: UnitStance.ATTACKING,
			}),
			activeHeroCard: { unitId: heroId, card },
		}));
	};
