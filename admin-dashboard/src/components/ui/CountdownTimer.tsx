"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

export default function CountdownTimer({ targetDate, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    function update() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setExpired(true); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (expired) {
    return <span className={`text-[#00E5FF] font-semibold ${className}`}>بدأت الآن!</span>;
  }

  return (
    <div className={`flex items-center gap-1.5 direction-ltr ${className}`}>
      <TimeUnit value={timeLeft.days} label="ي" />
      <span className="text-[#6B7280]">:</span>
      <TimeUnit value={timeLeft.hours} label="س" />
      <span className="text-[#6B7280]">:</span>
      <TimeUnit value={timeLeft.minutes} label="د" />
      <span className="text-[#6B7280]">:</span>
      <TimeUnit value={timeLeft.seconds} label="ث" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-0.5">
      <span className="text-[#00E5FF] font-bold tabular-nums text-sm min-w-[18px] text-center">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-[#6B7280]">{label}</span>
    </div>
  );
}
