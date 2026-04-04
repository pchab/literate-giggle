import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { Encounter } from "@/modules/campaign/domain/encounters.type";
import type { Hero } from "@/modules/units/domain/units.type";
import { isHero } from "@/modules/units/helpers/units.helpers";
import { useWorldStore } from "@/modules/world/store/world.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export function useBattleTurns(encounterId: Encounter["id"]): {
	isPlayerTurn: boolean;
} {
	const router = useRouter();
	const { roster, stageBattleRewards } = useWorldStore(
		useShallow((state) => ({
			roster: state.roster,
			stageBattleRewards: state.stageBattleRewards,
		})),
	);

	const {
		units,
		usedCardsThisTurn,
		activeHeroCard,
		enemyAction,
		initBattle,
		battleStatus,
	} = useBattleStore(
		useShallow((state) => ({
			units: state.units,
			usedCardsThisTurn: state.usedCardsThisTurn,
			activeHeroCard: state.activeHeroCard,
			enemyAction: state.enemyAction,
			initBattle: state.initBattle,
			battleStatus: state.battleStatus,
		})),
	);

	const [isInit, setIsInit] = useState(false);
	const heroes = units.filter(isHero);

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
		battleStatus === "ONGOING" &&
		!activeHeroCard &&
		aliveHeroesCount > 0 &&
		Object.keys(usedCardsThisTurn).length === aliveHeroesCount;

	useEffect(() => {
		if (isEnemyTurn) {
			const timeoutId = setTimeout(() => enemyAction(), 200);
			return () => clearTimeout(timeoutId);
		}
	}, [isEnemyTurn, enemyAction]);

	// --- BATTLE END ROUTING ---
	useEffect(() => {
		if (battleStatus === "VICTORY") {
			const remainingHealth = heroes.reduce(
				(acc, hero) => {
					acc[hero.id] = hero.currentHp;
					return acc;
				},
				{} as Record<Hero["id"], number>,
			);

			const timeoutId = setTimeout(() => {
				stageBattleRewards(remainingHealth);
				router.push("/reward");
			}, 1000);

			return () => clearTimeout(timeoutId);
		}

		if (battleStatus === "DEFEAT") {
			// Route to a game over screen or village destruction scene
			const timeoutId = setTimeout(() => {
				router.push("/game-over");
			}, 1000);
			return () => clearTimeout(timeoutId);
		}
	}, [battleStatus, heroes, router, stageBattleRewards]);

	return { isPlayerTurn: !isEnemyTurn };
}
