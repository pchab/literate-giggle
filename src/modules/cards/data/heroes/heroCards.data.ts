import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const heroCardLibrary: Record<Card["id"], Card> = {
	[cardId("club")]: {
		id: cardId("club"),
		name: "Club",
		range: 1,
		image: "/cards/club.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 2, target: "anchor" }],
	},
	[cardId("bandage")]: {
		id: cardId("bandage"),
		name: "Bandage",
		range: 0,
		image: "/cards/bandage.png",
		playRequirement: "no_target",
		effects: [{ type: "heal", amount: 1, target: "self" }],
	},
	[cardId("short-sword")]: {
		id: cardId("short-sword"),
		name: "Short Sword",
		range: 1,
		image: "/cards/short-sword.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("apprentice-staff")]: {
		id: cardId("apprentice-staff"),
		name: "Apprentice Staff",
		range: 2,
		image: "/cards/apprentice-staff.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("battle-cry")]: {
		id: cardId("battle-cry"),
		name: "Battle Cry",
		range: 1,
		image: "/cards/battle-cry.png",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "push", distance: 2, collisionDamage: 3, target: "anchor" },
		],
	},
	[cardId("shield-block")]: {
		id: cardId("shield-block"),
		name: "Shield Block",
		range: 0,
		image: "/cards/shield-block.png",
		playRequirement: "no_target",
		effects: [
			{
				type: "apply_status",
				statusType: "temp_block",
				amount: 4,
				target: "self",
				duration: 1,
			},
		],
	},
	[cardId("arcane-shield-1")]: {
		id: cardId("arcane-shield-1"),
		name: "Arcane Shield",
		range: 2,
		image: "/cards/arcane-shield.png",
		playRequirement: "requires_ally_or_self",
		effects: [
			{
				type: "apply_status",
				statusType: "perma_shield",
				amount: 2,
				target: "self",
				duration: 999,
			},
		],
	},

	[cardId("knight-placeholder")]: {
		id: cardId("knight-placeholder"),
		name: "Knight Placeholder",
		range: 1,
		image: "/cards/knight.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("barbarian-placeholder")]: {
		id: cardId("barbarian-placeholder"),
		name: "Barbarian Placeholder",
		range: 1,
		image: "/cards/barbarian.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("archer-placeholder")]: {
		id: cardId("archer-placeholder"),
		name: "Archer Placeholder",
		range: 1,
		image: "/cards/archer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("pyromancer-placeholder")]: {
		id: cardId("pyromancer-placeholder"),
		name: "Pyromancer Placeholder",
		range: 1,
		image: "/cards/pyromancer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("ice-wall")]: {
		id: cardId("ice-wall"),
		name: "Ice Wall",
		range: 1,
		image: "/cards/ice-wall.png",
		playRequirement: "requires_empty_cell",
		effects: [{ type: "summon", blueprintId: "ice_wall", target: "anchor" }],
	},

	[cardId("cryomancer-placeholder")]: {
		id: cardId("cryomancer-placeholder"),
		name: "Cryomancer Placeholder",
		range: 1,
		image: "/cards/cryomancer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("knight-weapon")]: {
		id: cardId("knight-weapon"),
		name: "Knight Weapon",
		range: 1,
		image: "/cards/knight.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},

	[cardId("barbarian-weapon")]: {
		id: cardId("barbarian-weapon"),
		name: "Barbarian Weapon",
		range: 1,
		image: "/cards/barbarian.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},

	[cardId("archer-weapon")]: {
		id: cardId("archer-weapon"),
		name: "Archer Weapon",
		range: 3,
		image: "/cards/archer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},

	[cardId("pyromancer-weapon")]: {
		id: cardId("pyromancer-weapon"),
		name: "Pyromancer Weapon",
		range: 2,
		image: "/cards/pyromancer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},

	[cardId("cryomancer-weapon")]: {
		id: cardId("cryomancer-weapon"),
		name: "Cryomancer Weapon",
		range: 2,
		image: "/cards/cryomancer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},
};
