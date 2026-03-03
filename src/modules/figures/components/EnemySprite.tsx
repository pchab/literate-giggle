"use client";

import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { Monster } from "@/modules/figures/domain/figures.type";
import FloatingDamage from "../../battle/components/FloatingDamage";
import HealthBar from "../../battle/components/HealthBar";
import IntentDisplay from "../../battle/components/IntentDisplay";
import { useCombatText } from "../../battle/hooks/useCombatText.hook";
import { UnitSprite } from "./UnitSprite";

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

			<UnitSprite
				id={unitInCell.id}
				spriteBase={unitInCell.spriteBase}
				stance={stance}
				isHit={isHit}
			/>

			<HealthBar currentHp={currentHp} maxHp={maxHp} />
		</div>
	);
}
