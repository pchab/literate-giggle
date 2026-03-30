import { useBattleStore } from "@/modules/battle/store/battle.store";
import { isUnitInTile } from "../helpers/grid.helpers";

export function ProjectedCasualtyIcon({ unitId }: { unitId: string }) {
	const isDying = useBattleStore(
		({ units, hoveredCell, shadowStateDiff: { projectedCasualties } }) => {
			if (projectedCasualties.includes(unitId)) return true;

			if (hoveredCell) {
				const hoveredUnit = units.find(isUnitInTile(hoveredCell));
				if (hoveredUnit && projectedCasualties.includes(unitId)) {
					return true;
				}
			}
			return false;
		},
	);

	if (!isDying) return null;

	return (
		<div className="absolute -top-2 -right-2 text-red-500 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-xl pointer-events-none">
			☠
		</div>
	);
}
