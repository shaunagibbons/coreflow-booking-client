import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge', () => {
  it('renders "Confirmed" for confirmed status', () => {
    render(<Badge status="confirmed" />);
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });

  it('renders "Pending" for pending status', () => {
    render(<Badge status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders "Cancelled" for cancelled status', () => {
    render(<Badge status="cancelled" />);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });
});
