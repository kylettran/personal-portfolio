"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export const Navigation: React.FC = () => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header ref={ref}>
			<div
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 border-b  ${
					isIntersecting
						? "bg-zinc-900/0 border-transparent"
						: "bg-zinc-900/500  border-zinc-800 "
				}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between px-6 py-3 mx-auto">
					<div className="flex items-center gap-4">
						<Link
							href="/projects"
							className="py-3 px-2 duration-200 text-zinc-400 hover:text-zinc-100 min-h-[44px] flex items-center"
						>
							Projects
						</Link>
						<Link
							href="/contact"
							className="py-3 px-2 duration-200 text-zinc-400 hover:text-zinc-100 min-h-[44px] flex items-center"
						>
							Contact
						</Link>
					</div>

					<Link
						href="/"
						className="py-3 px-2 duration-200 text-zinc-300 hover:text-zinc-100 min-h-[44px] flex items-center"
					>
						<ArrowLeft className="w-6 h-6" />
					</Link>
				</div>
			</div>
		</header>
	);
};
