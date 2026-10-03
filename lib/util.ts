export const STARS = Array.from({ length: 220 }, (_, i) => {
  // Deterministic pseudo-random value based on the index
  const random = (seed: number) => {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };

  const r1 = random(i + 1);
  const r2 = random(i + 1000);
  const r3 = random(i + 2000);
  const r4 = random(i + 3000);

  return {
    id: i,
    top: `${(r1 * 100).toFixed(2)}%`,
    left: `${(r2 * 100).toFixed(2)}%`,
    w: r3 < 0.6 ? 1 : r3 < 0.85 ? 1.5 : 2,
    opacity: parseFloat((0.08 + r4 * 0.45).toFixed(2)),
    amber: random(i + 4000) < 0.05,
  };
});