// src/modules/system/components/SystemMenu.tsx
import { useRouter } from "next/navigation";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import { SaveSlotList } from "@/modules/saves/SaveSlotList";
import { RetroButton } from "@/modules/shared/components/RetroButton";
import { useWorldStore } from "@/modules/world/store/world.store";

export function SystemMenu() {
	const router = useRouter();

	const handleSaveGame = () => {
		const worldState = useWorldStore.getState();
		const campaignState = useCampaignStore.getState();

		const savePayload = {
			version: "0.1.0",
			timestamp: new Date().toISOString(),
			world: worldState,
			campaign: campaignState,
		};

		const blob = new Blob([JSON.stringify(savePayload, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `hobo_to_hero_save_${Date.now()}.json`;
		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="flex flex-col items-center h-full w-full gap-6 p-8 overflow-y-auto">
			<div className="text-center">
				<h2 className="text-4xl font-pixel text-yellow-500 mb-2 uppercase tracking-widest text-shadow-pixel">
					Save Game
				</h2>
				<p className="text-zinc-500 font-mono text-sm max-w-md mx-auto">
					Saves stay in this browser. Load one here or from the title screen.
				</p>
			</div>

			<SaveSlotList canSave onLoaded={() => router.push("/")} />

			<div className="flex flex-col items-center gap-2 mt-4">
				<RetroButton
					onClick={handleSaveGame}
					variant="default"
					className="w-64"
				>
					Export Save File
				</RetroButton>
				<p className="text-zinc-600 font-mono text-xs">
					Download a copy to keep or move to another device.
				</p>
			</div>
		</div>
	);
}
