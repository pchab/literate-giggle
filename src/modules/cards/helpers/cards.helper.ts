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

export function formatStatusEffect({ status }: ApplyStatusEffect): string {
	switch (status.type) {
		case "block":
			return `🛡️ Gain ${status.amount} block${status.duration > 0 ? ` for ${status.duration} turn(s).` : ""}`;
		case "poison":
			return `☠️ Apply ${status.amount} poison for ${status.duration} turn(s).`;
		case "rooted":
			return `🌱 Apply rooted for ${status.duration} turn(s).`;
		case "vulnerable":
			return `⚡ Apply vulnerable ${status.amount} for ${status.duration} turn(s).`;
		case "regen":
			return `💚 Apply regen ${status.amount} for ${status.duration} turn(s).`;
		default:
			return `Unknown status effect.`;
	}
}

export function formatCardEffect(effect: CardEffect): string {
	const targetText =
		effect.type !== "create_surface"
			? effect.target === "anchor"
				? "target"
				: effect.target.replace(/_/g, " ")
			: "";

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
			return `🧱 ${effect.blueprintId.replace(/-/g, " ")}.`;
		case "create_surface":
			return `📛 Create ${effect.surfaceType} on the target cell.`;
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
		if (
			effect.type === "push" &&
			(instance.powerRunes.bonusPushDistance ||
				instance.powerRunes.bonusPushCollision)
		) {
			return {
				...effect,
				distance:
					effect.distance + (instance.powerRunes.bonusPushDistance ?? 0),
				collisionDamage:
					effect.collisionDamage +
					(instance.powerRunes.bonusPushCollision ?? 0),
			};
		}

		if (effect.type === "apply_status") {
			const addedAmount =
				instance.powerRunes.bonusStatusAmount?.[effect.status.type] || 0;
			const addedDuration =
				instance.powerRunes.bonusStatusDuration?.[effect.status.type] || 0;
			const { amount, duration, ...rest } = effect.status;

			return {
				...effect,
				status: {
					...rest,
					amount: amount + addedAmount,
					duration: duration === -1 ? -1 : duration + addedDuration,
				},
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

export function getStatusEffectText({ status }: ApplyStatusEffect): {
	icon: string;
	statusName: string;
	durationText: string;
} {
	let icon = "";
	let statusName = "";
	const durationText =
		status.duration !== -1 ? ` for ${status.duration} turn(s)` : "";

	// Determine the visual flavor based on the specific status
	switch (status.type) {
		case "block":
			icon = "🛡️";
			statusName = "Block";
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
