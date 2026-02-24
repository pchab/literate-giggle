import { intentService } from "@/modules/attacks/intents.service";
import { getManhattanDistance } from "@/modules/grid/grid.helpers";
import type { BattleStoreServerAction } from "@/store/battle.store";
import {
	filterGridByAttackPattern,
	findTargetedHero,
} from "../../attacks/attacks";
import { calculateAIMove } from "../ai.helpers";

export function enemyAction(): BattleStoreServerAction {
	return ({ monsters, heroes, enemyIntents }) => {
		const nextMonsters = monsters
			.filter((m) => m.currentHp > 0)
			.map((m) => {
				const plannedAttack = enemyIntents[m.id].attackData;
				const newGridPosition = calculateAIMove(
					m,
					plannedAttack,
					heroes,
					monsters,
				);
				return {
					...m,
					gridPosition: newGridPosition,
				};
			});

		const nextHeroes = nextMonsters.reduce((acc, m) => {
			const plannedAttack = enemyIntents[m.id].attackData;
			const targetHero =
				heroes.find((h) => h.id === enemyIntents[m.id].targetHeroId) ||
				findTargetedHero(plannedAttack, heroes);

			const distance = getManhattanDistance(
				m.gridPosition,
				targetHero.gridPosition,
			);
			if (
				distance < plannedAttack.minRange ||
				distance > plannedAttack.maxRange
			) {
				return acc;
			}

			const targetedCells = filterGridByAttackPattern(plannedAttack, heroes);
			return acc.map((hero) => {
				const isTargeted = targetedCells.some(
					({ col, row }) =>
						col === hero.gridPosition.col && row === hero.gridPosition.row,
				);
				if (!isTargeted) {
					return hero;
				}
				const effectiveDmg =
					plannedAttack.effect === "physDmg"
						? Math.max(0, plannedAttack.damage - hero.physDef)
						: Math.max(0, plannedAttack.damage - hero.magDef);

				// Calculate how much HP is lost, and how much Block remains
				const hpDamage =
					plannedAttack.effect === "physDmg"
						? Math.max(0, effectiveDmg - hero.currentPhysBlock)
						: Math.max(0, effectiveDmg - hero.currentMagBlock);

				const newPhysBlock =
					plannedAttack.effect === "physDmg"
						? Math.max(0, hero.currentPhysBlock - effectiveDmg)
						: hero.currentPhysBlock; // Unchanged if magic attack

				const newMagBlock =
					plannedAttack.effect === "magDmg"
						? Math.max(0, hero.currentMagBlock - effectiveDmg)
						: hero.currentMagBlock; // Unchanged if phys attack

				return {
					...hero,
					currentHp: Math.max(0, hero.currentHp - hpDamage),
					currentPhysBlock: newPhysBlock,
					currentMagBlock: newMagBlock,
				};
			});
		}, heroes);
		const nextEnemyIntents = intentService.calculateAllIntents(
			nextHeroes,
			nextMonsters,
		);
		return {
			monsters: nextMonsters,
			heroes: nextHeroes,
			usedCardsThisTurn: {},
			enemyIntents: nextEnemyIntents,
		};
	};
}
