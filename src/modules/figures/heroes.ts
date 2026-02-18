import type { Hero } from './figures.type';

export const squireStats: Omit<Hero, 'id' | 'gridPosition' | 'cards'> = { heroClass: "Squire", hp: 10, maxHp: 10, physAtk: 1, physDef: 1, magAtk: 1, magDef: 1 };
