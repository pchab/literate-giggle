import type { Card } from "../domain/cards.type";
import { cardId } from "../helpers/cards.helper";

const bandageBase: Pick<Card, "name" | "range" | "image" | "playRequirement"> = {
	name: "Bandage",
	range: 0,
	image: "/cards/bandage.png",
	playRequirement: "no_target",
};

const clubBase: Pick<Card, "name" | "range" | "image" | "playRequirement"> = {
	name: "Club",
	range: 1,
	image: "/cards/club.png",
	playRequirement: "requires_enemy",
};

const shortSwordBase: Pick<Card, "name" | "range" | "image" | "playRequirement"> = {
	name: "Short Sword",
	range: 1,
	image: "/cards/short-sword.png",
	playRequirement: "requires_enemy",
};

const apprenticeStaffBase: Pick<Card, "name" | "range" | "image" | "playRequirement"> = {
	name: "Apprentice Staff",
	range: 2,
	image: "/cards/apprentice-staff.png",
	playRequirement: "requires_enemy",
};

const battleCryBase: Pick<Card, "name" | "range" | "image" | "playRequirement"> = {
	name: "Battle Cry",
	range: 1,
	image: "/cards/battle-cry.png",
	playRequirement: "requires_enemy",
};

const shieldBlockBase: Pick<Card, "name" | "range" | "image" | "playRequirement"> = {
	name: "Shield Block",
	range: 0,
	image: "/cards/shield-block.png",
	playRequirement: "no_target",
};

const arcaneShieldBase: Pick<Card, "name" | "range" | "image" | "playRequirement"> = {
	name: "Arcane Shield",
	range: 2,
	image: "/cards/arcane-shield.png",
	playRequirement: "requires_ally_or_self",
};

