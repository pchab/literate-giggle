"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { UnitSprite } from "@/components/UnitSprite";
import { useBattleStore } from "@/store/battle.store";

export default function EnemyArea() {
	const {
		heroes,
		monsters,
		usedCardsThisTurn,
		currentMove,
		currentAttack,
		attackEnemy,
		enemyAction,
	} = useBattleStore(
		useShallow((state) => ({
			heroes: state.heroes,
			monsters: state.monsters,
			usedCardsThisTurn: state.usedCardsThisTurn,
			currentMove: state.currentMove,
			currentAttack: state.currentAttack,
			attackEnemy: state.attackEnemy,
			enemyAction: state.enemyAction,
		})),
	);

	const isEnemyTurn =
		!currentMove &&
		!currentAttack &&
		Object.keys(usedCardsThisTurn).length ===
			heroes.filter(({ currentHp }) => currentHp > 0).length;

	useEffect(() => {
		if (isEnemyTurn) {
			setTimeout(() => {
				enemyAction();
			}, 1000);
		}
	}, [isEnemyTurn, enemyAction]);

	return (
		<section className="h-full w-full flex flex-col gap-4">
			<h2 className="text-xl font-bold uppercase tracking-wider text-red-900/50 text-right">
				Enemy
			</h2>
			<div className="flex-1 flex flex-col gap-4">
				<div className="h-1/2 rounded-lg border border-dashed border-red-900/20 bg-red-950/10 flex items-center justify-center text-red-900/50">
					{monsters.map((m) => (
						<button
							type="button"
							key={m.id}
							className="relative w-full h-full flex items-center justify-center -translate-y-4"
							onClick={() => attackEnemy(m.id, 1)}
						>
							<UnitSprite type={m.enemyType} stance={isEnemyTurn ? 1 : 0} />
						</button>
					))}
				</div>
				<div className="h-1/4 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-600">
					{monsters.map(({ currentHp, maxHp, intent }) => (
						<div key={intent.id} className="text-center">
							<p className="font-bold">{intent.target}</p>
							<p className="font-bold">
								HP: {currentHp}/{maxHp}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
