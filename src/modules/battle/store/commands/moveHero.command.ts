import type { GridPosition } from "@/modules/battle/domain/grid.type";
import { getManhattanDistance } from "@/modules/battle/helpers/grid.helpers";
import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import { isHeroId } from "@/modules/figures/helpers/figures.helpers";
import { calculateAllIntents } from "./calculateAllIntents.command";

export function moveHero(newPosition: GridPosition): BattleStoreServerAction {
	return ({
		heroes,
		monsters,
		summons,
		aiIntents: enemyIntents,
		activeMoveUnitId,
		usedMovesThisTurn,
	}) => {
		if (
			!activeMoveUnitId ||
			!isHeroId(activeMoveUnitId) ||
			usedMovesThisTurn[activeMoveUnitId]
		)
			return {};

		const heroId = activeMoveUnitId;
		const hero = heroes.find((h) => h.id === heroId);
		if (!hero) {
			console.warn(`Hero with ID ${heroId} not found.`);
			return {};
		}
		const distance = getManhattanDistance(newPosition, hero.gridPosition);
		if (distance > hero.baseMove) {
			console.warn(
				`Hero ${heroId} cannot move more than ${hero.baseMove} squares.`,
			);
			return {};
		}

		const newHeroes = heroes.map((h) =>
			h.id === heroId ? { ...h, gridPosition: newPosition } : h,
		);
		const newIntents = calculateAllIntents(
			newHeroes,
			monsters,
			summons,
			enemyIntents,
		);

		return {
			heroes: newHeroes,
			activeMoveUnitId: null,
			usedMovesThisTurn: { ...usedMovesThisTurn, [heroId]: true },
			aiIntents: newIntents,
		};
	};
}
