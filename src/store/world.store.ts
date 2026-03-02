import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { cardService } from "@/modules/cards/cards.service";
import { initialDeck } from "@/modules/cards/domain/cards.data";
import type { Card, CardLog, Hand } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { baseHeroStats } from "@/modules/figures/domain/heroes/baseHeroStats";
import { heroId } from "@/modules/figures/figures.helpers";
import type {
	HeroClass,
	PendingPromotion,
} from "@/modules/heroClass/domain/heroClass.types";
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
	pendingPromotions: PendingPromotion[];
}

export interface WorldAction {
	setPhase: (phase: GamePhase) => void;
	stageBattleRewards: (
		remainingHp: Record<string, number>,
		cardLog: CardLog,
	) => void;
	travelToNode: (nodeId: string, nodeType: NodeType) => void;
	claimRewards: (earnedXp: number) => void;
	resolvePromotion: (
		heroId: Hero["id"],
		chosenClass: HeroClass,
		utilityCardId: Card["id"],
	) => void;
	updateHand: (heroId: Hero["id"], hand: Hand) => void;
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
					id: heroId(1),
					...baseHeroStats,
					currentHp: baseHeroStats.maxHp,
					currentBlock: 0,
					gridPosition: { row: 0, col: 0 },
					deck: [...initialDeck],
					hand: [initialDeck[0], initialDeck[1], null],
				},
				{
					id: heroId(2),
					...baseHeroStats,
					currentHp: baseHeroStats.maxHp,
					currentBlock: 0,
					gridPosition: { row: 0, col: 1 },
					deck: [...initialDeck],
					hand: [initialDeck[0], initialDeck[1], null],
				},
				{
					id: heroId(3),
					...baseHeroStats,
					currentHp: baseHeroStats.maxHp,
					currentBlock: 0,
					gridPosition: { row: 1, col: 0 },
					deck: [...initialDeck],
					hand: [initialDeck[0], initialDeck[1], null],
				},
			],
			pendingBattleLog: {} as CardLog,
			pendingPromotions: [],

			setPhase: (phase) => set(worldService.setPhase(phase)),
			travelToNode: (nodeId, nodeType) =>
				set(worldService.travelToNode(nodeId, nodeType)),
			stageBattleRewards: (remainingHp, cardLog) =>
				set(worldService.stageBattleRewards(remainingHp, cardLog)),
			claimRewards: (earnedXp: number) =>
				set(heroClassService.claimRewards(earnedXp)),
			resolvePromotion: (heroId, chosenClass, utilityCardId) =>
				set(
					heroClassService.resolvePendingPromotion(
						heroId,
						chosenClass,
						utilityCardId,
					),
				),
			updateHand: (heroId, hand) => set(cardService.updateHand(heroId, hand)),
		}),
		{
			name: "alpha-world-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
