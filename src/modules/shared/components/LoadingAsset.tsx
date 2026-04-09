export default function LoadingAsset({ assetName }: { assetName: string }) {
	return (
		<div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950 text-zinc-200">
			<div className="relative flex flex-col items-center gap-6">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-800 border-t-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
				<div className="flex flex-col items-center">
					<h1 className="text-xl font-bold tracking-widest text-zinc-100">
						LOADING DATABASE
					</h1>
					<p className="text-xs font-mono text-zinc-500 mt-2 animate-pulse">
						Fetching {assetName} assets
					</p>
				</div>
			</div>
		</div>
	);
}
