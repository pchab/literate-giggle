import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Card, CardLog } from '@/modules/cards/cards.type';
import { filterGridByAttackPattern } from '@/modules/figures/attacks';
import { testBoss } from '@/modules/figures/boss';
import type { Hero, Monster } from '@/modules/figures/figures.type';
import type { GridPosition } from '@/modules/grid/grid.type';

type BattleState = {
  heroes: Hero[];
  monsters: Monster[];
  currentMove: [Hero['id'], number] | null;
  currentAttack: [Monster['id'], number] | null;
  usedCardsThisTurn: Record<Hero['id'], Card['id']>;
  cardUsageLog: CardLog;
}

type BattleAction = {
  initBattle: (heroRoster: Hero[]) => void;
  playCard: (heroId: Hero['id'], cardId: Card['id']) => void;
  moveHero: (newPosition: GridPosition) => void;
  attackEnemy: (monsterId: Monster['id'], attackValue: number) => void;
  enemyAction: () => void;
}

const initialState: BattleState = {
  heroes: [],
  monsters: [testBoss],
  currentMove: null,
  currentAttack: null,
  usedCardsThisTurn: {},
  cardUsageLog: {
    1: {},
    2: {},
    3: {},
  },
};

export const useBattleStore = create<
  BattleState & BattleAction
>()(
  persist(
    (set) => ({
      ...initialState,
      initBattle: (heroRoster: Hero[]) => set(() => ({ ...initialState, heroes: heroRoster })),
      playCard: (heroId, cardId) => set(({ heroes, currentMove, currentAttack, usedCardsThisTurn, cardUsageLog }) => {
        if (currentMove || currentAttack) {
          console.warn("A card use is already in progress. Please wait for it to resolve before playing another card.");
          return {};
        }
        const heroIndex = heroes.findIndex((h) => h.id === heroId);
        if (heroIndex === -1) {
          console.warn(`Hero with ID ${heroId} not found.`);
          return {};
        }
        const hero = heroes[heroIndex];
        const card = hero.cards.find(c => c.id === cardId);
        if (!card) {
          console.warn(`Card with ID ${cardId} not found for hero with ID ${heroId}`);
          return {};
        }
        const hasAttackValue = card.action.type === 'physAtt' || card.action.type === 'magAtt';
        const hasMoveValue = card.action.move > 0;
        return {
          heroes: heroes.with(heroIndex, {
            ...hero,
            currentHp: card.action.type === 'heal' ? Math.min(hero.maxHp, hero.currentHp + card.action.value) : hero.currentHp,
            currentPhysBlock: card.action.type === 'physDef' ? hero.currentPhysBlock + card.action.value : hero.currentPhysBlock,
            currentMagBlock: card.action.type === 'magDef' ? hero.currentMagBlock + card.action.value : hero.currentMagBlock,
          }),
          usedCardsThisTurn: {
            ...usedCardsThisTurn,
            [heroId]: cardId,
          },
          cardUsageLog: {
            ...cardUsageLog,
            [heroId]: {
              ...cardUsageLog[heroId],  
              [cardId]: (cardUsageLog[heroId][cardId] || 0) + 1,
            },
          },
          currentMove: hasMoveValue ? [heroId, card.action.move] : null,
          currentAttack: hasAttackValue ? [heroId, card.action.value] : null,
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
      attackEnemy: (monsterId, attackValue) => set(({ monsters, currentAttack }) => {
        if (!currentAttack) {
          console.warn("No card is currently being played. Please play a card before attacking an enemy.");
          return {};
        }
        const monster = monsters.find((m) => m.id === monsterId);
        if (!monster) {
          console.warn(`Monster with ID ${monsterId} not found.`);
          return {};
        }
        return {
          monsters: monsters.map((m) => m.id === monsterId ? { ...m, currentHp: Math.max(0, m.currentHp - attackValue) } : m),
          currentAttack: null,
        };
      }),
      enemyAction: () => set(({ monsters, heroes }) => {
        const nextHeroes = monsters.reduce((acc, { intent }) => {
          const targetedCells = filterGridByAttackPattern(
            intent,
            heroes,
          );
          return acc.map((hero) => {
            const isTargeted = targetedCells.some(
              ({ col, row }) => col === hero.gridPosition.col && row === hero.gridPosition.row,
            );
            if (!isTargeted) {
              return hero;
            }
            const damage = intent.effect === 'physDmg'
              ? Math.max(0, intent.damage - hero.physDef - hero.currentPhysBlock)
              : Math.max(0, intent.damage - hero.magDef - hero.currentMagBlock);
            return {
              ...hero,
              currentHp: Math.max(0, hero.currentHp - damage),
              currentPhysBlock: 0,
              currentMagBlock: 0,
            };
          });
        }, heroes);
        const nextMonsters = monsters.map((m) => {
          const nextIntent =
          m.attacks[Math.floor(Math.random() * m.attacks.length)];
          return { ...m, intent: nextIntent };
        });
        return {
          monsters: nextMonsters,
          heroes: nextHeroes,
          usedCardsThisTurn: {}, // Reset used cards after enemy action
        };
      }),
    }),
    {
      name: "alpha-battle-state",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);