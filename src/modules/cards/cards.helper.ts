import type { Hero, Monster } from "../figures/domain/figures.type";
import type { Card, CardEffect } from "./domain/cards.type";

export function cardId(id: string): Card["id"] {
	return `card-${id}` as Card["id"];
}

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

export function formatCardEffect(effect: CardEffect): string {
	const targetText =
		effect.target === "anchor" ? "target" : effect.target.replace(/_/g, " ");

	switch (effect.type) {
		case "damage":
			return `🗡️ Deal ${effect.amount} damage to ${targetText}.`;
		case "block":
			return `🛡️ Gain ${effect.amount} Block.`;
		case "heal":
			return `✨ Heal ${effect.amount} HP to ${targetText}.`;
		case "push":
			return `💨 Push ${targetText} ${effect.distance} tile(s).`;
		case "move":
			return `👟 Move to target cell.`;
		case "summon":
			// Optional: You could look up the actual summon name from summonLibrary here!
			return `🧱 Summon ${effect.blueprintId.replace(/_/g, " ")}.`;
		default:
			return `Unknown effect.`;
	}
}
