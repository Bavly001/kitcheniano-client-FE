import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../lib/utils';

describe('Frontend Utilities', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(18.5)).toBe('$18.50');
    expect(formatCurrency(0)).toBe('$0.00');
  });
});
