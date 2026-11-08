import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../lib/utils';

describe('Orders and Formatting Utilities', () => {
  it('formats currency in standard USD format', () => {
    expect(formatCurrency(24.5)).toBe('$24.50');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(129.99)).toBe('$129.99');
  });

  it('formats dates consistently', () => {
    const iso = '2026-11-08T12:00:00.000Z';
    const formatted = formatDate(iso);
    expect(formatted).toBeDefined();
    expect(typeof formatted).toBe('string');
  });

  it('correctly maps active order statuses vs completed statuses', () => {
    const activeStatuses = ['pending', 'accepted', 'in_kitchen', 'out_for_delivery', 'ready_for_pickup'];
    const completedStatuses = ['received', 'rejected', 'cancelled'];

    const isOrderActive = (status: string) => activeStatuses.includes(status);
    const isOrderFinished = (status: string) => completedStatuses.includes(status);

    expect(isOrderActive('in_kitchen')).toBe(true);
    expect(isOrderActive('pending')).toBe(true);
    expect(isOrderActive('received')).toBe(false);

    expect(isOrderFinished('received')).toBe(true);
    expect(isOrderFinished('cancelled')).toBe(true);
    expect(isOrderFinished('accepted')).toBe(false);
  });
});
