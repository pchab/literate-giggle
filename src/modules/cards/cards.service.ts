import { cancelCard } from "./applications/cancelCard.command";
import { evolveCard } from "./applications/evolveCard.command";
import { resolveCard } from "./applications/resolveCard.command";
import { selectCard } from "./applications/selectCard.command";

export const cardService = {
	selectCard: selectCard,
	cancelCard: cancelCard,
	resolveCard: resolveCard,
	evolveCard: evolveCard,
};
