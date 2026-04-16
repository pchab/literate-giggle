import type { Card } from "../domain/cards.type";
import { cardId } from "../helpers/cards.helper";
import { heroCardLibrary } from "./heroes/heroCards.data";
import { itemCards } from "./items/itemCards";
import { alchemistLedgerCards } from "./monsters/alchemistLedgerCards.data";
import { dwarvenPassageCards } from "./monsters/dwarvenPassageCards.data";
import { monsterCardLibrary } from "./monsters/monsterCards.data";
import { sewerContaminationCards } from "./monsters/sewerContaminationCards.data";

export const cardLibrary: Record<Card["id"], Card> = {
	...heroCardLibrary,
	...monsterCardLibrary,
	...dwarvenPassageCards,
	...alchemistLedgerCards,
	...sewerContaminationCards,
	...itemCards,
};

export const initialDeck = [cardId("club"), cardId("bandage"), cardId("shove")];
