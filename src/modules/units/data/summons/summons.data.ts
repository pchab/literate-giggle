import type { UnitBlueprint } from "../../domain/units.type";
import { summonId } from "../../helpers/units.helpers";
import { briarWolf } from "../monsters/briar-wolf";
import { rat } from "../monsters/rat.data";
import { skeleton } from "../monsters/skeleton.data";
import { acidFlask } from "./acidFlask";
import { arcaneWisp } from "./arcaneWisp";
import { iceWall } from "./iceWall";

export const summonLibrary: Record<string, UnitBlueprint> = {
	[summonId("ice_wall")]: iceWall,
	[summonId("rat")]: rat,
	[summonId("skeleton")]: skeleton,
	[summonId("briar-wolf")]: briarWolf,
	[summonId("arcane-wisp")]: arcaneWisp,
	[summonId("acid-flask")]: acidFlask,
};
