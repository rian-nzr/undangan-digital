import React, { useState, useEffect } from "react";

interface CountdownProps {
  targetDateStr?: string; // default to '2026-09-05T10:00:00'
}

export const Countdown: React.FC<CountdownProps> = ({ targetDateStr = "2026-09-05T10:00:00" }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const targetDate = new Date(targetDateStr).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  const timeUnits = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <div id="countdown-wrapper" className="flex flex-col items-center justify-center w-full my-8">
      {timeLeft.isOver ? (
        <div className="text-center bg-editorial-ivory border border-editorial-charcoal/10 px-8 py-5">
          <p className="font-serif text-lg font-medium text-editorial-charcoal tracking-wide">
            Acara Sedang / Telah Berlangsung 🎉
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-editorial-accent mt-2">
            Sabtu, 5 September 2026 • 10.00 am
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 max-w-sm w-full px-2">
          {timeUnits.map((unit, index) => (
            <div
              key={unit.label}
              id={`countdown-unit-${unit.label.toLowerCase()}`}
              className="flex flex-col items-center justify-center bg-editorial-ivory border border-editorial-charcoal/10 p-4 transition-colors duration-300 relative"
            >
              <span className="font-mono text-2xl md:text-3xl font-light text-editorial-charcoal tracking-tighter">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-editorial-accent mt-2 block">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
