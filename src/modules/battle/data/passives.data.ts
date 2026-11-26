import {
	PASSIVE_IDS,
	type PassiveId,
} from "@/modules/units/data/passiveIds.data";
import type { PassiveDefinition } from "@/modules/units/domain/passive.type";
import type { StatusType } from "@/modules/units/domain/status.type";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import { hasStatus } from "@/modules/units/helpers/units.helpers";
import { areEnemies, getAllegiance } from "../helpers/effects/effect.helpers";
import {
	getDistanceToBoundingBox,
	isUnitInTile,
} from "../helpers/grid.helpers";
import { flashPassive } from "../helpers/passive.helpers";
import { applyCombatUpdate } from "../helpers/state.helpers";

// --- small geometry helpers ---

const isAllyOf = (owner: BattleUnit) => (other: BattleUnit) =>
	other.id !== owner.id &&
	getAllegiance(other) !== "NEUTRAL" &&
	getAllegiance(other) === getAllegiance(owner);

const isAdjacent = (a: BattleUnit, b: BattleUnit) =>
	getDistanceToBoundingBox({ caster: a, target: b }) === 1;

/** True when an ally of `owner` stands on the far side of `target`, in line with the owner. */
const isFlanking = (
	units: BattleUnit[],
	owner: BattleUnit,
	target: BattleUnit,
) => {
	if (!isAdjacent(owner, target)) return false;
	const size = target.size ?? { cols: 1, rows: 1 };
	const { col: tc, row: tr } = target.gridPosition;
	const { col: oc, row: or } = owner.gridPosition;

	let opposite: { col: number; row: number } | null = null;
	if (oc < tc) opposite = { col: tc + size.cols, row: or };
	else if (oc > tc + size.cols - 1) opposite = { col: tc - 1, row: or };
	else if (or < tr) opposite = { col: oc, row: tr + size.rows };
	else if (or > tr + size.rows - 1) opposite = { col: oc, row: tr - 1 };
	if (!opposite) return false;

	const tile = opposite;
	return units.some(
		(u) => u.currentHp > 0 && isAllyOf(owner)(u) && isUnitInTile(tile)(u),
	);
};

export { PASSIVE_IDS };

const DEBUFFS: StatusType[] = [
	"poison",
	"burn",
	"chill",
	"frozen",
	"stun",
	"weak",
	"vulnerable",
	"marked",
	"rooted",
];

