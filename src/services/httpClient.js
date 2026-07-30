export class HttpClientError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "HttpClientError";
    this.status = details.status ?? null;
    this.code = details.code ?? "HTTP_ERROR";
    this.requestId = details.requestId ?? null;
  }
}

function withTimeout(signal, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  return {
    signal: controller.signal,
    clear() {
      clearTimeout(timeoutId);
    },
  };
}

export function createHttpClient({
  baseUrl,
  timeoutMs = 8000,
  fetchImpl = fetch,
}) {
  return {
    async get(path, { query = {}, signal } = {}) {
      const url = new URL(path, `${baseUrl}/`);

      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value));
        }
      }

      const timeout = withTimeout(signal, timeoutMs);

      try {
        const response = await fetchImpl(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: timeout.signal,
        });
        const text = await response.text();
        const payload = text ? JSON.parse(text) : null;
        const requestId =
          payload?.meta?.requestId ??
          response.headers?.get?.("x-request-id") ??
          null;

        if (!response.ok) {
          throw new HttpClientError(
            payload?.error?.message ?? "Request failed",
            {
              status: response.status,
              code: payload?.error?.code ?? "HTTP_ERROR",
              requestId,
            },
          );
        }

        if (!payload || payload.success !== true || !("data" in payload)) {
          throw new HttpClientError("Invalid API response contract", {
            status: response.status,
            code: "INVALID_RESPONSE",
            requestId,
          });
        }

        return {
          data: payload.data,
          requestId,
        };
      } catch (error) {
        if (error.name === "AbortError") {
          throw new HttpClientError("Request aborted", {
            code: "ABORTED",
          });
        }

        if (error instanceof SyntaxError) {
          throw new HttpClientError("Invalid JSON response", {
            code: "INVALID_RESPONSE",
          });
        }

        if (error instanceof HttpClientError) {
          throw error;
        }

        throw new HttpClientError(error.message || "Network error", {
          code: "NETWORK_ERROR",
        });
      } finally {
        timeout.clear();
      }
    },
  };
}
