import type { BattleGet, BattleSet } from "@/modules/battle/store/battle.store";
import { triggerRegurgitation } from "@/modules/cards/data/custom-scripts/swallow.script";
import { sumpSlime } from "@/modules/units/data/monsters/sump-slime";
import type { Status, StatusType } from "@/modules/units/domain/status.type";
import {
	type BattleUnit,
	type Summon,
	UnitStance,
} from "@/modules/units/domain/units.type";
import { summonId } from "@/modules/units/helpers/units.helpers";
import type { GridPosition } from "../domain/grid.type";
import type { VfxType } from "../domain/vfx.type";
import { isTileEmpty, isTileInBounds } from "./grid.helpers";
import { calculateAttackableCells } from "./move.helpers";
import { applyCombatUpdate, type CombatUpdate } from "./state.helpers";

type TickResult = CombatUpdate & { vfxType?: VfxType };

type StatusRegistryHooks = {
	// Phase 1: Modifies incoming damage (Shields, Vulnerability)
	onBeforeDamage?: (
		get: BattleGet,
		set: BattleSet,
		isSimulation: boolean,
	) => <T extends BattleUnit>(params: {
		amount: Status["amount"];
		unit: T;
		isTrueDamage?: boolean;
		damageTaken: number;
		sourceId?: BattleUnit["id"];
		isDirectHit?: boolean;
	}) => Promise<{ unit: T; damageTaken: number }>;

	// Phase 2: Reacts to HP lost (Spikes, Regurgitation)
	onAfterDamage?: (
		get: BattleGet,
		set: BattleSet,
		isSimulation: boolean,
	) => <T extends BattleUnit>(params: {
		unit: T;
		hpLost: number;
		sourceId?: BattleUnit["id"];
		isDirectHit?: boolean;
	}) => Promise<{ unit: T }>;

	// Source side: modifies outgoing damage of a direct hit (Might, Weak). Sync.
	onBeforeDealDamage?: (params: {
		status: Status;
		source: BattleUnit;
		target: BattleUnit;
		damage: number;
	}) => number;

	// Source side: after the unit dealt a direct hit (Stealth breaks)
	onAfterDealDamage?: (
		get: BattleGet,
		set: BattleSet,
		isSimulation: boolean,
	) => (params: { source: BattleUnit }) => Promise<void>;

	// Phase 3: Reacts to death (Explosions, Revives)
	onDeath?: (
		get: BattleGet,
		set: BattleSet,
		isSimulation: boolean,
	) => <T extends BattleUnit>(params: { unit: T }) => Promise<{ unit: T }>;

	// Pahse 4: End of turn tick
	onTick?: (
		get: BattleGet,
		set: BattleSet,
		isSimulation: boolean,
	) => <T extends BattleUnit>(params: {
		unit: T;
		status: Status;
	}) => Promise<TickResult>;

	// Phase 5: Movement interception
	onBeforeMove?: (
		get: BattleGet,
		set: BattleSet,
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
			async ({ unit, damageTaken, isTrueDamage, amount }) => {
				if (isTrueDamage) return { unit, damageTaken };
				return { unit, damageTaken: damageTaken + amount };
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

	burn: {
		onTick:
			() =>
			async ({ status }) => ({
				damageTaken: status.amount,
				isTrueDamage: true,
				vfxType: "FIRE",
			}),
	},

	// Chill & Frozen & Stun & Haste & Taunt: read by getMoveValue / isIncapacitated / AI targeting.
	chill: {},
	frozen: {},
	stun: {},
	haste: {},
	taunt: {},

	stealth: {
		onAfterDealDamage:
			(_, set) =>
			async ({ source }) => {
				set(({ units }) => ({
					units: units.map((u) =>
						u.id === source.id
							? {
									...u,
									statuses: u.statuses.filter((s) => s.type !== "stealth"),
								}
							: u,
					),
				}));
			},
	},

	might: {
		onBeforeDealDamage: ({ status, damage }) => damage + status.amount,
	},

	weak: {
		onBeforeDealDamage: ({ status, damage }) =>
			Math.max(0, damage - status.amount),
	},

	marked: {
		onBeforeDamage:
			() =>
			async ({ unit, damageTaken, isDirectHit }) => {
				if (!isDirectHit) return { unit, damageTaken };
				const bonus = unit.statuses
					.filter((s) => s.type === "marked")
					.reduce((acc, s) => acc + s.amount, 0);
				return {
					unit: {
						...unit,
						statuses: unit.statuses.filter((s) => s.type !== "marked"),
					},
					damageTaken: damageTaken + bonus,
				};
			},
	},

	thorns: {
		onAfterDamage:
			(get, set, isSimulation) =>
			async ({ unit, sourceId, isDirectHit }) => {
				if (!isDirectHit || !sourceId || sourceId === unit.id) return { unit };
				const amount = unit.statuses
					.filter((s) => s.type === "thorns")
					.reduce((acc, s) => acc + s.amount, 0);
				await applyCombatUpdate(
					get,
					set,
					isSimulation,
				)(sourceId, {
					damageTaken: amount,
					isTrueDamage: true,
				});
				return { unit };
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
	unstable_mitosis: {
		onBeforeDamage:
			(get, set) =>
			async ({ unit, damageTaken, isTrueDamage }) => {
				const { units, gridSize, removedCells } = get();

				// 1. Find empty adjacent tiles to spawn the slimes
				const spawnTiles = calculateAttackableCells({
					attacker: unit,
					rangeValue: 1,
					gridSize,
				}).filter(
					(tile) =>
						isTileInBounds(gridSize, removedCells)(tile) &&
						isTileEmpty(units)(tile),
				);

				// 2. Spawn up to 2 slimes
				const slimesToSpawn = Math.min(2, spawnTiles.length);
				const newSlimes: Summon[] = [];

				for (let i = 0; i < slimesToSpawn; i++) {
					newSlimes.push({
						...sumpSlime,
						id: summonId(crypto.randomUUID()),
						gridPosition: spawnTiles[i],
						currentHp: sumpSlime.maxHp,
						stance: UnitStance.IDLE,
						statuses: [],
						allegiance: "ENEMY",
						variant: "default",
					});
				}

				if (newSlimes.length > 0) {
					// 3. If there are new slimes, inject them into the store
					set((state) => ({
						units: [...state.units, ...newSlimes],
					}));
				}

				// 4. Negate the incoming attack completely unless true damage
				return { unit, damageTaken: isTrueDamage ? damageTaken : 0 };
			},
		onTick: () => async () => {
			const hpLoss = 20;
			return {
				damageTaken: hpLoss,
				isTrueDamage: true,
				vfxType: "POISON",
			};
		},
	},
};

/**
 * Merges incoming statuses into a unit's list and applies elemental rules:
 * - Burn melts Chill and Frozen.
 * - Chill douses Burn; 3+ total Chill turns into Frozen (skips 1 turn).
 * - Several hooks (marked, thorns, …) sum stacks themselves, so duplicates are fine.
 */
export function reconcileStatuses(
	existing: Status[],
	incoming: Status[],
	immunities: StatusType[] = [],
): Status[] {
	let statuses = [...existing];

	for (const status of incoming) {
		if (immunities.includes(status.type)) continue;

		if (status.type === "burn") {
			statuses = statuses.filter(
				(s) => s.type !== "chill" && s.type !== "frozen",
			);
		}
		if (status.type === "chill") {
			statuses = statuses.filter((s) => s.type !== "burn");
		}

		statuses.push(status);

		const totalChill = statuses
			.filter((s) => s.type === "chill")
			.reduce((acc, s) => acc + s.amount, 0);
		if (totalChill >= 3 && !immunities.includes("frozen")) {
			statuses = statuses.filter(
				(s) => s.type !== "chill" && s.type !== "frozen",
			);
			// Duration 2: survives the owner's next tick, so exactly one turn is lost.
			statuses.push({ type: "frozen", amount: 1, duration: 2 });
		}
	}

	return statuses;
}
