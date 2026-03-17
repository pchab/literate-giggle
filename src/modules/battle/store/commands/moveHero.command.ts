import type { GridPosition } from "@/modules/battle/domain/grid.type";
import { getManhattanDistance } from "@/modules/battle/helpers/grid.helpers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import { isHeroId } from "@/modules/figures/helpers/figures.helpers";
import { areEnemies } from "../../helpers/effects/effect.helpers";
import { calculateExactPath, moveBattleUnit } from "../../helpers/move.helpers";
import { calculateAIIntents } from "./calculateAIIntents.command";

export function moveHero(newPosition: GridPosition) {
	return async (get: StoreGet, set: StoreSet) => {
		const {
			activeMoveHeroId: activeMoveUnitId,
			usedMovesThisTurn,
			heroes,
			monsters,
			summons,
		} = get();

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
			activeMoveHeroId: null,
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
			...summons.filter(areEnemies(hero)),
		];

		const path = calculateExactPath(
			hero.gridPosition,
			newPosition,
			allBlockingFigures,
		);
		await moveBattleUnit(get, set)({ movingUnit: hero, path });

		set(({ usedMovesThisTurn }) => {
			return {
				usedMovesThisTurn: {
					...usedMovesThisTurn,
					[heroId]: moveAlreadyDone + distance,
				},
			};
		});

		await calculateAIIntents(get, set)();
	};
}
