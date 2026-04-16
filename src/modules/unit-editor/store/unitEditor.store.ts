import { create } from "zustand";
import { set as idbSet, STORES } from "@/modules/shared/store/lib/indexed-db";
import type { UnitBlueprint } from "@/modules/units/domain/units.type";

export interface UnitEditorState {
	draftUnit: UnitBlueprint;
	loadDraft: (unit: UnitBlueprint) => void;
	updateDraft: (changes: Partial<UnitBlueprint>) => void;
	resetDraft: () => UnitBlueprint["id"];
	saveToDatabase: () => Promise<void>;
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
	resetDraft: () => {
		const draftUnit = createNewUnit();
		set({ draftUnit });
		return draftUnit.id;
	},
	saveToDatabase: async () => {
		const { draftUnit } = get();
		await idbSet(STORES.DATA, `unit_${draftUnit.id}`, draftUnit);
	},
}));
