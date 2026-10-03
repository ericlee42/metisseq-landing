import NumberText from '@/components/NumberText';
import Faq from '@/components/Faq';
import { rewardRecipientModalVisibleAtom } from '@/models';
import { parseTokenAmount } from '@/utils/amount';
import { activeEpoch, watchL2, type Epoch } from '@/utils/l2';
import { parseRevertReason } from '@/utils/tools';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Provider, useAtom, useAtomValue } from 'jotai';
import { encodeErrorResult, formatEther, type Address, type PublicClient } from 'viem';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);
const signer = '0x0000000000000000000000000000000000000001' as Address;
const nextSigner = '0x0000000000000000000000000000000000000002' as Address;
const current: Epoch = { number: 2n, signer: nextSigner, startBlock: 101n, endBlock: 200n };
const previous: Epoch = { number: 1n, signer, startBlock: 1n, endBlock: 100n };
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('exact amounts and decoding', () => {
  it('preserves wei and integers beyond Number precision', () => {
    expect(parseTokenAmount('0.000000000000000001')).toBe(1n);
    const amount = '9007199254740993.123456789012345678';
    expect(formatEther(parseTokenAmount(amount))).toBe(amount);
    expect(parseTokenAmount('1.0000000000000000000')).toBe(10n ** 18n);
    expect(() => parseTokenAmount('0.0000000000000000001')).toThrow('18 decimals');
    expect(() => parseTokenAmount('1e18')).toThrow('Invalid amount');
  });
  it('decodes revert selectors and handles malformed data', () => {
    expect(
      parseRevertReason(
        encodeErrorResult({
          abi: [{ type: 'error', name: 'Error', inputs: [{ type: 'string', name: 'message' }] }],
          errorName: 'Error',
          args: ['denied'],
        }),
      ),
    ).toBe('denied');
    expect(parseRevertReason('0x1234')).toBeNull();
  });
});

describe('React 19 state and UI', () => {
  it('renders missing async numbers without crashing', () => {
    const { rerender } = render(<NumberText value={undefined} />);
    expect(screen.getByText('-')).toBeTruthy();
    rerender(<NumberText value={0n} allowZero />);
    expect(screen.getByText('0')).toBeTruthy();
  });
  it('shares Jotai state across subscribers and isolates providers', () => {
    function Write() {
      const [, set] = useAtom(rewardRecipientModalVisibleAtom);
      return <button onClick={() => set(true)}>Open</button>;
    }
    function Read({ label }: { label: string }) {
      const value = useAtomValue(rewardRecipientModalVisibleAtom);
      return (
        <span>
          {label}:{String(value)}
        </span>
      );
    }
    render(
      <>
        <Provider>
          <Write />
          <Read label="shared" />
        </Provider>
        <Provider>
          <Read label="isolated" />
        </Provider>
      </>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('shared:true')).toBeTruthy();
    expect(screen.getByText('isolated:false')).toBeTruthy();
  });
  it('renders FAQ content with native disclosure controls', () => {
    render(<Faq data={{ rows: [{ title: 'Question', content: <a href="https://example.com">Answer</a> }] }} />);
    expect(screen.getByText('Question').closest('summary')).toBeTruthy();
    expect(screen.getByText('Answer').getAttribute('href')).toBe('https://example.com');
  });
});

describe('L2 lifecycle', () => {
  const contract = { address: signer, abi: [] };
  it('includes epoch boundary blocks and exposes the next signer', () => {
    expect(activeEpoch(100n, current, previous)).toEqual({ current: signer, next: nextSigner });
    expect(activeEpoch(101n, current, previous)).toEqual({ current: nextSigner, next: undefined });
    expect(activeEpoch(201n, current, previous).current).toBeUndefined();
  });
  it('does not start a subscription when disposed during chain lookup', async () => {
    let resolve!: (id: number) => void;
    const watchBlockNumber = vi.fn();
    const client = {
      getChainId: () =>
        new Promise<number>((r) => {
          resolve = r;
        }),
      watchBlockNumber,
    } as unknown as PublicClient;
    const stop = watchL2(client, 1088, contract, { block: vi.fn(), epoch: vi.fn(), error: vi.fn() });
    stop();
    resolve(1088);
    await flush();
    expect(watchBlockNumber).not.toHaveBeenCalled();
  });
  it('unsubscribes and ignores an old epoch response after switching chains', async () => {
    let onBlock!: (block: bigint) => Promise<void>;
    let resolve!: (epoch: Epoch) => void;
    const unwatch = vi.fn();
    const epoch = vi.fn();
    const client = {
      getChainId: async () => 1088,
      watchBlockNumber: (options: { onBlockNumber: typeof onBlock }) => {
        onBlock = options.onBlockNumber;
        return unwatch;
      },
      readContract: vi
        .fn()
        .mockImplementationOnce(
          () =>
            new Promise<Epoch>((r) => {
              resolve = r;
            }),
        )
        .mockResolvedValue([1n, signer, 1n, 100n]),
    } as unknown as PublicClient;
    const stop = watchL2(client, 1088, contract, { block: vi.fn(), epoch, error: vi.fn() });
    await flush();
    const pending = onBlock(101n);
    stop();
    resolve(current);
    await pending;
    expect(unwatch).toHaveBeenCalledOnce();
    expect(epoch).not.toHaveBeenCalled();
  });
  it('rejects mismatched RPC chains', async () => {
    const error = vi.fn();
    const watchBlockNumber = vi.fn();
    watchL2({ getChainId: async () => 1, watchBlockNumber } as unknown as PublicClient, 1088, contract, {
      block: vi.fn(),
      epoch: vi.fn(),
      error,
    });
    await flush();
    expect(error).toHaveBeenCalledOnce();
    expect(watchBlockNumber).not.toHaveBeenCalled();
  });
});
