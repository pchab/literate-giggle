export type VfxType =
	| "SLASH"
	| "HEAL"
	| "BLOCK"
	| "POISON"
	| "FIREBALL"
	| "ARROW"
	| "ACID_SPIT"
	| "FIRE"
	| "BLUNT"
	| "ICE"
	| null;

export type Vfx = {
	type: VfxType;
	id?: string; // for layout id
	angle?: number; // orientation for arrows
};
