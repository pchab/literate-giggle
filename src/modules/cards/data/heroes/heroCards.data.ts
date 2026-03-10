import { summonId } from "@/modules/figures/helpers/figures.helpers";
import type { Card } from "../../domain/cards.type";
import { fighterCards } from "./fighterCards.data";
import { hoboCards } from "./hoboCards.data";
import { mageCards } from "./mageCards.data";
import { rogueCards } from "./rogueCards.data";
import { cryomancerCards } from "./cryomancerCards.data";
import { knightCards } from "./knightCards.data";
import { barbarianCards } from "./barbarianCards.data";
import { archerCards } from "./archerCards.data";
import { pyromancerCards } from "./pyromancerCards.data";

export const heroCardLibrary: Record<Card["id"], Card> = {
	...hoboCards,
	...fighterCards,
	...mageCards,
	...rogueCards,
	...cryomancerCards,
	...knightCards,
	...barbarianCards,
	...archerCards,
	...pyromancerCards,
};
