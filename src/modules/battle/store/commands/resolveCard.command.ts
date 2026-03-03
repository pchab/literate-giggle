import { cardLibrary } from "@/modules/cards/data/cards.data";
import {
	type AnchorTarget,
	anchorIsGridPosition,
	anchorIsHeroId,
	anchorIsMonsterId,
	type EffectTarget,
} from "@/modules/cards/domain/cards.type";
import { summonLibrary } from "@/modules/figures/data/summons/summons.data";
import type { Hero, Monster } from "@/modules/figures/domain/figures.type";
import { summonId } from "@/modules/figures/helpers/figures.helpers";
import type { VfxType } from "../../domain/vfx.type";
import {
	applyEffectToHero,
	applyEffectToMonster,
} from "../../helpers/effect.helpers";
import { getVfxForEffect } from "../../helpers/vfx.helper";
import type { BattleStoreServerAction } from "../battle.store";
import { calculateAllIntents } from "./calculateAllIntents.command";

function resolveTargets(
	targetType: EffectTarget,
	anchorTargetId: AnchorTarget | null,
	casterId: Hero["id"],
	currentMonsters: Monster[],
) {
	const heroIds: string[] = [];
	const monsterIds: string[] = [];

	if (targetType === "self") {
		heroIds.push(casterId);
	} else if (
		targetType === "anchor" &&
		anchorTargetId &&
		typeof anchorTargetId === "string"
	) {
		if (anchorIsHeroId(anchorTargetId)) heroIds.push(anchorTargetId);
		if (anchorIsMonsterId(anchorTargetId)) monsterIds.push(anchorTargetId);
	} else if (targetType === "all_enemies") {
		monsterIds.push(...currentMonsters.map((m) => m.id));
	}

	// Future: "adjacent_to_anchor" AoE logic will go exactly here!

	return { heroIds, monsterIds };
}

// --- 2. MAIN COMMAND ---
export function resolveCard(
	anchorTargetId: AnchorTarget | null,
): BattleStoreServerAction {
	return ({
		activeCard,
		heroes,
		monsters,
		usedCardsThisTurn,
		usedMovesThisTurn,
		summons,
		xpEarned,
		...state
	}) => {
		if (!activeCard) return {};

		const { heroId, cardId } = activeCard;
		const card = cardLibrary[cardId];
		if (!heroes.some((h) => h.id === heroId)) return {};

		// Mutable drafts for our sequence pipeline
		let draftHeroes = [...heroes];
		let draftMonsters = [...monsters];
		const draftSummons = [...summons];
		const vfx: Record<string, VfxType> = {};

		// --- 3. THE PIPELINE ---
		card.effects.forEach((effect) => {
			// A. Handle Grid Displacements
			if (effect.type === "move") {
				if (anchorTargetId && anchorIsGridPosition(anchorTargetId)) {
					if (effect.target === "self") {
						draftHeroes = draftHeroes.map((hero) =>
							hero.id === heroId
								? { ...hero, gridPosition: anchorTargetId }
								: hero,
						);
					}
				}
				return;
			}

			// B. Handle Entities Spawning
			if (effect.type === "summon") {
				if (anchorTargetId && anchorIsGridPosition(anchorTargetId)) {
					const blueprint = summonLibrary[effect.blueprintId];
					draftSummons.push({
						id: summonId(Date.now()),
						...blueprint,
						currentHp: blueprint.maxHp,
						gridPosition: anchorTargetId,
						allegiance: "PLAYER",
					});
				}
				return;
			}

			// C. Handle Standard Effects (Damage, Heal, Block, Push)
			// 1. Ask the helper who to hit
			const targets = resolveTargets(
				effect.target,
				anchorTargetId,
				heroId,
				draftMonsters,
			);

			// 2. Apply the hits
			draftHeroes = draftHeroes.map((hero) =>
				targets.heroIds.includes(hero.id)
					? applyEffectToHero(hero, effect)
					: hero,
			);

			draftMonsters = draftMonsters.map((monster) =>
				targets.monsterIds.includes(monster.id)
					? applyEffectToMonster(monster, effect)
					: monster,
			);

			const newVfx = getVfxForEffect(effect, {
				monsterPositions: targets.monsterIds
					.map(
						(monsterId) =>
							draftMonsters.find((m) => m.id === monsterId)?.gridPosition,
					)
					.filter((pos) => pos !== undefined),
				heroPositions: targets.heroIds
					.map(
						(heroId) => draftHeroes.find((h) => h.id === heroId)?.gridPosition,
					)
					.filter((pos) => pos !== undefined),
			});
			Object.assign(vfx, newVfx);
		});

		const deadMonsters = draftMonsters.filter((m) => m.currentHp <= 0);
		const xpEarnedThisTurn = deadMonsters.reduce(
			(acc, m) => acc + m.xpReward,
			0,
		);
		const remainingMonsters = draftMonsters.filter((m) => m.currentHp > 0);

		// --- 4. FINALIZE & UPDATE STORE ---
		return {
			...state,
			activeCard: null,
			heroes: draftHeroes,
			monsters: remainingMonsters,
			summons: draftSummons,
			enemyIntents: calculateAllIntents(draftHeroes, remainingMonsters),
			usedCardsThisTurn: {
				...usedCardsThisTurn,
				[heroId]: cardId,
			},
			usedMovesThisTurn: {
				...usedMovesThisTurn,
				[heroId]: true,
			},
			currentVfx: vfx,
			xpEarned: xpEarned + xpEarnedThisTurn,
		};
	};
}
