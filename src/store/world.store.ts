import { create } from 'zustand';
import { cardLibrary, initialDeck } from '@/modules/cards/cards';
import type { CardLog } from '@/modules/cards/cards.type';
import type { Hero } from '@/modules/figures/figures.type';
import { squireStats } from '@/modules/figures/heroes';
import { type MapTier, type NodeType, PROTOTYPE_MAP } from '@/modules/map/map.model';

export type GamePhase = 'CAMP' | 'MAP' | 'BATTLE' | 'REWARD';

interface GlobalState {
  phase: GamePhase;
  mapData: MapTier[];
  currentNodeId: string;
  roster: Hero[];
  pendingBattleLog: CardLog | null;
  
  setPhase: (phase: GamePhase) => void;
  stageBattleRewards: (remainingHp: Record<string, number>, cardLog: CardLog) => void;
  travelToNode: (nodeId: string, nodeType: NodeType) => void;
  claimRewardsAndReturnToMap: () => void;
}

export const useWorldStore = create<GlobalState>((set) => ({
  phase: 'MAP',
  mapData: PROTOTYPE_MAP,
  currentNodeId: 'start',
  roster: [
    { id: 1, ...squireStats, currentPhysBlock: 0, currentMagBlock: 0, gridPosition: { row: 1, col: 1 }, deck: initialDeck, cards: [cardLibrary[0], cardLibrary[1]] },
    { id: 2, ...squireStats, currentPhysBlock: 0, currentMagBlock: 0, gridPosition: { row: 2, col: 1 }, deck: initialDeck, cards: [cardLibrary[2], cardLibrary[3]] },
    { id: 3, ...squireStats, currentPhysBlock: 0, currentMagBlock: 0, gridPosition: { row: 3, col: 1 }, deck: initialDeck, cards: [cardLibrary[1], cardLibrary[4]] },
  ],
  pendingBattleLog: {} as CardLog | null,
  
  setPhase: (phase) => set({ phase }),
  travelToNode: (nodeId, nodeType) => {
    set({ currentNodeId: nodeId });
    
    if (nodeType === 'battle' || nodeType === 'elite' || nodeType === 'boss') {
      set({ phase: 'BATTLE' });
    } else if (nodeType === 'camp') {
      set({ phase: 'CAMP' });
    }
  },
  stageBattleRewards: (remainingHp, cardLog) => set(({ roster }) => ({
    roster: roster.map(hero => ({
      ...hero,
      currentHp: remainingHp[hero.id] !== undefined ? remainingHp[hero.id] : hero.currentHp
    })),
    pendingBattleLog: cardLog,
    phase: 'REWARD',
  })),
  claimRewardsAndReturnToMap: () => set(({ roster, pendingBattleLog }) => {
    if (!pendingBattleLog) return {};

    const newRoster = roster.map(hero => {
      const cardsUsed = pendingBattleLog[hero.id] || {};
      
      return {
        ...hero,
        deck: hero.deck.map(card => {
          const timesUsed = cardsUsed[card.id] || 0;
          return {
            ...card,
            xp: card.xp + timesUsed,
          };
        })
      };
    });
    
    return {
      roster: newRoster,
      pendingBattleLog: null,
      phase: 'MAP'
    };
  })
}));