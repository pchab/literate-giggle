import type { Card } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import { singleTargetPattern } from "../data/attackPattern.data";
import type {
	BoundingBox,
	SurfaceData,
	SurfaceType,
} from "../domain/grid.type";
import type { BattleGet, BattleSet } from "../store/battle.store";
import { getAnchorTarget } from "./ai.targeting.helpers";
import { resolveTargets } from "./effects/effect.helpers";
import { resolvers } from "./effects/effect.resolvers";
import {
	doBoundingBoxesIntersect,
	filterGridByAttackPattern,
	getClosestOriginTile,
	getDistanceToBoundingBox,
} from "./grid.helpers";

export const resolveSurfacesTriggered =
	(get: BattleGet, set: BattleSet, isSimulation: boolean) =>
	async ({ unit }: { unit: BattleUnit }) => {
		const { surfaces: draftSurfaces } = get();
		const processedSurfaceTypes = new Set<SurfaceType>();
		let surfacesChanged = false;
		const nextSurfaces = { ...draftSurfaces };

		for (const surface of Object.values(draftSurfaces)) {
			if (!doBoundingBoxesIntersect(unit, surface)) continue;
			if (unit.surfaceImmunities?.includes(surface.type)) continue;

			if (processedSurfaceTypes.has(surface.type)) continue;
			processedSurfaceTypes.add(surface.type);

			if (surface.onStep) {
				!isSimulation && console.log({ unit, card: surface.onStep });
				await resolveSurfaceCard(
					get,
					set,
					isSimulation,
				)({ surface, target: unit, card: surface.onStep });
			}

			const targetSurface = nextSurfaces[surface.id];
			if (targetSurface && targetSurface.charges !== undefined) {
				targetSurface.charges -= 1;
				surfacesChanged = true;
				if (targetSurface.charges <= 0) {
					delete nextSurfaces[surface.id];
				}
			}
		}

		if (surfacesChanged) {
			set((prev) => ({ ...prev, surfaces: nextSurfaces }));
		}
	};

export const resolveSurfaceCard =
	(get: BattleGet, set: BattleSet, isSimulation = false) =>
	async ({
		surface,
		target,
		card,
	}: {
		surface: SurfaceData;
		target: BoundingBox;
		card: Card;
	}) => {
		const { gridSize, removedCells, units } = get();
		const attackerPosition = surface.focalPoint ?? surface;
		const phantomCaster: BattleUnit = {
			id: `surface_${surface.id}`,
			...attackerPosition,
		} as BattleUnit;

		// ==========================================
		// 1. PREPARE THE ATTACK
		// ==========================================
		const distanceToTarget = getDistanceToBoundingBox({
			caster: phantomCaster,
			target,
		});

		if (card.aiTargetPreference !== "self" && distanceToTarget > card.range) {
			return;
		}

		const attackOrigin = getClosestOriginTile({
			caster: phantomCaster,
			anchorTarget: target,
		});
		!isSimulation && console.log({ target, attackOrigin });

		// Handle LoS interception
		const anchorTarget = getAnchorTarget({
			attacker: { gridPosition: attackOrigin, id: phantomCaster.id },
			card,
			intendedTarget: target,
			obstacles: units,
		});

		const targetedCells = filterGridByAttackPattern({
			pattern: card.aoePattern ?? singleTargetPattern,
			targetPos: anchorTarget,
			originPos: attackOrigin,
			gridSize,
			removedCells,
		});

		// ==========================================
		// 2. RESOLVE EFFECTS
		// ==========================================
		!isSimulation && console.log({ anchorTarget });
		const lockedTargets = card.effects.map((effect) =>
			resolveTargets(
				effect.target,
				anchorTarget,
				phantomCaster,
				units,
				targetedCells,
			),
		);
		!isSimulation && console.log({ lockedTargets });

		for (let i = 0; i < card.effects.length; i++) {
			const effect = card.effects[i];
			await resolvers(get, set, isSimulation)(effect)({
				anchorTarget,
				caster: phantomCaster,
				patternCells: targetedCells,
				targetIds: lockedTargets[i],
			});
		}
	};
