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
				const formattedStatus = effect.statusType
					.replace("_", " ")
					.replace(/\b\w/g, (c) => c.toUpperCase());

				possibleOptions.set(`amount_${effect.statusType}`, {
					type: "bonusStatusAmount",
					statusType: effect.statusType,
					amount: 1,
					label: `+1 ${formattedStatus} Amount`,
				});

				if (effect.duration && effect.duration > 0) {
					possibleOptions.set(`duration_${effect.statusType}`, {
						type: "bonusStatusDuration",
						statusType: effect.statusType,
						amount: 1,
						label: `+1 ${formattedStatus} Duration`,
					});
				}
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
