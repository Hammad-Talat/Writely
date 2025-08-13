import React, { useMemo } from "react";

const PHRASES = [
  "writer’s block?",
  "what’s the hook?",
  "is it clear?",
  "need a better title?",
  "does it scale?",
  "is the tone right?",
  "ready to publish?",
  "how would you test it?",
];

const makeRows = (count) => {
  if (count <= 1) return [50];
  const min = 16, max = 84;                 
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => +(min + i * step).toFixed(2));
};

export default function FloatingWords({
  rows = 4,
  duration = 8,      
  amp = 6,           
  rot = 0.25,        
}) {
  const data = useMemo(() => {
    const tops = makeRows(rows);

    const offset = rows > 1 ? (tops[1] - tops[0]) / 2 : 0;

    const leftP  = tops.map((_, i) => PHRASES[i % PHRASES.length]);
    const rightP = tops.map((_, i) => PHRASES[(i + rows) % PHRASES.length]);

    const pairs = tops.flatMap((top, i) => {
      const phase = (i / rows) * duration;
      return [
        { id: `L${i}`, text: leftP[i],  col: "left",  top,            delay: `-${phase.toFixed(2)}s` },
        { id: `R${i}`, text: rightP[i], col: "right", top: Math.min(92, top + offset), delay: `-${(phase + duration/3).toFixed(2)}s` },
      ];
    });

    return pairs;
  }, [rows, duration]);

  return (
    <div
      aria-hidden
      className="
        pointer-events-none absolute inset-0 overflow-hidden
        grid
        [grid-template-columns:1fr_minmax(26rem,32rem)_1fr]  /* left | reserved center | right */
        px-6 sm:px-10
      "
    >
      <div className="relative col-[1] h-full">
        {data.filter(d => d.col === "left").map(d => (
          <span
            key={d.id}
            className="
              floating-fixed absolute left-0 -translate-x-[2%]
              font-extrabold text-white/90 tracking-wide whitespace-nowrap leading-none
            "
            style={{
              top: `${d.top}%`,
              fontSize: "clamp(1.2rem, 1.4vw + 1rem, 2.6rem)",
              animationDuration: `${duration}s`,
              animationDelay: d.delay,
              "--amp": `${amp}px`,
              "--rot": `${rot}deg`,
            }}
          >
            {d.text}
          </span>
        ))}
      </div>

      <div className="relative col-[3] h-full">
        {data.filter(d => d.col === "right").map(d => (
          <span
            key={d.id}
            className="
              floating-fixed absolute right-0 translate-x-[2%] text-right
              font-extrabold text-white/90 tracking-wide whitespace-nowrap leading-none
            "
            style={{
              top: `${d.top}%`,
              fontSize: "clamp(1.2rem, 1.4vw + 1rem, 2.6rem)",
              animationDuration: `${duration}s`,
              animationDelay: d.delay,
              "--amp": `${amp}px`,
              "--rot": `${rot}deg`,
            }}
          >
            {d.text}
          </span>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/55 via-transparent to-neutral-950/65" />
    </div>
  );
}
