import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { evolveCard } from "@/modules/cards/applications/evolveCard.command";
import { cardLibrary, initialDeck } from "@/modules/cards/domain/cards";
import type { Card, CardLog } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { squireStats } from "@/modules/figures/domain/heroes";
import { createHeroId } from "@/modules/figures/figures.helpers";
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

export type WorldStoreServerAction = (state: WorldState) => Partial<WorldState>;

export const useWorldStore = create<WorldState & WorldAction>()(
	persist(
		(set) => ({
			phase: "MAP",
			mapData: PROTOTYPE_MAP,
			currentNodeId: "start",
			roster: [
				{
					id: createHeroId(1),
					...squireStats,
					currentHp: squireStats.maxHp,
					currentPhysBlock: 0,
					currentMagBlock: 0,
					gridPosition: { row: 0, col: 0 },
					deck: initialDeck,
					cards: [cardLibrary[0], cardLibrary[1]],
				},
				{
					id: createHeroId(2),
					...squireStats,
					currentHp: squireStats.maxHp,
					currentPhysBlock: 0,
					currentMagBlock: 0,
					gridPosition: { row: 0, col: 1 },
					deck: initialDeck,
					cards: [cardLibrary[2], cardLibrary[3]],
				},
				{
					id: createHeroId(3),
					...squireStats,
					currentHp: squireStats.maxHp,
					currentPhysBlock: 0,
					currentMagBlock: 0,
					gridPosition: { row: 1, col: 0 },
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
				set(evolveCard(heroId, oldCardId, newCardId)),
		}),
		{
			name: "alpha-world-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
