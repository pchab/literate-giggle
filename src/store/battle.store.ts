import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { MonsterIntent } from "@/modules/attacks/attacks";
import { cardService } from "@/modules/cards/cards.service";
import type {
	AnchorTarget,
	Card,
	CardLog,
} from "@/modules/cards/domain/cards.type";
import type {
	Hero,
	Monster,
	Summon,
} from "@/modules/figures/domain/figures.type";
import { enemyService } from "@/modules/figures/enemy.service";
import { heroService } from "@/modules/figures/heroes.service";
import type { GridPosition } from "@/modules/grid/grid.type";
import type { Encounter } from "@/modules/map/encounters.data";
import { encountersService } from "@/modules/map/encounters.service";

export type ActiveCardContext = {
	heroId: Hero["id"];
	card: Card;
};

export type BattleState = {
	heroes: Hero[];
	monsters: Monster[];
	activeMoveHeroId: Hero["id"] | null;
	usedMovesThisTurn: Record<Hero["id"], boolean>;
	activeCard: ActiveCardContext | null;
	usedCardsThisTurn: Record<Hero["id"], Card["id"]>;
	cardUsageLog: CardLog;
	enemyIntents: Record<Monster["id"], MonsterIntent>;
	hoveredCard: { heroId: Hero["id"]; cardId: Card["id"] } | null;
	summons: Summon[];
};

type BattleAction = {
	initBattle: (heroRoster: Hero[], encounterId: Encounter["id"]) => void;
	setActiveMoveHeroId: (heroId: Hero["id"] | null) => void;
	moveHero: (newPosition: GridPosition) => void;
	selectCard: (heroId: Hero["id"], cardId: Card["id"]) => void;
	cancelCard: (heroId: Hero["id"], cardId: Card["id"]) => void;
	resolveCard: (anchorTargetId: AnchorTarget | null) => void;
	enemyAction: () => Promise<void>;
	setHoveredCard: (
		hovered: { heroId: Hero["id"]; cardId: Card["id"] } | null,
	) => void;
};

const initialState: BattleState = {
	heroes: [],
	monsters: [],
	enemyIntents: {},
	activeCard: null,
	activeMoveHeroId: null,
	usedMovesThisTurn: {},
	usedCardsThisTurn: {},
	cardUsageLog: {},
	hoveredCard: null,
	summons: [],
};

export type BattleStoreServerAction = (
	state: BattleState & BattleAction,
) => Partial<BattleState>;

export const useBattleStore = create<BattleState & BattleAction>()(
	persist(
		(set, get) => ({
			...initialState,
			initBattle: (heroRoster: Hero[], encounterId: Encounter["id"]) =>
				set(encountersService.initBattle(heroRoster, encounterId)),
			selectCard: (heroId, cardId) =>
				set(cardService.selectCard(heroId, cardId)),
			cancelCard: (heroId, cardId) =>
				set(cardService.cancelCard(heroId, cardId)),
			resolveCard: (anchorTargetId) =>
				set(cardService.resolveCard(anchorTargetId)),
			setActiveMoveHeroId: (heroId) =>
				set(heroService.selectActiveMoveHero(heroId)),
			moveHero: (newPosition) => set(heroService.moveHero(newPosition)),
			enemyAction: async () => {
				await enemyService.resolveEnemyActions(get, set);
			},
			setHoveredCard: (hoveredCard) => set(() => ({ hoveredCard })),
		}),
		{
			name: "alpha-battle-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
