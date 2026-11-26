import { STATUS_INFO } from "@/modules/units/data/statusInfo.data";
import type { RuneDraftOption } from "@/modules/units/domain/heroClass.types";
import type { StatusType } from "@/modules/units/domain/status.type";
import type { HeroCard, PowerRunes } from "../domain/cards.type";
import { addPowerRune } from "./heroCards.helper";

const statusLabel = (type: string) =>
	STATUS_INFO[type as StatusType]?.label ?? type;

/** Short, human labels for every upgrade on a card, e.g. ["+1 Dmg", "+1 Poison"]. */
export function describePowerRunes(runes: PowerRunes): string[] {
	const out: string[] = [];
	if (runes.bonusDamage) out.push(`+${runes.bonusDamage} Dmg`);
	if (runes.bonusHeal) out.push(`+${runes.bonusHeal} Heal`);
	if (runes.bonusRange) out.push(`+${runes.bonusRange} Range`);
	if (runes.bonusPushDistance) out.push(`+${runes.bonusPushDistance} Push`);
	if (runes.bonusPushCollision) out.push(`+${runes.bonusPushCollision} Impact`);
	for (const [type, n] of Object.entries(runes.bonusStatusAmount ?? {})) {
		if (n) out.push(`+${n} ${statusLabel(type)}`);
	}
	for (const [type, n] of Object.entries(runes.bonusStatusDuration ?? {})) {
		if (n) out.push(`+${n} ${statusLabel(type)} turn${n > 1 ? "s" : ""}`);
	}
	return out;
}

export function describeRune(rune: RuneDraftOption): string {
	return (
		describePowerRunes(addPowerRune(rune, emptyCard()).powerRunes)[0] ??
		rune.label
	);
}

/** Returns a copy of the card with the rune applied (never mutates the original). */
export function withRune(card: HeroCard, rune: RuneDraftOption): HeroCard {
	return addPowerRune(rune, {
		...card,
		powerRunes: {
			...card.powerRunes,
			bonusStatusAmount: { ...card.powerRunes.bonusStatusAmount },
			bonusStatusDuration: { ...card.powerRunes.bonusStatusDuration },
		},
	});
}

const emptyCard = (): HeroCard => ({
	instanceId: "" as HeroCard["instanceId"],
	baseCardId: "" as HeroCard["baseCardId"],
	powerRunes: {},
});
