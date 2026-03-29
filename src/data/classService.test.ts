import api from '@/data/api';
import classService from '@/data/classService';

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

describe('classService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('list with no filters calls /classes/ with empty params', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { count: 0, next: null, previous: null, results: [] },
    });

    const result = await classService.list();

    expect(api.get).toHaveBeenCalledWith('/classes/', { params: {} });
    expect(result.results).toEqual([]);
  });

  it('list passes filter params', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { count: 0, next: null, previous: null, results: [] },
    });

    await classService.list({ date_from: '2026-01-01', page: 2 });

    expect(api.get).toHaveBeenCalledWith('/classes/', {
      params: { date_from: '2026-01-01', page: '2' },
    });
  });

  it('list normalizes array response to paginated', async () => {
    const classes = [{ id: 1, title: 'Pilates' }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: classes });

    const result = await classService.list();

    expect(result).toEqual({
      count: 1,
      next: null,
      previous: null,
      results: classes,
    });
  });

  it('list passes through paginated response', async () => {
    const paginated = { count: 1, next: null, previous: null, results: [{ id: 1 }] };
    vi.mocked(api.get).mockResolvedValueOnce({ data: paginated });

    const result = await classService.list();

    expect(result).toEqual(paginated);
  });

  it('getById fetches a specific class', async () => {
    const cls = { id: 1, title: 'Pilates' };
    vi.mocked(api.get).mockResolvedValueOnce({ data: cls });

    const result = await classService.getById(1);

    expect(api.get).toHaveBeenCalledWith('/classes/1/');
    expect(result).toEqual(cls);
  });

  it('create posts class data', async () => {
    const cls = { id: 1, title: 'New Class' };
    vi.mocked(api.post).mockResolvedValueOnce({ data: cls });

    const result = await classService.create({ title: 'New Class', instructor_id: 1 });

    expect(api.post).toHaveBeenCalledWith('/classes/', { title: 'New Class', instructor_id: 1 });
    expect(result).toEqual(cls);
  });

  it('update patches class data', async () => {
    const cls = { id: 1, title: 'Updated' };
    vi.mocked(api.patch).mockResolvedValueOnce({ data: cls });

    const result = await classService.update(1, { title: 'Updated' });

    expect(api.patch).toHaveBeenCalledWith('/classes/1/', { title: 'Updated' });
    expect(result).toEqual(cls);
  });

  it('delete removes a class', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({});

    await classService.delete(1);

    expect(api.delete).toHaveBeenCalledWith('/classes/1/');
  });
});
