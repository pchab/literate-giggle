import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { Encounter } from "@/modules/campaign/domain/encounters.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { useWorldStore } from "@/modules/world/store/world.store";

export function useBattleTurns(encounterId: Encounter["id"]): void {
	const router = useRouter();
	const { roster, stageBattleRewards } = useWorldStore(
		useShallow((state) => ({
			roster: state.roster,
			stageBattleRewards: state.stageBattleRewards,
		})),
	);
	const {
		heroes,
		monsters,
		usedCardsThisTurn,
		activeHeroCard,
		enemyAction,
		initBattle,
	} = useBattleStore(
		useShallow((state) => ({
			heroes: state.heroes,
			monsters: state.monsters,
			usedCardsThisTurn: state.usedCardsThisTurn,
			activeHeroCard: state.activeHeroCard,
			enemyAction: state.enemyAction,
			initBattle: state.initBattle,
		})),
	);
	const [isInit, setIsInit] = useState(false);

	// --- BATTLE INIT ---
	useEffect(() => {
		if (!isInit && roster.length > 0) {
			setIsInit(true);
			initBattle(roster, encounterId);
		}
	}, [isInit, roster, encounterId, initBattle]);

	// --- ENEMY TURN TRIGGER ---
	const aliveHeroesCount = heroes.filter((h) => h.currentHp > 0).length;
	const isEnemyTurn =
		!activeHeroCard &&
		aliveHeroesCount > 0 &&
		Object.keys(usedCardsThisTurn).length === aliveHeroesCount;

	useEffect(() => {
		if (isEnemyTurn) {
			const timeoutId = setTimeout(() => enemyAction(), 200);
			return () => clearTimeout(timeoutId);
		}
	}, [isEnemyTurn, enemyAction]);

	// --- BATTLE END TRIGGER ---
	const isBattleWon = monsters.every((monster) => monster.currentHp <= 0);
	if (isBattleWon && isInit) {
		const remainingHealth = heroes.reduce(
			(acc, hero) => {
				acc[hero.id] = hero.currentHp;
				return acc;
			},
			{} as Record<Hero["id"], number>,
		);

		setTimeout(() => {
			stageBattleRewards(remainingHealth);

			router.push("/");
		}, 1000);
	}
}
