export type StatusType =
	| "temp_block"
	| "perma_shield"
	| "poison"
	| "rooted"
	| "vulnerable"
	| "regen";

export interface Status {
	type: StatusType;
	duration: number;
	amount: number;
}
