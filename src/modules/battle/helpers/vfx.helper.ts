import type { CardEffect } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { Vfx } from "../domain/vfx.type";
import { getCellId } from "./grid.helpers";

export function getVfxForEffect<T extends BattleUnit>(
	effect: CardEffect,
	targets: T["gridPosition"][],
): Record<string, Vfx> {
	const vfx: Record<string, Vfx> = {};

	switch (effect.type) {
		case "heal":
			targets.forEach((position) => {
				vfx[getCellId(position)] = { type: "HEAL" };
			});
			break;
		case "damage":
			targets.forEach((position) => {
				vfx[getCellId(position)] = { type: effect.vfx ?? "SLASH" };
			});
			break;
		case "apply_status":
			targets.forEach((position) => {
				if (["perma_shield", "temp_block"].includes(effect.status.type)) {
					vfx[getCellId(position)] = { type: "BLOCK" };
				}
				if (effect.status.type === "poison") {
					vfx[getCellId(position)] = { type: "POISON" };
				}
				if (effect.status.type === "regen") {
					vfx[getCellId(position)] = { type: "HEAL" };
				}
			});
			break;
	}

	return vfx;
}
