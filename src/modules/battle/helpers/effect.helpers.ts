import type { CardEffect } from "@/modules/cards/domain/cards.type";
import type {
	Figure,
	Hero,
	Monster,
} from "@/modules/figures/domain/figures.type";

export function applyDamageToEntity<T extends Figure>(
	entity: T,
	damage: number,
): T {
	const effectiveDmg = Math.max(0, damage - entity.baseDef);
	const hpDamage = Math.max(0, effectiveDmg - entity.currentBlock);
	const newBlock = Math.max(0, entity.currentBlock - effectiveDmg);
	return {
		...entity,
		currentHp: Math.max(0, entity.currentHp - hpDamage),
		currentBlock: newBlock,
	};
}

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
	if (effect.type === "damage") {
		return applyDamageToEntity(hero, effect.amount);
	}
	return hero;
}

export function applyEffectToMonster(
	monster: Monster,
	effect: CardEffect,
): Monster {
	if (effect.type === "damage") {
		return applyDamageToEntity(monster, effect.amount);
	}
	return monster;
}
