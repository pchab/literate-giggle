import type { CardEffect } from "@/modules/cards/domain/cards.type";
import type { Hero, Monster } from "@/modules/figures/domain/figures.type";

export function applyEffectToHero(hero: Hero, effect: CardEffect): Hero {
	if (effect.type === "heal") {
		return {
			...hero,
			currentHp: Math.min(hero.maxHp, hero.currentHp + effect.amount),
		};
	}
	if (effect.type === "block") {
		return {
			...hero,
			currentBlock: Math.max(hero.currentBlock, effect.amount),
		};
	}
	return hero;
}

export function applyEffectToMonster(
	monster: Monster,
	effect: CardEffect,
): Monster {
	if (effect.type === "damage") {
		const dmg = Math.max(
			0,
			effect.amount - monster.currentBlock - monster.baseDef,
		);
		return { ...monster, currentHp: Math.max(0, monster.currentHp - dmg) };
	}
	return monster;
}
