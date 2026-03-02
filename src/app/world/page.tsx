"use client";

import { redirect } from "next/navigation";
import WorldMap from "@/app/world/WorldMap";
import { useWorldStore } from "@/store/world.store";

export default function WorldScreen() {
	const { phase } = useWorldStore();

	if (phase !== "MAP") {
		return redirect("/");
	}

	return <WorldMap />;
}
