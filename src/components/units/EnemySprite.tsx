"use client";

import { useShallow } from "zustand/shallow";
import type { Monster } from "@/modules/figures/domain/figures.type";
import { useBattleStore } from "@/store/battle.store";
import FloatingDamage from "./FloatingDamage";
import HealthBar from "./HealthBar";
import IntentDisplay from "./IntentDisplay";
import { UnitSprite } from "./UnitSprite";
import { useCombatText } from "./useCombatText.hook";

export default function EnemySprite({ unitInCell }: { unitInCell: Monster }) {
	const { heroes, usedCardsThisTurn, activeCard, enemyIntents } =
		useBattleStore(
			useShallow((state) => ({
				heroes: state.heroes,
				usedCardsThisTurn: state.usedCardsThisTurn,
				activeCard: state.activeCard,
				enemyIntents: state.enemyIntents,
			})),
		);
	const { texts, isHit } = useCombatText(unitInCell.currentHp);

	const isEnemyTurn =
		!activeCard &&
		Object.keys(usedCardsThisTurn).length ===
			heroes.filter(({ currentHp }) => currentHp > 0).length;

	const stance = isEnemyTurn ? 1 : 0;
	const intent = enemyIntents?.[unitInCell.id];
	const currentHp = unitInCell.currentHp;
	const maxHp = unitInCell.maxHp;

	return (
		<div className="absolute inset-0 z-10 flex flex-col items-center justify-end">
			{intent && !isEnemyTurn && <IntentDisplay intent={intent} />}

			<FloatingDamage texts={texts} />

			<div className="relative w-24 h-24 flex items-center justify-center z-10">
				<UnitSprite
					spriteBase={unitInCell.spriteBase}
					stance={stance}
					isHit={isHit}
				/>
			</div>

			<HealthBar currentHp={currentHp} maxHp={maxHp} />
		</div>
	);
}
