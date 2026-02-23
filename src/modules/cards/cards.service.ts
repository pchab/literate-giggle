"use server";

import { evolveCard } from "./applications/evolveCard.command";
import { executeCard } from "./applications/executeCard.command";

export const cardService = {
	playCard: executeCard,
	evolveCard: evolveCard,
};
