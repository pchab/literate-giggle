import { cardId } from "@/modules/cards/helpers/cards.helper";
import { type Summon, UnitStance } from "../../domain/figures.type";

export const arcaneWisp: Omit<
	Summon,
	"id" | "currentHp" | "statuses" | "gridPosition" | "allegiance"
> = {
	spriteBase: "summons/arcane_wisp",
	stance: UnitStance.IDLE,
	maxHp: 5,
	baseDef: 0,
	baseMove: 3,
	intentPool: [{ cardId: cardId("wisp_zap"), weight: 1 }],
};
