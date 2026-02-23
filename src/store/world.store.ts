import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { cardLibrary, initialDeck } from "@/modules/cards/cards";
import { cardService } from "@/modules/cards/cards.service";
import type { Card, CardLog } from "@/modules/cards/cards.type";
import type { Hero } from "@/modules/figures/figures.type";
import { squireStats } from "@/modules/figures/heroes";
import {
	type MapTier,
	type NodeType,
	PROTOTYPE_MAP,
} from "@/modules/map/map.model";
import { worldService } from "@/modules/world/world.service";

export type GamePhase = "CAMP" | "MAP" | "BATTLE" | "REWARD";

export interface WorldState {
	phase: GamePhase;
	mapData: MapTier[];
	currentNodeId: string;
	roster: Hero[];
	pendingBattleLog: CardLog | null;
}

export interface WorldAction {
	setPhase: (phase: GamePhase) => void;
	stageBattleRewards: (
		remainingHp: Record<string, number>,
		cardLog: CardLog,
	) => void;
	travelToNode: (nodeId: string, nodeType: NodeType) => void;
	claimRewardsAndReturnToMap: () => void;
	evolveCard: (
		heroId: Hero["id"],
		oldCardId: Card["id"],
		newCardId: Card["id"],
	) => void;
}

export type WorldStoreServerAction = (
	state: WorldState,
) => Partial<WorldState>;

export const useWorldStore = create<WorldState & WorldAction>()(
	persist(
		(set) => ({
			phase: "MAP",
			mapData: PROTOTYPE_MAP,
			currentNodeId: "start",
			roster: [
				{
					id: 1,
					...squireStats,
					currentPhysBlock: 0,
					currentMagBlock: 0,
					gridPosition: { row: 1, col: 1 },
					deck: initialDeck,
					cards: [cardLibrary[0], cardLibrary[1]],
				},
				{
					id: 2,
					...squireStats,
					currentPhysBlock: 0,
					currentMagBlock: 0,
					gridPosition: { row: 2, col: 1 },
					deck: initialDeck,
					cards: [cardLibrary[2], cardLibrary[3]],
				},
				{
					id: 3,
					...squireStats,
					currentPhysBlock: 0,
					currentMagBlock: 0,
					gridPosition: { row: 3, col: 1 },
					deck: initialDeck,
					cards: [cardLibrary[1], cardLibrary[4]],
				},
			],
			pendingBattleLog: {} as CardLog | null,

			setPhase: (phase) => set(worldService.setPhase(phase)),
			travelToNode: (nodeId, nodeType) =>
				set(worldService.travelToNode(nodeId, nodeType)),
			stageBattleRewards: (remainingHp, cardLog) =>
				set(worldService.stageBattleRewards(remainingHp, cardLog)),
			claimRewardsAndReturnToMap: () =>
				set(worldService.claimRewardsAndReturnToMap()),
			evolveCard: (heroId, oldCardId, newCardId) =>
				set(cardService.evolveCard(heroId, oldCardId, newCardId)),
		}),
		{
			name: "alpha-world-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
