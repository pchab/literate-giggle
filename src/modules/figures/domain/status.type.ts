export type StatusType =
	| "temp_block"
	| "perma_shield"
	| "poison"
	| "rooted"
	| "vulnerable";

export interface Status {
	type: StatusType;
	amount: number;
	duration: number;
}
