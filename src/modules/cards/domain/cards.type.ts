import type { Hero } from "../../figures/domain/figures.type";

export type CardAction = {
	type: "physAtt" | "physDef" | "magAtt" | "magDef" | "heal";
	value: number;
	move: number;
	range: number;
};

export type Card = {
	id: number;
	name: string;
	action: CardAction;
	xp: number;
	evolutions: Card["id"][];
};

export type CardLog = Record<Hero["id"], Record<Card["id"], number>>;
