export type StatusType =
	| "block"
	| "poison"
	| "rooted"
	| "vulnerable"
	| "regen"
	| "swallowed"
	| "digesting";

export interface Status {
	type: StatusType;
	duration: number;
	amount: number;
}
