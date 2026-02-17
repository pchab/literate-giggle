import { crossPattern, linePattern } from "./attacks";
import type { Monster } from "./figures.type";

export const testBoss: Monster = {
  id: 1,
  enemyType: "Boss",
  hp: 20,
  attacks: [
    {
      id: 1,
      target: "lowestHp",
      pattern: crossPattern,
      damage: 3,
    },
    {
      id: 2,
      target: "lowestPhysDef",
      pattern: linePattern,
      damage: 4,
    },
  ],
  intent: {
    id: 1,
    target: "lowestHp",
    pattern: crossPattern,
    damage: 3,
  },
};
