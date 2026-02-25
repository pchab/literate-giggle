import type { Card } from "@/modules/cards/domain/cards.type";
import type { HeroClass } from "./heroClass.types";
import { CLASS_DEFINING_CARDS } from "./heroClass.types";

export function evaluateHeroClass(
	cards: Card[],
	currentClass: HeroClass,
): HeroClass {
	for (const card of cards) {
		const potentialClass = CLASS_DEFINING_CARDS[card.id];
		if (potentialClass) {
			return potentialClass;
		}
	}

	return currentClass;
}
