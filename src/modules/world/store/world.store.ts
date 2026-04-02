import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Quest } from "@/modules/campaign/domain/quests.type";
import type { EvolutionRuneId } from "@/modules/cards/data/evolutionRecipes.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import type {
	HeroClass,
	PendingPowerRune,
	PendingPromotion,
	RuneDraftOption,
} from "@/modules/units/domain/heroClass.types";
import type { Hero } from "@/modules/units/domain/units.type";
import { type MapNode, mapNodeId } from "@/modules/world/domain/map.types";
import { claimRewards } from "./commands/claimRewards.command";
import { forgeEvolution } from "./commands/forgeEvolution.command";
import { healParty } from "./commands/healParty.command";
import { initializeRoster } from "./commands/initializeRoster.command";
import { resolvePendingPromotion } from "./commands/resolvePendingPromotion.command";
import { setPhase } from "./commands/setPhase.command";
import { stageBattleRewards } from "./commands/stageBattleRewards.command";
import { travelToNode } from "./commands/travelToNode.command";
import { updateSelectedCards } from "./commands/updateSelectedCards.command";

export type GamePhase = "TOWN" | "CAMP" | "MAP" | "BATTLE" | "REWARD" | "SCENE";

export interface WorldState {
	phase: GamePhase;
	currentNodeId: MapNode["id"];
	roster: Hero[];
	pendingPromotions: PendingPromotion[];
	unlockedQuestsQueue: Quest["id"][];
	pendingPowerRunes: PendingPowerRune[];
	evolutionRunesInventory: EvolutionRuneId[];
}

interface WorldAction {
	initializeRoster: () => void;
	setPhase: (phase: GamePhase) => void;
	stageBattleRewards: (remainingHp: Record<string, number>) => void;
	travelToNode: (
		nodeId: MapNode["id"],
		dynamicMap: Record<MapNode["id"], MapNode>,
	) => void;
	claimRewards: (
		earnedXp: number,
		completedDraft: Record<
			Hero["id"],
			{
				rune: RuneDraftOption;
				cardInstanceId: Card["id"];
			}[]
		>,
	) => void;
	resolvePromotion: (
		heroId: Hero["id"],
		chosenClass: HeroClass,
		utilityCardId: Card["id"],
	) => void;
	updateSelectedCards: (
		heroId: Hero["id"],
		cards: Hero["selectedCards"],
	) => void;
	clearUnlockedQuestsQueue: () => void;
	healParty: (healAmount: number) => void;
	rewardEvoRune: (runeId: EvolutionRuneId) => void;
	forgeEvolution: (
		heroId: Hero["id"],
		cardInstanceId: string,
		runeId: EvolutionRuneId,
	) => void;
}

export const initialWorldState: WorldState = {
	phase: "MAP",
	currentNodeId: mapNodeId("ironhold_city"),
	roster: [],
	pendingPromotions: [],
	pendingPowerRunes: [],
	unlockedQuestsQueue: [],
	evolutionRunesInventory: [],
};

export type WorldStoreServerAction = (state: WorldState) => Partial<WorldState>;

export const useWorldStore = create<WorldState & WorldAction>()(
	persist(
		(set) => ({
			...initialWorldState,

			initializeRoster: () => set(initializeRoster()),
			setPhase: (phase) => set(setPhase(phase)),
			travelToNode: (nodeId, dynamicMap) =>
				set(travelToNode(nodeId, dynamicMap)),
			stageBattleRewards: (remainingHp) => set(stageBattleRewards(remainingHp)),
			claimRewards: (
				earnedXp: number,
				completedDraft: Record<
					Hero["id"],
					{
						rune: RuneDraftOption;
						cardInstanceId: Card["id"];
					}[]
				>,
			) => set(claimRewards(earnedXp, completedDraft)),
			resolvePromotion: (heroId, chosenClass, utilityCardId) =>
				set(resolvePendingPromotion(heroId, chosenClass, utilityCardId)),
			updateSelectedCards: (heroId, selectedCards) =>
				set(updateSelectedCards(heroId, selectedCards)),
			clearUnlockedQuestsQueue: () => set({ unlockedQuestsQueue: [] }),
			healParty: (healAmount: number) => set(healParty(healAmount)),
			rewardEvoRune: (runeId: EvolutionRuneId) =>
				set(({ evolutionRunesInventory }) => ({
					evolutionRunesInventory: [...evolutionRunesInventory, runeId],
				})),
			forgeEvolution: (heroId, cardInstanceId, runeId) =>
				set((state) => forgeEvolution(state, heroId, cardInstanceId, runeId)),
		}),
		{
			name: "alpha-world-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
