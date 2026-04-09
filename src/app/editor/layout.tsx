import { CampaignProvider } from "@/modules/campaign/providers/CampaignProvider";

export default function EditorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <CampaignProvider>{children}</CampaignProvider>;
}
