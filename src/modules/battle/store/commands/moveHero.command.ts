import type { GridPosition } from "@/modules/battle/domain/grid.type";
import { getManhattanDistance } from "@/modules/battle/helpers/grid.helpers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import { isHeroId } from "@/modules/figures/helpers/figures.helpers";
import { calculateExactPath, moveBattleUnit } from "../../helpers/move.helpers";
import { calculateAIIntents } from "./calculateAIIntents.command";

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

		const distance = getManhattanDistance(newPosition, hero.gridPosition);
		if (distance > remainingMove) {
			console.warn(
				`Hero ${heroId} cannot move more than ${hero.baseMove} squares.`,
			);
			return {};
		}

		const allBlockingFigures = [
			...monsters,
			...summons.filter(({ allegiance }) => allegiance === "ENEMY"),
		];

		const path = calculateExactPath(
			hero.gridPosition,
			newPosition,
			allBlockingFigures,
		);
		await moveBattleUnit(get, set)({ movingUnit: hero, path });

		return set(({ heroes, aiIntents, usedMovesThisTurn }) => {
			const newIntents = calculateAIIntents(
				[...heroes, ...monsters, ...summons],
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
