import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";
import { apprenticeStaffCards } from "./apprenticeStaff.data";
import { arcaneShieldCards } from "./arcaneShield.data";
import { bandageCards } from "./bandage.data";
import { battleCryCards } from "./battleCry.data";
import { clubCards } from "./club.data";
import { shieldBlockCards } from "./shieldBlock.data";
import { shortSwordCards } from "./shortSword.data";

export const heroCardLibrary: Record<Card["id"], Card> = {
	...bandageCards,
	...clubCards,
	...shortSwordCards,
	...apprenticeStaffCards,
	...battleCryCards,
	...shieldBlockCards,
	...arcaneShieldCards,

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
