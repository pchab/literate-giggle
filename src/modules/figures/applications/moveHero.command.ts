import type { GridPosition } from "@/modules/grid/grid.type";
import type { BattleStoreServerAction } from "@/store/battle.store";

export function moveHero(newPosition: GridPosition): BattleStoreServerAction {
	return ({ heroes, currentMove }) => {
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
		const distance =
			Math.abs(newPosition.row - hero.gridPosition.row) +
			Math.abs(newPosition.col - hero.gridPosition.col);
		if (distance > maxDistance) {
			console.warn(
				`Hero ${heroId} cannot move more than ${maxDistance} squares.`,
			);
			return {};
		}
		return {
			heroes: heroes.map((h) =>
				h.id === heroId ? { ...h, gridPosition: newPosition } : h,
			),
			currentMove: null,
		};
	};
}
