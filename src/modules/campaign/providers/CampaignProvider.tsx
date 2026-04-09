"use client";

import LoadingAsset from "@/modules/shared/components/LoadingAsset";
import { useRegistryStore } from "@/modules/shared/store/registry.store";
import { useEffect, useState } from "react";

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
