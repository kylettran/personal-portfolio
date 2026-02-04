 "use client";

import Link from "next/link";
import { useEffect } from "react";
import Particles from "./components/particles";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default function Home() {
  useEffect(() => {
    const root = document.documentElement;
    const scrollY = window.scrollY;
    document.body.style.setProperty("--home-scroll-y", `${scrollY}px`);
    document.body.classList.add("home-lock-scroll");
    root.classList.add("home-lock-scroll");
    const preventScroll = (event: TouchEvent) => {
      if (document.body.classList.contains("home-lock-scroll")) {
        event.preventDefault();
      }
    };
    document.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      document.removeEventListener("touchmove", preventScroll);
      document.body.classList.remove("home-lock-scroll");
      root.classList.remove("home-lock-scroll");
      const stored = document.body.style.getPropertyValue("--home-scroll-y");
      document.body.style.removeProperty("--home-scroll-y");
      const restore = stored ? parseInt(stored, 10) : 0;
      window.scrollTo(0, restore);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <nav className="my-16 animate-fade-in">
        <ul className="flex items-center justify-center gap-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </nav>
      <div className="w-screen h-px animate-glow animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <Particles
        className="absolute inset-0 -z-10 animate-fade-in"
        quantity={100}
      />
      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text">
        Kyle Tran
      </h1>

      <div className="w-screen h-px animate-glow animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="my-16 text-center animate-fade-in">
        <h2 className="text-sm text-zinc-500 ">
          Empowering {" "}
          <Link
            target="_blank"
            href="https://discord.com/invite/XHUyAQb3"
            className="underline duration-500 hover:text-zinc-300"
          >
            non-technical builders
          </Link> to build.
        </h2>
      </div>
    </div>
  );

}
