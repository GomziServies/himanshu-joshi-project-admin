import { vi } from 'vitest';

type RouteHandler = (init: RequestInit | undefined, url: string) => { status?: number; body: unknown };

/** Mocks fetch, matching routes by "METHOD /path" prefix. Unmatched calls fail the request. */
export function mockApi(routes: Record<string, RouteHandler>) {
  const fetchMock = vi.fn(async (input: string, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method || 'GET';
    const path = url.replace(/^.*\/api/, '');
    const key = Object.keys(routes).find((route) => {
      const [routeMethod, routePath] = route.split(' ');
      return routeMethod === method && path.startsWith(routePath);
    });
    if (!key) {
      return { ok: false, status: 404, json: async () => ({ success: false, message: `No mock for ${method} ${path}` }) };
    }
    const { status = 200, body } = routes[key](init, url);
    return { ok: status < 400, status, json: async () => body };
  });
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

export function callsTo(fetchMock: ReturnType<typeof mockApi>, method: string, path: string) {
  return fetchMock.mock.calls.filter(
    ([url, init]) => (init?.method || 'GET') === method && String(url).includes(path)
  );
}

export function lastUrlTo(fetchMock: ReturnType<typeof mockApi>, path: string): string {
  const calls = callsTo(fetchMock, 'GET', path);
  return String(calls[calls.length - 1]?.[0]);
}
