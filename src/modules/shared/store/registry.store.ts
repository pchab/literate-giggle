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

function isCard(item: Card | UnitBlueprint): item is Card {
	return "effects" in item;
}
function isUnitBlueprint(item: Card | UnitBlueprint): item is UnitBlueprint {
	return "intentPool" in item;
}

export const useRegistryStore = create<RegistryStore>((set, get) => ({
	cards: { ...cardLibrary },
	units: {},

	initRegistry: async () => {
		try {
			const allData = await getAll<Card | UnitBlueprint>(STORES.DATA);

			const customCards: Record<string, Card> = {};
			const customUnits: Record<string, UnitBlueprint> = {};

			allData.forEach((item: Card | UnitBlueprint) => {
				if (isCard(item)) customCards[item.id] = item;
				if (isUnitBlueprint(item)) customUnits[item.id] = item;
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
