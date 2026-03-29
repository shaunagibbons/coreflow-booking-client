import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PublicOnlyRoute from './PublicOnlyRoute';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

function renderWithRouter(initialEntry = '/login') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<div>Login Form</div>} />
        </Route>
        <Route path="/" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PublicOnlyRoute', () => {
  it('shows spinner while loading', () => {
    vi.mocked(useAuth).mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    });

    renderWithRouter();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('redirects to dashboard when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { id: 1, email: 'test@example.com', first_name: 'Test', last_name: 'User', full_name: 'Test User', phone_number: '', is_instructor: false, date_joined: '' },
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    });

    renderWithRouter();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Login Form')).not.toBeInTheDocument();
  });

  it('renders content when not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    });

    renderWithRouter();

    expect(screen.getByText('Login Form')).toBeInTheDocument();
  });
});
