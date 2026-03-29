import { AxiosError, AxiosHeaders } from 'axios';
import { parseApiError, parseFieldErrors } from '@/utils/errors';

function makeAxiosError(data: unknown, status = 400) {
  return new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    data,
    status,
    statusText: 'Bad Request',
    headers: {},
    config: { headers: new AxiosHeaders() },
  });
}

describe('parseApiError', () => {
  it('returns detail string from response', () => {
    const error = makeAxiosError({ detail: 'Invalid credentials' });
    expect(parseApiError(error)).toBe('Invalid credentials');
  });

  it('returns first array error from field', () => {
    const error = makeAxiosError({ email: ['This field is required'] });
    expect(parseApiError(error)).toBe('This field is required');
  });

  it('returns string field error', () => {
    const error = makeAxiosError({ email: 'Invalid email' });
    expect(parseApiError(error)).toBe('Invalid email');
  });

  it('returns error.message when no response data', () => {
    const error = new AxiosError('Network Error');
    expect(parseApiError(error)).toBe('Network Error');
  });

  it('returns fallback for empty data object', () => {
    const error = makeAxiosError({});
    expect(parseApiError(error)).toBe('Something went wrong. Please try again.');
  });

  it('returns message for plain Error', () => {
    expect(parseApiError(new Error('oops'))).toBe('oops');
  });

  it('returns fallback for unknown value', () => {
    expect(parseApiError(null)).toBe('An unexpected error occurred.');
  });
});

describe('parseFieldErrors', () => {
  it('extracts field errors from arrays', () => {
    const error = makeAxiosError({ email: ['Required'], password: ['Too short'] });
    expect(parseFieldErrors(error)).toEqual({ email: 'Required', password: 'Too short' });
  });

  it('skips the detail key', () => {
    const error = makeAxiosError({ detail: 'Not found', email: ['Required'] });
    expect(parseFieldErrors(error)).toEqual({ email: 'Required' });
  });

  it('handles string field values', () => {
    const error = makeAxiosError({ email: 'Invalid' });
    expect(parseFieldErrors(error)).toEqual({ email: 'Invalid' });
  });

  it('returns empty object for non-axios error', () => {
    expect(parseFieldErrors(new Error('oops'))).toEqual({});
  });

  it('returns empty object when no response data', () => {
    const error = new AxiosError('Network Error');
    expect(parseFieldErrors(error)).toEqual({});
  });
});
