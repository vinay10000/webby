import { describe, it } from 'vitest';
import fc from 'fast-check';

describe('Property-Based Testing Setup', () => {
  it('should run property test with fast-check', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a; // Commutative property
      }),
      { numRuns: 100 }
    );
  });
});
