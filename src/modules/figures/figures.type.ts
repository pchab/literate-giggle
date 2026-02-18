import type { Card } from '../cards/cards.type';
import type { GridPosition } from '../grid/grid.type';
import type { Attack } from './attacks';

export type HeroClass = 'Squire' | 'Knight' | 'Thief' | 'Mage';
export type Hero = {
  id: number;
  heroClass: HeroClass;
  hp: number;
  maxHp: number;
  physAtk: number;
  physDef: number;
  magAtk: number;
  magDef: number;
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
