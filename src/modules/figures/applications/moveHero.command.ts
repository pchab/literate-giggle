import { intentService } from "@/modules/attacks/intents.service";
import { getManhattanDistance } from "@/modules/grid/grid.helpers";
import type { GridPosition } from "@/modules/grid/grid.type";
import type { BattleStoreServerAction } from "@/store/battle.store";

export function moveHero(newPosition: GridPosition): BattleStoreServerAction {
	return ({ heroes, monsters, activeMoveHeroId, usedMovesThisTurn }) => {
		if (!activeMoveHeroId || usedMovesThisTurn[activeMoveHeroId]) return {};

		const heroId = activeMoveHeroId;
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
		const newIntents = intentService.calculateAllIntents(newHeroes, monsters);

		return {
			heroes: newHeroes,
			activeMoveHeroId: null,
			usedMovesThisTurn: { ...usedMovesThisTurn, [heroId]: true },
			enemyIntents: newIntents,
		};
	};
}
