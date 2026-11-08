// ==============================================================================
// STOREFRONT CHECKOUT & AUTHENTICATION UTILITIES (src/lib/checkout.ts)
// ==============================================================================

export interface CheckoutValidationResult {
  allowed: boolean;
  error?: string;
  redirectUrl?: string;
}

/**
 * Validates that an order checkout attempt is authorized by a verified customer.
 * Unauthenticated guests are strictly forbidden from placing orders.
 */
export function validateCheckoutAuth(
  isAuthenticated: boolean,
  token: string | null | undefined,
  clientId?: number | null | undefined,
): CheckoutValidationResult {
  if (!isAuthenticated || !token || !clientId) {
    return {
      allowed: false,
      error: 'Please sign in or create an account to complete your order.',
      redirectUrl: '/login?redirect=/checkout',
    };
  }

  return { allowed: true };
}

/**
 * Sanitizes and extracts the post-authentication redirect destination.
 * Only allows safe relative paths starting with a single '/' to prevent open redirect exploits.
 */
export function getAuthRedirectTarget(
  redirectParam: string | null | undefined,
  fallback = '/menu',
): string {
  if (!redirectParam || typeof redirectParam !== 'string') {
    return fallback;
  }

  const trimmed = redirectParam.trim();

  // Allow only valid internal relative paths (e.g. /checkout) and reject protocol-relative (//) or external URLs
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('\\')) {
    return trimmed;
  }

  return fallback;
}

/**
 * Generates an authentication route URL with an encoded redirect parameter.
 */
export function buildAuthRedirectLink(
  baseRoute: '/login' | '/register',
  redirectTarget?: string | null,
): string {
  if (!redirectTarget || redirectTarget === '/menu') {
    return baseRoute;
  }

  return `${baseRoute}?redirect=${encodeURIComponent(redirectTarget)}`;
}
