import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { cardService } from "@/modules/cards/cards.service";
import type { Card, CardLog } from "@/modules/cards/domain/cards.type";
import { testBoss } from "@/modules/figures/domain/boss";
import type { Hero, Monster } from "@/modules/figures/domain/figures.type";
import { enemyService } from "@/modules/figures/enemy.service";
import { heroService } from "@/modules/figures/heroes.service";
import type { GridPosition } from "@/modules/grid/grid.type";

export type BattleState = {
	heroes: Hero[];
	monsters: Monster[];
	currentMove: [Hero["id"], number] | null;
	currentAttack: [Monster["id"], number] | null;
	usedCardsThisTurn: Record<Hero["id"], Card["id"]>;
	cardUsageLog: CardLog;
};

type BattleAction = {
	initBattle: (heroRoster: Hero[]) => void;
	playCard: (heroId: Hero["id"], cardId: Card["id"]) => void;
	moveHero: (newPosition: GridPosition) => void;
	attackEnemy: (monsterId: Monster["id"], attackValue: number) => void;
	enemyAction: () => void;
};

const initialState: BattleState = {
	heroes: [],
	monsters: [{ ...testBoss, currentHp: 4, gridPosition: { row: 4, col: 4 } }],
	currentMove: null,
	currentAttack: null,
	usedCardsThisTurn: {},
	cardUsageLog: {
		1: {},
		2: {},
		3: {},
	},
};

export type BattleStoreServerAction = (
	state: BattleState,
) => Partial<BattleState>;

export const useBattleStore = create<BattleState & BattleAction>()(
	persist(
		(set) => ({
			...initialState,
			initBattle: (heroRoster: Hero[]) =>
				set(() => ({ ...initialState, heroes: heroRoster })),
			playCard: (heroId, cardId) => set(cardService.playCard(heroId, cardId)),
			moveHero: (newPosition) => set(heroService.moveHero(newPosition)),
			attackEnemy: (monsterId, attackValue) =>
				set(heroService.attackEnemy(monsterId, attackValue)),
			enemyAction: () => set(enemyService.enemyAction()),
		}),
		{
			name: "alpha-battle-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
