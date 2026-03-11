import type { CardEffect } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { VfxType } from "../domain/vfx.type";
import { getCellId } from "./grid.helpers";

export function getVfxForEffect<T extends BattleUnit>(
	effect: CardEffect,
	targets: T["gridPosition"][],
): Record<string, VfxType> {
	const vfx: Record<string, VfxType> = {};

	switch (effect.type) {
		case "heal":
			targets.forEach((position) => {
				vfx[getCellId(position)] = "HEAL";
			});
			break;
		case "damage":
			targets.forEach((position) => {
				vfx[getCellId(position)] = "SLASH";
			});
			break;
		case "apply_status":
			targets.forEach((position) => {
				if (["perma_shield", "temp_block"].includes(effect.status.type)) {
					vfx[getCellId(position)] = "BLOCK";
				}
				if (effect.status.type === "poison") {
					vfx[getCellId(position)] = "POISON";
				}
				if (effect.status.type === "regen") {
					vfx[getCellId(position)] = "HEAL";
				}
			});
			break;
	}

	return vfx;
}
