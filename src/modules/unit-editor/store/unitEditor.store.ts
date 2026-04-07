import { set as idbSet, STORES } from "@/modules/shared/store/lib/indexed-db";
import type { UnitBlueprint } from "@/modules/units/domain/units.type";
import { create } from "zustand";

export interface UnitEditorState {
	draftUnit: UnitBlueprint;
	updateDraft: (changes: Partial<UnitBlueprint>) => void;
	resetDraft: () => void;
	saveToDatabase: () => Promise<void>;
	loadDraft: (unit: UnitBlueprint) => void;
}

const INITIAL_DRAFT: Omit<UnitBlueprint, "id" | "spriteBase"> = {
	name: "New Monster",
	maxHp: 10,
	baseDef: 0,
	baseMove: 2,
	xpReward: 5,
	immunities: [],
	surfaceImmunities: [],
	intentPool: [],
};

const createNewUnit = (): UnitBlueprint => {
	const newId = crypto.randomUUID();
	return {
		...INITIAL_DRAFT,
		id: newId as UnitBlueprint["id"],
		spriteBase: newId,
	};
};

export const useUnitEditorStore = create<UnitEditorState>((set, get) => ({
	draftUnit: createNewUnit(),

	updateDraft: (changes) =>
		set((state) => ({
			draftUnit: {
				...state.draftUnit,
				...changes,
			},
		})),
	loadDraft: (unit) => set({ draftUnit: unit }),
	resetDraft: () => set({ draftUnit: createNewUnit() }),
	saveToDatabase: async () => {
		const { draftUnit } = get();
		await idbSet(STORES.DATA, `unit_${draftUnit.name}`, draftUnit);
	},
}));
