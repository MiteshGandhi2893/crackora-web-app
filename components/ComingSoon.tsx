import { useEffect, useState } from "react";

export function ComingSoon() {
  const text = "COMING SOON";
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h3 className="text-xl sm:text-2xl font-bold text-cyan-700 tracking-widest">
        {displayed}
        <span className="animate-pulse">|</span>
      </h3>

      <p className="text-xs text-amber-600 mt-2">
        We’re building something powerful for you 🚀
      </p>
    </div>
  );
}