import { ENCOUNTER_DB } from "@/modules/campaign/data/encounters.data";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import { isHero, isMonster } from "@/modules/units/helpers/units.helpers";
import type { BattleState, StoreGet, StoreSet } from "../store/battle.store";
import { calculateStateDiff } from "./state.helpers";

const evaluateEncounterStatus = (get: StoreGet, set: StoreSet) => {
	const state = get();
	if (state.battleStatus !== "ONGOING" || !state.encounterId) return;

	const encounter = ENCOUNTER_DB[state.encounterId];
	if (!encounter) return;
	const { checkLoss = defaultLossCondition, checkWin = defaultWinCondition } =
		encounter;

	// 1. Check Custom Loss or Default Loss
	const isLoss = checkLoss(state);
	if (isLoss) {
		set(() => ({ battleStatus: "DEFEAT" }));
		return;
	}

	// 2. Check Custom Win or Default Win
	const isWin = checkWin(state);
	if (isWin) {
		set(() => ({ battleStatus: "VICTORY" }));
	}
};

const defaultLossCondition = (state: BattleState) => {
	return state.units.filter((f) => isHero(f) && f.currentHp > 0).length === 0;
};

const defaultWinCondition = (state: BattleState) => {
	return (
		state.units.filter((f) => isMonster(f) && f.currentHp > 0).length === 0
	);
};

export const finalizeAction = (
	get: StoreGet,
	set: StoreSet,
	previousUnits: BattleUnit[],
) => {
	const { units: currentUnits, xpEarned } = get();

	// 1. Calculate XP from fresh casualties
	const previousMonsters = previousUnits.filter(isMonster);
	const currentMonsters = currentUnits.filter(isMonster);

	const { projectedCasualties } = calculateStateDiff(
		currentMonsters,
		previousMonsters,
	);
	const casualtySet = new Set(projectedCasualties);

	const xpEarnedThisStep = previousMonsters.reduce(
		(xp, monster) =>
			casualtySet.has(monster.id) ? xp + (monster.xpReward ?? 0) : xp,
		0,
	);

	// 2. Clear out the corpses
	const survivingUnits = currentUnits.filter((u) => u.currentHp > 0);

	// 3. Commit the cleanup to the store
	set((state) => ({
		...state,
		units: survivingUnits,
		xpEarned: xpEarned + xpEarnedThisStep,
		shadowStateDiff: {
			projectedMoves: {},
			projectedCasualties: [],
			projectedDamage: {},
			projectedHealing: {},
		},
	}));

	// 4. Check if the battle is over
	evaluateEncounterStatus(get, set);
};
