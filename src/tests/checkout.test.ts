import { describe, it, expect } from 'vitest';
import {
  validateCheckoutAuth,
  getAuthRedirectTarget,
  buildAuthRedirectLink,
} from '../lib/checkout';

describe('Storefront Checkout Authentication Gate', () => {
  describe('validateCheckoutAuth', () => {
    it('blocks unauthenticated visitors from completing orders', () => {
      const result = validateCheckoutAuth(false, null, null);
      expect(result.allowed).toBe(false);
      expect(result.error).toMatch(/sign in or create an account/i);
      expect(result.redirectUrl).toBe('/login?redirect=/checkout');
    });

    it('blocks order completion if token is missing even if client state was partially set', () => {
      const result = validateCheckoutAuth(false, null, 101);
      expect(result.allowed).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('blocks order completion if clientId is missing', () => {
      const result = validateCheckoutAuth(true, 'mock-jwt-token', null);
      expect(result.allowed).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('permits order completion for authenticated customers with verified clientId and token', () => {
      const result = validateCheckoutAuth(true, 'valid-token', 101);
      expect(result.allowed).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('getAuthRedirectTarget', () => {
    it('returns the redirect path when a valid internal path is provided in query params', () => {
      const target = getAuthRedirectTarget('/checkout');
      expect(target).toBe('/checkout');
    });

    it('falls back to /menu when redirect param is missing or null', () => {
      expect(getAuthRedirectTarget(null)).toBe('/menu');
      expect(getAuthRedirectTarget('')).toBe('/menu');
    });

    it('sanitizes external URLs to prevent open redirect vulnerabilities', () => {
      expect(getAuthRedirectTarget('https://evil.com')).toBe('/menu');
      expect(getAuthRedirectTarget('//evil.com/phish')).toBe('/menu');
      expect(getAuthRedirectTarget('javascript:alert(1)')).toBe('/menu');
    });
  });

  describe('buildAuthRedirectLink', () => {
    it('constructs correct login link with encoded redirect parameter', () => {
      const link = buildAuthRedirectLink('/login', '/checkout');
      expect(link).toBe('/login?redirect=%2Fcheckout');
    });

    it('constructs register link with encoded redirect parameter', () => {
      const link = buildAuthRedirectLink('/register', '/checkout');
      expect(link).toBe('/register?redirect=%2Fcheckout');
    });

    it('omits redirect parameter when destination is empty or default menu', () => {
      expect(buildAuthRedirectLink('/login', '')).toBe('/login');
      expect(buildAuthRedirectLink('/login', '/menu')).toBe('/login');
    });
  });
});
