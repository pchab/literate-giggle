import type { Summon } from "../../domain/figures.type";
import { summonId } from "../../helpers/figures.helpers";
import { briarWolf } from "../monsters/briar-wolf";
import { skeleton } from "../monsters/skeleton.data";
import { arcaneWisp } from "./arcaneWisp";
import { iceWall } from "./iceWall";

export const summonLibrary: Record<
	string,
	Omit<Summon, "id" | "gridPosition" | "allegiance" | "currentHp" | "statuses">
> = {
	[summonId("ice-wall")]: iceWall,
	[summonId("skeleton")]: skeleton,
	[summonId("briar-wolf")]: briarWolf,
	[summonId("arcane-wisp")]: arcaneWisp,
};
