import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
	variable: "--font-pixel",
	weight: "400",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "The Long Road",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${vt323.variable} antialiased bg-zinc-950 text-zinc-100 font-sans h-screen w-screen overflow-hidden flex`}
			>
				{children}
			</body>
		</html>
	);
}
