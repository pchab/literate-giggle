import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import { triggerRegurgitation } from "@/modules/cards/data/custom-scripts/swallow.script";
import type { Status, StatusType } from "@/modules/units/domain/status.type";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import type { GridPosition } from "../domain/grid.type";
import type { VfxType } from "../domain/vfx.type";
import type { CombatUpdate } from "./state.helpers";

type TickResult = CombatUpdate & { vfxType?: VfxType };

type StatusRegistryHooks = {
	// Phase 1: Modifies incoming damage (Shields, Vulnerability)
	onBeforeDamage?: (
		get: StoreGet,
		set: StoreSet,
		isSimulation: boolean,
	) => <T extends BattleUnit>(params: {
		unit: T;
		isTrueDamage?: boolean;
		damageTaken: number;
	}) => Promise<{ unit: T; damageTaken: number }>;

	// Phase 2: Reacts to HP lost (Spikes, Regurgitation)
	onAfterDamage?: (
		get: StoreGet,
		set: StoreSet,
		isSimulation: boolean,
	) => <T extends BattleUnit>(params: {
		unit: T;
		hpLost: number;
	}) => Promise<{ unit: T }>;

	// Phase 3: Reacts to death (Explosions, Revives)
	onDeath?: (
		get: StoreGet,
		set: StoreSet,
		isSimulation: boolean,
	) => <T extends BattleUnit>(params: { unit: T }) => Promise<{ unit: T }>;

	// Pahse 4: End of turn tick
	onTick?: (
		get: StoreGet,
		set: StoreSet,
		isSimulation: boolean,
	) => <T extends BattleUnit>(params: {
		unit: T;
		status: Status;
	}) => Promise<TickResult>;

	// Phase 5: Movement interception
	onBeforeMove?: (
		get: StoreGet,
		set: StoreSet,
		isSimulation: boolean,
	) => <T extends BattleUnit>(params: {
		unit: T;
		nextStep: GridPosition;
	}) => Promise<{ canMove: boolean }>;
};

export const statusRegistry: Record<StatusType, StatusRegistryHooks> = {
	vulnerable: {
		onBeforeDamage:
			() =>
			async ({ unit, damageTaken, isTrueDamage }) => {
				if (isTrueDamage) return { unit, damageTaken };
				return { unit, damageTaken: damageTaken + 2 };
			},
	},

	block: {
		onBeforeDamage:
			() =>
			async ({ unit, damageTaken, isTrueDamage }) => {
				if (isTrueDamage) return { unit, damageTaken };
				let remainingDamage = damageTaken;

				const blocks = unit.statuses.filter((s) => s.type === "block");
				const otherStatuses = unit.statuses.filter((s) => s.type !== "block");

				blocks.sort((a, b) => {
					const durA =
						a.duration === -1 ? Number.POSITIVE_INFINITY : a.duration;
					const durB =
						b.duration === -1 ? Number.POSITIVE_INFINITY : b.duration;
					return durA - durB;
				});

				const nextBlocks: typeof unit.statuses = [];

				for (const block of blocks) {
					if (remainingDamage > 0) {
						if (block.amount <= remainingDamage) {
							remainingDamage -= block.amount;
						} else {
							nextBlocks.push({
								...block,
								amount: block.amount - remainingDamage,
							});
							remainingDamage = 0;
						}
					} else {
						nextBlocks.push(block);
					}
				}

				return {
					unit: { ...unit, statuses: [...otherStatuses, ...nextBlocks] },
					damageTaken: remainingDamage,
				};
			},
	},

	poison: {
		onTick:
			() =>
			async ({ status }) => {
				return {
					damageTaken: status.amount,
					isTrueDamage: true,
					vfxType: "POISON",
				};
			},
	},

	regen: {
		onTick:
			() =>
			async ({ status }) => {
				return { healingReceived: status.amount, vfxType: "HEAL" };
			},
	},

	rooted: {
		onBeforeMove: () => async () => {
			return { canMove: false };
		},
	},

	swallowed: {
		onTick:
			() =>
			async ({ status }) => {
				return { damageTaken: status.amount, vfxType: "POISON" };
			},
		onBeforeMove: () => async () => {
			return { canMove: false };
		},
	},

	digesting: {
		onAfterDamage:
			(get, set, isSimulation) =>
			async ({ unit, hpLost }) => {
				const digestingStatus = unit.statuses.find(
					(s) => s.type === "digesting",
				);
				if (!digestingStatus) return { unit };

				const remainingAmount = digestingStatus.amount - hpLost;

				if (remainingAmount > 0) {
					const nextStatuses = unit.statuses.map((s) =>
						s.type === "digesting" ? { ...s, amount: remainingAmount } : s,
					);
					return { unit: { ...unit, statuses: nextStatuses } };
				}

				// --- THE THRESHOLD IS BROKEN! REGURGITATE! ---
				const toadNextStatuses = unit.statuses.filter(
					(s) => s.type !== "digesting",
				);
				const updatedToad = { ...unit, statuses: toadNextStatuses };

				await triggerRegurgitation(get, set, isSimulation, updatedToad);

				return { unit: updatedToad };
			},

		onDeath:
			(get, set, isSimulation) =>
			async ({ unit }) => {
				await triggerRegurgitation(get, set, isSimulation, unit);
				return { unit };
			},
	},
};
