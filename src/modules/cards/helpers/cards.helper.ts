import type { Card, CardEffect } from "../domain/cards.type";

export function cardId(id: string): Card["id"] {
	return `card-${id}` as Card["id"];
}

export function cloneCard(card: Card): Card {
	return Object.assign({}, card);
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
			// Optional: look up the actual summon name from summonLibrary
			return `🧱 Summon ${effect.blueprintId.replace(/_/g, " ")}.`;
		default:
			return `Unknown effect.`;
	}
}
