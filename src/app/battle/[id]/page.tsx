import { BattleGrid } from "@/modules/battle/components/BattleGrid";
import BattleTurns from "@/modules/battle/components/BattleTurns";
import type { Encounter } from "@/modules/campaign/domain/encounters.type";
import { MotionCamera } from "@/modules/shared/components/MotionCamera";
import { getBackgroundImage } from "@/modules/shared/helpers/backgroundImage.helpers";

export default async function BattleScreen({
	params,
	searchParams,
}: {
	params: Promise<{ id: Encounter["id"] }>;
	searchParams: Promise<{ background: string }>;
}) {
	const { id: encounterId } = await params;
	const { background } = await searchParams;

	const backgroundImage = getBackgroundImage(
		`/battlegrounds/${background}.webp`,
		1200,
		800,
	);

	return (
		<section className="h-full w-full">
			<MotionCamera background={backgroundImage}>
				<BattleGrid />
			</MotionCamera>

			<div className="absolute top-0 right-0">
				<BattleTurns encounterId={encounterId} />
			</div>
		</section>
	);
}
