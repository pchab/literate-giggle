"use client";

import { CardProvider } from "@/modules/card-editor/providers/CardProvider";

export default function CardEditorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <CardProvider>{children}</CardProvider>;
}
