import type { BattleStoreServerAction } from "@/store/battle.store";
import { filterGridByAttackPattern } from "../attacks";

export function enemyAction(): BattleStoreServerAction {
	return ({ monsters, heroes }) => {
		const nextHeroes = monsters.reduce((acc, { intent }) => {
			const targetedCells = filterGridByAttackPattern(intent, heroes);
			return acc.map((hero) => {
				const isTargeted = targetedCells.some(
					({ col, row }) =>
						col === hero.gridPosition.col && row === hero.gridPosition.row,
				);
				if (!isTargeted) {
					return hero;
				}
				const damage =
					intent.effect === "physDmg"
						? Math.max(0, intent.damage - hero.physDef - hero.currentPhysBlock)
						: Math.max(0, intent.damage - hero.magDef - hero.currentMagBlock);
				return {
					...hero,
					currentHp: Math.max(0, hero.currentHp - damage),
					currentPhysBlock: 0,
					currentMagBlock: 0,
				};
			});
		}, heroes);
		const nextMonsters = monsters.map((m) => {
			const nextIntent =
				m.attacks[Math.floor(Math.random() * m.attacks.length)];
			return { ...m, intent: nextIntent };
		});
		return {
			monsters: nextMonsters,
			heroes: nextHeroes,
			usedCardsThisTurn: {}, // Reset used cards after enemy action
		};
	};
}
