"use client";

import { redirect } from "next/navigation";
import { useWorldStore } from "@/store/world.store";

export default function Home() {
	const { phase } = useWorldStore();

	switch (phase) {
		case "MAP":
			return redirect("/world");
		case "BATTLE":
			return redirect("/battle");
		case "CAMP":
			return redirect("/camp");
		case "REWARD":
			return redirect("/reward");
	}
}
