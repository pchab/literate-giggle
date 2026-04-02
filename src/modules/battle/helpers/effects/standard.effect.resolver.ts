import type {
	ApplyStatusEffect,
	DamageEffect,
	HealEffect,
} from "@/modules/cards/domain/cards.type";
import { sleep } from "@/modules/shared/helpers/sleep";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import type { GridPosition } from "../../domain/grid.type";
import type { VfxType } from "../../domain/vfx.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { getCellId } from "../grid.helpers";
import {
	applyCombatUpdate,
	type CombatUpdate,
	findUnit,
} from "../state.helpers";
import { getVfxForEffect } from "../vfx.helper";
import type { EffectResolver } from "./effect.resolvers";

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
		const angle = Math.atan2(dy, dx) * (180 / Math.PI);

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

export const resolveStandardEffect: EffectResolver<
	BattleUnit,
	DamageEffect | HealEffect | ApplyStatusEffect
> =
	(get, set, isSimulation = false) =>
	(effect) =>
	async ({ anchorTarget, caster, targetIds }) => {
		const targetPositions: GridPosition[] = [];

		if (anchorTarget && effect.projectile && !isSimulation) {
			await animateProjectile(get, set)(
				effect.projectile,
				caster.gridPosition,
				anchorTarget.gridPosition,
			);
		}

		for (const targetId of targetIds) {
			const target = findUnit(get)(targetId);
			if (!target || target.currentHp <= 0) continue;

			targetPositions.push(target.gridPosition);

			const combatUpdate: CombatUpdate = {};

			if (effect.type === "damage") {
				combatUpdate.damageTaken = effect.amount;
			} else if (effect.type === "heal") {
				combatUpdate.healingReceived = effect.amount;
			} else if (effect.type === "apply_status") {
				if (!target.immunities?.includes(effect.status.type)) {
					combatUpdate.newStatuses = [effect.status];
				}
			}

			await applyCombatUpdate(get, set, isSimulation)(targetId, combatUpdate);
		}

		if (!isSimulation) {
			set((prev) => {
				const newVfx = getVfxForEffect(effect, targetPositions);

				return {
					...prev,
					currentVfx: { ...prev.currentVfx, ...newVfx },
				};
			});
		}
	};
