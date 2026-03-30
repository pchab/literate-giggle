import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
	GridPosition,
	SurfaceData,
} from "@/modules/battle/domain/grid.type";
import type { Intent } from "@/modules/battle/domain/intent.type";
import type { Vfx } from "@/modules/battle/domain/vfx.type";
import type { Encounter } from "@/modules/campaign/domain/encounters.type";
import type { AnchorTarget, Card } from "@/modules/cards/domain/cards.type";
import type {
	BattleHero,
	BattleUnit,
	Hero,
} from "@/modules/figures/domain/figures.type";
import { cancelCard } from "./commands/cancelCard.command";
import { endTurn } from "./commands/endTurn.command";
import { initBattle } from "./commands/initBattle.command";
import { moveHero } from "./commands/moveHero.command";
import { resolveAIActions } from "./commands/resolveAIAction.command";
import { resolveCard } from "./commands/resolveCard.command";
import { selectActiveMoveHero } from "./commands/selectActiveMoveHero.command";
import { selectCard } from "./commands/selectCard.command";
import { setHoveredCell } from "./commands/setHoveredCell.command";

export type ActiveCardContext = {
	unitId: BattleHero["id"];
	card: Card;
};

export type BattleState = {
	encounterId: Encounter["id"] | null;

	units: BattleUnit[];
	surfaces: Record<string, SurfaceData>;

	activeMoveHeroId: BattleHero["id"] | null;
	usedMovesThisTurn: Record<BattleHero["id"], number>;
	activeHeroCard: ActiveCardContext | null;
	hoveredHeroCard: ActiveCardContext | null;
	usedCardsThisTurn: Record<BattleHero["id"], Card["id"]>;
	hoveredCell: GridPosition | null; // getGridId(GridPosition)

	currentVfx: Record<string, Vfx>; // key is cell id

	aiIntents: Record<BattleUnit["id"], Intent>;
	playerIntent: Intent | null;

	xpEarned: number;
};

type BattleAction = {
	initBattle: (
		heroRoster: Hero[],
		encounterId: Encounter["id"],
	) => Promise<void>;
	setActiveMoveHeroId: (heroId: Hero["id"] | null) => void;
	moveHero: (newPosition: GridPosition) => void;
	selectCard: (heroId: Hero["id"], card: Card) => void;
	cancelCard: () => void;
	endTurn: (heroId: Hero["id"]) => void;
	resolveCard: (
		anchorTarget: AnchorTarget,
		cardContext: ActiveCardContext,
	) => void;
	enemyAction: () => Promise<void>;
	setHoveredCell: (cell: GridPosition | null) => Promise<void>;
	setHoveredCard: (cardContext: ActiveCardContext | null) => void;
	setVfx: (cellId: string, vfx: Vfx | null) => void;
	resetXpEarned: () => void;
};

const initialState: BattleState = {
	encounterId: null,
	units: [],
	aiIntents: {},
	activeHeroCard: null,
	activeMoveHeroId: null,
	hoveredHeroCard: null,
	hoveredCell: null,
	usedMovesThisTurn: {},
	usedCardsThisTurn: {},
	currentVfx: {},
	xpEarned: 0,
	surfaces: {},
	playerIntent: null,
};

export type BattleStoreServerAction = (
	state: BattleState & BattleAction,
) => Partial<BattleState>;

export type StoreGet = () => BattleState;
export type StoreSet = (
	fn: (state: BattleState) => Partial<BattleState>,
) => void;

export const useBattleStore = create<BattleState & BattleAction>()(
	persist(
		(set, get) => ({
			...initialState,
			initBattle: (heroRoster: Hero[], encounterId: Encounter["id"]) =>
				initBattle(get, set)(heroRoster, encounterId),
			selectCard: async (heroId, card) =>
				await selectCard(get, set)(heroId, card),
			cancelCard: () => set(cancelCard()),
			resolveCard: (anchorTarget, cardContext) =>
				resolveCard(get, set)(anchorTarget, cardContext),
			endTurn: (heroId) => set(endTurn(heroId)),
			setActiveMoveHeroId: (heroId) => set(selectActiveMoveHero(heroId)),
			moveHero: async (newPosition) => await moveHero(newPosition)(get, set),
			enemyAction: async () => await resolveAIActions(get, set),
			setHoveredCell: (hoveredCell) => setHoveredCell(get, set)(hoveredCell),
			setHoveredCard: (hoveredHeroCard) => set(() => ({ hoveredHeroCard })),
			setVfx: (cellId, vfx) =>
				set(({ currentVfx: { [cellId]: cellVfx, ...otherVfx } }) => ({
					currentVfx: vfx ? { ...otherVfx, [cellId]: vfx } : otherVfx,
				})),
			resetXpEarned: () => set({ xpEarned: 0, encounterId: null }),
		}),
		{
			name: "alpha-battle-state",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({
				encounterId: state.encounterId,
				units: state.units,
				aiIntents: state.aiIntents,
				usedMovesThisTurn: state.usedMovesThisTurn,
				usedCardsThisTurn: state.usedCardsThisTurn,
				xpEarned: state.xpEarned,
				surfaces: state.surfaces,
			}),
		},
	),
);
