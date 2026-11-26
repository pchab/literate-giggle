import {
	createHeroCard,
	getComputedCard,
} from "@/modules/cards/helpers/cards.helper";
import { withRune } from "@/modules/cards/helpers/powerRunes.helper";
import { useRegistryStore } from "@/modules/shared/store/registry.store";
import { CLASS_REGISTRY } from "@/modules/units/data/heroClass.data";
import type {
	HeroDraftResult,
	LevelUpDraftStep,
	RuneDraftOption,
} from "@/modules/units/domain/heroClass.types";
import type { Hero } from "@/modules/units/domain/units.type";

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

				if (duration && duration > 0) {
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

// ==========================================
// LEVEL-UP DRAFT (reward screen ↔ claimRewards)
// ==========================================

/** Every decision a hero will face for the XP just earned, in level order. */
export function buildDraftSteps(
	hero: Hero,
	xpEarned: number,
): { steps: LevelUpDraftStep[]; levelsGained: number } {
	const classDef = CLASS_REGISTRY[hero.heroClass];
	const steps: LevelUpDraftStep[] = [];
	let xp = hero.currentXp + xpEarned;
	let level = hero.currentLevel;
	const owned = new Set<string>(hero.deck.map((c) => c.baseCardId));

	while (
		classDef.xpThresholds[level] !== undefined &&
		xp >= classDef.xpThresholds[level]
	) {
		xp -= classDef.xpThresholds[level];
		for (const trigger of classDef.levelUpTriggers[level] ?? []) {
			if (trigger.type === "powerRune") {
				steps.push({
					kind: "rune",
					level: level + 1,
					choices: generateDynamicRuneChoices(hero),
				});
			}
			if (trigger.type === "cardChoice") {
				const options = trigger.options.filter(
					(id) => !owned.has(id) && !!useRegistryStore.getState().getCard(id),
				);
				if (options.length)
					steps.push({ kind: "card", level: level + 1, options });
			}
			if (trigger.type === "passiveChoice") {
				const options = trigger.options.filter(
					(id) => !hero.passives.includes(id),
				);
				if (options.length)
					steps.push({ kind: "passive", level: level + 1, options });
			}
		}
		level++;
	}

	return { steps, levelsGained: level - hero.currentLevel };
}

/**
 * Applies the reward-screen picks to a hero. Pure: returns a new hero.
 * Order: learned cards (auto-equipped into a free hand slot), passives, then runes.
 */
export function applyDraftResult(hero: Hero, draft: HeroDraftResult): Hero {
	const next: Hero = {
		...hero,
		deck: [...hero.deck],
		selectedCards: [...hero.selectedCards] as Hero["selectedCards"],
		passives: [...hero.passives],
	};

	for (const cardId of draft.cards) {
		if (next.deck.some((c) => c.baseCardId === cardId)) continue;
		if (!useRegistryStore.getState().getCard(cardId)) continue;
		const heroCard = createHeroCard(hero.id)(cardId);
		next.deck.push(heroCard);
		const freeSlot = next.selectedCards.findIndex((c, i) => i > 0 && !c);
		if (freeSlot !== -1) next.selectedCards[freeSlot] = heroCard;
	}

	for (const passiveId of draft.passives) {
		if (!next.passives.includes(passiveId)) next.passives.push(passiveId);
	}

	for (const { rune, cardInstanceId } of draft.runes) {
		const deckIndex = next.deck.findIndex(
			(c) => c.instanceId === cardInstanceId,
		);
		if (deckIndex === -1) continue;
		const upgraded = withRune(next.deck[deckIndex], rune);
		next.deck[deckIndex] = upgraded;
		const handIndex = next.selectedCards.findIndex(
			(c) => c?.instanceId === cardInstanceId,
		);
		if (handIndex !== -1) next.selectedCards[handIndex] = upgraded;
	}

	return next;
}
