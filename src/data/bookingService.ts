import api from '@/data/api';
import type {
  Booking,
  BookingListItem,
  CreateBookingRequest,
  PaginatedResponse,
} from '@/data/types';

const bookingService = {
  async list(page?: number): Promise<PaginatedResponse<BookingListItem>> {
    const params = page ? { page: String(page) } : undefined;
    const response = await api.get<PaginatedResponse<BookingListItem>>(
      '/bookings/',
      { params },
    );
    return response.data;
  },

  async upcoming(page?: number): Promise<PaginatedResponse<BookingListItem>> {
    const params = page ? { page: String(page) } : undefined;
    const response = await api.get<PaginatedResponse<BookingListItem>>(
      '/bookings/upcoming/',
      { params },
    );
    return response.data;
  },

  async past(page?: number): Promise<PaginatedResponse<BookingListItem>> {
    const params = page ? { page: String(page) } : undefined;
    const response = await api.get<PaginatedResponse<BookingListItem>>(
      '/bookings/past/',
      { params },
    );
    return response.data;
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
