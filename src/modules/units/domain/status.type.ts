export type StatusType =
	| "block"
	| "poison"
	| "rooted"
	| "vulnerable"
	| "regen"
	| "swallowed"
	| "digesting"
	| "unstable_mitosis"
	// --- elemental ---
	| "burn" // DoT; cancels chill / frozen
	| "chill" // -1 move; 3 stacks → frozen
	| "frozen" // skips its turn
	// --- control ---
	| "stun" // skips its turn
	| "taunt" // enemy AI must target this unit first
	| "stealth" // enemy AI can't target it; lost on direct hit dealt
	| "haste" // +amount move
	// --- combat modifiers ---
	| "might" // +amount damage on direct hits dealt
	| "weak" // -amount damage on direct hits dealt
	| "marked" // next direct hit received deals +amount, then consumed
	| "thorns"; // direct hit attackers take amount true damage

export interface Status {
	type: StatusType;
	duration: number;
	amount: number;
}
