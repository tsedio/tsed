/**
 * Seeded pseudo-random generator (mulberry32): the same seed gives the same order of measurements.
 */
export function createRandom(seed) {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(items, random) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

/**
 * Builds the interleaved rounds: each round measures every unit once, in a shuffled order.
 * Drift of the machine during the run then spreads over every target instead of favouring one.
 */
export function buildSchedule(units, rounds, seed) {
  const random = createRandom(seed);

  return Array.from({length: rounds}, () => shuffle(units, random));
}
