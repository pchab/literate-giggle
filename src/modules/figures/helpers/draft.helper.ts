import { getComputedCard } from "@/modules/cards/helpers/cards.helper";
import type { Hero } from "@/modules/figures/domain/figures.type";
import type { RuneDraftOption } from "@/modules/figures/domain/heroClass.types";

export function generateDynamicRuneChoices(
	hero: Hero,
	count = 3,
): RuneDraftOption[] {
	const possibleOptions = new Map<string, RuneDraftOption>();

	const activeCards = hero.selectedCards
		.filter((card): card is NonNullable<typeof card> => card !== null)
		.map(getComputedCard);

	activeCards.forEach((card) => {
		if (card.range > 1) {
			possibleOptions.set("bonusRange", {
				type: "bonusRange",
				amount: 1,
				label: "+1 Range",
			});
		}

		card.effects.forEach((effect) => {
			if (effect.type === "damage") {
				possibleOptions.set("bonusDamage", {
					type: "bonusDamage",
					amount: 1,
					label: "+1 Damage",
				});
			} else if (effect.type === "heal") {
				possibleOptions.set("bonusHeal", {
					type: "bonusHeal",
					amount: 1,
					label: "+1 Heal",
				});
			} else if (effect.type === "apply_status") {
				const { type, duration } = effect.status;
				const formattedStatus = type
					.replace("_", " ")
					.replace(/\b\w/g, (c) => c.toUpperCase());

				possibleOptions.set(`amount_${type}`, {
					type: "bonusStatusAmount",
					statusType: type,
					amount: 1,
					label: `+1 ${formattedStatus} Amount`,
				});

				if (duration && duration > 0 && type !== "perma_shield") {
					possibleOptions.set(`duration_${type}`, {
						type: "bonusStatusDuration",
						statusType: type,
						amount: 1,
						label: `+1 ${formattedStatus} Duration`,
					});
				}
			} else if (effect.type === "push") {
				possibleOptions.set("push_distance", {
					type: "bonusPushDistance",
					amount: 1,
					label: `+1 Push distance`,
				});
				possibleOptions.set("push_collision", {
					type: "bonusPushCollision",
					amount: 1,
					label: `+1 Push collision damage`,
				});
			}
		});
	});

	const allOptions = Array.from(possibleOptions.values());

	if (allOptions.length === 0) {
		return [
			{ type: "bonusDamage", amount: 1, label: "+1 Damage" },
			{ type: "bonusRange", amount: 1, label: "+1 Range" },
		];
	}

	return allOptions.sort(() => Math.random() - 0.5).slice(0, count);
}
