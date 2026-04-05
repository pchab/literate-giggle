import Image from "next/image";
import type React from "react";
import { useRef, useState } from "react";

interface ImageUploadAreaProps {
	label: string;
	currentImage?: string;
	onImageChange: (imageUrl: string, file: File) => void;
}

export function ImageUploadArea({
	label,
	currentImage,
	onImageChange,
}: ImageUploadAreaProps) {
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFile = (file: File) => {
		if (!file.type.startsWith("image/")) return;

		// Create a temporary local URL for immediate preview
		const objectUrl = URL.createObjectURL(file);
		onImageChange(objectUrl, file);
	};

	const onDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const onDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const onDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			handleFile(e.dataTransfer.files[0]);
		}
	};

	return (
		<div className="flex flex-col mb-4">
			<span className="text-sm font-semibold text-zinc-400 mb-1">{label}</span>

			<button
				type="button"
				onClick={() => fileInputRef.current?.click()}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
				className={`
          relative flex flex-col items-center justify-center w-card h-card
          border-2 border-dashed rounded-lg cursor-pointer overflow-hidden
          transition-colors duration-200 group
          ${
						isDragging
							? "border-blue-500 bg-blue-900/20"
							: "border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-500"
					}
        `}
			>
				{currentImage ? (
					<>
						<Image
							src={currentImage}
							alt="Preview"
							fill
							className="object-cover opacity-80 group-hover:opacity-50 transition-opacity"
						/>
						<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
							<span className="bg-zinc-900/80 text-white text-xs font-bold px-3 py-1 rounded backdrop-blur-sm shadow-xl">
								Replace Image
							</span>
						</div>
					</>
				) : (
					<div className="flex flex-col items-center text-zinc-500 group-hover:text-zinc-300">
						<svg
							className="w-8 h-8 mb-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Image Upload Area</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<span className="text-xs font-semibold">
							Click or drag image here
						</span>
					</div>
				)}
			</button>

			<input
				type="file"
				ref={fileInputRef}
				onChange={(e) => {
					if (e.target.files && e.target.files.length > 0) {
						handleFile(e.target.files[0]);
					}
				}}
				accept="image/*"
				className="hidden"
			/>
		</div>
	);
}
