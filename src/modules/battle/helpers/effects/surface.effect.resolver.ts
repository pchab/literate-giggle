import type { CreateSurfaceEffect } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { getCellId } from "../grid.helpers";
import type { EffectResolverParams } from "./effect.resolvers";

export const resolveSurfaceEffect =
	(get: StoreGet, set: StoreSet) =>
	(effect: CreateSurfaceEffect) =>
	<C extends BattleUnit>({ patternCells }: EffectResolverParams<C>) => {
		const currentSurfaces = get().surfaces;

		const newSurfaces = patternCells?.reduce((surfaces, cell) => {
			const cellId = getCellId(cell);
			Object.assign(surfaces, {
				[cellId]: {
					position: cell,
					type: effect.surfaceType,
					duration: effect.duration,
					damage: effect.damage,
					spriteBase: effect.spriteBase,
					status: effect.status,
					charges: effect.charges,
				},
			});
			return surfaces;
		}, currentSurfaces);

		set(() => ({
			surfaces: newSurfaces,
		}));
	};
