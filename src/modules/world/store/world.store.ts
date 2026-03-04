import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Quest } from "@/modules/campaign/domain/quests.type";
import { initialDeck } from "@/modules/cards/data/cards.data";
import type { Card, CardLog, Hand } from "@/modules/cards/domain/cards.type";
import { baseHeroStats } from "@/modules/figures/data/heroes/baseHeroStats";
import type { Hero } from "@/modules/figures/domain/figures.type";
import type {
	HeroClass,
	PendingPromotion,
} from "@/modules/figures/domain/heroClass.types";
import { heroId } from "@/modules/figures/helpers/figures.helpers";
import { type MapNode, mapNodeId } from "@/modules/world/domain/map.types";
import { claimRewards } from "./commands/claimRewards.command";
import { healParty } from "./commands/healParty.command";
import { resolvePendingPromotion } from "./commands/resolvePendingPromotion.command";
import { setPhase } from "./commands/setPhase.command";
import { stageBattleRewards } from "./commands/stageBattleRewards.command";
import { travelToNode } from "./commands/travelToNode.command";
import { updateHand } from "./commands/updateHand.command";
import { upgradeClassCards } from "./commands/upgradeClassCards.command";

export type GamePhase = "TOWN" | "CAMP" | "MAP" | "BATTLE" | "REWARD" | "SCENE";

export interface WorldState {
	phase: GamePhase;
	currentNodeId: MapNode["id"];
	roster: Hero[];
	pendingPromotions: PendingPromotion[];
	unlockedQuestsQueue: Quest["id"][];
}

export interface WorldAction {
	setPhase: (phase: GamePhase) => void;
	stageBattleRewards: (remainingHp: Record<string, number>) => void;
	travelToNode: (nodeId: MapNode["id"]) => void;
	claimRewards: (earnedXp: number) => void;
	resolvePromotion: (
		heroId: Hero["id"],
		chosenClass: HeroClass,
		utilityCardId: Card["id"],
	) => void;
	updateHand: (heroId: Hero["id"], hand: Hand) => void;
	upgradeClassCards: (cardUpgrades: Record<Card["id"], Card["id"]>) => void;
	clearUnlockedQuestsQueue: () => void;
	healParty: (healAmount: number) => void;
}

export type WorldStoreServerAction = (state: WorldState) => Partial<WorldState>;

export const useWorldStore = create<WorldState & WorldAction>()(
	persist(
		(set) => ({
			phase: "MAP",
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
			pendingPromotions: [],
			unlockedQuestsQueue: [],

			setPhase: (phase) => set(setPhase(phase)),
			travelToNode: (nodeId) => set(travelToNode(nodeId)),
			stageBattleRewards: (remainingHp) => set(stageBattleRewards(remainingHp)),
			claimRewards: (earnedXp: number) => set(claimRewards(earnedXp)),
			resolvePromotion: (heroId, chosenClass, utilityCardId) =>
				set(resolvePendingPromotion(heroId, chosenClass, utilityCardId)),
			updateHand: (heroId, hand) => set(updateHand(heroId, hand)),
			upgradeClassCards: (cardUpgrades: Record<Card["id"], Card["id"]>) =>
				set(upgradeClassCards(cardUpgrades)),
			clearUnlockedQuestsQueue: () => set({ unlockedQuestsQueue: [] }),
			healParty: (healAmount: number) => set(healParty(healAmount)),
		}),
		{
			name: "alpha-world-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
