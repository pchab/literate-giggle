import type { Card } from "@/modules/cards/domain/cards.type";
import type {
	PassiveContext,
	PassiveDefinition,
} from "@/modules/units/domain/passive.type";
import type { Status } from "@/modules/units/domain/status.type";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import { PASSIVE_REGISTRY } from "../data/passives.data";
import type { VfxType } from "../domain/vfx.type";
import type { BattleGet, BattleSet } from "../store/battle.store";
import { getCellId } from "./grid.helpers";

export const getPassives = (unit?: object | null): PassiveDefinition[] => {
	if (!unit || !("passives" in unit) || !Array.isArray(unit.passives)) {
		return [];
	}
	return (unit.passives as string[])
		.map((id) => PASSIVE_REGISTRY[id as keyof typeof PASSIVE_REGISTRY])
		.filter((p): p is PassiveDefinition => !!p);
};

export const applyPassivesToCard = (unit: object, card: Card): Card =>
	getPassives(unit).reduce(
		(acc, passive) => passive.hooks.modifyCard?.(acc) ?? acc,
		card,
	);

const ctxFor =
	(get: BattleGet, set: BattleSet, isSimulation: boolean) =>
	(owner: BattleUnit): PassiveContext => ({ get, set, isSimulation, owner });

const livingPassiveOwners = (get: BattleGet) =>
	get().units.filter((u) => u.currentHp > 0 && getPassives(u).length > 0);

/** Runs the source's outgoing modifiers (direct hits only), then every unit's incoming modifiers. */
export const modifyDamageByPassives =
	(get: BattleGet, set: BattleSet, isSimulation: boolean) =>
	({
		sourceId,
		isDirectHit,
		target,
		amount,
	}: {
		sourceId?: string;
		isDirectHit?: boolean;
		target: BattleUnit;
		amount: number;
	}): number => {
		const ctx = ctxFor(get, set, isSimulation);
		let damage = amount;

		const source = sourceId
			? get().units.find((u) => u.id === sourceId)
			: undefined;
		if (source && isDirectHit) {
			for (const passive of getPassives(source)) {
				const hook = passive.hooks.modifyOutgoingDamage;
				if (hook) damage = hook(ctx(source), { target, amount: damage });
			}
		}

		for (const owner of livingPassiveOwners(get)) {
			for (const passive of getPassives(owner)) {
				const hook = passive.hooks.modifyIncomingDamage;
				if (hook) damage = hook(ctx(owner), { target, amount: damage });
			}
		}

		return Math.max(0, damage);
	};

export const getOverhealStatuses =
	(get: BattleGet, set: BattleSet, isSimulation: boolean) =>
	({
		sourceId,
		target,
		overflow,
	}: {
		sourceId?: string;
		target: BattleUnit;
		overflow: number;
	}): Status[] => {
		if (!sourceId || overflow <= 0) return [];
		const source = get().units.find((u) => u.id === sourceId);
		if (!source) return [];
		return getPassives(source).flatMap(
			(passive) =>
				passive.hooks.onOverheal?.(ctxFor(get, set, isSimulation)(source), {
					target,
					overflow,
				}) ?? [],
		);
	};

export const broadcastDamaged =
	(get: BattleGet, set: BattleSet, isSimulation: boolean) =>
	async (params: {
		target: BattleUnit;
		hpLost: number;
		sourceId?: string;
		isDirectHit?: boolean;
	}) => {
		for (const owner of livingPassiveOwners(get)) {
			for (const passive of getPassives(owner)) {
				await passive.hooks.onAnyDamaged?.(
					ctxFor(get, set, isSimulation)(owner),
					params,
				);
			}
		}
	};

export const triggerKill =
	(get: BattleGet, set: BattleSet, isSimulation: boolean) =>
	async ({ sourceId, victim }: { sourceId?: string; victim: BattleUnit }) => {
		if (!sourceId) return;
		const source = get().units.find((u) => u.id === sourceId);
		if (!source || source.currentHp <= 0) return;
		for (const passive of getPassives(source)) {
			await passive.hooks.onKill?.(ctxFor(get, set, isSimulation)(source), {
				victim,
			});
		}
	};

export const triggerTurnStart =
	(get: BattleGet, set: BattleSet, isSimulation: boolean) =>
	async (units: BattleUnit[]) => {
		for (const unit of units) {
			const owner = get().units.find((u) => u.id === unit.id);
			if (!owner || owner.currentHp <= 0) continue;
			for (const passive of getPassives(owner)) {
				await passive.hooks.onTurnStart?.(
					ctxFor(get, set, isSimulation)(owner),
				);
			}
		}
	};

/** Small visual cue on the owner's tile when a passive fires. */
export const flashPassive = (
	{ set, isSimulation, owner }: PassiveContext,
	vfx: VfxType,
) => {
	if (isSimulation) return;
	set(({ currentVfx }) => ({
		currentVfx: {
			...currentVfx,
			[getCellId(owner.gridPosition)]: { type: vfx },
		},
	}));
};
