import { create } from "zustand";
import { cardLibrary } from "@/modules/cards/data/cards.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { UnitBlueprint } from "@/modules/units/domain/units.type";
import { getAll, STORES } from "./lib/indexed-db";

interface RegistryStore {
	cards: Record<string, Card>;
	units: Record<string, UnitBlueprint>;

	initRegistry: () => Promise<void>;
	getAllCards: () => Card[];
	getCard: (id: string) => Card | undefined;
	getUnit: (id: string) => UnitBlueprint | undefined;
}

export const useRegistryStore = create<RegistryStore>((set, get) => ({
	cards: { ...cardLibrary },
	units: {},

	initRegistry: async () => {
		try {
			const allData = await getAll(STORES.DATA);

			const customCards: Record<string, Card> = {};
			const customUnits: Record<string, UnitBlueprint> = {};

			allData.forEach((item: any) => {
				if (item.effects) customCards[item.id] = item;
				if (item.intentPool) customUnits[item.id] = item;
			});

			set((state) => ({
				cards: { ...state.cards, ...customCards },
				units: { ...state.units, ...customUnits },
			}));
		} catch (error) {
			console.error("Failed to load campaign data from IndexedDB", error);
		}
	},

	getAllCards: () => {
		const { cards } = get();
		return Object.values(cards);
	},
	getCard: (id) => get().cards[id],
	getUnit: (id) => get().units[id],
}));
