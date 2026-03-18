import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Quest } from "@/modules/campaign/domain/quests.type";
import { initialDeck } from "@/modules/cards/data/cards.data";
import type { EvolutionRuneId } from "@/modules/cards/data/evolutionRecipes.data";
import type { Card, HeroCard } from "@/modules/cards/domain/cards.type";
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
import { setPhase } from "./commands/setPhase.command";
import { stageBattleRewards } from "./commands/stageBattleRewards.command";
import { travelToNode } from "./commands/travelToNode.command";
import { updateSelectedCards } from "./commands/updateSelectedCards.command";

export type GamePhase = "TOWN" | "CAMP" | "MAP" | "BATTLE" | "REWARD" | "SCENE";
const startingIds = [
	heroId(crypto.randomUUID()),
	heroId(crypto.randomUUID()),
	heroId(crypto.randomUUID()),
];
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

export type WorldStoreServerAction = (state: WorldState) => Partial<WorldState>;

export const useWorldStore = create<WorldState & WorldAction>()(
	persist(
		(set) => ({
			phase: "MAP",
			currentNodeId: mapNodeId("ironhold_city"),
			roster: [
				{
					id: startingIds[0],
					name: "Anselus",
					...baseHeroStats,
					currentHp: baseHeroStats.maxHp,
					deck: [...initialDeck].map(createHeroCard(startingIds[0])),
					selectedCards: [...initialDeck].map(
						createHeroCard(startingIds[0]),
					) as [HeroCard, HeroCard | null, HeroCard | null],
				},
				{
					id: startingIds[1],
					name: "Willet",
					...baseHeroStats,
					currentHp: baseHeroStats.maxHp,
					deck: [...initialDeck].map(createHeroCard(startingIds[1])),
					selectedCards: [...initialDeck].map(
						createHeroCard(startingIds[1]),
					) as [HeroCard, HeroCard | null, HeroCard | null],
				},
				{
					id: startingIds[2],
					name: "Gabrien",
					...baseHeroStats,
					currentHp: baseHeroStats.maxHp,
					deck: [...initialDeck].map(createHeroCard(startingIds[2])),
					selectedCards: [...initialDeck].map(
						createHeroCard(startingIds[2]),
					) as [HeroCard, HeroCard | null, HeroCard | null],
				},
			],
			pendingPromotions: [],
			pendingPowerRunes: [],
			unlockedQuestsQueue: [],
			evolutionRunesInventory: [],

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
				set(({ evolutionRunesInventory }) => {
					evolutionRunesInventory.push(runeId);
					return { evolutionRunesInventory };
				}),
			forgeEvolution: (heroId, cardInstanceId, runeId) =>
				set((state) => forgeEvolution(state, heroId, cardInstanceId, runeId)),
		}),
		{
			name: "alpha-world-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
