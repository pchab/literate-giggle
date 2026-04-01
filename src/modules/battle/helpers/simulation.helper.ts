import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";

export const getSimulationState = (
	get: StoreGet,
): { fakeGet: StoreGet; fakeSet: StoreSet } => {
	// 1. Deep clone the critical state (StructuredClone is native and fast)
	// Note: Only clone the arrays we actually mutate to save performance
	const { units, surfaces, gridSize } = get();
	let draftState = structuredClone({
		units: units,
		surfaces: surfaces,
		aiIntents: {},
		playerIntent: {},
		gridSize,
	}) as ReturnType<StoreGet>;

	// 2. Create the Fake Zustand API
	const fakeGet: StoreGet = () => draftState;
	const fakeSet: StoreSet = (updater) => {
		// Zustand allows passing an object or a callback function. Handle both:
		const nextPartialState =
			typeof updater === "function" ? updater(draftState) : updater;
		draftState = { ...draftState, ...nextPartialState };
	};

	return { fakeGet, fakeSet };
};
