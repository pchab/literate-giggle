import type { CreateSurfaceEffect } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { getCellId } from "../grid.helpers";
import type { EffectResolverParams } from "./effect.resolvers";

export const resolveSurfaceEffect =
	(_: StoreGet, set: StoreSet) =>
	(effect: CreateSurfaceEffect) =>
	<C extends BattleUnit>({ anchorTarget }: EffectResolverParams<C>) => {
		if (!anchorTarget) {
			console.warn(
				`Create surface effect ${effect.surfaceType} called on non cell anchor`,
			);
			return;
		}
		const cellId = getCellId(anchorTarget);

		set(({ surfaces }) => ({
			surfaces: {
				...surfaces,
				[cellId]: {
					position: anchorTarget,
					type: effect.surfaceType,
					duration: effect.duration,
					damage: effect.damage,
					spriteBase: effect.spriteBase,
					status: effect.status,
					charges: effect.charges,
				},
			},
		}));
	};
