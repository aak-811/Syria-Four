"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [text, setText] = useState("--");

  useEffect(() => {
    function tick() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return setText("انتهى");
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      if (d > 0) setText(`${d}ي ${h}س`);
      else if (h > 0) setText(`${h}:${String(m).padStart(2, "0")}`);
      else setText(`${m}د`);
    }
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [targetDate]);

  return <span className="tabular-nums">{text}</span>;
}
