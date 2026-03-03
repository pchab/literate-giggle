import { redirect } from "next/navigation";
import SceneComponent from "@/modules/campaign/components/Scene";
import { SCENE_DB } from "@/modules/campaign/data/scenes.data";
import type { Scene } from "@/modules/campaign/domain/scenes.type";

export default async function ScenePage({
	params,
}: {
	params: Promise<{ id: Scene["id"] }>;
}) {
	const { id } = await params;
	const scene = SCENE_DB[id];

	if (!scene) {
		console.error(`Scene ${id} not found!`);
		return redirect("/");
	}

	const currentStep = scene.steps[scene.initialStepId];
	if (!currentStep) return null;

	return (
		<main className="relative w-screen h-screen overflow-hidden bg-zinc-950 flex flex-col justify-end pb-12 px-4 md:px-24 text-zinc-200">
			{/* 1. BACKGROUND LAYER */}
			<SceneComponent scene={scene} />
		</main>
	);
}
