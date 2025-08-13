import React from "react";
export default function Section({ title, subtitle, right, children }) {
  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
        </div>
        {right}
      </header>
      {children}
    </section>
  );
}
