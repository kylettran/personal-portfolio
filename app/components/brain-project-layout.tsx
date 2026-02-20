"use client";

import React from "react";
import { BrainOrb } from "./brain-orb";

export function BrainProjectLayout() {
  return (
    <div className="grid w-full items-start gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-center">
      <div className="order-1">
        <BrainOrb />
      </div>
      <div className="order-2 lg:pt-6">
        <h2 className="text-2xl font-semibold text-white">What you are seeing</h2>
        <p className="mt-4 text-base leading-7 text-white/70">
          This interactive artifact starts as a tech-inspired silhouette. It cycles
          through internal neuron fibers and a skeletal wiring state while you
          rotate it. Scroll to amplify the motion.
        </p>
        <h2 className="mt-10 text-2xl font-semibold text-white">Intent</h2>
        <p className="mt-4 text-base leading-7 text-white/70">
          I wanted a piece that feels alive: a calm exterior that opens into a
          dense, colorful wiring once you engage with it. The idea is to make
          curiosity the trigger for depth.
        </p>
      </div>
    </div>
  );
}
