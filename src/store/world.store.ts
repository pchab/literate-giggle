import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { evolveCard } from "@/modules/cards/applications/evolveCard.command";
import { cloneCard } from "@/modules/cards/cards.helper";
import { initialDeck } from "@/modules/cards/domain/cards.data";
import type { Card, CardLog } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { squireStats } from "@/modules/figures/domain/heroes/squire";
import { createHeroId } from "@/modules/figures/figures.helpers";
import type { HeroClass } from "@/modules/heroClass/domain/heroClass.types";
import { heroClassService } from "@/modules/heroClass/heroClass.service";
import {
	type MapData,
	type NodeType,
	PROTOTYPE_MAP,
} from "@/modules/map/map.model";
import { worldService } from "@/modules/world/world.service";

export type GamePhase = "CAMP" | "MAP" | "BATTLE" | "REWARD";

export interface WorldState {
	phase: GamePhase;
	mapData: MapData;
	currentNodeId: string;
	roster: Hero[];
	pendingBattleLog: CardLog;
	pendingPromotion: {
		heroId: Hero["id"];
		oldClass: HeroClass;
		newClass: HeroClass;
	} | null;
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
	resolvePromotion: (chosenUtilityCardId: Card["id"]) => void;
}

export type WorldStoreServerAction = (state: WorldState) => Partial<WorldState>;

export const useWorldStore = create<WorldState & WorldAction>()(
	persist(
		(set) => ({
			phase: "MAP",
			mapData: PROTOTYPE_MAP,
			currentNodeId: "ironhold_city",
			roster: [
				{
					id: createHeroId(1),
					...squireStats,
					currentHp: squireStats.maxHp,
					currentBlock: 0,
					gridPosition: { row: 0, col: 0 },
					deck: initialDeck.map(cloneCard),
					cards: [cloneCard(initialDeck[0]), cloneCard(initialDeck[1]), null],
				},
				{
					id: createHeroId(2),
					...squireStats,
					currentHp: squireStats.maxHp,
					currentBlock: 0,
					gridPosition: { row: 0, col: 1 },
					deck: initialDeck.map(cloneCard),
					cards: [cloneCard(initialDeck[0]), cloneCard(initialDeck[1]), null],
				},
				{
					id: createHeroId(3),
					...squireStats,
					currentHp: squireStats.maxHp,
					currentBlock: 0,
					gridPosition: { row: 1, col: 0 },
					deck: initialDeck.map(cloneCard),
					cards: [cloneCard(initialDeck[0]), cloneCard(initialDeck[1]), null],
				},
			],
			pendingBattleLog: {} as CardLog,
			pendingPromotion: null,

			setPhase: (phase) => set(worldService.setPhase(phase)),
			travelToNode: (nodeId, nodeType) =>
				set(worldService.travelToNode(nodeId, nodeType)),
			stageBattleRewards: (remainingHp, cardLog) =>
				set(worldService.stageBattleRewards(remainingHp, cardLog)),
			claimRewardsAndReturnToMap: () =>
				set(worldService.claimRewardsAndReturnToMap()),
			evolveCard: (heroId, oldCardId, newCardId) =>
				set(evolveCard(heroId, oldCardId, newCardId)),
			resolvePromotion: (chosenUtilityCardId) =>
				set(heroClassService.resolvePendingPromotion(chosenUtilityCardId)),
		}),
		{
			name: "alpha-world-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
