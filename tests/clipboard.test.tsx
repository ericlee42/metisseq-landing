import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import CopyAddress from '@/components/CopyAddress';

const mocks = vi.hoisted(() => ({ copy: vi.fn(), success: vi.fn(), error: vi.fn() }));
vi.mock('copy-to-clipboard', () => ({ default: mocks.copy }));
vi.mock('@/hooks/useAuth', () => ({ default: () => ({ address: undefined }) }));
vi.mock('@/components', () => ({ message: { success: mocks.success, error: mocks.error } }));
afterEach(cleanup);

it('reports success only after the clipboard write completes', async () => {
  let complete!: (value: boolean) => void;
  mocks.copy.mockReturnValue(new Promise<boolean>((resolve) => (complete = resolve)));
  render(<CopyAddress addr="0x1234" hide={false} copyTrigger={<span>Copy</span>} />);
  fireEvent.click(screen.getByText('Copy'));
  expect(mocks.copy).toHaveBeenCalledWith('0x1234');
  expect(mocks.success).not.toHaveBeenCalled();
  await act(async () => complete(true));
  expect(mocks.success).toHaveBeenCalledWith('copied!');
});

it.each(['false', 'rejection'])('reports clipboard failure on %s', async (failure) => {
  if (failure === 'false') mocks.copy.mockResolvedValue(false);
  else mocks.copy.mockRejectedValue(new Error('Permission denied'));
  render(<CopyAddress addr="0x1234" copyTrigger={<span>Copy</span>} />);
  fireEvent.click(screen.getByText('Copy'));
  await waitFor(() => expect(mocks.error).toHaveBeenCalledWith('Failed to copy'));
  expect(mocks.success).not.toHaveBeenCalled();
});
