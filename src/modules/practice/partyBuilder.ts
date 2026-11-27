import { createHeroCard } from "@/modules/cards/helpers/cards.helper";
import { useRegistryStore } from "@/modules/shared/store/registry.store";
import { CLASS_REGISTRY } from "@/modules/units/data/heroClass.data";
import type {
	HeroClass,
	HeroDraftResult,
	LevelUpDefinition,
} from "@/modules/units/domain/heroClass.types";
import type { Hero } from "@/modules/units/domain/units.type";
import {
	applyDraftResult,
	generateDynamicRuneChoices,
} from "@/modules/units/helpers/draft.helper";
import { applyLevelUpTriggers } from "@/modules/units/helpers/levelUpEffects.helper";

/** Classes a hero goes through to reach each class, starting as a Hobo. */
export const CLASS_PATHS: Record<HeroClass, HeroClass[]> = {
	HOBO: ["HOBO"],
	FIGHTER: ["HOBO", "FIGHTER"],
	MAGE: ["HOBO", "MAGE"],
	ROGUE: ["HOBO", "ROGUE"],
	ARCHER: ["HOBO", "ARCHER"],
	CLERIC: ["HOBO", "CLERIC"],
	KNIGHT: ["HOBO", "FIGHTER", "KNIGHT"],
	BARBARIAN: ["HOBO", "FIGHTER", "BARBARIAN"],
	PYROMANCER: ["HOBO", "MAGE", "PYROMANCER"],
	CRYOMANCER: ["HOBO", "MAGE", "CRYOMANCER"],
};

/** Highest level a preset can reach in a class (the level its promotion triggers at). */
export function maxPresetLevel(heroClass: HeroClass) {
	return CLASS_REGISTRY[heroClass].levelUpTriggers.length;
}

export interface HeroPreset {
	heroClass: HeroClass;
	level: number;
}

/**
 * Levels a fresh Hobo to `level` in `heroClass` with the game's own level-up code:
 * every earlier class is maxed and promoted on the way. Choices are made the same way
 * every time so a preset is reproducible: first card or passive offered, and a
 * "+1" power rune on the first card in hand that can take it. Ends at full HP.
 */
export function buildPresetHero(
	base: Hero,
	{ heroClass, level }: HeroPreset,
): Hero {
	let hero: Hero = structuredClone(base);
	const path = CLASS_PATHS[heroClass];

	path.forEach((cls, i) => {
		const def = CLASS_REGISTRY[cls];
		if (i > 0) hero = promote(hero, cls);
		const target = i === path.length - 1 ? level : def.levelUpTriggers.length;
		while (
			hero.currentLevel < target &&
			def.levelUpTriggers[hero.currentLevel]
		) {
			hero = applyLevel(hero, def.levelUpTriggers[hero.currentLevel]);
			hero.currentLevel++;
		}
	});

	hero = fillHand(hero);
	return { ...hero, currentXp: 0, currentHp: hero.maxHp };
}

function promote(hero: Hero, cls: HeroClass): Hero {
	const def = CLASS_REGISTRY[cls];
	let next = applyLevel(hero, def.levelUpTriggers[0] ?? []);
	const utility = def.utilityCardChoices[0];
	if (utility && !next.deck.some((c) => c.baseCardId === utility)) {
		next = { ...next, deck: [...next.deck, createHeroCard(next.id)(utility)] };
	}
	return {
		...next,
		heroClass: cls,
		spriteBase: def.spriteBase,
		currentLevel: 1,
	};
}

/** One level's triggers, plus the reward-screen picks a player would make for it. */
function applyLevel(hero: Hero, triggers: LevelUpDefinition[]): Hero {
	let next = triggers.reduce(applyLevelUpTriggers, {
		hero,
		pendingPromotions: [],
		unlockedQuestsQueue: [],
	}).hero;

	const draft: HeroDraftResult = { cards: [], passives: [], runes: [] };
	for (const t of triggers) {
		if (t.type === "cardChoice") {
			const card = t.options.find(
				(id) =>
					!next.deck.some((c) => c.baseCardId === id) &&
					!!useRegistryStore.getState().getCard(id),
			);
			if (card) draft.cards.push(card);
		}
		if (t.type === "passiveChoice") {
			const passive = t.options.find((id) => !next.passives.includes(id));
			if (passive) draft.passives.push(passive);
		}
	}
	next = applyDraftResult(next, draft);

	for (const t of triggers) {
		if (t.type !== "powerRune") continue;
		const target = next.selectedCards.find((c) => c !== null);
		const rune = generateDynamicRuneChoices(next, 99).sort((a, b) =>
			a.label.localeCompare(b.label),
		)[0];
		if (target && rune) {
			next = applyDraftResult(next, {
				cards: [],
				passives: [],
				runes: [{ rune, cardInstanceId: target.instanceId }],
			});
		}
	}
	return next;
}

/** Puts deck cards into empty hand slots, as a player would before a fight. */
function fillHand(hero: Hero): Hero {
	const hand = [...hero.selectedCards] as Hero["selectedCards"];
	const spare = hero.deck.filter(
		(c) => !hand.some((h) => h?.instanceId === c.instanceId),
	);
	for (let i = 1; i < hand.length; i++) {
		if (!hand[i] && spare.length) hand[i] = spare.shift() ?? null;
	}
	return { ...hero, selectedCards: hand };
}
