import type { CardEffect } from "@/modules/cards/domain/cards.type";
import type { Hero, Monster } from "@/modules/figures/domain/figures.type";
import { getCellId } from "../grid.helpers";
import type { VfxType } from "./vfx.type";

export function getVfxForEffect(
	effect: CardEffect,
	targets: {
		monsterPositions: Monster["gridPosition"][];
		heroPositions: Hero["gridPosition"][];
	},
): Record<string, VfxType> {
	const vfx: Record<string, VfxType> = {};

	switch (effect.type) {
		case "heal":
			targets.heroPositions.forEach((heroPosition) => {
				vfx[getCellId(heroPosition)] = "HEAL";
			});
			break;
		case "damage":
			targets.monsterPositions.forEach((monsterPosition) => {
				vfx[getCellId(monsterPosition)] = "SLASH";
			});
			break;
		case "block":
			targets.heroPositions.forEach((heroPosition) => {
				vfx[getCellId(heroPosition)] = "BLOCK";
			});
			break;
	}

	return vfx;
}
