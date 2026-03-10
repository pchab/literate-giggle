import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const archerCards: Record<Card["id"], Card> = {
    [cardId("archer-placeholder")]: {
        id: cardId("archer-placeholder"),
        name: "Archer Placeholder",
        range: 1,
        image: "/cards/archer.png",
        playRequirement: "requires_enemy",
        effects: [{ type: "damage", amount: 4, target: "anchor" }],
    },

    [cardId("archer_weapon")]: {
        id: cardId("archer_weapon"),
        name: "Archer Weapon",
        range: 2,
        image: "/cards/archer.png",
        playRequirement: "requires_enemy",
        effects: [{ type: "damage", amount: 6, target: "anchor" }],
    },
};