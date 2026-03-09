import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Quest } from "@/modules/campaign/domain/quests.type";
import { initialDeck } from "@/modules/cards/data/cards.data";
import type { EvolutionRuneId } from "@/modules/cards/data/evolutionRecipes.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import { createHeroCard } from "@/modules/cards/helpers/cards.helper";
import { baseHeroStats } from "@/modules/figures/data/heroes/baseHeroStats";
import type { Hero } from "@/modules/figures/domain/figures.type";
import type {
	HeroClass,
	PendingPowerRune,
	PendingPromotion,
	RuneDraftOption,
} from "@/modules/figures/domain/heroClass.types";
import { heroId } from "@/modules/figures/helpers/figures.helpers";
import { type MapNode, mapNodeId } from "@/modules/world/domain/map.types";
import { claimRewards } from "./commands/claimRewards.command";
import { forgeEvolution } from "./commands/forgeEvolution.command";
import { healParty } from "./commands/healParty.command";
import { resolvePendingPromotion } from "./commands/resolvePendingPromotion.command";
import { resolvePowerRune } from "./commands/resolvePowerRune.command";
import { setPhase } from "./commands/setPhase.command";
import { stageBattleRewards } from "./commands/stageBattleRewards.command";
import { travelToNode } from "./commands/travelToNode.command";
import { updateSelectedCards } from "./commands/updateSelectedCards.command";
import { upgradeClassCards } from "./commands/upgradeClassCards.command";

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

export interface WorldAction {
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
	resolvePowerRune: (
		heroId: Hero["id"],
		cardInstanceId: string,
		chosenRune: RuneDraftOption,
	) => void;
	updateSelectedCards: (
		heroId: Hero["id"],
		cards: Hero["selectedCards"],
	) => void;
	upgradeClassCards: (cardUpgrades: Record<Card["id"], Card["id"]>) => void;
	clearUnlockedQuestsQueue: () => void;
	healParty: (healAmount: number) => void;
	forgeEvolution: (
		heroId: Hero["id"],
		cardInstanceId: string,
		runeId: EvolutionRuneId,
	) => void;
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
					statuses: [],
					gridPosition: { row: 1, col: 1 },
					deck: [...initialDeck].map(createHeroCard(heroId(1))),
					selectedCards: [
						createHeroCard(heroId(1))(initialDeck[0]),
						createHeroCard(heroId(1))(initialDeck[1]),
						null,
					],
				},
				{
					id: heroId(2),
					...baseHeroStats,
					currentHp: baseHeroStats.maxHp,
					statuses: [],
					gridPosition: { row: 0, col: 1 },
					deck: [...initialDeck].map(createHeroCard(heroId(2))),
					selectedCards: [
						createHeroCard(heroId(2))(initialDeck[0]),
						createHeroCard(heroId(2))(initialDeck[1]),
						null,
					],
				},
				{
					id: heroId(3),
					...baseHeroStats,
					currentHp: baseHeroStats.maxHp,
					statuses: [],
					gridPosition: { row: 1, col: 0 },
					deck: [...initialDeck].map(createHeroCard(heroId(3))),
					selectedCards: [
						createHeroCard(heroId(3))(initialDeck[0]),
						createHeroCard(heroId(3))(initialDeck[1]),
						null,
					],
				},
			],
			pendingPromotions: [],
			pendingPowerRunes: [],
			unlockedQuestsQueue: [],
			evolutionRunesInventory: ["rune_iron", "rune_nature"],

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
			resolvePowerRune: (heroId, cardInstanceId, chosenRune) =>
				set((state) =>
					resolvePowerRune(state, heroId, cardInstanceId, chosenRune),
				),
			updateSelectedCards: (heroId, selectedCards) =>
				set(updateSelectedCards(heroId, selectedCards)),
			upgradeClassCards: (cardUpgrades: Record<Card["id"], Card["id"]>) =>
				set(upgradeClassCards(cardUpgrades)),
			clearUnlockedQuestsQueue: () => set({ unlockedQuestsQueue: [] }),
			healParty: (healAmount: number) => set(healParty(healAmount)),
			forgeEvolution: (heroId, cardInstanceId, runeId) =>
				set((state) => forgeEvolution(state, heroId, cardInstanceId, runeId)),
		}),
		{
			name: "alpha-world-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
