// ==============================================================================
// KITCHENIANO CLIENT API CLIENT (src/lib/api-client.ts)
// ==============================================================================
import { useAuthStore } from '../store/auth.store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, headers = {}, ...customConfig } = options;

  // Retrieve current auth state
  const { token, organizationId } = useAuthStore.getState();

  // Construct query string if params provided
  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-organization-id': organizationId || process.env.NEXT_PUBLIC_DEFAULT_ORG_ID || '',
    ...(headers as Record<string, string>),
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...customConfig,
    headers: requestHeaders,
  });

  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      // response might be empty or non-JSON
    }

    const errorMessage =
      errorData.error || errorData.message || `Request failed with status ${response.status}`;
    throw new ApiError(response.status, errorMessage, errorData);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
