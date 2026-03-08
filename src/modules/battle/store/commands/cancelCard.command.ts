import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import { calculateAllIntents } from "./calculateAllIntents.command";

export function cancelCard(): BattleStoreServerAction {
	return ({
		aiIntents: enemyIntents,
		heroes,
		monsters,
		summons,
		activeCard,
	}) => {
		if (!activeCard) {
			console.warn("No card is currently selected.");
			return {};
		}
		const newIntents = calculateAllIntents(
			heroes,
			monsters,
			summons,
			enemyIntents,
		);
		return {
			aiIntents: newIntents,
			activeCard: null,
		};
	};
}