export const cardLibrary: Record<Card["id"], Card> = {
	[cardId("bandage-1")]: {
		id: cardId("bandage-1"),
		...bandageBase,
		effects: [{ type: "heal", amount: 1, target: "self" }],
	},
	[cardId("bandage-2")]: {
		id: cardId("bandage-2"),
		...bandageBase,
		effects: [{ type: "heal", amount: 2, target: "self" }],
	},
	[cardId("bandage-3")]: {
		id: cardId("bandage-3"),
		...bandageBase,
		effects: [{ type: "heal", amount: 3, target: "self" }],
	},

	[cardId("club-1")]: {
		id: cardId("club-1"),
		...clubBase,
		effects: [{ type: "damage", amount: 2, target: "anchor" }],
	},
	[cardId("club-2")]: {
		id: cardId("club-2"),
		...clubBase,
		effects: [{ type: "damage", amount: 3, target: "anchor" }],
	},
	[cardId("club-3")]: {
		id: cardId("club-3"),
		...clubBase,
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("short-sword-1")]: {
		id: cardId("short-sword-1"),
		...shortSwordBase,
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("short-sword-2")]: {
		id: cardId("short-sword-2"),
		...shortSwordBase,
		effects: [{ type: "damage", amount: 5, target: "anchor" }],
	},
	[cardId("short-sword-3")]: {
		id: cardId("short-sword-3"),
		...shortSwordBase,
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},
	[cardId("apprentice-staff-1")]: {
		id: cardId("apprentice-staff-1"),
		...apprenticeStaffBase,
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("apprentice-staff-2")]: {
		id: cardId("apprentice-staff-2"),
		...apprenticeStaffBase,
		effects: [{ type: "damage", amount: 5, target: "anchor" }],
	},
	[cardId("apprentice-staff-3")]: {
		id: cardId("apprentice-staff-3"),
		...apprenticeStaffBase,
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},

	[cardId("arcane-shield-1")]: {
		id: cardId("arcane-shield-1"),
		...arcaneShieldBase,
		playRequirement: "no_target",
		effects: [{ type: "block", amount: 2, target: "self" }],
	},
	[cardId("arcane-shield-2")]: {
		id: cardId("arcane-shield-2"),
		...arcaneShieldBase,
		effects: [{ type: "block", amount: 3, target: "anchor" }],
	},
	[cardId("arcane-shield-3")]: {
		id: cardId("arcane-shield-3"),
		...arcaneShieldBase,
		effects: [{ type: "block", amount: 4, target: "anchor" }],
	},

	[cardId("shield-block-1")]: {
		id: cardId("shield-block-1"),
		...shieldBlockBase,
		effects: [{ type: "block", amount: 4, target: "self" }],
	},
	[cardId("shield-block-2")]: {
		id: cardId("shield-block-2"),
		...shieldBlockBase,
		effects: [{ type: "block", amount: 5, target: "self" }],
	},
	[cardId("shield-block-3")]: {
		id: cardId("shield-block-3"),
		...shieldBlockBase,
		effects: [{ type: "block", amount: 6, target: "self" }],
	},

	[cardId("battle-cry-1")]: {
		id: cardId("battle-cry-1"),
		...battleCryBase,
		effects: [
			{ type: "push", distance: 1, target: "adjacent_to_anchor" }, // Or whatever your AoE target is!
			{ type: "block", amount: 2, target: "self" },
		],
	},
	[cardId("battle-cry-2")]: {
		id: cardId("battle-cry-2"),
		...battleCryBase,
		effects: [
			{ type: "push", distance: 1, target: "adjacent_to_anchor" }, // Or whatever your AoE target is!
			{ type: "block", amount: 3, target: "self" },
		],
	},
	[cardId("battle-cry-3")]: {
		id: cardId("battle-cry-3"),
		...battleCryBase,
		effects: [
			{ type: "push", distance: 1, target: "adjacent_to_anchor" }, // Or whatever your AoE target is!
			{ type: "block", amount: 4, target: "self" },
		],
	},

	[cardId("knight-placeholder-1")]: {
		id: cardId("knight-placeholder-1"),
		name: "Knight Placeholder",
		range: 1,
		image: "/cards/knight.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("barbarian-placeholder-1")]: {
		id: cardId("barbarian-placeholder-1"),
		name: "Barbarian Placeholder",
		range: 1,
		image: "/cards/barbarian.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("archer-placeholder-1")]: {
		id: cardId("archer-placeholder-1"),
		name: "Archer Placeholder",
		range: 1,
		image: "/cards/archer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("pyromancer-placeholder-1")]: {
		id: cardId("pyromancer-placeholder-1"),
		name: "Pyromancer Placeholder",
		range: 1,
		image: "/cards/pyromancer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("ice-wall-1")]: {
		id: cardId("ice-wall-1"),
		name: "Ice Wall",
		range: 1,
		image: "/cards/ice-wall.png",
		playRequirement: "requires_empty_cell",
		effects: [{ type: "summon", blueprintId: "ice_wall", target: "anchor" }],
	},

	[cardId("cryomancer-placeholder-1")]: {
		id: cardId("cryomancer-placeholder-1"),
		name: "Cryomancer Placeholder",
		range: 1,
		image: "/cards/cryomancer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("knight-weapon-1")]: {
		id: cardId("knight-weapon-1"),
		name: "Knight Weapon",
		range: 1,
		image: "/cards/knight.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},

	[cardId("barbarian-weapon-1")]: {
		id: cardId("barbarian-weapon-1"),
		name: "Barbarian Weapon",
		range: 1,
		image: "/cards/barbarian.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},

	[cardId("archer-weapon-1")]: {
		id: cardId("archer-weapon-1"),
		name: "Archer Weapon",
		range: 3,
		image: "/cards/archer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},

	[cardId("pyromancer-weapon-1")]: {
		id: cardId("pyromancer-weapon-1"),
		name: "Pyromancer Weapon",
		range: 2,
		image: "/cards/pyromancer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},

	[cardId("cryomancer-weapon-1")]: {
		id: cardId("cryomancer-weapon-1"),
		name: "Cryomancer Weapon",
		range: 2,
		image: "/cards/cryomancer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},
};

export const initialDeck = [cardId("club-1"), cardId("bandage-1")];
