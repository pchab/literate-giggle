import { create } from "zustand";
import { get as idbGet, set as idbSet, STORES } from "./lib/indexed-db";

interface AssetStore {
	sprites: Record<string, string>;

	saveAsset: (id: string, data: Blob | File | string) => Promise<void>;
	loadAsset: (id: string) => Promise<void>;
	getSprite: (id: string, fallbackPath?: string) => string;
	revokeAllAssets: () => void;
}

export const useAssetStore = create<AssetStore>((set, getStore) => ({
	sprites: {},

	saveAsset: async (id, data) => {
		await idbSet(STORES.ASSETS, id, data);
		const url = data instanceof Blob ? URL.createObjectURL(data) : data;
		set((state) => ({ sprites: { ...state.sprites, [id]: url } }));
	},

	loadAsset: async (id) => {
		const data = await idbGet<Blob>(STORES.ASSETS, id);
		if (!data) return;

		const url: string = data instanceof Blob ? URL.createObjectURL(data) : data;
		set((state) => ({ sprites: { ...state.sprites, [id]: url } }));
	},

	getSprite: (id, fallbackPath) => {
		const { sprites } = getStore();
		return sprites[id] || fallbackPath || "";
	},

	revokeAllAssets: () => {
		const { sprites } = getStore();
		Object.values(sprites).forEach((url) => {
			if (url.startsWith("blob:")) URL.revokeObjectURL(url);
		});
		set({ sprites: {} });
	},
}));
