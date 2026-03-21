"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const slides = [
  { src: "/lynx-hero.png", alt: "Lynx Combinator — program overview" },
  { src: "/lynx-products.png", alt: "What students build" },
  { src: "/lynx-dashboard.png", alt: "Live data & outcomes dashboard" },
  { src: "/lynx-about.png", alt: "Founder section" },
];

export function LynxCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  return (
    <div className="not-prose my-10 w-full flex flex-col items-center gap-3">
      {/* Carousel viewport */}
      <div className="relative w-full max-w-3xl mx-auto group">
        <div
          className="overflow-hidden rounded-xl border border-zinc-200 cursor-grab active:cursor-grabbing"
          ref={emblaRef}
        >
          <div className="flex touch-pan-y">
            {slides.map((slide) => (
              <div key={slide.src} className="flex-[0_0_100%] min-w-0">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-auto object-cover block select-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Prev button */}
        <button
          onClick={scrollPrev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md border border-zinc-200 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white disabled:opacity-30"
          disabled={!canScrollPrev}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next button */}
        <button
          onClick={scrollNext}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md border border-zinc-200 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white disabled:opacity-30"
          disabled={!canScrollNext}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "w-5 bg-zinc-800"
                : "w-1.5 bg-zinc-300 hover:bg-zinc-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
