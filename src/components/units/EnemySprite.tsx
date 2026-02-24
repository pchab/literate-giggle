"use client";

import { useShallow } from "zustand/shallow";
import type { Monster } from "@/modules/figures/domain/figures.type";
import { useBattleStore } from "@/store/battle.store";
import { UnitSprite } from "./UnitSprite";

export default function EnemySprite({ unitInCell }: { unitInCell: Monster }) {
	const {
		heroes,
		usedCardsThisTurn,
		currentMove,
		currentAttack,
		enemyIntents,
	} = useBattleStore(
		useShallow((state) => ({
			heroes: state.heroes,
			usedCardsThisTurn: state.usedCardsThisTurn,
			currentMove: state.currentMove,
			currentAttack: state.currentAttack,
			enemyIntents: state.enemyIntents, // 1. Pull the intents!
		})),
	);

	const isEnemyTurn =
		!currentMove &&
		!currentAttack &&
		Object.keys(usedCardsThisTurn).length ===
			heroes.filter(({ currentHp }) => currentHp > 0).length;

	const stance = isEnemyTurn ? 1 : 0;

	const intent = enemyIntents?.[unitInCell.id];

	return (
		<div className="absolute inset-0 z-10 flex flex-col items-center justify-end">
			{intent && !isEnemyTurn && (
				<div className="absolute -bottom-4 bg-zinc-950/90 border border-zinc-700 rounded px-2 py-1 flex items-center gap-1.5 shadow-lg pointer-events-none z-20 transition-all">
					<span className="text-xs drop-shadow-md">
						{intent.attackData.effect === "physDmg" ? "⚔️" : "🔮"}
					</span>

					<span className="text-xs font-bold text-red-400">
						{intent.attackData.damage}
					</span>
					{(intent.attackData.minRange > 1 ||
						intent.attackData.maxRange > 1) && (
						<span className="text-[10px] text-zinc-400 ml-1 border-l border-zinc-700 pl-1">
							🏹 {intent.attackData.minRange}-{intent.attackData.maxRange}
						</span>
					)}
					{intent.attackData.move > 0 && (
						<span className="text-[10px] text-zinc-400 ml-1 border-l border-zinc-700 pl-1">
							👟 {intent.attackData.move}
						</span>
					)}
				</div>
			)}

			<UnitSprite type={unitInCell.enemyType} stance={stance} />
		</div>
	);
}
