import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

function renderWithRouter(initialEntry = '/protected') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/protected" element={<div>Secret Content</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
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
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
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

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('renders content when authenticated', () => {
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

    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });
});
