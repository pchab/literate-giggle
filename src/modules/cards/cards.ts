import type { Card } from './cards.type';

export const shortSwordCard: Card = {
  id: 1,
  name: "Short Sword",
  action: {
    type: 'physAtt',
    value: 2,
    move: 0,
  },
};

export const woodenShieldCard: Card = {
  id: 2,
  name: "Wooden Shield",
  action: {
    type: 'physDef',
    value: 2,
    move: 2,
  },
};

export const arcaneBoltCard: Card = {
  id: 3,
  name: "Arcane Bolt",
  action: {
    type: 'magAtt',
    value: 2,
    move: 0,
  },
};

export const arcaneShieldCard: Card = {
  id: 4,
  name: "Arcane Shield",
  action: {
    type: 'magDef',
    value: 2,
    move: 2,
  },
};

export const bandageCard: Card = {
  id: 5,
  name: "Bandage",
  action: {
    type: 'heal',
    value: 2,
    move: 0,
  },
};