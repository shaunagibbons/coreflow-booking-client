import axios from 'axios';

export function parseApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (!data) {
      return error.message || 'A network error occurred. Please try again.';
    }

    // { detail: "..." }
    if (typeof data.detail === 'string') {
      return data.detail;
    }

    // { field: ["error1", "error2"] } — return first error found
    for (const key of Object.keys(data)) {
      const value = data[key];
      if (Array.isArray(value) && typeof value[0] === 'string') {
        return value[0];
      }
      if (typeof value === 'string') {
        return value;
      }
    }

    return 'Something went wrong. Please try again.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}

export function parseFieldErrors(
  error: unknown,
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (!axios.isAxiosError(error) || !error.response?.data) {
    return fieldErrors;
  }

  const data = error.response.data;

  for (const [key, value] of Object.entries(data)) {
    if (key === 'detail') continue;

    if (Array.isArray(value) && typeof value[0] === 'string') {
      fieldErrors[key] = value[0];
    } else if (typeof value === 'string') {
      fieldErrors[key] = value;
    }
  }

  return fieldErrors;
}
