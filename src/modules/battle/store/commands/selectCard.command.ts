import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import { type Hero, UnitStance } from "@/modules/figures/domain/figures.type";
import { resolveCard } from "./resolveCard.command";

export const selectCard =
	(get: StoreGet, set: StoreSet) => async (heroId: Hero["id"], card: Card) => {
		const {
			heroes,
			activeHeroCard: previousCardContext,
			usedCardsThisTurn,
		} = get();
		if (previousCardContext) return;
		if (usedCardsThisTurn[heroId]) {
			console.warn("This hero has already played a card this turn!");
			return;
		}

		const heroIndex = heroes.findIndex(({ id }) => id === heroId);
		const activeHeroCard = { unitId: heroId, card };

		set(({ heroes, ...prev }) => ({
			...prev,
			heroes: heroes.with(heroIndex, {
				...heroes[heroIndex],
				stance: UnitStance.ATTACKING,
			}),
			activeHeroCard,
		}));

		if (card.playRequirement === "no_target") {
			await resolveCard(get, set)(null, activeHeroCard);

			set((prev) => ({
				...prev,
				activeHeroCard: null,
			}));
		}
	};
