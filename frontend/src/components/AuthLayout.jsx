import React from "react";
import FloatingWords from "./Floatingwords";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-[100dvh] w-full bg-neutral-950 text-white">
      <header className="fixed inset-x-0 top-0 z-30 h-16">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-8">
          <div className="text-base font-semibold tracking-wide">Writely</div>
          <div className="hidden text-sm opacity-80 sm:block">
            A home for writers &amp; readers
          </div>
        </div>
      </header>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingWords />
      </div>

      <main className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl items-center justify-center px-6 pb-10 pt-16 sm:px-8">
        <div className="w-full max-w-md rounded-2xl bg-white/5 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur">
          {children}
        </div>
      </main>
    </div>
  );
}
