import { intentService } from "@/modules/attacks/intents.service";
import type { BattleStoreServerAction } from "@/store/battle.store";
import type { Hero } from "../../figures/domain/figures.type";
import type { Card } from "../domain/cards.type";

export function cancelCard(
	heroId: Hero["id"],
	cardId: Card["id"],
): BattleStoreServerAction {
	return ({
		heroes,
		monsters,
		currentMove,
		currentAttack,
		usedCardsThisTurn,
		cardUsageLog,
	}) => {
		if (
			(currentMove && currentMove[0] !== heroId) ||
			(currentAttack && currentAttack[0] !== heroId)
		) {
			console.warn("You can't cancel a card use from another hero.");
			return {};
		}
		const heroIndex = heroes.findIndex((h) => h.id === heroId);
		if (heroIndex === -1) {
			console.warn(`Hero with ID ${heroId} not found.`);
			return {};
		}
		const hero = heroes[heroIndex];
		const card = hero.cards.find((c) => c.id === cardId);
		if (!card) {
			console.warn(
				`Card with ID ${cardId} not found for hero with ID ${heroId}`,
			);
			return {};
		}
		const { [heroId]: usedCard, ...remainingUsedCards } = usedCardsThisTurn;
		const { [heroId]: heroCardUsageLog, ...remainingCardUsageLog } =
			cardUsageLog;
		const { [cardId]: loggedCard, ...remainingCardUsageForHeroLog } =
			heroCardUsageLog;
		const newIntents = intentService.calculateAllIntents(heroes, monsters);
		return {
			enemyIntents: newIntents,
			usedCardsThisTurn: remainingUsedCards,
			cardUsageLog: {
				...remainingCardUsageLog,
				[heroId]: {
					...remainingCardUsageForHeroLog,
					...(loggedCard > 1 ? { [cardId]: loggedCard - 1 } : {}),
				},
			},
			currentMove: null,
			currentAttack: null,
			hoveredCard: null,
		};
	};
}
