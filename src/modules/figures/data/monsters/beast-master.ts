import { singleTargetPattern } from "@/modules/battle/data/attackPattern.data";
import { Monster } from "../../domain/figures.type";

export const beastMaster: Omit<
    Monster,
    "id" | "currentHp" | "gridPosition" | "intent"
> = {
    enemyType: "BEASTMASTER",
    spriteBase: "monsters/beast_master",
    maxHp: 18,
    baseMove: 2,
    baseDef: 0,
    currentBlock: 0,
    xpReward: 20,
    attacks: [
        {
            id: "call_of_the_wild",
            name: "Call of the Wild",
			target: "self",
			pattern: singleTargetPattern,
			move: 0,
			damage: 0,
			minRange: 0,
			maxRange: 0,
			summonType: "BRIAR_WOLF",
        },
        {
            id: "hunting_spear",
            name: "Hunting Spear",
            target: "lowestHp",
            pattern: singleTargetPattern,
            move: 1,
            damage: 5,
            minRange: 1,
            maxRange: 2,
        }
    ],
};