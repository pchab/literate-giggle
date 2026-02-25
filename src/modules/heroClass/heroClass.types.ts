import type { Card } from "@/modules/cards/domain/cards.type";
import { cardLibrary } from "../cards/domain/cards";

export type HeroClass =
	| "SQUIRE"
	| "KNIGHT"
	| "BARBARIAN"
	| "PALADIN"
	| "PYROMANCER"
	| "CRYOMANCER"
	| "CLERIC"
	| "THIEF";

export const CLASS_DEFINING_CARDS: Record<Card["id"], HeroClass> = {
	[cardLibrary[5].id]: "KNIGHT", // Long Sword
	[cardLibrary[6].id]: "BARBARIAN", // Battle Axe
	[cardLibrary[7].id]: "PALADIN", // Steel Shield
	[cardLibrary[8].id]: "PALADIN", // Heavy Shield (can map multiple cards to one class)
	[cardLibrary[9].id]: "PYROMANCER", // Fireball
	[cardLibrary[10].id]: "CRYOMANCER", // Ice Shard
	[cardLibrary[13].id]: "CLERIC", // Healing Orb
};
