import React, { useEffect, useState } from "react";

export default function Preloader({ brand = "Writely" }) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHide(true), 1200); 
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`fixed inset-0 z-[9999] grid place-items-center bg-black text-white
        transition-opacity duration-500 ${hide ? "opacity-0 pointer-events-none" : ""}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-end gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-16 bg-white animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1.2s",
                animationIterationCount: "infinite",
              }}
            />
          ))}
        </div>
        <div className="text-sm tracking-wide opacity-80">{brand}</div>
      </div>
    </div>
  );
}
