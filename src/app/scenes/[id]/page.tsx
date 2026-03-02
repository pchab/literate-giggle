import { redirect } from "next/navigation";
import { SCENE_DB } from "@/modules/quests/domain/scenes.data";
import { Scene } from "@/modules/quests/domain/scenes.type";
import SceneComponent from "./Scene";

// Next.js 15+ standard for unwrapping dynamic route params
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
