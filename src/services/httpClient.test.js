import { describe, expect, it, vi } from "vitest";

import { createHttpClient } from "./httpClient.js";

describe("httpClient", () => {
  it("serializes query params and returns request metadata", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      status: 200,
      headers: {
        get: vi.fn(() => "req-123"),
      },
      async text() {
        return JSON.stringify({
          success: true,
          data: [{ id: 1 }],
          meta: {
            requestId: "req-123",
          },
        });
      },
    }));

    const client = createHttpClient({
      baseUrl: "http://localhost:3000",
      fetchImpl,
    });

    const result = await client.get("/api/predictions/today", {
      query: {
        competition: "premier-league",
        empty: "",
      },
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl.mock.calls[0][0].toString()).toContain(
      "competition=premier-league",
    );
    expect(result).toEqual({
      data: [{ id: 1 }],
      requestId: "req-123",
    });
  });

  it("normalizes invalid response contracts", async () => {
    const client = createHttpClient({
      baseUrl: "http://localhost:3000",
      fetchImpl: vi.fn(async () => ({
        ok: true,
        status: 200,
        headers: {
          get: vi.fn(() => null),
        },
        async text() {
          return JSON.stringify({
            ok: true,
          });
        },
      })),
    });

    await expect(client.get("/api/system/runs/latest")).rejects.toMatchObject({
      name: "HttpClientError",
      code: "INVALID_RESPONSE",
    });
  });

  it("maps aborts to uniform client errors", async () => {
    const fetchImpl = vi.fn(async (_url, options) => {
      if (options.signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      options.signal.dispatchEvent(new Event("abort"));
      throw new DOMException("Aborted", "AbortError");
    });

    const client = createHttpClient({
      baseUrl: "http://localhost:3000",
      fetchImpl,
    });
    const controller = new AbortController();
    controller.abort();

    await expect(
      client.get("/api/predictions/17", { signal: controller.signal }),
    ).rejects.toEqual(
      expect.objectContaining({
        name: "HttpClientError",
        code: "ABORTED",
      }),
    );
  });

  it("preserves backend error details when available", async () => {
    const client = createHttpClient({
      baseUrl: "http://localhost:3000",
      fetchImpl: vi.fn(async () => ({
        ok: false,
        status: 503,
        headers: {
          get: vi.fn(() => "req-503"),
        },
        async text() {
          return JSON.stringify({
            error: {
              code: "SERVICE_UNAVAILABLE",
              message: "Service down",
            },
          });
        },
      })),
    });

    await expect(client.get("/api/predictions/top")).rejects.toEqual(
      expect.objectContaining({
        name: "HttpClientError",
        status: 503,
        code: "SERVICE_UNAVAILABLE",
      }),
    );
  });
});
