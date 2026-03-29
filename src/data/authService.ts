import api, { tokenStorage } from '@/data/api';
import type {
  AuthTokens,
  ChangePasswordRequest,
  LoginRequest,
  ProfileUpdateRequest,
  RegisterRequest,
  User,
} from '@/data/types';

const authService = {
  async login(data: LoginRequest): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>('/auth/login/', data);
    tokenStorage.set(response.data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<void> {
    await api.post('/auth/register/', data);
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/users/me/');
    return response.data;
  },

  async updateProfile(data: ProfileUpdateRequest): Promise<User> {
    const response = await api.patch<User>('/auth/users/update_profile/', data);
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await api.post('/auth/users/change_password/', data);
  },

  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/password-reset/', { email });
  },

  async confirmPasswordReset(
    uid: string,
    token: string,
    new_password: string,
    new_password_confirm: string,
  ): Promise<void> {
    await api.post('/auth/password-reset-confirm/', {
      uid,
      token,
      new_password,
      new_password_confirm,
    });
  },
};

export default authService;
