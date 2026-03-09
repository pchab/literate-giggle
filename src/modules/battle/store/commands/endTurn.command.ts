import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import type { BattleHero } from "@/modules/figures/domain/figures.type";

export function endTurn(heroId: BattleHero["id"]): BattleStoreServerAction {
	return ({ usedMovesThisTurn, usedCardsThisTurn }) => {
		return {
			usedMovesThisTurn: {
				...usedMovesThisTurn,
				[heroId]: true,
			},
			usedCardsThisTurn: {
				...usedCardsThisTurn,
				[heroId]: true,
			},
		};
	};
}
