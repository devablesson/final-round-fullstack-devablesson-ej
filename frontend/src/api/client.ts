/**
 * Centralized API client.
 * All HTTP calls go through this file to ensure
 * consistent error handling and easier maintenance.
 */

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Handles API responses safely.
 * Converts backend errors into readable JS Errors.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Unexpected server error";

    try {
      const data = await response.json();
      if (data?.detail) {
        message = data.detail;
      }
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }

  return response.json();
}

/**
 * HTTP GET helper
 */
export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  return handleResponse<T>(response);
}

/**
 * HTTP POST helper
 */
export async function apiPost<T>(
  path: string,
  body: unknown
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}
