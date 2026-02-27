import { cancelCard } from "./applications/cancelCard.command";
import { evolveCard } from "./applications/evolveCard.command";
import { resolveCard } from "./applications/resolveCard.command";
import { selectCard } from "./applications/selectCard.command";
import { updateHand } from "./applications/updateDeck.command";

export const cardService = {
	selectCard,
	cancelCard,
	resolveCard,
	evolveCard,
	updateHand,
};
