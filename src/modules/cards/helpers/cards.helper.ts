import type { Hero } from "@/modules/figures/domain/figures.type";
import { cardLibrary } from "../data/cards.data";
import type {
	ApplyStatusEffect,
	Card,
	CardEffect,
	HeroCard,
} from "../domain/cards.type";

export function cardId(id: string): Card["id"] {
	return `card-${id}` as Card["id"];
}

export function cloneCard(card: Card): Card {
	return Object.assign({}, card);
}

export function formatStatusEffect(effect: ApplyStatusEffect): string {
	switch (effect.statusType) {
		case "temp_block":
			return `🛡️ Gain ${effect.amount} temporary block for ${effect.duration} turn(s).`;
		case "perma_shield":
			return `🛡️ Gain ${effect.amount} permanent shield.`;
		case "poison":
			return `☠️ Apply ${effect.amount} poison for ${effect.duration} turn(s).`;
		case "rooted":
			return `🌱 Apply rooted for ${effect.duration} turn(s).`;
		case "vulnerable":
			return `⚡ Apply vulnerable for ${effect.duration} turn(s).`;
		default:
			return `Unknown status effect.`;
	}
}

export function formatCardEffect(effect: CardEffect): string {
	const targetText =
		effect.target === "anchor" ? "target" : effect.target.replace(/_/g, " ");

	switch (effect.type) {
		case "damage":
			return `🗡️ Deal ${effect.amount} damage to ${targetText}.`;
		case "apply_status":
			return formatStatusEffect(effect);
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

export function createHeroCard(heroId: Hero["id"]) {
	return (baseCardId: Card["id"]): HeroCard => {
		const baseCard = cardLibrary[baseCardId];
		if (!baseCard) {
			throw new Error(`Missing base card id ${baseCardId}`);
		}

		return {
			baseCardId,
			instanceId: cardId(`${heroId}-${baseCardId}`),
			powerRunes: {},
		};
	};
}

export function getComputedCard(instance: HeroCard): Card {
	const baseCard = cardLibrary[instance.baseCardId];
	if (!baseCard) {
		throw new Error(`Missing card definition ${instance.baseCardId}`);
	}

	const { effects, range, ...cardStats } = baseCard;
	const computedEffects: CardEffect[] = effects.map((effect) => {
		if (effect.type === "damage" && instance.powerRunes.bonusDamage) {
			return {
				...effect,
				amount: effect.amount + instance.powerRunes.bonusDamage,
			};
		}

		if (effect.type === "heal" && instance.powerRunes.bonusHeal) {
			return {
				...effect,
				amount: effect.amount + instance.powerRunes.bonusHeal,
			};
		}

		if (effect.type === "apply_status") {
			const addedAmount =
				instance.powerRunes.bonusStatusAmount?.[effect.statusType] || 0;
			const addedDuration =
				instance.powerRunes.bonusStatusDuration?.[effect.statusType] || 0;

			return {
				...effect,
				amount: effect.amount + addedAmount,
				duration: effect.duration === -1 ? -1 : effect.duration + addedDuration,
			};
		}

		return effect;
	});

	return {
		...cardStats,
		id: instance.instanceId,
		range: range + (instance.powerRunes.bonusRange || 0),
		effects: computedEffects,
	};
}

export function getStatusEffectText(effect: ApplyStatusEffect): {
	icon: string;
	statusName: string;
	durationText: string;
} {
	let icon = "";
	let statusName = "";
	let durationText =
		effect.duration !== -1 ? ` for ${effect.duration} turn(s)` : "";

	// Determine the visual flavor based on the specific status
	switch (effect.statusType) {
		case "temp_block":
			icon = "🛡️";
			statusName = "Temporary Block";
			break;
		case "perma_shield":
			icon = "🔮"; // Or ✨ for Arcane Shield
			statusName = "Permanent Shield";
			durationText = ""; // Perma shield doesn't decay
			break;
		case "poison":
			icon = "☠️";
			statusName = "Poison";
			break;
		case "rooted":
			icon = "🌱";
			statusName = "Rooted";
			break;
		case "vulnerable":
			icon = "💔";
			statusName = "Vulnerable";
			break;
		default:
			icon = "✨";
			statusName = "Status";
	}
	return { icon, statusName, durationText };
}
