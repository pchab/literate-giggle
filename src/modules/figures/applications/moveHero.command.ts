import { intentService } from "@/modules/attacks/intents.service";
import { getManhattanDistance } from "@/modules/grid/grid.helpers";
import type { GridPosition } from "@/modules/grid/grid.type";
import type { BattleStoreServerAction } from "@/store/battle.store";

export function moveHero(newPosition: GridPosition): BattleStoreServerAction {
	return ({ heroes, currentMove, monsters }) => {
		if (!currentMove) {
			console.warn(
				"No card is currently being played. Please play a card before moving a hero.",
			);
			return {};
		}
		const [heroId, maxDistance] = currentMove;
		const hero = heroes.find((h) => h.id === currentMove[0]);
		if (!hero) {
			console.warn(`Hero with ID ${heroId} not found.`);
			return {};
		}
		const distance = getManhattanDistance(newPosition, hero.gridPosition);
		if (distance > maxDistance) {
			console.warn(
				`Hero ${heroId} cannot move more than ${maxDistance} squares.`,
			);
			return {};
		}

		const newHeroes = heroes.map((h) =>
			h.id === heroId ? { ...h, gridPosition: newPosition } : h,
		);
		const newIntents = intentService.calculateAllIntents(newHeroes, monsters);
		return {
			heroes: newHeroes,
			enemyIntents: newIntents,
			currentMove: null,
			hoveredCard: null,
		};
	};
}
