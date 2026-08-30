import { Settlement } from '@/types/world';
import { TerrainData } from './TerrainGenerator';
import { SeedRandom } from './SeedRandom';
import { SettlementMorphology } from './SettlementMorphology';

/**
 * SettlementSynthesizer.ts
 * High-level coordinator that invokes the generic SettlementMorphology engine
 * for each settlement in the world specification.
 */
export class SettlementSynthesizer {
  public static synthesize(settlements: Settlement[], terrain: TerrainData, rng: SeedRandom): void {
    for (const s of settlements) {
      SettlementMorphology.synthesizeSettlement(s, terrain, rng);
    }
  }
}
