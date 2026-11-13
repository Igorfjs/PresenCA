const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

/** Shared browser/server API boundary for replacing mock services incrementally. */
export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`A API respondeu com status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}
