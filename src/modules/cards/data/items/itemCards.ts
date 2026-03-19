import type { Card } from "../../domain/cards.type";
import { acidFlaskExplosionCard } from "./acidFlaskExplosion";

export const itemCards: Record<Card["id"], Card> = {
	[acidFlaskExplosionCard.id]: acidFlaskExplosionCard,
};
