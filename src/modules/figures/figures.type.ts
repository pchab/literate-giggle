import type { Card } from '../cards/cards.type';
import type { GridPosition } from '../grid/grid.type';

type HeroClass = 'Squire' | 'Knight' | 'Thief' | 'Mage';
export type Hero = {
  id: number;
  heroClass: HeroClass;
  hp: number;
  maxHp: number;
  gridPosition: GridPosition;
  cards: [Card, Card];
}

export type Monster = {
  id: number;
  name: string;
  hp: number;
  attacks: Attack[];
  intent: Attack;
}

type Target = 'lowestHp' | 'random' | 'lowestPhysDef' | 'lowestMagDef' | 'grid';
export type Attack = {
  id: number;
  target: Target;
  pattern: GridPosition[];
  damage: number;
  effect?: string;
}
