import { BattleGrid } from "@/modules/battle/components/BattleGrid";
import type { Encounter } from "@/modules/campaign/domain/encounters.type";
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
		817,
	);

	return (
		<section
			className="h-full w-full flex flex-col"
			style={{
				backgroundImage,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="flex-1 flex items-center justify-center p-8">
				<BattleGrid encounterId={encounterId} />
			</div>
		</section>
	);
}
