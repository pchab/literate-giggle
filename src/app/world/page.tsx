"use client";

import { redirect } from "next/navigation";
import { ClassPromotionModal } from "@/modules/units/components/ClassPromotionModal";
import WorldMap from "@/modules/world/components/WorldMap";
import { useWorldStore } from "@/modules/world/store/world.store";

export default function WorldScreen() {
	const { phase } = useWorldStore();

	if (phase !== "MAP") {
		return redirect("/");
	}

	return (
		<>
			<WorldMap />

			<ClassPromotionModal />
		</>
	);
}
