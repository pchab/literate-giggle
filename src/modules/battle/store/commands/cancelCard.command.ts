import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { calculateAllIntents } from "./calculateAllIntents.command";

export function cancelCard(
	heroId: Hero["id"],
	cardId: Card["id"],
): BattleStoreServerAction {
	return ({ heroes, monsters, activeCard }) => {
		if (!activeCard) {
			console.warn("No card is currently selected.");
			return {};
		}
		const hero = heroes.find((h) => h.id === activeCard.heroId);
		if (!hero) {
			console.warn(`Hero with ID ${heroId} not found.`);
			return {};
		}
		const card = hero.hand.find((cId) => cId === cardId);
		if (!card) {
			console.warn(
				`Card with ID ${cardId} not found for hero with ID ${heroId}`,
			);
			return {};
		}
		const newIntents = calculateAllIntents(heroes, monsters);
		return {
			enemyIntents: newIntents,
			activeCard: null,
		};
	};
}
