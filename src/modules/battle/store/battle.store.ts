import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
	GridPosition,
	SurfaceData,
} from "@/modules/battle/domain/grid.type";
import type {
	Intent,
	ShadowStateDiff,
} from "@/modules/battle/domain/intent.type";
import type { Vfx } from "@/modules/battle/domain/vfx.type";
import type { Encounter } from "@/modules/campaign/domain/encounters.type";
import type { EditorTestMode } from "@/modules/card-editor/store/cardEditor.store";
import type { AnchorTarget, Card } from "@/modules/cards/domain/cards.type";
import type {
	BattleHero,
	BattleUnit,
	Hero,
	UnitBlueprint,
	UnitStance,
} from "@/modules/units/domain/units.type";
import { calculateAIIntents } from "./commands/calculateAIIntents.command";
import { cancelCard } from "./commands/cancelCard.command";
import { endTurn } from "./commands/endTurn.command";
import { initBattle } from "./commands/initBattle.command";
import { initCardEditorTestBattle } from "./commands/initCardEditorTestBattle.command";
import { initUnitEditorTestBattle } from "./commands/initUnitEditorTestBattle.command";
import { moveHero } from "./commands/moveHero.command";
import { resolveAIActions } from "./commands/resolveAIAction.command";
import { resolveCard } from "./commands/resolveCard.command";
import { selectActiveMoveHero } from "./commands/selectActiveMoveHero.command";
import { selectCard } from "./commands/selectCard.command";
import { setHoveredCell } from "./commands/setHoveredCell.command";

export type BattleStatus = "ONGOING" | "VICTORY" | "DEFEAT";
export type ActiveCardContext = {
	unitId: BattleHero["id"];
	card: Card;
};

export type BattleState = {
	units: BattleUnit[];
	surfaces: Record<string, SurfaceData>;
	removedCells: GridPosition[];

	activeMoveHeroId: BattleHero["id"] | null;
	usedMovesThisTurn: Record<BattleHero["id"], number>;
	activeHeroCard: ActiveCardContext | null;
	hoveredHeroCard: ActiveCardContext | null;
	usedCardsThisTurn: Record<BattleHero["id"], Card["id"]>;
	hoveredCell: GridPosition | null; // getGridId(GridPosition)

	currentVfx: Record<string, Vfx>; // key is cell id

	aiIntents: Record<BattleUnit["id"], Intent>;
	aiStateDiff: ShadowStateDiff;
	playerIntent: Intent | null;
	playerStateDiff: ShadowStateDiff;

	xpEarned: number;
	encounterId: Encounter["id"] | null;
	gridSize: { cols: number; rows: number };
	objectiveProgress: Record<string, number>;
	battleStatus: BattleStatus;

	sandboxCardOverride: Card | undefined;
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

	calculateAIIntents: (
		existingIntents: Record<BattleUnit["id"], Intent>,
	) => void;
	initCardEditorTestBattle: (draftCard: Card, testMode: EditorTestMode) => void;
	initUnitEditorTestBattle: (
		draftUnit: UnitBlueprint,
		stance: UnitStance,
	) => void;
};

const initialState: BattleState = {
	units: [],
	activeHeroCard: null,
	activeMoveHeroId: null,
	hoveredHeroCard: null,
	hoveredCell: null,
	usedMovesThisTurn: {},
	usedCardsThisTurn: {},
	surfaces: {},
	removedCells: [],
	currentVfx: {},

	aiIntents: {},
	aiStateDiff: {
		projectedMoves: {},
		projectedCasualties: [],
		projectedDamage: {},
		projectedHealing: {},
		projectedSpawns: [],
	},
	playerIntent: null,
	playerStateDiff: {
		projectedMoves: {},
		projectedCasualties: [],
		projectedDamage: {},
		projectedHealing: {},
		projectedSpawns: [],
	},

	xpEarned: 0,
	encounterId: null,
	gridSize: { cols: 8, rows: 8 },
	objectiveProgress: {},
	battleStatus: "ONGOING",

	sandboxCardOverride: undefined,
};

export type BattleStoreServerAction = (
	state: BattleState & BattleAction,
) => Partial<BattleState>;

export type BattleGet = () => BattleState;
export type BattleSet = (
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
			calculateAIIntents: (existingIntents: Record<BattleUnit["id"], Intent>) =>
				calculateAIIntents(get, set)(existingIntents),
			initCardEditorTestBattle: (draftCard, testMode) =>
				initCardEditorTestBattle(get, set)(draftCard, testMode),
			initUnitEditorTestBattle: (draftUnit, stance) =>
				initUnitEditorTestBattle(get, set)(draftUnit, stance),
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
				gridSize: state.gridSize,
				battleStatus: state.battleStatus,
				objectiveProgress: state.objectiveProgress,
			}),
		},
	),
);
