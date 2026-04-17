"use client";

import { motion } from "framer-motion";
import { useShallow } from "zustand/shallow";
import {
	doBoundingBoxesIntersect,
	isUnitInTile,
} from "@/modules/battle/helpers/grid.helpers";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import {
	isHero,
	isMonster,
	isSummon,
} from "@/modules/units/helpers/units.helpers";
import EnemyIntentSidebar from "./EnemyIntent";
import HeroStatusSidebar from "./HeroStatus";
import SurfaceInspectorSidebar from "./SurfaceInspector";

export default function UnitInspector() {
	const { units, surfaces, hoveredCell } = useBattleStore(
		useShallow((state) => ({
			units: state.units,
			surfaces: state.surfaces,
			hoveredCell: state.hoveredCell,
		})),
	);

	const unit = hoveredCell && units.find(isUnitInTile(hoveredCell));

	const surface =
		hoveredCell &&
		Object.values(surfaces).find((s) =>
			doBoundingBoxesIntersect(s, { gridPosition: hoveredCell }),
		);

	if (!hoveredCell || (!unit && !surface)) {
		return (
			<motion.div
				key="empty"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="flex items-center justify-center h-full border border-dashed border-zinc-800/50 rounded-lg text-zinc-600 text-xs uppercase tracking-widest font-bold"
			>
				Hover a target
			</motion.div>
		);
	}

	return (
		<div className="relative w-full h-full">
			{/* 1. PRIMARY INSPECTOR (Inside the h-64 box) */}
			<div className="w-full h-full">
				{unit && isHero(unit) && <HeroStatusSidebar hero={unit} />}
				{unit && (isMonster(unit) || isSummon(unit)) && (
					<EnemyIntentSidebar aiUnit={unit} />
				)}

				{/* If there is NO unit, the surface takes the primary spot */}
				{!unit && surface && <SurfaceInspectorSidebar surface={surface} />}
			</div>

			{/* 2. THE BREAKOUT BOX (If BOTH exist) */}
			{unit && surface && (
				<div className="absolute top-0 left-[calc(100%+2rem)] w-96 z-50 pointer-events-none">
					{/* We drop the Surface Inspector to the right of the aside, floating over the main layout */}
					<SurfaceInspectorSidebar surface={surface} />
				</div>
			)}
		</div>
	);
}
