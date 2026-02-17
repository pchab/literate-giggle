import { arcaneBoltCard, arcaneShieldCard, bandageCard, shortSwordCard, woodenShieldCard } from '@/modules/cards/cards';
import type { Card } from '@/modules/cards/cards.type';
import { testBoss } from '@/modules/figures/boss';
import type { Hero, Monster } from '@/modules/figures/figures.type';
import type { GridPosition } from '@/modules/grid/grid.type';
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type BattleState = {
  heroes: Hero[];
  monsters: Monster[];
  currentMove: [Hero['id'], number] | null;
  usedCards: Record<Hero['id'], Card['id']>;
}

type BattleAction = {
  playCard: (heroId: Hero['id'], cardId: Card['id']) => void;
  moveHero: (newPosition: GridPosition) => void;
}

const initialState: BattleState = {
  heroes: [
    { id: 1, heroClass: "Squire", hp: 10, maxHp: 10, gridPosition: { row: 1, col: 1 }, cards: [shortSwordCard, woodenShieldCard] },
    { id: 2, heroClass: "Squire", hp: 10, maxHp: 10, gridPosition: { row: 2, col: 1 }, cards: [arcaneBoltCard, arcaneShieldCard] },
    { id: 3, heroClass: "Squire", hp: 10, maxHp: 10, gridPosition: { row: 3, col: 1 }, cards: [bandageCard, woodenShieldCard] },
  ],
  monsters: [testBoss],
  currentMove: null,
  usedCards: {},
};

export const useBattleStore = create<
  BattleState & BattleAction
>()(
  persist(
    (set) => ({
      ...initialState,
      playCard: (heroId, cardId) => set(({ heroes, currentMove, usedCards }) => {
        if (currentMove) {
          console.warn("A card use is already in progress. Please wait for it to resolve before playing another card.");
          return {};
        }
        const card = heroes.find(h => h.id === heroId)?.cards.find(c => c.id === cardId);
        if (!card) {
          console.warn(`Card with ID ${cardId} not found for hero with ID ${heroId}`);
          return {};
        }
        return {
          usedCards: {
            ...usedCards,
            [heroId]: cardId,
          },
          currentMove: card.action.move > 0 ? [heroId, card.action.move] : null,
        };
      }),
      moveHero: (newPosition) => set(({ heroes, currentMove }) => {
        if (!currentMove) {
          console.warn("No card is currently being played. Please play a card before moving a hero.");
          return {};
        }
        const [heroId, maxDistance] = currentMove;
        const hero = heroes.find((h) => h.id === currentMove[0]);
        if (!hero) {
          console.warn(`Hero with ID ${heroId} not found.`);
          return {};
        }
        const distance = Math.abs(newPosition.row - hero.gridPosition.row) + Math.abs(newPosition.col - hero.gridPosition.col);
        if (distance > maxDistance) {
          console.warn(`Hero ${heroId} cannot move more than ${maxDistance} squares.`);
          return {};
        }
        return {
          heroes: heroes.map((h) => h.id === heroId ? { ...h, gridPosition: newPosition } : h),
          currentMove: null,
        };
      }),
    }),
    {
      name: "alpha-battle-state",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);