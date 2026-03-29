import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
  it('renders nothing when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={vi.fn()} title="Test">Content</Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title and children when open', () => {
    render(<Modal isOpen onClose={vi.fn()} title="My Modal">Hello</Modal>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('My Modal')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('has aria-modal attribute', () => {
    render(<Modal isOpen onClose={vi.fn()} title="Test">Content</Modal>);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    render(<Modal isOpen onClose={onClose} title="Test">Content</Modal>);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when overlay is clicked', async () => {
    const onClose = vi.fn();
    render(<Modal isOpen onClose={onClose} title="Test">Content</Modal>);
    // The overlay is the parent of the dialog
    const dialog = screen.getByRole('dialog');
    await userEvent.click(dialog.parentElement!);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose when modal body is clicked', async () => {
    const onClose = vi.fn();
    render(<Modal isOpen onClose={onClose} title="Test">Content</Modal>);
    await userEvent.click(screen.getByText('Content'));
    // onClose may be called from overlay but not from inner click
    // The stopPropagation on the modal div prevents it
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<Modal isOpen onClose={onClose} title="Test">Content</Modal>);
    await userEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('sets body overflow to hidden when open', () => {
    render(<Modal isOpen onClose={vi.fn()} title="Test">Content</Modal>);
    expect(document.body.style.overflow).toBe('hidden');
  });
});
