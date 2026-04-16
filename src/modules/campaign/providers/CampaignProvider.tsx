"use client";

import { useEffect, useState } from "react";
import LoadingAsset from "@/modules/shared/components/LoadingAsset";
import { useRegistryStore } from "@/modules/shared/store/registry.store";

export function CampaignProvider({ children }: { children: React.ReactNode }) {
	const [isReady, setIsReady] = useState(false);
	const initRegistry = useRegistryStore((state) => state.initRegistry);

	useEffect(() => {
		let isMounted = true;

		const bootEngine = async () => {
			await initRegistry();

			if (isMounted) {
				setIsReady(true);
			}
		};

		bootEngine();

		return () => {
			isMounted = false;
		};
	}, [initRegistry]);

	if (!isReady) {
		return <LoadingAsset assetName="campaign" />;
	}

	return <>{children}</>;
}
