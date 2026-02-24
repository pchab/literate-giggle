import { cancelCard } from "./applications/cancelCard.command";
import { evolveCard } from "./applications/evolveCard.command";
import { executeCard } from "./applications/executeCard.command";

export const cardService = {
	playCard: executeCard,
	cancelCard: cancelCard,
	evolveCard: evolveCard,
};
