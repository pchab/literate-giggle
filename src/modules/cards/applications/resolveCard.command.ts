import { intentService } from "@/modules/attacks/intents.service";
import { summonLibrary } from "@/modules/figures/domain/summons/summons.data";
import type { BattleStoreServerAction } from "@/store/battle.store";
import type { Hero, Monster, Summon } from "../../figures/domain/figures.type";
import { applyEffectToHero, applyEffectToMonster } from "../cards.helper";
import {
	type AnchorTarget,
	anchorIsGridPosition,
	anchorIsHeroId,
	anchorIsMonsterId,
} from "../domain/cards.type";

export function resolveCard(
	anchorTargetId: AnchorTarget | null,
): BattleStoreServerAction {
	return ({
		activeCard,
		heroes,
		monsters,
		usedCardsThisTurn,
		cardUsageLog,
		summons,
		...state
	}) => {
		if (!activeCard) {
			console.warn(`No active card found.`);
			return {};
		}
		const { heroId, card } = activeCard;
		const heroIndex = heroes.findIndex((h) => h.id === heroId);
		if (heroIndex === -1) {
			console.warn(`Hero with ID ${heroId} not found.`);
			return {};
		}

		// Clone the state so we can safely mutate it during the sequence
		let nextHeroes = [...heroes];
		let nextMonsters = [...monsters];
		const nextSummons = [...summons];

		// Process every effect in the card's payload
		card.effects.forEach((effect) => {
			// --- NEW: INTERCEPT MOVEMENT ---
			if (effect.type === "move") {
				if (anchorTargetId && anchorIsGridPosition(anchorTargetId)) {
					const destination = anchorTargetId;

					if (effect.target === "self") {
						nextHeroes = nextHeroes.map((hero) =>
							hero.id === heroId
								? { ...hero, gridPosition: destination }
								: hero,
						);
					}
					// (Future proofing: if effect.target === 'anchor', you could use this to 'Pull' or 'Teleport' an ally/enemy!)
				}
				return; // Stop processing this specific effect and move to the next one
			}
			// -------------------------------
			if (effect.type === "summon") {
				if (anchorTargetId && anchorIsGridPosition(anchorTargetId)) {
					const { blueprintId } = effect;
					const newSummonBlueprint = summonLibrary[blueprintId];
					const newSummon: Summon = {
						id: `summon-${Date.now()}` as Summon["id"],
						...newSummonBlueprint,
						currentHp: newSummonBlueprint.maxHp,
						gridPosition: anchorTargetId,
						allegiance: "PLAYER", // Assuming a hero cast it
					};

					nextSummons.push(newSummon);
				}
			}

			// 1. Determine WHO receives this specific effect
			const targetedHeroIds: Hero["id"][] = [];
			let targetedMonsterIds: Monster["id"][] = [];

			if (effect.target === "self") {
				targetedHeroIds.push(heroId);
			} else if (
				effect.target === "anchor" &&
				anchorTargetId &&
				typeof anchorTargetId === "string"
			) {
				// Added `typeof anchorTargetId === "string"` check here so TS knows it's an ID
				if (anchorIsHeroId(anchorTargetId))
					targetedHeroIds.push(anchorTargetId);
				if (anchorIsMonsterId(anchorTargetId))
					targetedMonsterIds.push(anchorTargetId);
			} else if (effect.target === "all_enemies") {
				targetedMonsterIds = nextMonsters.map((m) => m.id);
			}
			// (You can add "adjacent_to_anchor" logic here later using grid math!)
			// 2. Apply the effect to the targeted Heroes
			nextHeroes = nextHeroes.map((hero) => {
				if (!targetedHeroIds.includes(hero.id)) return hero;
				return applyEffectToHero(hero, effect);
			});

			// 3. Apply the effect to the targeted Monsters
			nextMonsters = nextMonsters.map((monster) => {
				if (!targetedMonsterIds.includes(monster.id)) return monster;
				return applyEffectToMonster(monster, effect);
			});
		});

		const newIntents = intentService.calculateAllIntents(
			nextHeroes,
			nextMonsters,
		);
		return {
			...state,
			activeCard: null,
			heroes: nextHeroes,
			monsters: nextMonsters,
			summons: nextSummons,
			enemyIntents: newIntents, // Replaced `intents` with `enemyIntents` to match your store
			usedCardsThisTurn: {
				...usedCardsThisTurn,
				[activeCard.heroId]: activeCard.card.id, // Or activeCard.cardId depending on your state
			},
			cardUsageLog: {
				...cardUsageLog,
				[heroId]: {
					...(cardUsageLog[heroId] || {}),
					[card.id]: (cardUsageLog[heroId]?.[card.id] || 0) + 1,
				},
			},
		};
	};
}
