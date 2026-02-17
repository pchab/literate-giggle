"use client";

import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/store/battle.store";
import { UnitSprite } from "@/components/UnitSprite";
import { useEffect } from "react";

export default function EnemyArea() {
	const { heroes, monsters, usedCards, currentMove, enemyAction } =
		useBattleStore(
			useShallow((state) => ({
				heroes: state.heroes,
				monsters: state.monsters,
				usedCards: state.usedCards,
				currentMove: state.currentMove,
				enemyAction: state.enemyAction,
			})),
		);

	const isEnemyTurn =
		!currentMove &&
		Object.keys(usedCards).length === heroes.filter(({ hp }) => hp > 0).length;

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
						<UnitSprite
							key={m.id}
							type={m.enemyType}
							stance={isEnemyTurn ? 1 : 0}
						/>
					))}
				</div>
				<div className="h-1/4 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-600">
					{monsters.map(({ intent }) => (
						<div key={intent.id} className="text-center">
							<p className="font-bold">{intent.target}</p>
							<p className="font-bold">{JSON.stringify(intent.pattern)}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
