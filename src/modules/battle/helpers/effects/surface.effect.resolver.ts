import type { CreateSurfaceEffect } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { getCellId } from "../grid.helpers";
import type { EffectResolverParams } from "./effect.resolvers";

export const resolveSurfaceEffect =
	(_: StoreGet, set: StoreSet) =>
	(effect: CreateSurfaceEffect) =>
	<C extends BattleUnit>({ patternCells }: EffectResolverParams<C>) => {
		const newSurfaces = patternCells?.reduce((surfaces, cell) => {
			const cellId = getCellId(cell);
			Object.assign(surfaces, {
				[cellId]: {
					id: cellId,
					gridPosition: cell,
					size: effect.size ?? { cols: 1, rows: 1 },
					type: effect.surfaceType,
					duration: effect.duration,
					damage: effect.damage,
					spriteBase: effect.spriteBase,
					status: effect.status,
					charges: effect.charges,
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
