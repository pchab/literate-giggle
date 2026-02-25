import type { Hero, Monster } from "../figures/domain/figures.type";
import type { Card, CardEffect } from "./domain/cards.type";

export function cloneCard(card: Card): Card {
	return Object.assign({}, card);
}

export function applyEffectToHero(hero: Hero, effect: CardEffect): Hero {
	if (effect.type === "heal") {
		return {
			...hero,
			currentHp: Math.min(hero.maxHp, hero.currentHp + effect.amount),
		};
	}
	if (effect.type === "block") {
		if (effect.blockType === "physBlock")
			return {
				...hero,
				currentPhysBlock: Math.max(hero.currentPhysBlock, effect.amount),
			};
		if (effect.blockType === "magBlock")
			return {
				...hero,
				currentMagBlock: Math.max(hero.currentMagBlock, effect.amount),
			};
	}
	// Handle self-damage, buffs, etc.
	return hero;
}

export function applyEffectToMonster(
	monster: Monster,
	effect: CardEffect,
): Monster {
	if (effect.type === "damage") {
		const dmg = Math.max(
			0,
			effect.amount -
				(effect.damageType === "physDmg" ? monster.physDef : monster.magDef),
		);
		return { ...monster, currentHp: Math.max(0, monster.currentHp - dmg) };
	}
	return monster;
}
