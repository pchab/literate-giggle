import type { Card } from '../cards/cards.type';
import type { GridPosition } from '../grid/grid.type';
import type { Attack } from './attacks';

export type HeroClass = 'Squire' | 'Knight' | 'Thief' | 'Mage';
export type Hero = {
  id: number;
  heroClass: HeroClass;
  currentHp: number;
  maxHp: number;
  physAtk: number;
  physDef: number;
  currentPhysBlock: number;
  magAtk: number;
  magDef: number;
  currentMagBlock: number;
  gridPosition: GridPosition;
  deck: Card[];
  cards: [Card, Card];
}

export type EnemyType = 'Boss' | 'Skeleton' | 'Bat' | 'Archer';
export type Monster = {
  id: number;
  enemyType: EnemyType;
  currentHp: number;
  maxHp: number;
  attacks: Attack[];
  intent: Attack;
}
