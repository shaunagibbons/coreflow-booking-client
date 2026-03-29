import api from '@/data/api';
import bookingService from '@/data/bookingService';

vi.mock('@/data/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  tokenStorage: {
    set: vi.fn(),
    clear: vi.fn(),
    getAccess: vi.fn(),
    getRefresh: vi.fn(),
  },
}));

describe('bookingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('list fetches /bookings/', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { count: 0, next: null, previous: null, results: [] },
    });

    const result = await bookingService.list();

    expect(api.get).toHaveBeenCalledWith('/bookings/', { params: undefined });
    expect(result.results).toEqual([]);
  });

  it('list passes page param', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { count: 0, next: null, previous: null, results: [] },
    });

    await bookingService.list(2);

    expect(api.get).toHaveBeenCalledWith('/bookings/', { params: { page: '2' } });
  });

  it('upcoming fetches /bookings/upcoming/', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { count: 0, next: null, previous: null, results: [] },
    });

    await bookingService.upcoming();

    expect(api.get).toHaveBeenCalledWith('/bookings/upcoming/', { params: undefined });
  });

  it('past fetches /bookings/past/', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { count: 0, next: null, previous: null, results: [] },
    });

    await bookingService.past();

    expect(api.get).toHaveBeenCalledWith('/bookings/past/', { params: undefined });
  });

  it('getById fetches a specific booking', async () => {
    const booking = { id: 5, status: 'confirmed' };
    vi.mocked(api.get).mockResolvedValueOnce({ data: booking });

    const result = await bookingService.getById(5);

    expect(api.get).toHaveBeenCalledWith('/bookings/5/');
    expect(result).toEqual(booking);
  });

  it('create posts booking data', async () => {
    const booking = { id: 1, status: 'pending' };
    vi.mocked(api.post).mockResolvedValueOnce({ data: booking });

    const result = await bookingService.create({ pilates_class: 1 });

    expect(api.post).toHaveBeenCalledWith('/bookings/', { pilates_class: 1 });
    expect(result).toEqual(booking);
  });

  it('cancel posts to cancel endpoint', async () => {
    const booking = { id: 3, status: 'cancelled' };
    vi.mocked(api.post).mockResolvedValueOnce({ data: booking });

    const result = await bookingService.cancel(3);

    expect(api.post).toHaveBeenCalledWith('/bookings/3/cancel/');
    expect(result).toEqual(booking);
  });

  it('normalizes array response to paginated', async () => {
    const bookings = [{ id: 1 }, { id: 2 }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: bookings });

    const result = await bookingService.list();

    expect(result).toEqual({
      count: 2,
      next: null,
      previous: null,
      results: bookings,
    });
  });
});
