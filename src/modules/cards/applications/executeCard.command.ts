import { intentService } from "@/modules/attacks/intents.service";
import type { BattleStoreServerAction } from "@/store/battle.store";
import type { Hero } from "../../figures/domain/figures.type";
import type { Card } from "../domain/cards.type";

export function executeCard(
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
		if (currentMove || currentAttack) {
			console.warn(
				"A card use is already in progress. Please wait for it to resolve before playing another card.",
			);
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
		const hasAttackValue =
			card.action.type === "physAtt" || card.action.type === "magAtt";
		const hasMoveValue = card.action.move > 0;

		const newHeroes = heroes.with(heroIndex, {
			...hero,
			currentHp:
				card.action.type === "heal"
					? Math.min(hero.maxHp, hero.currentHp + card.action.value)
					: hero.currentHp,
			currentPhysBlock:
				card.action.type === "physDef"
					? hero.currentPhysBlock + card.action.value
					: hero.currentPhysBlock,
			currentMagBlock:
				card.action.type === "magDef"
					? hero.currentMagBlock + card.action.value
					: hero.currentMagBlock,
		});
		const newIntents = intentService.calculateAllIntents(newHeroes, monsters);
		return {
			heroes: newHeroes,
			enemyIntents: newIntents,
			usedCardsThisTurn: {
				...usedCardsThisTurn,
				[heroId]: cardId,
			},
			cardUsageLog: {
				...cardUsageLog,
				[heroId]: {
					...cardUsageLog[heroId],
					[cardId]: (cardUsageLog[heroId][cardId] || 0) + 1,
				},
			},
			currentMove: hasMoveValue ? [heroId, card.action.move] : null,
			currentAttack: hasAttackValue
				? [heroId, { damage: card.action.value, range: card.action.range }]
				: null,
			hoveredCard: null,
		};
	};
}
