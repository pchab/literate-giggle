import type { UnitBlueprint } from "../../domain/figures.type";
import { summonId } from "../../helpers/figures.helpers";
import { briarWolf } from "../monsters/briar-wolf";
import { rat } from "../monsters/rat.data";
import { skeleton } from "../monsters/skeleton.data";
import { acidFlask } from "./acidFlask";
import { arcaneWisp } from "./arcaneWisp";
import { barrel } from "./barrel";
import { iceWall } from "./iceWall";

export const summonLibrary: Record<string, UnitBlueprint> = {
	[summonId("barrel")]: barrel,
	[summonId("ice-wall")]: iceWall,
	[summonId("rat")]: rat,
	[summonId("skeleton")]: skeleton,
	[summonId("briar-wolf")]: briarWolf,
	[summonId("arcane-wisp")]: arcaneWisp,
	[summonId("acid-flask")]: acidFlask,
};
