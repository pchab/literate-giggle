import { arcaneBoltCard, arcaneShieldCard, bandageCard, shortSwordCard, woodenShieldCard } from '@/modules/cards/cards';
import type { Card } from '@/modules/cards/cards.type';
import { testBoss } from '@/modules/figures/boss';
import type { Hero, Monster } from '@/modules/figures/figures.type';
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type BattleState = {
  heroes: Hero[];
  monsters: Monster[];
}

type BattleAction = {
  playCard: (heroId: Hero['id'], cardId: Card['id']) => void;
}

const initialState: BattleState = {
  heroes: [
    { id: 1, heroClass: "Squire", hp: 10, maxHp: 10, gridPosition: { row: 1, col: 1 }, cards: [shortSwordCard, woodenShieldCard] },
    { id: 2, heroClass: "Squire", hp: 10, maxHp: 10, gridPosition: { row: 2, col: 1 }, cards: [arcaneBoltCard, arcaneShieldCard] },
    { id: 3, heroClass: "Squire", hp: 10, maxHp: 10, gridPosition: { row: 3, col: 1 }, cards: [bandageCard, woodenShieldCard] },
  ],
  monsters: [testBoss],
};

export const useBattleStore = create<
  BattleState & BattleAction
>()(
  persist(
    (set) => ({
      ...initialState,
      playCard: (heroId, cardId) => {
        set((state) => {
          const hero = state.heroes.find(h => h.id === heroId);
          const card = hero?.cards.find(c => c.id === cardId);
          if (!hero || !card) return state;

          console.log(`Hero ${heroId} played card ${card.name}`);
          // Apply card action logic here (e.g., damage calculation, healing, etc.)
          // This is a placeholder and should be expanded based on game rules.
          switch (card.action.type) {
            case 'physAtt':
              // Apply physical attack logic
              break;
            case 'physDef':
              // Apply physical defense logic
              break;
            case 'magAtt':
              // Apply magical attack logic
              break;
            case 'magDef':
              // Apply magical defense logic
              break;
            case 'heal':
              // Apply healing logic
              break;
          }

          return state; // Return updated state after applying card action
        });
      },
    }),
    {
      name: "alpha-battle-state",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);