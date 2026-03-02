import type { BattleStoreServerAction } from "@/store/battle.store";
import type { Hero } from "../../figures/domain/figures.type";
import { cardLibrary } from "../domain/cards.data";
import type { Card } from "../domain/cards.type";
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
