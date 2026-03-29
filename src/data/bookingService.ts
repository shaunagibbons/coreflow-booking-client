import api from '@/data/api';
import type {
  Booking,
  BookingListItem,
  CreateBookingRequest,
  PaginatedResponse,
} from '@/data/types';

/**
 * Normalize API responses that may return either a paginated object
 * ({ count, results, ... }) or a plain array.
 */
function normalizePaginated<T>(data: PaginatedResponse<T> | T[]): PaginatedResponse<T> {
  if (Array.isArray(data)) {
    return { count: data.length, next: null, previous: null, results: data };
  }
  return data;
}

const bookingService = {
  async list(page?: number): Promise<PaginatedResponse<BookingListItem>> {
    const params = page ? { page: String(page) } : undefined;
    const response = await api.get<PaginatedResponse<BookingListItem> | BookingListItem[]>(
      '/bookings/',
      { params },
    );
    return normalizePaginated(response.data);
  },

  async upcoming(page?: number): Promise<PaginatedResponse<BookingListItem>> {
    const params = page ? { page: String(page) } : undefined;
    const response = await api.get<PaginatedResponse<BookingListItem> | BookingListItem[]>(
      '/bookings/upcoming/',
      { params },
    );
    return normalizePaginated(response.data);
  },

  async past(page?: number): Promise<PaginatedResponse<BookingListItem>> {
    const params = page ? { page: String(page) } : undefined;
    const response = await api.get<PaginatedResponse<BookingListItem> | BookingListItem[]>(
      '/bookings/past/',
      { params },
    );
    return normalizePaginated(response.data);
  },

  async getById(id: number): Promise<Booking> {
    const response = await api.get<Booking>(`/bookings/${id}/`);
    return response.data;
  },

  async create(data: CreateBookingRequest): Promise<Booking> {
    const response = await api.post<Booking>('/bookings/', data);
    return response.data;
  },

  async cancel(id: number): Promise<Booking> {
    const response = await api.post<Booking>(`/bookings/${id}/cancel/`);
    return response.data;
  },
};

export default bookingService;
