import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import type { BattleHero } from "@/modules/units/domain/units.type";

export function endTurn(heroId: BattleHero["id"]): BattleStoreServerAction {
	return ({
		usedMovesThisTurn,
		usedCardsThisTurn,
		activeHeroCard,
		activeMoveHeroId,
	}) => {
		return {
			// A card or move left selected must not block the enemy turn.
			activeHeroCard: activeHeroCard?.unitId === heroId ? null : activeHeroCard,
			activeMoveHeroId: activeMoveHeroId === heroId ? null : activeMoveHeroId,
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
