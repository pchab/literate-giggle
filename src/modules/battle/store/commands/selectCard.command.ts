import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import { cardLibrary } from "@/modules/cards/data/cards.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { resolveCard } from "./resolveCard.command";

export function selectCard(
	heroId: Hero["id"],
	cardId: Card["id"],
): BattleStoreServerAction {
	return (state) => {
		const { heroes, activeCard, usedCardsThisTurn } = state;
		if (activeCard) {
			console.warn("Another card is already selected.");
			return {};
		}
		if (usedCardsThisTurn[heroId]) {
			console.warn("This hero has already played a card this turn!");
			return {};
		}
		const hero = heroes.find((h) => h.id === heroId);
		if (!hero) {
			console.warn(`Hero with ID ${heroId} not found.`);
			return {};
		}
		const card = cardLibrary[cardId];
		if (!card) {
			console.warn(
				`Card with ID ${cardId} not found for hero with ID ${heroId}`,
			);
			return {};
		}

		if (card.playRequirement === "no_target") {
			const executeEngine = resolveCard(null);

			const nextState = executeEngine({
				...state,
				activeCard: { heroId, cardId },
			});

			return {
				...state,
				...nextState,
				activeCard: null,
			};
		}

		return {
			activeCard: { heroId, cardId },
		};
	};
}
