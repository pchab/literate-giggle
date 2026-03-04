import { singleTargetPattern } from "@/modules/battle/data/attackPattern.data";
import type { Monster } from "../../domain/figures.type";

export const elvenWeaver: Omit<
    Monster,
    "id" | "currentHp" | "gridPosition" | "intent"
> = {
    enemyType: "ELVEN_WEAVER",
    spriteBase: "monsters/elven_weaver",
    maxHp: 12,
    baseMove: 3,
    baseDef: 0,
    currentBlock: 0,
    xpReward: 10,
    attacks: [
        {
            id: "water_whip",
            name: "Water Whip",
            target: "lowestHp",
            pattern: singleTargetPattern,
            move: 1,
            damage: 4,
            minRange: 1,
            maxRange: 1,
        },
    ],
};
