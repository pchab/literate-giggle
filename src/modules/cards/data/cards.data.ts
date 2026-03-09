import type { Card } from "../domain/cards.type";
import { cardId } from "../helpers/cards.helper";
import { heroCardLibrary } from "./heroes/heroCards.data";
import { monsterCardLibrary } from "./monsters/monsterCards.data";

export const cardLibrary: Record<Card["id"], Card> = {
	...heroCardLibrary,
	...monsterCardLibrary,
};

export const initialDeck = [cardId("club"), cardId("bandage")];
