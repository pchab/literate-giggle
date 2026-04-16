"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingAsset from "@/modules/shared/components/LoadingAsset";
import { useRegistryStore } from "@/modules/shared/store/registry.store";
import type { UnitBlueprint } from "@/modules/units/domain/units.type";
import { useUnitEditorStore } from "../store/unitEditor.store";

export function UnitProvider({ children }: { children: React.ReactNode }) {
	const { unitId } = useParams() as { unitId: UnitBlueprint["id"] };
	const { loadDraft, updateDraft } = useUnitEditorStore();
	const { getUnit } = useRegistryStore();
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		let isMounted = true;
		const existingUnit = getUnit(unitId);

		const bootEngine = async () => {
			if (existingUnit) {
				loadDraft(existingUnit);
			} else {
				updateDraft({
					id: unitId,
					spriteBase: `/units/${unitId}`,
				});
			}

			if (isMounted) {
				setIsReady(true);
			}
		};

		bootEngine();

		return () => {
			isMounted = false;
		};
	}, [getUnit, loadDraft, updateDraft, unitId]);

	if (!isReady) {
		return <LoadingAsset assetName="unit" />;
	}

	return <>{children}</>;
}
