import seedrandom from 'seedrandom';
import { createNoise2D } from 'simplex-noise';

export class SeedRandom {
  private rng: seedrandom.PRNG;
  private noise2DGen: (x: number, y: number) => number;

  constructor(public readonly seed: string) {
    this.rng = seedrandom(seed);
    const noiseRng = seedrandom(`${seed}_noise`);
    this.noise2DGen = createNoise2D(() => noiseRng());
  }

  public next(): number {
    return this.rng();
  }

  public floatRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  public intRange(min: number, max: number): number {
    return Math.floor(this.floatRange(min, max + 1));
  }

  public pickOne<T>(arr: T[]): T {
    if (arr.length === 0) throw new Error('Cannot pick from empty array');
    return arr[Math.floor(this.next() * arr.length)];
  }

  public pickMultiple<T>(arr: T[], count: number): T[] {
    const shuffled = this.shuffle([...arr]);
    return shuffled.slice(0, Math.min(count, arr.length));
  }

  public shuffle<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  public chance(probability: number): boolean {
    return this.next() < probability;
  }

  /**
   * Fractal Brownian Motion 2D noise
   */
  public fbmNoise2D(
    x: number,
    y: number,
    scale = 0.05,
    octaves = 4,
    lacunarity = 2.0,
    gain = 0.5
  ): number {
    let total = 0;
    let frequency = scale;
    let amplitude = 1.0;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += (this.noise2DGen(x * frequency, y * frequency) * 0.5 + 0.5) * amplitude;
      maxValue += amplitude;
      amplitude *= gain;
      frequency *= lacunarity;
    }

    return total / maxValue;
  }
}
