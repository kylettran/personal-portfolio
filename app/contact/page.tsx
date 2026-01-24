"use client";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";

const XIcon = () => (
	<svg
		viewBox="0 0 24 24"
		width="20"
		height="20"
		fill="currentColor"
	>
		<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
	</svg>
);

const socials = [
	{
		icon: <Linkedin size={20} />,
		href: "https://www.linkedin.com/in/kyletran01/",
		label: "LinkedIn",
		handle: "Profile",
	},
	{
		icon: <Github size={20} />,
		href: "https://github.com/kylettran",
		label: "Github",
		handle: "Kyle Tran",
	},
	{
		icon: <XIcon />,
		href: "https://twitter.com/kylettran",
		label: "X",
		handle: "@kyle_trxn",
	},
];

export default function Example() {
	return (
		<div className=" bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
			<Navigation />
			<div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
				<div className="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-4 lg:gap-16">
					{/* Portrait Card */}
					<Card>
						<div className="relative w-full h-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] overflow-hidden">
							<Image
								src="/portrait.JPEG"
								alt="Kyle Tran"
								fill
								className="object-cover object-[center_25%]"
							/>
						</div>
					</Card>

					{socials.map((s) => (
						<Card key={s.label}>
							<Link
								href={s.href}
								target="_blank"
								className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 lg:pb-48 md:p-16"
							>
								<span
									className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
									aria-hidden="true"
								/>
								<span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
									{s.icon}
								</span>{" "}
								<div className="z-10 flex flex-col items-center text-center">
									<span className="lg:text-xl font-medium duration-150 xl:text-3xl text-zinc-200 group-hover:text-white font-display text-center">
										{s.handle}
									</span>
									<span className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
										{s.label}
									</span>
								</div>
							</Link>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}