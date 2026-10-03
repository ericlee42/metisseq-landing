import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { PropsWithChildren } from 'react';
import Select from '@/components/Select';
import Modal from '@/components/Modal';

vi.mock('@/components/Scrollbar', () => ({
  default: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it.each([true, false])('positions and selects portal options with follow=%s', async (follow) => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    return { top: 20, left: 30, width: this.tagName === 'UL' ? 80 : 120, height: 40 } as DOMRect;
  });
  const onChange = vi.fn();
  const { container } = render(
    <Select
      follow={follow}
      placement="right"
      placeholder="Choose network"
      options={[{ value: 1, name: 'Mainnet' }]}
      onChange={onChange}
    />,
  );
  fireEvent.click(screen.getByText('Choose network'));
  const menu = screen.getByRole('list');
  expect(menu.parentElement).toBe(follow ? container.querySelector('.component-select') : document.body);
  expect(menu.style.top).toBe(follow ? '40px' : '60px');
  expect(follow ? menu.style.right : menu.style.left).toBe(follow ? '0px' : '70px');
  fireEvent.click(screen.getByText('Mainnet'));
  expect(onChange).toHaveBeenCalledWith({ value: 1, name: 'Mainnet' });
  await waitFor(() => expect(screen.queryByRole('list')).toBeNull());
});

it('updates modal alignment and mask close callback when props change', () => {
  const firstClose = vi.fn();
  const nextClose = vi.fn();
  const { rerender } = render(<Modal visible title="Details" onClose={firstClose} />);
  rerender(<Modal visible title="Details" middleHeader onClose={nextClose} />);
  expect(screen.getByText('Details').parentElement?.classList.contains('middle-header')).toBe(true);
  fireEvent.click(screen.getByText('Details'));
  expect(nextClose).not.toHaveBeenCalled();
  fireEvent.click(document.querySelector('.component-modal')!);
  expect(nextClose).toHaveBeenCalledOnce();
  expect(firstClose).not.toHaveBeenCalled();
});
