import type { Card } from '../cards/cards.type';
import type { GridPosition } from '../grid/grid.type';

export type HeroClass = 'Squire' | 'Knight' | 'Thief' | 'Mage';
export type Hero = {
  id: number;
  heroClass: HeroClass;
  hp: number;
  maxHp: number;
  gridPosition: GridPosition;
  cards: [Card, Card];
}

export type EnemyType = 'Boss';
export type Monster = {
  id: number;
  enemyType: EnemyType;
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
