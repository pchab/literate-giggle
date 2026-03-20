export type VfxProjectile = "FIREBALL" | "ARROW" | "ICE" | "NECROBOLT";

export type VfxType =
	| VfxProjectile
	| "SLASH"
	| "HEAL"
	| "BLOCK"
	| "POISON"
	| "ACID_SPIT"
	| "FIRE"
	| "BLUNT"
	| "NECROTIC_IMPACT"
	| null;

export type Vfx = {
	type: VfxType;
	id?: string; // for layout id
	angle?: number; // orientation for arrows
};

export const isProjectile = (vfx: VfxType): vfx is VfxProjectile => !!vfx && ["FIREBALL", "ARROW", "ICE", "NECROBOLT"].includes(vfx);
