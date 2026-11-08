import { describe, it, expect } from 'vitest';
import { resolveImageUrl, formatCurrency, formatDate } from '../lib/utils';

describe('utils', () => {
  describe('formatCurrency', () => {
    it('formats numbers as USD currency', () => {
      expect(formatCurrency(12.5)).toBe('$12.50');
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('formatDate', () => {
    it('returns empty string for invalid dates', () => {
      expect(formatDate('invalid')).toBe('');
    });

    it('formats valid date string', () => {
      const formatted = formatDate('2026-11-08T12:00:00Z');
      expect(formatted).toContain('2026');
    });
  });

  describe('resolveImageUrl', () => {
    it('returns null when imageUrl is null, undefined, or empty', () => {
      expect(resolveImageUrl(null)).toBeNull();
      expect(resolveImageUrl(undefined)).toBeNull();
      expect(resolveImageUrl('')).toBeNull();
    });

    it('returns absolute http and https URLs unchanged', () => {
      const b2Url = 'http://localhost:4000/uploads/b2/menu-items%2Fphoto.jpg';
      const httpsUrl = 'https://s3.us-east-005.backblazeb2.com/bucket/photo.jpg';
      expect(resolveImageUrl(b2Url)).toBe(b2Url);
      expect(resolveImageUrl(httpsUrl)).toBe(httpsUrl);
    });

    it('prepends backend base URL to relative image paths', () => {
      const resolved = resolveImageUrl('/uploads/dish.jpg');
      expect(resolved).toMatch(/http:\/\/localhost:4000\/uploads\/dish\.jpg/);
    });

    it('handles relative paths without leading slash', () => {
      const resolved = resolveImageUrl('uploads/dish.jpg');
      expect(resolved).toMatch(/http:\/\/localhost:4000\/uploads\/dish\.jpg/);
    });
  });
});
