import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { resolveCard } from "./resolveCard.command";

export function selectCard(
	heroId: Hero["id"],
	card: Card,
): BattleStoreServerAction {
	return (state) => {
		const { activeCard, usedCardsThisTurn } = state;
		if (activeCard) {
			console.warn("Another card is already selected.");
			return {};
		}
		if (usedCardsThisTurn[heroId]) {
			console.warn("This hero has already played a card this turn!");
			return {};
		}

		if (card.playRequirement === "no_target") {
			const executeEngine = resolveCard(null);

			const nextState = executeEngine({
				...state,
				activeCard: { unitId: heroId, card },
			});

			return {
				...state,
				...nextState,
				activeCard: null,
			};
		}

		return {
			activeCard: { unitId: heroId, card },
		};
	};
}
