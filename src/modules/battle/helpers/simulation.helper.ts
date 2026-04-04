import type { BattleGet, BattleSet } from "@/modules/battle/store/battle.store";

export const getSimulationState = (
	get: BattleGet,
): { fakeGet: BattleGet; fakeSet: BattleSet } => {
	// 1. Deep clone the critical state (StructuredClone is native and fast)
	// Note: Only clone the arrays we actually mutate to save performance
	const { units, surfaces, gridSize } = get();
	let draftState = structuredClone({
		units: units,
		surfaces: surfaces,
		aiIntents: {},
		playerIntent: {},
		gridSize,
	}) as ReturnType<BattleGet>;

	// 2. Create the Fake Zustand API
	const fakeGet: BattleGet = () => draftState;
	const fakeSet: BattleSet = (updater) => {
		// Zustand allows passing an object or a callback function. Handle both:
		const nextPartialState =
			typeof updater === "function" ? updater(draftState) : updater;
		draftState = { ...draftState, ...nextPartialState };
	};

	return { fakeGet, fakeSet };
};
