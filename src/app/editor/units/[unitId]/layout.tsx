import { UnitProvider } from "@/modules/unit-editor/providers/UnitProvider";

export default function UnitEditorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <UnitProvider>{children}</UnitProvider>;
}
