import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginPage from './LoginPage';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

const mockLogin = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useAuth).mockReturnValue({
    isLoading: false,
    isAuthenticated: false,
    user: null,
    login: mockLogin,
    register: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
  });
});

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  it('renders email and password inputs', () => {
    renderLoginPage();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders sign in button', () => {
    renderLoginPage();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows error when email is empty', async () => {
    renderLoginPage();
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('shows error when password is empty', async () => {
    renderLoginPage();
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('calls login with credentials on valid submit', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    renderLoginPage();

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('contains link to register page', () => {
    renderLoginPage();
    expect(screen.getByText('Register')).toHaveAttribute('href', '/register');
  });

  it('contains forgot password link', () => {
    renderLoginPage();
    expect(screen.getByText(/forgot your password/i)).toHaveAttribute('href', '/forgot-password');
  });
});
