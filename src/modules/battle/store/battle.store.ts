import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { GridPosition } from "@/modules/battle/domain/grid.type";
import type { MonsterIntent } from "@/modules/battle/domain/intent.type";
import type { VfxType } from "@/modules/battle/domain/vfx.type";
import type { Encounter } from "@/modules/campaign/data/encounters.data";
import type { AnchorTarget, Card } from "@/modules/cards/domain/cards.type";
import type {
	Hero,
	Monster,
	Summon,
} from "@/modules/figures/domain/figures.type";
import { cancelCard } from "./commands/cancelCard.command";
import { initBattle } from "./commands/initBattle.command";
import { moveHero } from "./commands/moveHero.command";
import { resolveCard } from "./commands/resolveCard.command";
import { resolveEnemyActions } from "./commands/resolveEnemyAction.command";
import { selectActiveMoveHero } from "./commands/selectActiveMoveHero.command";
import { selectCard } from "./commands/selectCard.command";

export type ActiveCardContext = {
	heroId: Hero["id"];
	cardId: Card["id"];
};

export type BattleState = {
	encounterId: Encounter["id"] | null;
	heroes: Hero[];
	monsters: Monster[];
	activeMoveHeroId: Hero["id"] | null;
	usedMovesThisTurn: Record<Hero["id"], boolean>;
	activeCard: ActiveCardContext | null;
	usedCardsThisTurn: Record<Hero["id"], Card["id"]>;
	enemyIntents: Record<Monster["id"], MonsterIntent>;
	hoveredCard: { heroId: Hero["id"]; cardId: Card["id"] } | null;
	summons: Summon[];
	currentVfx: Record<string, VfxType>; // key is cell id
	xpEarned: number;
	background: string;
};

type BattleAction = {
	initBattle: (
		heroRoster: Hero[],
		encounterId: Encounter["id"],
		background: string,
	) => void;
	setActiveMoveHeroId: (heroId: Hero["id"] | null) => void;
	moveHero: (newPosition: GridPosition) => void;
	selectCard: (heroId: Hero["id"], cardId: Card["id"]) => void;
	cancelCard: (heroId: Hero["id"], cardId: Card["id"]) => void;
	resolveCard: (anchorTargetId: AnchorTarget | null) => void;
	enemyAction: () => Promise<void>;
	setHoveredCard: (
		hovered: { heroId: Hero["id"]; cardId: Card["id"] } | null,
	) => void;
	setVfx: (cellId: string, vfx: VfxType | null) => void;
	resetXpEarned: () => void;
};

const initialState: BattleState = {
	encounterId: null,
	heroes: [],
	monsters: [],
	enemyIntents: {},
	activeCard: null,
	activeMoveHeroId: null,
	usedMovesThisTurn: {},
	usedCardsThisTurn: {},
	hoveredCard: null,
	summons: [],
	currentVfx: {},
	xpEarned: 0,
	background: "",
};

export type BattleStoreServerAction = (
	state: BattleState & BattleAction,
) => Partial<BattleState>;

export const useBattleStore = create<BattleState & BattleAction>()(
	persist(
		(set, get) => ({
			...initialState,
			initBattle: (
				heroRoster: Hero[],
				encounterId: Encounter["id"],
				background: string,
			) => set(initBattle(heroRoster, encounterId, background)),
			selectCard: (heroId, cardId) => set(selectCard(heroId, cardId)),
			cancelCard: (heroId, cardId) => set(cancelCard(heroId, cardId)),
			resolveCard: (anchorTargetId) => set(resolveCard(anchorTargetId)),
			setActiveMoveHeroId: (heroId) => set(selectActiveMoveHero(heroId)),
			moveHero: (newPosition) => set(moveHero(newPosition)),
			enemyAction: async () => {
				await resolveEnemyActions(get, set);
			},
			setHoveredCard: (hoveredCard) => set(() => ({ hoveredCard })),
			setVfx: (cellId, vfx) =>
				set(({ currentVfx: { [cellId]: cellVfx, ...otherVfx } }) => ({
					currentVfx: vfx ? { ...otherVfx, [cellId]: vfx } : otherVfx,
				})),
			resetXpEarned: () => set({ xpEarned: 0, encounterId: null }),
		}),
		{
			name: "alpha-battle-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
