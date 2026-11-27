import type { Card } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/units/domain/units.type";

/** The phase a scripted boss is in at its current HP, or undefined without phases. */
export function currentPhaseIndex(unit: BattleUnit): number | undefined {
	if (!unit.phases?.length) return undefined;
	const hpPercent = (unit.currentHp / unit.maxHp) * 100;
	let index = 0;
	unit.phases.forEach((phase, i) => {
		if (hpPercent <= phase.atHpPercent) index = i;
	});
	return index;
}

function patternFor(unit: BattleUnit, phaseIndex: number | undefined) {
	return phaseIndex !== undefined
		? unit.phases?.[phaseIndex]?.intentPattern
		: unit.intentPattern;
}

export function isScripted(unit: BattleUnit) {
	return !!(unit.intentPattern?.length || unit.phases?.length);
}

export interface ScriptedIntent {
	cardId: Card["id"];
	/** Set when entering a new phase: the phase, with its pattern restarted. */
	unitPatch?: Pick<BattleUnit, "patternStep" | "phaseIndex">;
	/** Set when this pick enters a new phase (including the first one). */
	bark?: string;
}

/**
 * The move a scripted boss shows next: the current card of its pattern, or the first
 * card of a new phase's pattern if its HP crossed a threshold. Picking doesn't
 * advance the pattern (see advancePattern), so it can be recomputed safely.
 * Null if the unit isn't scripted.
 */
export function nextScriptedIntent(unit: BattleUnit): ScriptedIntent | null {
	const phaseIndex = currentPhaseIndex(unit);
	const pattern = patternFor(unit, phaseIndex);
	if (!pattern?.length) return null;

	const enteredPhase =
		phaseIndex !== undefined && phaseIndex !== unit.phaseIndex;
	const step = enteredPhase ? 0 : (unit.patternStep ?? 0);
	return {
		cardId: pattern[step % pattern.length],
		unitPatch: enteredPhase ? { patternStep: 0, phaseIndex } : undefined,
		bark: enteredPhase ? unit.phases?.[phaseIndex]?.bark : undefined,
	};
}

/** After a scripted boss's move resolves: the pattern moves on to the next card. */
export function advancePattern<U extends BattleUnit>(unit: U): U {
	return isScripted(unit)
		? { ...unit, patternStep: (unit.patternStep ?? 0) + 1 }
		: unit;
}

/**
 * The moves a scripted boss will play after its current one, assuming it stays in
 * its current phase (for the inspector).
 */
export function upcomingScriptedMoves(
	unit: BattleUnit,
	count = 3,
): Card["id"][] {
	const pattern = patternFor(unit, unit.phaseIndex ?? currentPhaseIndex(unit));
	if (!pattern?.length) return [];
	const step = unit.patternStep ?? 0;
	return Array.from(
		{ length: count },
		(_, i) => pattern[(step + 1 + i) % pattern.length],
	);
}
