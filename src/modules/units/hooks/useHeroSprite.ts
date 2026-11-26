import { useEffect, useState } from "react";
import {
	getRecoloredSync,
	recolorClothes,
} from "@/modules/shared/helpers/recolor.helper";
import { getHeroColor } from "../data/heroPalette.data";
import { spriteVariants } from "../data/spriteVariants.data";
import type { UnitSpriteVariant } from "../domain/units.type";

/**
 * Heroes: clothes recoloured to their signature hue (skin untouched).
 * Everyone else (`isHero` false): the old whole-sprite CSS filter.
 */
export function useHeroSprite(
	src: string,
	variant: UnitSpriteVariant | undefined,
	isHero: boolean,
): { src: string; filter: string } {
	const hue = isHero ? getHeroColor(variant).hue : null;
	const [state, setState] = useState<{ key: string; url: string } | null>(
		null,
	);
	const key = hue === null || !src ? null : `${src}|${hue}`;

	useEffect(() => {
		if (key === null || hue === null) return;
		let alive = true;
		recolorClothes(src, hue)
			.then((url) => alive && setState({ key, url }))
			.catch(() => {
				/* keep the original sprite */
			});
		return () => {
			alive = false;
		};
	}, [key, src, hue]);

	if (!isHero) {
		return { src, filter: spriteVariants[variant || "default"] };
	}
	if (hue === null || key === null) return { src, filter: "none" };

	const url =
		(state?.key === key ? state.url : undefined) ?? getRecoloredSync(src, hue);
	return { src: url ?? src, filter: "none" };
}
