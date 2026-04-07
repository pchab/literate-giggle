import { CLASS_REGISTRY } from "@/modules/units/data/heroClass.data";
import type {
	BattleHero,
	Monster,
	UnitBlueprint,
} from "@/modules/units/domain/units.type";
import { UnitStance } from "@/modules/units/domain/units.type";
import { heroId, monsterId } from "@/modules/units/helpers/units.helpers";
import type { BattleGet, BattleSet } from "../battle.store";

export const initUnitEditorTestBattle =
	(_: BattleGet, set: BattleSet) =>
	(draftUnit: UnitBlueprint, stance: UnitStance) => {
		const previewMonster: Monster = {
			...draftUnit,
			id: monsterId("preview_monster"),
			variant: "default",
			currentHp: draftUnit.maxHp,
			gridPosition: { col: 2, row: 2 },
			statuses: [],
			stance: stance,
			intentPool: draftUnit.intentPool,
		};

		const dummyHero: BattleHero = {
			id: heroId("dummy_hero"),
			name: "Target Dummy",
			spriteBase: CLASS_REGISTRY.HOBO.spriteBase,
			variant: "default",
			heroClass: CLASS_REGISTRY.HOBO.id,
			maxHp: 100,
			currentHp: 100,
			baseDef: 0,
			baseMove: 2,
			gridPosition: { col: 2, row: 4 },
			statuses: [],
			stance: UnitStance.IDLE,
			passives: [],
			hand: [null, null, null],
		};

		set(() => ({
			units: [previewMonster, dummyHero],
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
			battleStatus: "ONGOING",
		}));
	};
