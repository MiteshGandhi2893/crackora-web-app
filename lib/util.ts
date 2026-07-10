export const STARS = Array.from({ length: 220 }, (_, i) => ({
  id: i,
  top: `${(Math.random() * 100).toFixed(2)}%`,
  left: `${(Math.random() * 100).toFixed(2)}%`,
  w: Math.random() < 0.6 ? 1 : Math.random() < 0.85 ? 1.5 : 2,
  opacity: parseFloat((0.08 + Math.random() * 0.45).toFixed(2)),
  amber: Math.random() < 0.05,
}));