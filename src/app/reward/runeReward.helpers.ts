import type { Card, CardEffect } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import type { RuneDraftOption } from "@/modules/figures/domain/heroClass.types";

const runeTypeToCardEffectType: Record<string, CardEffect["type"]> = {
	bonusDamage: "damage",
	bonusHeal: "heal",
	bonusStatusAmount: "apply_status",
	bonusStatusDuration: "apply_status",
	bonusPushDistance: "push",
	bonusPushCollision: "push",
};

export const getExistingRuneCount = (heroCard: Hero["deck"][0]) => {
	let count = 0;
	for (const val of Object.values(heroCard.powerRunes)) {
		if (typeof val === "number") count += val;
		else if (typeof val === "object" && val !== null) {
			count += Object.values(val).reduce(
				(sum: number, v) => sum + (v as number),
				0,
			);
		}
	}
	return count;
};

export const isCardCompatibleWithRune = (card: Card, rune: RuneDraftOption) => {
	if (rune.type === "bonusRange") {
		return card.range > 1;
	}
	return card.effects.some((effect) => {
		if (
			rune.type === "bonusStatusAmount" ||
			rune.type === "bonusStatusDuration"
		) {
			return (
				effect.type === "apply_status" && effect.status.type === rune.statusType
			);
		}
		return effect.type === runeTypeToCardEffectType[rune.type];
	});
};
