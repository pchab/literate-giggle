import type { Card } from "../../domain/cards.type";
import { archerCards } from "./archerCards.data";
import { barbarianCards } from "./barbarianCards.data";
import { clericCards } from './clericCards.data';
import { cryomancerCards } from "./cryomancerCards.data";
import { fighterCards } from "./fighterCards.data";
import { hoboCards } from "./hoboCards.data";
import { knightCards } from "./knightCards.data";
import { mageCards } from "./mageCards.data";
import { pyromancerCards } from "./pyromancerCards.data";
import { rogueCards } from "./rogueCards.data";

export const heroCardLibrary: Record<Card["id"], Card> = {
	...hoboCards,
	...fighterCards,
	...mageCards,
	...rogueCards,
	...archerCards,
	...clericCards,
	...cryomancerCards,
	...pyromancerCards,
	...knightCards,
	...barbarianCards,
};
