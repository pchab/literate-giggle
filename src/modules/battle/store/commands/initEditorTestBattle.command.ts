import type { BattleGet, BattleSet } from "@/modules/battle/store/battle.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import { CLASS_REGISTRY } from "@/modules/units/data/heroClass.data";
import { zombie } from "@/modules/units/data/monsters/zombie";
import { villager } from "@/modules/units/data/summons/villager";
import type {
	BattleHero,
	Monster,
	Summon,
} from "@/modules/units/domain/units.type";
import { UnitStance } from "@/modules/units/domain/units.type";
import {
	heroId,
	monsterId,
	summonId,
} from "@/modules/units/helpers/units.helpers";

export const initEditorTestBattle =
	(_: BattleGet, set: BattleSet) => (draftCard: Card) => {
		const mockHero: BattleHero = {
			id: heroId("test_hero"),
			name: "Test Subject",
			spriteBase: CLASS_REGISTRY.HOBO.spriteBase,
			variant: "default",
			heroClass: CLASS_REGISTRY.HOBO.id,
			maxHp: 100,
			currentHp: 100,
			baseDef: 0,
			baseMove: 3,
			gridPosition: { col: 2, row: 2 },
			statuses: [],
			stance: UnitStance.IDLE,
			passives: [],
			hand: [draftCard, null, null],
		};

		const dummyTarget: Monster = {
			id: monsterId("dummy_target"),
			...zombie,
			name: "Training Dummy",
			variant: "default",
			maxHp: 100,
			currentHp: 100,
			baseDef: 0,
			baseMove: 0,
			gridPosition: { col: 0, row: 0 },
			statuses: [],
			stance: UnitStance.IDLE,
			intentPool: [],
			xpReward: 0,
		};

		const mockAlly: Summon = {
			id: summonId("test_ally"),
			...villager,
			allegiance: "PLAYER",
			variant: "default",
			maxHp: 100,
			currentHp: 50,
			baseDef: 0,
			baseMove: 0,
			gridPosition: { col: 4, row: 0 },
			statuses: [],
			stance: UnitStance.IDLE,
			intentPool: [],
		};

		set(() => ({
			units: [mockHero, dummyTarget, mockAlly],
			surfaces: {},

			activeMoveHeroId: null,
			usedMovesThisTurn: {},
			activeHeroCard: null,
			hoveredHeroCard: null,
			usedCardsThisTurn: {},
			hoveredCell: null,

			currentVfx: {},

			aiIntents: {},
			aiStateDiff: {
				projectedMoves: {},
				projectedCasualties: [],
				projectedDamage: {},
				projectedHealing: {},
			},
			playerIntent: null,
			playerStateDiff: {
				projectedMoves: {},
				projectedCasualties: [],
				projectedDamage: {},
				projectedHealing: {},
			},

			xpEarned: 0,
			encounterId: null,
			gridSize: { cols: 5, rows: 5 },
			objectiveProgress: {},
			battleStatus: "ONGOING",
		}));
	};
