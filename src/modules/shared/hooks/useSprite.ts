import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useAssetStore } from "../store/asset.store";

export function useSprite(spriteId: string, fallbackPath?: string) {
	const { spriteUrl, loadAsset } = useAssetStore(
		useShallow((state) => ({
			spriteUrl: state.sprites[spriteId],
			loadAsset: state.loadAsset,
		})),
	);

	useEffect(() => {
		if (spriteId && !spriteUrl) {
			loadAsset(spriteId);
		}
	}, [spriteId, spriteUrl, loadAsset]);

	return spriteUrl || fallbackPath || "";
}
