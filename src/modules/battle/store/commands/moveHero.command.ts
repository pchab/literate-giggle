import type { GridPosition } from "@/modules/battle/domain/grid.type";
import type { BattleGet, BattleSet } from "@/modules/battle/store/battle.store";
import { isHeroId } from "@/modules/units/helpers/units.helpers";
import { areEnemies } from "../../helpers/effects/effect.helpers";
import { getDistanceToBoundingBox } from "../../helpers/grid.helpers";
import { calculateExactPath, moveBattleUnit } from "../../helpers/move.helpers";
import { calculateAIIntents } from "./calculateAIIntents.command";

export function moveHero(newPosition: GridPosition) {
	return async (get: BattleGet, set: BattleSet) => {
		const {
			activeMoveHeroId: activeMoveUnitId,
			usedMovesThisTurn,
			units,
			gridSize,
			surfaces,
		} = get();

		if (!activeMoveUnitId || !isHeroId(activeMoveUnitId)) {
			return {};
		}

		const heroId = activeMoveUnitId;
		const hero = units.find((u) => u.id === heroId);

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

		const distance = getDistanceToBoundingBox({
			caster: hero,
			target: { gridPosition: newPosition },
		});

		if (distance > remainingMove) {
			console.warn(
				`Hero ${heroId} cannot move more than ${hero.baseMove} squares.`,
			);
			return {};
		}

		const allBlockingUnits = units.filter(areEnemies(hero));

		const path = calculateExactPath({
			movingUnit: hero,
			targetPos: newPosition,
			units: allBlockingUnits,
			gridSize,
			surfaces,
		});

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
