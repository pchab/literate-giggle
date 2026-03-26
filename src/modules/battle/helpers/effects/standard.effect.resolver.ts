import type {
	ApplyStatusEffect,
	DamageEffect,
	HealEffect,
} from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { sleep } from "@/modules/shared/helpers/sleep";
import type { GridPosition } from "../../domain/grid.type";
import type { VfxType } from "../../domain/vfx.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { getCellId } from "../grid.helpers";
import { findUnit, updateBattleUnitState } from "../state.helpers";
import { getVfxForEffect } from "../vfx.helper";
import { applyEffectToEntity, resolveTargets } from "./effect.helpers";
import type { EffectResolverParams } from "./effect.resolvers";

const animateProjectile =
	(_: StoreGet, set: StoreSet) =>
	async (
		projectile: VfxType,
		originPos: GridPosition,
		targetPos: GridPosition,
	) => {
		const projectileId = crypto.randomUUID();

		const dx = targetPos.col - originPos.col;
		const dy = targetPos.row - originPos.row;
		const angle = Math.atan2(dx, dy) * (180 / Math.PI);

		set((prev) => ({
			currentVfx: {
				...prev.currentVfx,
				[getCellId(originPos)]: {
					type: projectile,
					id: projectileId,
					angle,
				},
			},
		}));

		await sleep(100);

		set((prev) => {
			const nextVfx = { ...prev.currentVfx };
			delete nextVfx[getCellId(originPos)];

			nextVfx[getCellId(targetPos)] = {
				type: projectile,
				id: projectileId,
				angle,
			};
			return { currentVfx: nextVfx };
		});

		await sleep(300);

		set((prev) => {
			const nextVfx = { ...prev.currentVfx };
			if (nextVfx[getCellId(targetPos)]?.id === projectileId) {
				delete nextVfx[getCellId(targetPos)];
			}
			return { currentVfx: nextVfx };
		});
	};

export const resolveStandardEffect =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
	(effect: DamageEffect | HealEffect | ApplyStatusEffect) =>
	async <C extends BattleUnit>({
		anchorTarget,
		caster,
		patternCells,
	}: EffectResolverParams<C>): Promise<void> => {
		const { heroes, monsters, summons } = get();
		const figures = [...heroes, ...monsters, ...summons];
		const targets = resolveTargets<BattleUnit>(
			effect.target,
			anchorTarget,
			caster,
			figures,
			patternCells,
		);
		const targetPositions: GridPosition[] = [];
		if (anchorTarget && effect.projectile && !isSimulation) {
			await animateProjectile(get, set)(
				effect.projectile,
				caster.gridPosition,
				anchorTarget.gridPosition,
			);
		}

		for (const targetId of targets) {
			const target = findUnit(get)(targetId);
			if (!target) continue;

			const updatedEntity = applyEffectToEntity({ entity: target, effect });
			targetPositions.push(updatedEntity.gridPosition);
			await updateBattleUnitState(get, set, isSimulation)(updatedEntity);
		}

		set((prev) => {
			const newVfx = getVfxForEffect(effect, targetPositions);

			return {
				...prev,
				currentVfx: { ...prev.currentVfx, ...newVfx },
			};
		});
	};
