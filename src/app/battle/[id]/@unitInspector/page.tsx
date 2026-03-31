"use client";

import { motion } from "framer-motion";
import { useShallow } from "zustand/shallow";
import { isUnitInTile } from "@/modules/battle/helpers/grid.helpers";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import {
	isHero,
	isMonster,
	isSummon,
} from "@/modules/figures/helpers/figures.helpers";
import EnemyIntentSidebar from "./enemyIntent";
import HeroStatusSidebar from "./heroStatus";

export default function UnitInspector() {
	const { units, hoveredCell } = useBattleStore(
		useShallow((state) => ({
			units: state.units,
			hoveredCell: state.hoveredCell,
		})),
	);

	const unit = hoveredCell && units.find(isUnitInTile(hoveredCell));

	if (!hoveredCell || !unit) {
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

	if (isHero(unit)) {
		return <HeroStatusSidebar hero={unit} />;
	}

	if (isMonster(unit) || isSummon(unit)) {
		return <EnemyIntentSidebar aiUnit={unit} />;
	}
}
