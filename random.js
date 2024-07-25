import * as prand from 'https://unpkg.com/pure-rand/lib/esm/pure-rand.js';

const now = new Date()
export const seed = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
const rng = prand.xoroshiro128plus(seed)

export const random = (min, max) => prand.unsafeUniformIntDistribution(min, max, rng)

document.getElementById('seed').textContent = `Seed: ${seed}`