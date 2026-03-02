import { intentService } from "@/modules/attacks/intents.service";
import type { BattleStoreServerAction } from "@/store/battle.store";
import type { Hero } from "../../figures/domain/figures.type";
import type { Card } from "../domain/cards.type";

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
		const newIntents = intentService.calculateAllIntents(heroes, monsters);
		return {
			enemyIntents: newIntents,
			activeCard: null,
		};
	};
}
