export type StatusType =
	| "block"
	| "poison"
	| "rooted"
	| "vulnerable"
	| "regen"
	| "swallowed"
	| "digesting"
	| "unstable_mitosis";

export interface Status {
	type: StatusType;
	duration: number;
	amount: number;
}
