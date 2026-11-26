import type { BattleGet, BattleSet } from "@/modules/battle/store/battle.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Status } from "./status.type";
import type { BattleUnit } from "./units.type";

export type PassiveContext = {
	get: BattleGet;
	set: BattleSet;
	isSimulation: boolean;
	/** The unit that owns the passive. */
	owner: BattleUnit;
};

export type PassiveHooks = {
	/** Static tweak applied once, when the battle hand is built. */
	modifyCard?: (card: Card) => Card;

	/** Owner is the source of a direct hit. Returns the new damage amount. */
	modifyOutgoingDamage?: (
		ctx: PassiveContext,
		params: { target: BattleUnit; amount: number },
	) => number;

	/** Called on every unit with passives whenever anyone takes non-true damage. Returns the new damage amount. */
	modifyIncomingDamage?: (
		ctx: PassiveContext,
		params: { target: BattleUnit; amount: number },
	) => number;

	/** Broadcast to every unit with passives after any unit loses HP. */
	onAnyDamaged?: (
		ctx: PassiveContext,
		params: {
			target: BattleUnit;
			hpLost: number;
			sourceId?: string;
			isDirectHit?: boolean;
		},
	) => Promise<void>;

	/** Owner dealt the killing blow. */
	onKill?: (
		ctx: PassiveContext,
		params: { victim: BattleUnit },
	) => Promise<void>;

	/** Owner healed a target beyond its max HP. Returned statuses are added to the target. */
	onOverheal?: (
		ctx: PassiveContext,
		params: { target: BattleUnit; overflow: number },
	) => Status[];

	/** Start of the owner's side turn (the player turn, for heroes). */
	onTurnStart?: (ctx: PassiveContext) => Promise<void>;
};

export type PassiveDefinition = {
	id: string;
	name: string;
	icon: string;
	description: string;
	hooks: PassiveHooks;
};
