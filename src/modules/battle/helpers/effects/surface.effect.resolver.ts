import type { CreateSurfaceEffect } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import { getCellId } from "../grid.helpers";
import type { EffectResolver } from "./effect.resolvers";

export const resolveSurfaceEffect: EffectResolver<
	BattleUnit,
	CreateSurfaceEffect
> =
	(_, set) =>
	(effect) =>
	async ({ patternCells }) => {
		const newSurfaces = patternCells?.reduce((surfaces, cell) => {
			const cellId = getCellId(cell);
			Object.assign(surfaces, {
				[cellId]: {
					id: cellId,
					gridPosition: cell,
					size: effect.size ?? { cols: 1, rows: 1 },
					type: effect.surfaceType,
					duration: effect.duration,
					spriteBase: effect.spriteBase,
					charges: effect.charges,
					onStep: effect.onStep,
				},
			});
			return surfaces;
		}, {});

		set(({ surfaces: currentSurfaces }) => ({
			surfaces: {
				...currentSurfaces,
				...newSurfaces,
			},
		}));
	};
