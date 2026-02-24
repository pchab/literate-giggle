import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { MonsterIntent } from "@/modules/attacks/attacks";
import { intentService } from "@/modules/attacks/intents.service";
import { cardService } from "@/modules/cards/cards.service";
import type {
	AnchorTarget,
	Card,
	CardLog,
} from "@/modules/cards/domain/cards.type";
import { archer } from "@/modules/figures/domain/archer";
import type { Hero, Monster } from "@/modules/figures/domain/figures.type";
import { skeleton } from "@/modules/figures/domain/skeleton";
import { enemyService } from "@/modules/figures/enemy.service";
import { createMonsterId } from "@/modules/figures/figures.helpers";
import { heroService } from "@/modules/figures/heroes.service";
import type { GridPosition } from "@/modules/grid/grid.type";

export type ActiveCardContext = {
	heroId: Hero["id"];
	card: Card;
};

export type BattleState = {
	heroes: Hero[];
	monsters: Monster[];
	usedCardsThisTurn: Record<Hero["id"], Card["id"]>;
	cardUsageLog: CardLog;
	enemyIntents: Record<Monster["id"], MonsterIntent>;
	hoveredCard: { heroId: Hero["id"]; cardId: Card["id"] } | null;
	activeCard: ActiveCardContext | null;
};

type BattleAction = {
	initBattle: (heroRoster: Hero[]) => void;
	selectCard: (heroId: Hero["id"], cardId: Card["id"]) => void;
	cancelCard: (heroId: Hero["id"], cardId: Card["id"]) => void;
	resolveCard: (anchorTargetId: AnchorTarget | null) => void;
	moveHero: (newPosition: GridPosition) => void;
	attackEnemy: (
		monsterId: Monster["id"],
		attackData: { damage: number; range: number },
	) => void;
	enemyAction: () => void;
	setHoveredCard: (
		hovered: { heroId: Hero["id"]; cardId: Card["id"] } | null,
	) => void;
};

const initialState: BattleState = {
	heroes: [],
	monsters: [
		{
			id: createMonsterId(1),
			...skeleton,
			currentHp: skeleton.maxHp,
			gridPosition: { row: 4, col: 4 },
		},
		{
			id: createMonsterId(2),
			...archer,
			currentHp: archer.maxHp,
			gridPosition: { row: 4, col: 3 },
		},
	],
	enemyIntents: {},
	activeCard: null,
	usedCardsThisTurn: {},
	cardUsageLog: {},
	hoveredCard: null,
};

export type BattleStoreServerAction = (
	state: BattleState,
) => Partial<BattleState>;

export const useBattleStore = create<BattleState & BattleAction>()(
	persist(
		(set) => ({
			...initialState,
			initBattle: (heroRoster: Hero[]) =>
				set(() => ({
					...initialState,
					heroes: heroRoster,
					enemyIntents: intentService.calculateAllIntents(
						heroRoster,
						initialState.monsters,
					),
				})),
			selectCard: (heroId, cardId) =>
				set(cardService.selectCard(heroId, cardId)),
			cancelCard: (heroId, cardId) =>
				set(cardService.cancelCard(heroId, cardId)),
			resolveCard: (anchorTargetId) =>
				set(cardService.resolveCard(anchorTargetId)),
			moveHero: (newPosition) => set(heroService.moveHero(newPosition)),
			attackEnemy: (monsterId, attackData) =>
				set(heroService.attackEnemy(monsterId, attackData)),
			enemyAction: () => set(enemyService.enemyAction()),
			setHoveredCard: (hoveredCard) => set(() => ({ hoveredCard })),
		}),
		{
			name: "alpha-battle-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
