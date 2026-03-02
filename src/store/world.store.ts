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
	type MapNode,
	mapNodeId,
	type NodeType,
} from "@/modules/map/domain/map.model";
import { WorldMapNodes } from "@/modules/map/domain/mapNodes.data";
import type { Quest } from "@/modules/quests/domain/quests.type";
import { worldService } from "@/modules/world/world.service";

export type GamePhase = "CAMP" | "MAP" | "BATTLE" | "REWARD" | "SCENE";

export interface WorldState {
	phase: GamePhase;
	mapData: MapData;
	currentNodeId: MapNode["id"];
	roster: Hero[];
	pendingPromotions: PendingPromotion[];
	unlockedQuestsQueue: Quest["id"][];
}

export interface WorldAction {
	setPhase: (phase: GamePhase) => void;
	stageBattleRewards: (remainingHp: Record<string, number>) => void;
	travelToNode: (nodeId: MapNode["id"], nodeType: NodeType) => void;
	claimRewards: (earnedXp: number) => void;
	resolvePromotion: (
		heroId: Hero["id"],
		chosenClass: HeroClass,
		utilityCardId: Card["id"],
	) => void;
	updateHand: (heroId: Hero["id"], hand: Hand) => void;
	upgradeClassCards: (targetClass: HeroClass) => void;
	clearUnlockedQuestsQueue: () => void;
}

export type WorldStoreServerAction = (state: WorldState) => Partial<WorldState>;

export const useWorldStore = create<WorldState & WorldAction>()(
	persist(
		(set) => ({
			phase: "MAP",
			mapData: WorldMapNodes,
			currentNodeId: mapNodeId("ironhold_city"),
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
			activeSceneId: null,
			unlockedQuestsQueue: [],

			setPhase: (phase) => set(worldService.setPhase(phase)),
			travelToNode: (nodeId, nodeType) =>
				set(worldService.travelToNode(nodeId, nodeType)),
			stageBattleRewards: (remainingHp) =>
				set(worldService.stageBattleRewards(remainingHp)),
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
			upgradeClassCards: (targetClass: HeroClass) =>
				set((state) => {
					const newRoster = state.roster.map((hero) => {
						if (hero.heroClass !== targetClass) return hero;
						// TEMP
						console.log(`Upgrading ${hero.heroClass} cards!`);
						return {
							...hero,
							currentHp: hero.maxHp,
						};
					});

					return { roster: newRoster };
				}),
			clearUnlockedQuestsQueue: () => set({ unlockedQuestsQueue: [] }),
		}),
		{
			name: "alpha-world-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