export const PASSIVE_REGISTRY: Record<PassiveId, PassiveDefinition> = {
	// --- HOBO ---
	[PASSIVE_IDS.scavenger]: {
		id: PASSIVE_IDS.scavenger,
		name: "Scavenger",
		icon: "🦴",
		description: "When this hero lands a killing blow, heal 1 HP.",
		hooks: {
			onKill: async (ctx) => {
				await applyCombatUpdate(
					ctx.get,
					ctx.set,
					ctx.isSimulation,
				)(ctx.owner.id, { healingReceived: 1 });
				flashPassive(ctx, "HEAL");
			},
		},
	},

	// --- FIGHTER ---
	[PASSIVE_IDS.hold_the_line]: {
		id: PASSIVE_IDS.hold_the_line,
		name: "Hold the Line",
		icon: "🛡️",
		description:
			"When an adjacent ally loses HP, gain 1 Block until your next turn.",
		hooks: {
			onAnyDamaged: async (ctx, { target }) => {
				if (!isAllyOf(ctx.owner)(target) || !isAdjacent(ctx.owner, target)) {
					return;
				}
				await applyCombatUpdate(
					ctx.get,
					ctx.set,
					ctx.isSimulation,
				)(ctx.owner.id, {
					newStatuses: [{ type: "block", amount: 1, duration: 1 }],
				});
				flashPassive(ctx, "BLOCK");
			},
		},
	},

	// --- KNIGHT ---
	[PASSIVE_IDS.bulwark]: {
		id: PASSIVE_IDS.bulwark,
		name: "Bulwark",
		icon: "🏰",
		description: "Adjacent allies take 1 less damage from each hit.",
		hooks: {
			modifyIncomingDamage: ({ owner }, { target, amount }) =>
				isAllyOf(owner)(target) && isAdjacent(owner, target)
					? amount - 1
					: amount,
		},
	},

	// --- BARBARIAN ---
	[PASSIVE_IDS.bloodlust]: {
		id: PASSIVE_IDS.bloodlust,
		name: "Bloodlust",
		icon: "🩸",
		description: "+1 damage for every 3 missing HP.",
		hooks: {
			modifyOutgoingDamage: ({ owner }, { amount }) =>
				amount + Math.floor((owner.maxHp - owner.currentHp) / 3),
		},
	},

	// --- ROGUE ---
	[PASSIVE_IDS.backstab]: {
		id: PASSIVE_IDS.backstab,
		name: "Backstab",
		icon: "🗡️",
		description:
			"+2 damage when an ally stands on the opposite side of your target.",
		hooks: {
			modifyOutgoingDamage: ({ get, owner }, { target, amount }) =>
				isFlanking(get().units, owner, target) ? amount + 2 : amount,
		},
	},

	// --- ARCHER ---
	[PASSIVE_IDS.steady_aim]: {
		id: PASSIVE_IDS.steady_aim,
		name: "Steady Aim",
		icon: "🎯",
		description: "+1 damage if this hero hasn't moved this turn.",
		hooks: {
			modifyOutgoingDamage: ({ get, owner }, { amount }) =>
				((get().usedMovesThisTurn as Record<string, number>)[owner.id] ?? 0) ===
				0
					? amount + 1
					: amount,
		},
	},

	// --- MAGE ---
	[PASSIVE_IDS.spell_focus]: {
		id: PASSIVE_IDS.spell_focus,
		name: "Spell Focus",
		icon: "🔮",
		description: "+1 range on cards with range 2 or more.",
		hooks: {
			modifyCard: (card) =>
				card.range >= 2 ? { ...card, range: card.range + 1 } : card,
		},
	},

	// --- PYROMANCER ---
	[PASSIVE_IDS.kindling]: {
		id: PASSIVE_IDS.kindling,
		name: "Kindling",
		icon: "🔥",
		description: "+2 damage against burning targets.",
		hooks: {
			modifyOutgoingDamage: (_, { target, amount }) =>
				hasStatus(target, "burn") ? amount + 2 : amount,
		},
	},

	// --- CRYOMANCER ---
	[PASSIVE_IDS.permafrost]: {
		id: PASSIVE_IDS.permafrost,
		name: "Permafrost",
		icon: "❄️",
		description:
			"Direct hits that deal damage also apply 1 Chill (3 Chill = Frozen).",
		hooks: {
			onAnyDamaged: async (ctx, { target, sourceId, isDirectHit }) => {
				if (sourceId !== ctx.owner.id || !isDirectHit) return;
				const victim = ctx.get().units.find((u) => u.id === target.id);
				if (!victim || victim.currentHp <= 0) return;
				if (!areEnemies(ctx.owner)(victim)) return;
				await applyCombatUpdate(
					ctx.get,
					ctx.set,
					ctx.isSimulation,
				)(victim.id, {
					newStatuses: [{ type: "chill", amount: 1, duration: 2 }],
				});
			},
		},
	},

	// --- GENERIC (level-up passive choices) ---
	[PASSIVE_IDS.opportunist]: {
		id: PASSIVE_IDS.opportunist,
		name: "Opportunist",
		icon: "🦅",
		description:
			"+1 damage against targets that are poisoned, burning, chilled, weak, vulnerable, marked, rooted, stunned or frozen.",
		hooks: {
			modifyOutgoingDamage: (_, { target, amount }) =>
				DEBUFFS.some((d) => hasStatus(target, d)) ? amount + 1 : amount,
		},
	},
	[PASSIVE_IDS.momentum]: {
		id: PASSIVE_IDS.momentum,
		name: "Momentum",
		icon: "🏃",
		description: "+1 damage if this hero moved this turn.",
		hooks: {
			modifyOutgoingDamage: ({ get, owner }, { amount }) =>
				((get().usedMovesThisTurn as Record<string, number>)[owner.id] ?? 0) > 0
					? amount + 1
					: amount,
		},
	},
	[PASSIVE_IDS.second_wind]: {
		id: PASSIVE_IDS.second_wind,
		name: "Second Wind",
		icon: "🌬️",
		description:
			"At the start of your turn, heal 2 if at or below a third of max HP.",
		hooks: {
			onTurnStart: async (ctx) => {
				if (ctx.owner.currentHp > ctx.owner.maxHp / 3) return;
				await applyCombatUpdate(
					ctx.get,
					ctx.set,
					ctx.isSimulation,
				)(ctx.owner.id, { healingReceived: 2 });
				flashPassive(ctx, "HEAL");
			},
		},
	},

	// --- CLERIC ---
	[PASSIVE_IDS.devotion]: {
		id: PASSIVE_IDS.devotion,
		name: "Devotion",
		icon: "✨",
		description: "Healing beyond max HP becomes Block until your next turn.",
		hooks: {
			onOverheal: (_, { overflow }) => [
				{ type: "block", amount: overflow, duration: 1 },
			],
		},
	},
};
