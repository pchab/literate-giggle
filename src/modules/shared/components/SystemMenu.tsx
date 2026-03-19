// src/modules/system/components/SystemMenu.tsx
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import { RetroButton } from "@/modules/shared/components/RetroButton";
import { useWorldStore } from "@/modules/world/store/world.store";

export function SystemMenu() {
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
		<div className="flex flex-col items-center justify-center h-full w-full gap-8 p-8">
			<div className="text-center mb-8">
				<h2 className="text-4xl font-pixel text-yellow-500 mb-4 uppercase tracking-widest text-shadow-pixel">
					System Options
				</h2>
				<p className="text-zinc-500 font-mono text-sm max-w-md mx-auto">
					Download your current campaign progress to your device. You can import
					this file from the main menu to resume your journey.
				</p>
			</div>

			<RetroButton onClick={handleSaveGame} variant="primary" className="w-64">
				Export Save File
			</RetroButton>
		</div>
	);
}
