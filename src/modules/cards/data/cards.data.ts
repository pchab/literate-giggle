import type { Card } from "../domain/cards.type";
import { cardId } from "../helpers/cards.helper";
import { heroCardLibrary } from "./heroes/heroCards.data";
import { itemCards } from "./items/itemCards";
import { dwarvenPassageCards } from "./monsters/dwarvenPassageCards.data";
import { goblinCards } from "./monsters/goblinCards.data";
import { monsterCardLibrary } from "./monsters/monsterCards.data";

export const cardLibrary: Record<Card["id"], Card> = {
	...heroCardLibrary,
	...monsterCardLibrary,
	...dwarvenPassageCards,
	...goblinCards,
	...itemCards,
};

export const initialDeck = [cardId("club"), cardId("bandage"), cardId("shove")];
