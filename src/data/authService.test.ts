import api, { tokenStorage } from '@/data/api';
import authService from '@/data/authService';

vi.mock('@/data/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
  tokenStorage: {
    set: vi.fn(),
    clear: vi.fn(),
    getAccess: vi.fn(),
    getRefresh: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login posts credentials and stores tokens', async () => {
    const tokens = { access: 'abc', refresh: 'def' };
    vi.mocked(api.post).mockResolvedValueOnce({ data: tokens });

    const result = await authService.login({ email: 'test@example.com', password: 'pass123' });

    expect(api.post).toHaveBeenCalledWith('/auth/login/', { email: 'test@example.com', password: 'pass123' });
    expect(tokenStorage.set).toHaveBeenCalledWith(tokens);
    expect(result).toEqual(tokens);
  });

  it('register posts user data', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });

    await authService.register({
      email: 'test@example.com',
      password: 'pass1234',
      password_confirm: 'pass1234',
      first_name: 'Test',
      last_name: 'User',
    });

    expect(api.post).toHaveBeenCalledWith('/auth/register/', expect.objectContaining({
      email: 'test@example.com',
    }));
  });

  it('getProfile fetches current user', async () => {
    const user = { id: 1, email: 'test@example.com', first_name: 'Test', last_name: 'User' };
    vi.mocked(api.get).mockResolvedValueOnce({ data: user });

    const result = await authService.getProfile();

    expect(api.get).toHaveBeenCalledWith('/auth/users/me/');
    expect(result).toEqual(user);
  });

  it('updateProfile patches user data', async () => {
    const user = { id: 1, email: 'test@example.com', first_name: 'Updated', last_name: 'User' };
    vi.mocked(api.patch).mockResolvedValueOnce({ data: user });

    const result = await authService.updateProfile({ first_name: 'Updated', last_name: 'User' });

    expect(api.patch).toHaveBeenCalledWith('/auth/users/update_profile/', { first_name: 'Updated', last_name: 'User' });
    expect(result).toEqual(user);
  });

  it('changePassword posts password data', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });

    await authService.changePassword({ old_password: 'old', new_password: 'new12345' });

    expect(api.post).toHaveBeenCalledWith('/auth/users/change_password/', {
      old_password: 'old',
      new_password: 'new12345',
    });
  });

  it('requestPasswordReset posts email', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });

    await authService.requestPasswordReset('test@example.com');

    expect(api.post).toHaveBeenCalledWith('/auth/password-reset/', { email: 'test@example.com' });
  });

  it('confirmPasswordReset posts uid, token, and passwords', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });

    await authService.confirmPasswordReset('abc', 'token123', 'newpass1', 'newpass1');

    expect(api.post).toHaveBeenCalledWith('/auth/password-reset-confirm/', {
      uid: 'abc',
      token: 'token123',
      new_password: 'newpass1',
      new_password_confirm: 'newpass1',
    });
  });
});
