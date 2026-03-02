import { cancelCard } from "./applications/cancelCard.command";
import { resolveCard } from "./applications/resolveCard.command";
import { selectCard } from "./applications/selectCard.command";
import { updateHand } from "./applications/updateDeck.command";

export const cardService = {
	selectCard,
	cancelCard,
	resolveCard,
	updateHand,
};
