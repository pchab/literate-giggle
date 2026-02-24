import { intentService } from "@/modules/attacks/intents.service";
import type { BattleStoreServerAction } from "@/store/battle.store";
import type { Hero } from "../../figures/domain/figures.type";
import type { Card } from "../domain/cards.type";
import { resolveCard } from "./resolveCard.command";

export function selectCard(
	heroId: Hero["id"],
	cardId: Card["id"],
): BattleStoreServerAction {
	return (state) => {
		const { heroes, monsters, activeCard, usedCardsThisTurn } = state;
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
		const card = hero.cards.find((c) => c.id === cardId);
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
				activeCard: { heroId, card },
			});

			return {
				...state,
				...nextState,
				activeCard: null,
			};
		}

		const newIntents = intentService.calculateAllIntents(heroes, monsters);
		return {
			enemyIntents: newIntents,
			activeCard: { heroId, card },
		};
	};
}
