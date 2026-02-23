"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import type { Monster } from "@/modules/figures/domain/figures.type";
import { useBattleStore } from "@/store/battle.store";
import { UnitSprite } from "./UnitSprite";

export default function EnemySprite({ unitInCell }: { unitInCell: Monster }) {
	const { heroes, usedCardsThisTurn, currentMove, currentAttack, enemyAction } =
		useBattleStore(
			useShallow((state) => ({
				heroes: state.heroes,
				usedCardsThisTurn: state.usedCardsThisTurn,
				currentMove: state.currentMove,
				currentAttack: state.currentAttack,
				enemyAction: state.enemyAction,
			})),
		);

	const isEnemyTurn =
		!currentMove &&
		!currentAttack &&
		Object.keys(usedCardsThisTurn).length ===
			heroes.filter(({ currentHp }) => currentHp > 0).length;
	const stance = isEnemyTurn ? 1 : 0;

	useEffect(() => {
		if (isEnemyTurn) {
			setTimeout(() => {
				enemyAction();
			}, 1000);
		}
	}, [isEnemyTurn, enemyAction]);

	return (
		<div className="absolute inset-0 z-10">
			<UnitSprite type={unitInCell.enemyType} stance={stance} />
		</div>
	);
}
