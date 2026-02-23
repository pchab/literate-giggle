import { isTileOccupied } from "../grid/grid.helpers";
import type { GridPosition } from "../grid/grid.type";
import type { Hero, Monster } from "./domain/figures.type";

export const calculateAIMove = (
	monster: Monster,
	heroes: Hero[],
	monsters: Monster[],
): GridPosition => {
	// 1. Find the closest hero
	let shortestDistance = Infinity;
	const targetHero = heroes.reduce((hero: Hero | null, currentHero: Hero) => {
		if (currentHero.currentHp <= 0) return hero;
		const dist =
			Math.abs(monster.gridPosition.row - currentHero.gridPosition.row) +
			Math.abs(monster.gridPosition.col - currentHero.gridPosition.col);

		if (dist < shortestDistance) {
			shortestDistance = dist;
			return currentHero;
		}
		return hero;
	}, null);

	// If no heroes are alive, or we are already next to them, don't move
	if (!targetHero || shortestDistance === 1) return monster.gridPosition;

	// 2. Define the 4 possible steps (Up, Down, Left, Right)
	const possibleSteps: GridPosition[] = [
		{ row: monster.gridPosition.row - 1, col: monster.gridPosition.col }, // Up
		{ row: monster.gridPosition.row + 1, col: monster.gridPosition.col }, // Down
		{ row: monster.gridPosition.row, col: monster.gridPosition.col - 1 }, // Left
		{ row: monster.gridPosition.row, col: monster.gridPosition.col + 1 }, // Right
	];

	// 3. Find the best valid step
	let bestStep = monster.gridPosition;
	let bestStepDistance = shortestDistance;

	for (const step of possibleSteps) {
		// Ensure the step is within the 3x5 grid bounds (assuming rows 0-4, cols 0-2)
		if (step.row < 0 || step.row > 4 || step.col < 0 || step.col > 2) continue;

		// Ensure no one is standing there
		if (isTileOccupied(step, [...heroes, ...monsters])) continue;

		// Calculate distance from THIS step to the hero
		const distFromStep =
			Math.abs(step.row - targetHero.gridPosition.row) +
			Math.abs(step.col - targetHero.gridPosition.col);

		// If this step gets us closer, it's our new best option
		if (distFromStep < bestStepDistance) {
			bestStepDistance = distFromStep;
			bestStep = step;
		}
	}

	return bestStep;
};
