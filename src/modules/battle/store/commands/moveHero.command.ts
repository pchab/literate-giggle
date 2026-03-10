import type { GridPosition } from "@/modules/battle/domain/grid.type";
import {
	getManhattanDistance,
	resolveSurfaceEffectAndReturnBreak,
} from "@/modules/battle/helpers/grid.helpers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import { isHeroId } from "@/modules/figures/helpers/figures.helpers";
import { sleep } from "@/modules/shared/helpers/sleep";
import { calculateExactPath } from "../../helpers/ai.move.helpers";
import { calculateAllIntents } from "./calculateAllIntents.command";

export function moveHero(newPosition: GridPosition) {
	return async (get: StoreGet, set: StoreSet) => {
		const { activeMoveUnitId, usedMovesThisTurn, heroes, monsters, summons } =
			get();

		if (!activeMoveUnitId || !isHeroId(activeMoveUnitId)) {
			return {};
		}
		const heroId = activeMoveUnitId;
		const hero = heroes.find((h) => h.id === heroId);
		if (!hero) {
			console.warn(`Hero with ID ${heroId} not found.`);
			return {};
		}

		const moveAlreadyDone = usedMovesThisTurn[activeMoveUnitId] ?? 0;
		const remainingMove = hero.baseMove - moveAlreadyDone;
		if (remainingMove < 1) {
			return {};
		}

		set(() => ({
			activeMoveUnitId: null,
		}));

		const allBlockingFigures = [
			...monsters,
			...summons.filter(({ allegiance }) => allegiance === "ENEMY"),
		];

		const distance = getManhattanDistance(newPosition, hero.gridPosition);
		if (distance > remainingMove) {
			console.warn(
				`Hero ${heroId} cannot move more than ${hero.baseMove} squares.`,
			);
			return {};
		}

		const path = calculateExactPath(
			hero.gridPosition,
			newPosition,
			allBlockingFigures,
		);

		for (const step of path) {
			const heroIndex = heroes.findIndex((h) => h.id === heroId);
			if (heroIndex === -1) return { heroes };
			const movingHero = { ...heroes[heroIndex], gridPosition: step };
			set(({ heroes }) => {
				return { heroes: heroes.with(heroIndex, movingHero) };
			});
			await sleep(200);

			const shouldBreak = resolveSurfaceEffectAndReturnBreak(get, set)(
				step,
				movingHero,
			);
			if (shouldBreak) {
				break;
			}
		}

		return set(({ heroes, aiIntents, usedMovesThisTurn }) => {
			const newIntents = calculateAllIntents(
				heroes,
				monsters,
				summons,
				aiIntents,
			);
			return {
				usedMovesThisTurn: {
					...usedMovesThisTurn,
					[heroId]: moveAlreadyDone + distance,
				},
				aiIntents: newIntents,
			};
		});
	};
}
