import type { RuneDraftOption } from "@/modules/figures/domain/heroClass.types";
import type { HeroCard } from "../domain/cards.type";

export function addPowerRune(rune: RuneDraftOption, card: HeroCard) {
	switch (rune.type) {
		case "bonusDamage":
			card.powerRunes.bonusDamage =
				(card.powerRunes.bonusDamage || 0) + rune.amount;
			break;
		case "bonusHeal":
			card.powerRunes.bonusHeal =
				(card.powerRunes.bonusHeal || 0) + rune.amount;
			break;
		case "bonusRange":
			card.powerRunes.bonusRange =
				(card.powerRunes.bonusRange || 0) + rune.amount;
			break;
		case "bonusPushDistance":
			card.powerRunes.bonusPushDistance =
				(card.powerRunes.bonusPushDistance || 0) + rune.amount;
			break;
		case "bonusPushCollision":
			card.powerRunes.bonusPushCollision =
				(card.powerRunes.bonusPushCollision || 0) + rune.amount;
			break;
		case "bonusStatusAmount":
			card.powerRunes.bonusStatusAmount = {
				...card.powerRunes.bonusStatusAmount,
				[rune.statusType]:
					(card.powerRunes.bonusStatusAmount?.[rune.statusType] || 0) +
					rune.amount,
			};
			break;
		case "bonusStatusDuration":
			card.powerRunes.bonusStatusDuration = {
				...card.powerRunes.bonusStatusDuration,
				[rune.statusType]:
					(card.powerRunes.bonusStatusDuration?.[rune.statusType] || 0) +
					rune.amount,
			};
			break;
	}
	return card;
}
