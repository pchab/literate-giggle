import type { BattleStoreServerAction } from "@/store/battle.store";
import type { Monster } from "../figures.type";

export function attackEnemy(
	monsterId: Monster["id"],
	attackValue: number,
): BattleStoreServerAction {
	return ({ monsters, currentAttack }) => {
		if (!currentAttack) {
			console.warn(
				"No card is currently being played. Please play a card before attacking an enemy.",
			);
			return {};
		}
		const monster = monsters.find((m) => m.id === monsterId);
		if (!monster) {
			console.warn(`Monster with ID ${monsterId} not found.`);
			return {};
		}
		return {
			monsters: monsters.map((m) =>
				m.id === monsterId
					? { ...m, currentHp: Math.max(0, m.currentHp - attackValue) }
					: m,
			),
			currentAttack: null,
		};
	};
}
