import { singleTargetPattern } from "@/modules/battle/data/attackPattern.data";
import { Monster } from "../../domain/figures.type";

export const briarWolf: Omit<
    Monster,
    "id" | "currentHp" | "gridPosition" | "intent"
> = {
    enemyType: "BRIAR_WOLF",
    spriteBase: "monsters/briar_wolf",
    maxHp: 8,
    baseMove: 3,
    baseDef: 0,
    currentBlock: 0,
    xpReward: 5,
    attacks: [
        {
            id: "bite",
            name: "Bite",
            target: "lowestHp",
            pattern: singleTargetPattern,
            move: 3,
            damage: 3,
            minRange: 1,
            maxRange: 1,
        },
    ],
};