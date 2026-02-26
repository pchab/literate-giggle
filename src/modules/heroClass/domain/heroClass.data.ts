import type { HeroClass } from "../heroClass.types";

export interface ClassDefinition {
	id: HeroClass;
	name: string;
	spriteBase: string;
}

export const CLASS_REGISTRY: Record<HeroClass, ClassDefinition> = {
	SQUIRE: {
		id: "SQUIRE",
		name: "Squire",
		spriteBase: "squire",
	},
	BARBARIAN: {
		id: "BARBARIAN",
		name: "Barbarian",
		spriteBase: "barbarian",
	},
	PALADIN: {
		id: "PALADIN",
		name: "Paladin",
		spriteBase: "paladin",
	},
	PYROMANCER: {
		id: "PYROMANCER",
		name: "Pyromancer",
		spriteBase: "pyromancer",
	},
	CLERIC: {
		id: "CLERIC",
		name: "Cleric",
		spriteBase: "cleric",
	},
	KNIGHT: {
		id: "KNIGHT",
		name: "Knight",
		spriteBase: "knight",
	},
	CRYOMANCER: {
		id: "CRYOMANCER",
		name: "Cryomancer",
		spriteBase: "cryomancer",
	},
	THIEF: {
		id: "THIEF",
		name: "Thief",
		spriteBase: "thief",
	},
};
