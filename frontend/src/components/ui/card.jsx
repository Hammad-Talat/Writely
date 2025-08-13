import React from "react";
export default function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl bg-white/7 p-5 ring-1 ring-white/10 backdrop-blur shadow ${className}`}>
      {children}
    </div>
  );
}
