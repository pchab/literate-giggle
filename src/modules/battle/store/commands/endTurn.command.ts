import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import type { BattleHero } from "@/modules/units/domain/units.type";

export function endTurn(heroId: BattleHero["id"]): BattleStoreServerAction {
	return ({ usedMovesThisTurn, usedCardsThisTurn }) => {
		return {
			usedMovesThisTurn: {
				...usedMovesThisTurn,
				[heroId]: 99,
			},
			usedCardsThisTurn: {
				...usedCardsThisTurn,
				[heroId]: true,
			},
		};
	};
}
